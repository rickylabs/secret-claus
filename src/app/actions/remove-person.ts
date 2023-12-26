"use server";

import {supabase} from "@/server/db/supabase";

export async function removePerson(personId: string): Promise<void> {
    // Delete the corresponding records in the 'pairing' table
    const { error: pairingError } = await supabase
        .from('pairing')
        .delete()
        .eq('giver_id', personId);

    if(pairingError){
        console.error(pairingError);
        return;
    }

    // Delete the person
    const { error: personError } = await supabase
        .from('person')
        .delete()
        .eq('id', personId);

    if(personError){
        console.error(personError);
        return;
    }

}