"use server";

import { supabase, type Tables } from "@/server/db/supabase";
import { cookies } from "next/headers";
import { type PersonFormFields } from "@/app/_components/form/person-form";
import { revalidatePath } from "next/cache";

export async function createPerson(
  data: PersonFormFields,
): Promise<Tables<"person"> | void> {
  const cookieStore = cookies();
  const event_id = cookieStore.get("event_id");

  if (!event_id) {
    console.error("no event id found in cookie");
    return;
  }

  const payload = {
    ...data,
    allow_exclusion: data.allow_exclusion ? Number(data.allow_exclusion) : 0,
  };

  const { allow_exclusion, ...personRequest } = payload;

  const personPromise = await supabase
    .from("person")
    .insert({
      ...personRequest,
      name: data.name,
    })
    .select();

  if (personPromise.error) {
    console.error(personPromise.statusText);
    console.error(personPromise.error);
    return;
  }

  const person = personPromise.data?.[0] as Tables<"person">;

  const pairingPromise = await supabase
    .from("pairing")
    .insert({
      event_id: event_id.value,
      giver_id: person.id,
      allow_exclusion: allow_exclusion,
    })
    .select();

  if (pairingPromise.error) {
    console.error(pairingPromise.statusText);
    console.error(pairingPromise.error);
    return;
  }

  const pairing = pairingPromise.data[0] as Tables<"pairing">;

  revalidatePath(`/events/${event_id.value}`);
  revalidatePath(`/events/${event_id.value}/people`);

  return person;
}