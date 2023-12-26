import * as React from "react";
import {type Table, type Tables} from "@/server/db/supabase";
import {Button} from "@/app/_components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/_components/ui/card";
import Link from "next/link";
import {fetchEvent} from "@/lib/supabase";
import {EventDetails} from "@/app/_components/atoms/event-details";
import {PersonList} from "@/app/_components/list/person-list";
import {Separator} from "@/app/_components/ui/separator";
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription} from "@/app/_components/ui/alert";

export default async function Event({ params }: { params: { id: string } }) {
    const { data } = await fetchEvent(params?.id)
    const event: Tables<Table.Event> | undefined  = data?.[0]

    return (
        <>
            {event ? (
                <Card
                    className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold text-white">{event.title}</CardTitle>
                        <CardDescription
                            className="text-zinc-100 dark:text-zinc-200">{`Il ne vous reste plus qu'à ajouter vos convives`}</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white p-6 rounded-lg space-y-4">
                        <EventDetails event={event}/>
                    </CardContent>
                    <CardContent className="bg-white p-6 rounded-lg space-y-4 flex justify-center items-center" id={"share"}>
                        <div className="grid w-full items-center gap-6">
                            <div className="text-green-900">{`Participants:`}</div>
                            <Alert variant="informative" className="pt-4">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription>
                                    {`Le boutton de partage à coté de chaque participant vous permet de lui envoyer un lien pour qu'il puisse consulter son invité secret.`}
                                </AlertDescription>
                            </Alert>
                            <PersonList/>
                            <Separator className="my-4"/>
                            <Link href={`/events/${event.id}/people`} prefetch>
                                <Button
                                    className="bg-red-900/90 hover:bg-red-950"
                                >
                                    Gérer les participants
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
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