"use server";
import { supabase, Table } from "@/server/db/supabase";
import { revalidatePath } from "next/cache";
import { fetchPairingByEvent, scheduleNotification } from "@/lib/supabase";
import {
  NOTIFICATION_MODE,
  NOTIFICATION_TYPE,
  type PhoneNumber,
} from "@/server/db/validation";
import { type Tables } from "@/types/supabase";

type EventWithPairings = Tables<Table.Event> & {
  pairings: Array<
    Tables<Table.Pairing> & {
      giver: Tables<Table.Person>;
    }
  >;
};

type PairingWithRelations = {
  id: string;
  receiver_id: string | null;
  giver_id: string;
  receiver?: { name: string | null } | null;
  giver?: { name: string | null } | null;
};

function validatePairings(pairings: PairingWithRelations[]) {
  const receiverIds = new Set<string>();

  for (const pairing of pairings) {
    // Skip validation if receiver not assigned yet (expected before publish)
    if (!pairing.receiver_id) {
      continue;
    }

    // Check for duplicate receivers (only for already-assigned receivers)
    if (receiverIds.has(pairing.receiver_id)) {
      throw new Error(
        `Duplicate receiver detected: ${pairing.receiver?.name ?? pairing.receiver_id} is assigned to multiple givers`,
      );
    }

    receiverIds.add(pairing.receiver_id);

    // Check if someone is their own receiver
    if (pairing.giver_id === pairing.receiver_id) {
      throw new Error(
        `Invalid pairing: ${pairing.giver?.name ?? pairing.giver_id} is assigned as their own receiver`,
      );
    }
  }
}

export async function publishEvent(event_id: string) {
  if (!event_id) {
    throw new Error("No event found for the exclusion");
  }

  const { data: pairings } = await fetchPairingByEvent(event_id);

  if (!pairings?.length) {
    throw new Error("No pairings found for the event");
  }

  // Validate pairings before publishing
  validatePairings(pairings);

  const { data: event, error } = await supabase
    .from(Table.Event)
    .update({ status: "active" })
    .eq("id", event_id)
    // Update this query to SELECT * plus pairing AND person related to event_id
    .select(
      `
        *,
        pairings:pairing (
          *,
          giver:giver_id (*)
        )
      `,
    )
    .single<EventWithPairings>();

  if (error) {
    throw error;
  }

  if (
    event.notification_modes.includes(NOTIFICATION_MODE.EMAIL) ||
    event.notification_modes.includes(NOTIFICATION_MODE.SMS)
  ) {
    // create a new notification for each confirmed pairing using map and await all also check before doing db mutation if eveerything is correct
    const notificationPromises = event.pairings.map(async (pairing) => {
      if (pairing.confirmed === false) {
        return;
      }

      return await scheduleNotification({
        type: NOTIFICATION_TYPE.PUBLISH,
        event_id,
        email: pairing.giver.email,
        phone_number: pairing.giver.phone_number as PhoneNumber,
        person_id: pairing.giver.id,
      });
    });

    try {
      await Promise.all(notificationPromises);
    } catch (error) {
      throw error;
    }
  }

  revalidatePath(`/events/${event_id}`);
  revalidatePath(`/events/${event_id}/people`);

  return event;
}
