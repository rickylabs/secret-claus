"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createPersonWithPairing,
  fetchEvent,
  scheduleNotification,
} from "@/lib/supabase";
import { type Tables } from "@/types/supabase";
import {
  NOTIFICATION_MODE,
  NOTIFICATION_TYPE,
  type PersonFormFields,
} from "@/server/db/validation";

export async function createPerson(
  data: PersonFormFields & { allow_exclusion?: string },
): Promise<Tables<"person"> | void> {
  const cookieStore = cookies();
  const event_id = cookieStore.get("event_id");

  if (!event_id) {
    console.error("no event id found in cookie");
    return;
  }

  try {
    const { data: eventList } = await fetchEvent(event_id.value);

    const event = eventList?.[0];
    if (!event) {
      console.error("Error fetching event:");
      throw new Error("Error fetching event");
    }

    const person = await createPersonWithPairing({
      event_id: event_id.value,
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      phone_number: data.phone_number,
      allow_exclusion: data.allow_exclusion ? Number(data.allow_exclusion) : 0,
      confirmed: !event.guest_signup,
    });

    if (!person) {
      console.error("Error creating person");
      throw new Error("Error creating person");
    }

    if (event.guest_signup) {
      if (
        event.notification_modes.includes(NOTIFICATION_MODE.EMAIL) &&
        data.email
      ) {
        // send email
        await scheduleNotification({
          type: NOTIFICATION_TYPE.INVITE,
          event_id: event.id,
          email: data.email ?? null,
          person_id: person.id,
        });
      }
      if (
        event.notification_modes.includes(NOTIFICATION_MODE.SMS) &&
        data.phone_number
      ) {
        // send sms
        await scheduleNotification({
          type: NOTIFICATION_TYPE.INVITE,
          event_id: event.id,
          phone_number: data.phone_number,
          person_id: person.id,
        });
      }
    }

    revalidatePath(`/events/${event_id.value}`);
    revalidatePath(`/events/${event_id.value}/people`);

    return person ?? undefined;
  } catch (error) {
    console.error("Error in createPerson:", error);
    throw error;
  }
}
