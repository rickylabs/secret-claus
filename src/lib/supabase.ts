import {cache} from 'react'
import {supabase, Table} from "@/server/db/supabase";

export const fetchEvent = cache(async (event_id: string | undefined)=> {
    return event_id
        ? await supabase.from(Table.Event).select("*").eq('id', event_id)
        : { data: [] };
})

export const fetchPairing = cache(async (pairing_id: string | undefined)=> {
    return pairing_id
        ? await supabase
            .from("pairing")
            .select(`
                id,
                event_id,
                event (*),
                giver_id,
                giver:person!pairing_giver_id_person_id_fk (*),
                receiver_id,
                receiver:person!pairing_receiver_id_person_id_fk (*),
                password
            `)
            .eq('id', pairing_id)
        : { data: [] };
})

export const fetchPairingByEvent = cache(async (event_id: string | undefined)=> {
    return event_id
        ? await supabase
            .from("pairing")
            .select(`
                id,
                event_id,
                event (*),
                giver_id,
                giver:person!pairing_giver_id_person_id_fk (*),
                receiver_id,
                receiver:person!pairing_receiver_id_person_id_fk (*)
            `)
            .eq('event_id', event_id)
        : { data: [] };
})