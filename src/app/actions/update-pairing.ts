import {supabase, Table, type Tables} from "@/server/db/supabase";
import {type PairingFormFields, type PairingFormProps} from "@/app/_components/form/pairing-form";
import {genSaltSync, hashSync} from 'bcrypt-ts';

export async function generateReceiver(pairing: Tables<Table.Pairing>, guests: PairingFormProps["people"], formFields: PairingFormFields) {

    if (!guests.length) {
        throw new Error("No guest found for the event");
    }

    // Fetch all pairings related to the event
    const { data: pairings, error: fetchError } = await supabase
        .from(Table.Pairing)
        .select("receiver_id")
        .eq('event_id', pairing.event_id);

    if (fetchError) {
        throw fetchError;
    }

    // Get the ids of the receivers that are already attributed to other givers
    const attributedReceivers = pairings?.map(pairing_row => pairing_row.receiver_id) || [];

    // Filter out the giver, the ids from the exclusion list, and the receivers that are already attributed
    const filteredUsers = guests.filter(guest =>
        !formFields.persons?.includes(guest.item_value) &&
        !attributedReceivers.includes(guest.item_value)
    );

    // If password is not set, update it
    if (!pairing.password || pairing.password !== formFields.password) {
        await updatePassword(pairing, formFields.password);
    }

    // Randomly select a guest from the remaining list
    const selectedGuest = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];

    // Persist the selected guest id for the current pairing_id
    const { error: updateError } = await supabase
        .from(Table.Pairing)
        .update({ receiver_id: selectedGuest.item_value })
        .eq('id', pairing.id);

    if (updateError) {
        throw updateError;
    }

    return selectedGuest;
}

export async function updatePassword(pairing: Tables<Table.Pairing>, password: string) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const { error } = await supabase
        .from(Table.Pairing)
        .update({ password:hashedPassword })
        .eq('id', pairing.id);

    if (error) {
        throw error;
    }
}