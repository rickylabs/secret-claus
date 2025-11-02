"use server";

import { revalidatePath } from "next/cache";
import { type Tables } from "@/types/supabase";
import { type PersonFormFields } from "@/server/db/validation";
import { supabase } from "@/server/db/supabase";
import { redirect } from "next/navigation";

export async function updatePerson(
  person_id: string,
  event_id: string,
  data: PersonFormFields & { confirmed?: boolean },
): Promise<Tables<"person"> | void> {

  if (!event_id) {
    console.error("event id is missing");
    return;
  }

  const { confirmed, ...payload } = data;

  try {
    const { data: person, error: personError } = await supabase
      .from("person")
      .update({
        ...payload,
      })
      .eq("id", person_id)
      .select("*")
      .single();

    if (personError) {
      console.error(personError);
      throw new Error("Error updating person");
    }

    const { data: pairing, error: pairingError } = await supabase
      .from("pairing")
      .update({
        confirmed: !!confirmed,
      })
      .eq("event_id", event_id)
      .eq("giver_id", person.id)
      .single();

    if (pairingError ?? !pairing) {
      console.error(pairingError);
      //throw new Error("Error updating pairing");
    }

    revalidatePath(`/events/${event_id}`);
    revalidatePath(`/events/${event_id}/people`);
    revalidatePath(`/events/${event_id}/people/${person_id}`);

    redirect(`/events/${event_id}/people/${person_id}/confirmation`);
  } catch (error) {
    console.error("Error in createPerson:", error);
    throw error;
  }
}
