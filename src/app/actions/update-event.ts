"use server";

import { type Tables } from "@/types/supabase";
import { supabase, type Table } from "@/server/db/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { fetchEvent } from "@/lib/supabase";
import type { EventFormFields } from "@/server/db/validation";

export async function updateEvent(
  event_id: string,
  data: EventFormFields,
): Promise<Tables<Table.Event> | void> {
  if (!event_id) {
    throw new Error("No event found for the exclusion");
  }

  const payload: EventFormFields = {
    ...data,
    status: "draft",
  };

  const { data: currentEvent } = await fetchEvent(event_id);

  if (!currentEvent?.length) {
    throw new Error("No event found for the event");
  }

  const singleEvent = currentEvent[0];

  if (!singleEvent?.status) {
    throw new Error("No event status found for the event");
  }

  const eventPromise = await supabase
    .from("event")
    .update({
      ...payload,
      status: singleEvent.status ?? "draft",
    })
    .eq("id", event_id)
    .select();

  if (!eventPromise.data || eventPromise.error) {
    console.error(eventPromise.statusText);
    console.error(eventPromise.error);
    return;
  }
  revalidatePath(`/events/${event_id}`);
  revalidatePath(`/events/${event_id}/edit`);
  revalidatePath(`/events/${event_id}/people`);
  redirect(`/events/${event_id}`);
}
