import {PersonForm} from "@/app/_components/form/person-form";
import {fetchEvent, fetchPerson} from "@/lib/supabase";
import type {Tables} from "@/types/supabase";
import type {Table} from "@/server/db/supabase";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/_components/ui/card";
import * as React from "react";


export default async function Person({ params }: { params: { id: string, person_id: string } }) {
    const { data } = await fetchEvent(params?.id);
    const event: Tables<Table.Event> | undefined = data?.[0];
    const {data:person} = await fetchPerson(params?.person_id);

    console.log(person)

    if (!event) {
        return (
            <div>Event not found</div>
        );
    }

    return (
        <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
            <CardHeader>
                <CardTitle className="text-4xl font-bold text-white">
                    {`${person?.name ? "Bienvenue" + " " + person.name + "." : ""}Vous êtes convié à l'évènement ${event.title} !`}
                </CardTitle>
                <CardDescription className="text-zinc-100 dark:text-zinc-200">{`Merci de confirmer votre participation à l'évènement en remplissant les information ci-dessous`}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 rounded-lg bg-white p-6">
                <PersonForm event={event} person={person ?? undefined}/>
            </CardContent>
        </Card>
    )
}