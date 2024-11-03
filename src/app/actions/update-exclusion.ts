"use server";
import { supabase, Table } from "@/server/db/supabase";
import { revalidatePath } from "next/cache";

export async function updateExclusion(
  event_id: string,
  giver_id: string,
  receiver_ids: string[],
  //isBidirectional?: boolean,
) {
  if (!event_id) {
    throw new Error("No event found for the exclusion");
  }

  if (!giver_id) {
    throw new Error("No user found for the exclusion");
  }

  const { error: deleteError } = await supabase
    .from(Table.Exclusion)
    .delete()
    .match({ event_id, person_a_id: giver_id });

  if (deleteError) {
    throw deleteError;
  }

  revalidatePath(`/events/${event_id}`);
  revalidatePath(`/events/${event_id}/people`);

  if (!receiver_ids?.length) {
    return []; // No new exclusions to add
  }

  // Upsert exclusions with receiver_ids for current event_id and giver_id
  const { data, error } = await supabase
    .from(Table.Exclusion)
    .upsert(
      receiver_ids.map((guest_id) => {
        return {
          event_id,
          person_a_id: giver_id,
          person_b_id: guest_id,
        };
      }),
    )
    .select();

  if (error) {
    throw error;
  }

  return data;
}
