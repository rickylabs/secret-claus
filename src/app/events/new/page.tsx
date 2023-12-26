import * as React from "react";
import {EventForm} from "@/app/_components/form/event-form";
import {Card} from "@/app/_components/ui/card";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function NewEvent() {

    return (
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
            <EventForm/>
        </Card>
    );
}


