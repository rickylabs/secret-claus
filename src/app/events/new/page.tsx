import * as React from "react";
import {EventForm} from "@/app/_components/form/event-form";
import {Card} from "@/app/_components/ui/card";
import Link from "next/link";
import {Button} from "@/app/_components/ui/button";
import {ArrowLeft} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function NewEvent() {

    return (
        <Card
            className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
            <EventForm/>
            <div className="flex p-2 justify-center items-center">
                <Link href={`/events/`} prefetch>
                    <Button className="bg-red-800 dark:bg-red-950">
                        <ArrowLeft/><span className="ml-2">Retour à mes évènements</span>
                    </Button>
                </Link>
            </div>
        </Card>
    );
}


