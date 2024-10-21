"use server";

import { supabase, type Tables } from "@/server/db/supabase";
import { type EventFormFields } from "@/app/_components/form/event-form";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {fetchEvent} from "@/lib/supabase";

export async function updateEvent(
    event_id: string,
    data: EventFormFields,
): Promise<Tables<"event"> | void> {
  if(!event_id) {
    throw new Error("No event found for the exclusion");
  }

  type EventData = Pick<Tables<"event">, keyof EventFormFields> & {
    gift_amount: number;
    status: string;
  };
  const payload: EventData = {
    ...data,
    gift_amount: Number(data.gift_amount),
    status: "draft"
  };
  const { data:currentEvent } = await fetchEvent(event_id);

  if(!currentEvent?.length) {
    throw new Error("No event found for the event");
  }

  const singleEvent = currentEvent[0]

  if(!singleEvent?.status)  {
    throw new Error("No event status found for the event");
  }

  const eventPromise = await supabase
    .from("event")
    .update({
      ...payload,
      status: singleEvent.status ?? "draft"
    })
    .eq("id", event_id)
    .select();

  if (!eventPromise.data || eventPromise.error) {
    console.error(eventPromise.statusText);
    console.error(eventPromise.error);
    return;
  }
  const event = eventPromise.data?.[0] as Tables<"event">;
  revalidatePath(`/events/${event_id}`);
  revalidatePath(`/events/${event_id}/edit`);
  revalidatePath(`/events/${event_id}/people`);
  redirect(`/events/${event.id}`);
}