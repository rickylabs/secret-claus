"use server";

import {supabase, type Tables} from "@/server/db/supabase";
import {cookies} from "next/headers";
import {type PersonFormFields} from "@/app/_components/form/person-form";

export async function createPerson(data: PersonFormFields):Promise<Tables<'person'> | void> {
    const cookieStore = cookies()
    const event_id = cookieStore.get('event_id')
    if(!event_id){
        console.error("no event id found in cookie")
        return
    }
    type PersonData = Pick<Tables<'person'>, keyof Omit<PersonFormFields, 'person_name'>> & {
        phone_number: string | undefined,
        allow_exclusion: number
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { person_name, ...otherData } = data;
    const payload: PersonData = {
        ...otherData,
        phone_number: data.phone_number ?? '',
        allow_exclusion: data.allow_exclusion ? Number(data.allow_exclusion) : 0
    }

    const personPromise = await supabase
        .from('person')
        .insert({
            ...payload,
            name: data.person_name
        })
        .select()

    if(personPromise.error){
        console.error(personPromise.statusText)
        console.error(personPromise.error)
        return
    }
    const person = personPromise.data?.[0] as Tables<'person'>

    const pairingPromise = await supabase
        .from('pairing')
        .insert({
            event_id: event_id.value,
            giver_id: person.id
        })
        .select()

    if(pairingPromise.error){
        console.error(pairingPromise.statusText)
        console.error(pairingPromise.error)
        return
    }
    const pairing = pairingPromise.data[0] as Tables<'pairing'>
    return person
}