"use server";

import { supabase, type Table } from "@/server/db/supabase";
import { cookies } from "next/headers";
import { type Tables } from "@/types/supabase";
import { type EventFormFieldsExtended } from "@/app/_components/form/event-form";
import {NOTIFICATION_TYPE, type Person, type PhoneNumber} from "@/server/db/validation";
import { createPersonWithPairing, scheduleNotification } from "@/lib/supabase";

// Helper type for picking recipient fields
type RecipientFields = {
  recipients_email_addresses?: string[];
  recipients_phone_numbers?: PhoneNumber[];
};

type OwnerFields = {
  owner_name: string;
  owner_email?: string;
  owner_phone_number: PhoneNumber;
};

// Helper type for event payload
type EventPayload = Omit<
  EventFormFieldsExtended,
  keyof RecipientFields | keyof OwnerFields
>;

export async function createEvent(
  data: EventFormFieldsExtended,
): Promise<Tables<Table.Event> | void> {
  const {
    recipients_email_addresses,
    recipients_phone_numbers,
    owner_name,
    owner_email,
    owner_phone_number,
    ...eventPayload
  } = data as EventFormFieldsExtended & RecipientFields & OwnerFields;

  const payload = {
    ...eventPayload,
    status: "draft",
  } satisfies EventPayload;

  const { data: event, error } = await supabase
    .from("event")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  //handle owner person creation with pairing
  const owner = await createPersonWithPairing({
    event_id: event.id,
    name: owner_name,
    email: owner_email,
    phone_number: owner_phone_number,
    allow_exclusion: 0,
    confirmed: true,
  })

  if(!owner){
    //delete event since we failed to create owner
    await supabase.from("event").delete().match({ id: event.id });
    throw new Error("Failed to create owner");
  }

  try {
    //reference owner in event
    await supabase
        .from("event")
        .update({
          owner_id: owner.id,
        })
        .match({ id: event.id });
  } catch (error) {
    console.error(error);
    //delete event since we failed to reference owner
    await supabase.from("event").delete().match({ id: event.id });
    throw new Error("Failed to reference owner");
  }

  // Create a map of recipients combining email and phone data
  type Recipient = {
    email?: string;
    phone_number?: PhoneNumber;
  };

  const recipientMap = new Map<string, Recipient>();

  // Add email recipients to map
  recipients_email_addresses?.forEach(email => {
    recipientMap.set(email, { email });
  });

  // Merge phone recipients with existing email entries or add new ones
  recipients_phone_numbers?.forEach(phone => {
    // Try to find matching email recipient
    const existingEmail = recipients_email_addresses?.find(email => {
      // Add your matching logic here
      // For example, if you have a way to know that an email and phone belong to the same person
      return false; // Replace with your matching logic
    });

    if (existingEmail) {
      // Merge with existing email entry
      const existing = recipientMap.get(existingEmail);
      recipientMap.set(existingEmail, {
        ...existing,
        phone_number: phone
      });
    } else {
      // Add new phone-only entry
      recipientMap.set(`phone:${phone.number}`, { phone_number: phone });
    }
  });

  // Create persons and pairings
  let guests: Person[] = [];
  try {
    const pairingPromises = Array.from(recipientMap.values()).map(recipient =>
        createPersonWithPairing({
          event_id: event.id,
          email: recipient.email,
          phone_number: recipient.phone_number,
          confirmed: event.guest_signup ? undefined : true,
        })
    );

    guests = (await Promise.all(pairingPromises)) as Person[];
  } catch (error) {
    console.error(error);
    await supabase.from("event").delete().match({ id: event.id });
    throw new Error("Failed to create pairings");
  }

  /// Create notifications directly from recipientMap
  try {
    const notificationPromises = Array.from(recipientMap.values()).map(recipient => {
      return scheduleNotification({
        type: NOTIFICATION_TYPE.INVITE,
        event_id: event.id,
        email: recipient.email ?? null,
        phone_number: recipient.phone_number ?? null,
        person_id: guests.find(guest =>
            (guest.email === recipient.email) ||
            (guest.phone_number?.number === recipient.phone_number?.number)
        )?.id,
      });
    });

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error(error);
    await supabase.from("event").delete().match({ id: event.id });
    throw new Error("Failed to create notifications");
  }

  cookies().set("event_id", event.id, { secure: true });
  return event;
}
