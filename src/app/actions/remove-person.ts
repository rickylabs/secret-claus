"use server";

import { supabase } from "@/server/db/supabase";
import { revalidatePath } from "next/cache";

export async function removePerson(
  eventId: string,
  personId: string,
): Promise<void> {
  // Delete the corresponding records in the 'pairing' table
  const { error: pairingError } = await supabase
    .from("pairing")
    .delete()
    .eq("giver_id", personId);

  if (pairingError) {
    console.error(pairingError);
    return;
  }

  // Delete the person
  const { error: personError } = await supabase
    .from("person")
    .delete()
    .eq("id", personId);

  if (personError) {
    console.error(personError);
    return;
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/events/${eventId}/people`);
}
