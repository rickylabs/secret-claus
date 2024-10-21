import { supabase, Table } from "@/server/db/supabase";

export const fetchEvent = async (event_id: string | undefined) => {
  return event_id
    ? await supabase.from(Table.Event).select("*").eq("id", event_id)
    : { data: [] };
};

export const fetchPairing = async (pairing_id: string | undefined)=> {
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
                password,
                allow_exclusion
            `)
            .eq('id', pairing_id)
        : { data: [] };
}

export const fetchPairingByEvent = async (event_id: string | undefined)=> {
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
                receiver:person!pairing_receiver_id_person_id_fk (*),
                allow_exclusion
            `)
            .eq('event_id', event_id)
        : { data: [] };
}

export const fetchExclusionByGiverId = async (event_id: string , giver_id: string)=> {
    return await supabase
            .from("exclusion")
            .select("*")
            .eq('event_id', event_id)
            .eq('person_a_id', giver_id)
}