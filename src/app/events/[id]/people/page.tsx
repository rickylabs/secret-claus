import {type Table, type Tables} from "@/server/db/supabase";
import {Button} from "@/app/_components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/_components/ui/card";
import Link from "next/link";
import {PersonForm} from "@/app/_components/form/person-form";
import {PersonList} from "@/app/_components/list/person-list";
import {fetchEvent} from "@/lib/supabase";
import {EventDetails} from "@/app/_components/atoms/event-details";
import * as React from "react";
import {ArrowLeft} from "lucide-react";

export default async function Event({ params }: { params: { id: string } }) {
    const { data } = await fetchEvent(params?.id)
    const event: Tables<Table.Event> | undefined  = data?.[0]

    return (
        <>
            {event ? (
                    <Card className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold text-white">{event.title}</CardTitle>
                            <CardDescription className="text-zinc-100 dark:text-zinc-200">{`Il ne vous reste plus qu'à ajouter vos convives`}</CardDescription>
                        </CardHeader>
                        <CardContent className="bg-white p-6 rounded-lg space-y-4">
                           <EventDetails event={event}/>
                        </CardContent>
                        <CardContent className="bg-white p-6 rounded-lg space-y-4" id={"list"}>
                            <PersonForm>
                                <PersonList editable/>
                            </PersonForm>
                        </CardContent>
                        <div className="flex p-2 justify-center items-center">
                            <Link href={`/events/${event.id}`} prefetch>
                                <Button className="bg-red-800 dark:bg-red-950">
                                    <ArrowLeft  /><span className="ml-2">Retour à mon évènement</span>
                                </Button>
                            </Link>
                        </div>

                    </Card>
                )
                : (
                <div>
                <div>Not Found</div>
                        <Link href={"/new"}><Button>Create new event</Button></Link>
                    </div>
                )
            }
        </>
    );
}