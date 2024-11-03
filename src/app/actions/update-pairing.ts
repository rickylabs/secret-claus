import { supabase, Table } from "@/server/db/supabase";
import {
  type PairingFormFields,
  type PairingFormProps,
} from "@/app/_components/form/pairing-form";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { type PairingExtended } from "@/app/events/[id]/pairing/[pairing_id]/page";

export async function generateReceiver(
  pairing: Partial<PairingExtended>,
  guests: PairingFormProps["people"],
  formFields: PairingFormFields,
) {
  if (!guests.length) {
    throw new Error("No guest found for the event");
  }

  if (!pairing.event_id) {
    throw new Error("No event found for the pairing");
  }

  if (!pairing.giver_id) {
    throw new Error("No giver found for the pairing");
  }

  // Fetch all pairings related to the event
  const { data: pairings, error: fetchError } = await supabase
    .from(Table.Pairing)
    .select("receiver_id")
    .eq("event_id", pairing.event_id);

  if (fetchError) {
    throw fetchError;
  }

  // Fetch exclusions for the current giver
  const { data: exclusions, error: exclusionError } = await supabase
    .from(Table.Exclusion)
    .select("person_b_id")
    .eq("event_id", pairing.event_id)
    .eq("person_a_id", pairing.giver_id);

  if (exclusionError) {
    throw exclusionError;
  }

  // Fetch bidirectional exclusions where the giver is person_b
  const { data: bidirectionalExclusions, error: bidirectionalError } =
    await supabase
      .from(Table.Exclusion)
      .select("person_a_id")
      .eq("event_id", pairing.event_id)
      .eq("person_b_id", pairing.giver_id)
      .eq("isBidirectional", true);

  if (bidirectionalError) {
    throw bidirectionalError;
  }

  // Get the ids of the receivers that are already attributed to other givers
  const attributedReceivers =
    pairings?.map((pairing_row) => pairing_row.receiver_id) || [];

  // Get the ids of the excluded persons
  const excludedPersons = [
    ...(exclusions?.map((exclusion) => exclusion.person_b_id) || []),
    ...(bidirectionalExclusions?.map((exclusion) => exclusion.person_a_id) ||
      []),
  ];

  //console.log("Attributed receivers:", attributedReceivers);
  //console.log("Excluded persons:", excludedPersons);

  // Filter out the giver, the ids from the exclusion list, and the receivers that are already attributed
  const filteredUsers = guests.filter(
    (guest) =>
      guest.item_value !== pairing.giver_id &&
      !formFields.persons?.includes(guest.item_value) &&
      !attributedReceivers.includes(guest.item_value) &&
      !excludedPersons.includes(guest.item_value),
  );

  //console.log("Filtered users:", filteredUsers);

  // If password is not set, update it
  if (!pairing.password || pairing.password !== formFields.password) {
    await updatePassword(pairing.id!, formFields.password);
  }

  if (filteredUsers.length === 0) {
    //console.log("No eligible guests found. Returning null.");
    return null; // Instead of throwing an error, return null
  }

  // Randomly select a guest from the remaining list
  const selectedGuest =
    filteredUsers[Math.floor(Math.random() * filteredUsers.length)];

  //console.log("Selected guest:", selectedGuest);
  if (!selectedGuest) {
    throw new Error("No eligible guest found for the pairing");
  }

  // Persist the selected guest id for the current pairing_id
  const { error: updateError } = await supabase
    .from(Table.Pairing)
    .update({ receiver_id: selectedGuest.item_value })
    .eq("id", pairing.id!);

  if (updateError) {
    throw updateError;
  }

  return selectedGuest;
}

export async function updatePassword(pairing_id: string, password: string) {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  const { error } = await supabase
    .from(Table.Pairing)
    .update({ password: hashedPassword })
    .eq("id", pairing_id);

  if (error) {
    throw error;
  }
}
