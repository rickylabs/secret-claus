import * as React from "react";
import { EventForm } from "@/app/_components/form/event-form";
import { Card } from "@/app/_components/ui/card";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeft } from "lucide-react";
import { fetchEvent } from "@/lib/supabase";
import type { Table } from "@/server/db/supabase";
import {type Tables} from "@/types/supabase";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function EditEvent({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await fetchEvent(params?.id);
  const event: Tables<Table.Event> | undefined = data?.[0];

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
      <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
        <div className="absolute right-0 top-0 flex items-center justify-center p-2">
          <Link href={`/events/${event.id}/`} prefetch>
            <Button className="bg-red-800 dark:bg-red-950">
              <ArrowLeft/>
              <span className="mr-2 hidden md:block">Retour à mon évènement</span>
            </Button>
          </Link>
        </div>
        <EventForm initialEvent={event}/>
      </Card>
  );
}
