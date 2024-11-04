"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { type Tables } from "@/types/supabase";
import { type PersonFormFields } from "@/server/db/validation";
import { supabase } from "@/server/db/supabase";
import { redirect } from "next/navigation";

export async function updatePerson(
  person_id: string,
  data: PersonFormFields & { confirmed?: boolean },
): Promise<Tables<"person"> | void> {
  const cookieStore = cookies();
  const event_id = cookieStore.get("event_id");

  if (!event_id) {
    console.error("no event id found in cookie");
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
      .eq("event_id", event_id.value)
      .eq("giver_id", person.id)
      .single();

    if (pairingError ?? !pairing) {
      console.error(pairingError);
      throw new Error("Error updating pairing");
    }

    revalidatePath(`/events/${event_id.value}`);
    revalidatePath(`/events/${event_id.value}/people`);
    revalidatePath(`/events/${event_id.value}/people/${person_id}`);

    redirect(`/events/${event_id.value}/people/${person_id}/confirmation`);
  } catch (error) {
    console.error("Error in createPerson:", error);
    throw error;
  }
}
