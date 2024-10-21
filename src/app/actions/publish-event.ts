"use server"
import { supabase, Table } from "@/server/db/supabase";
import {revalidatePath} from "next/cache";
import {fetchPairingByEvent} from "@/lib/supabase";

export async function publishEvent(
  event_id: string,
) {
  if (!event_id) {
    throw new Error("No event found for the exclusion");
  }

  const { data: pairings } = await fetchPairingByEvent(event_id)

  if(!pairings?.length) {
    throw new Error("No pairings found for the event");
  }

  // Upsert exclusions with receiver_ids for current event_id and giver_id
  const { data, error } = await supabase
    .from(Table.Event)
    .update({ status:"active" })
    .eq("id", event_id)

  if (error) {
    throw error;
  }

  revalidatePath(`/events/${event_id}`);
  revalidatePath(`/events/${event_id}/people`);

  return data;
}
