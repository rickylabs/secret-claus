import * as React from "react";
import { EventForm } from "@/app/_components/form/event-form";
import { Card } from "@/app/_components/ui/card";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeft } from "lucide-react";
import {fetchEvent} from "@/lib/supabase";
import type {Table, Tables} from "@/server/db/supabase";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function EditEvent({ params }: { params: { id: string } }) {
    const { data } = await fetchEvent(params?.id);
    const event: Tables<Table.Event> | undefined = data?.[0];

    if(!event){
        return <div>Event not found</div>
    }

    return (
        <Card
            className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
            <EventForm initialEvent={event}/>
            <div className="flex p-2 justify-center items-center">
                <Link href={`/events/${event.id}/`} prefetch>
                    <Button className="bg-red-800 dark:bg-red-950">
                        <ArrowLeft/><span className="ml-2">Retour à mon évènement</span>
                    </Button>
                </Link>
            </div>
        </Card>
    );
}


