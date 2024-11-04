import { type Table } from "@/server/db/supabase";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import Link from "next/link";
import { PersonForm } from "@/app/_components/form/person-form";
import { PersonList } from "@/app/_components/list/person-list";
import { fetchEvent } from "@/lib/supabase";
import { EventDetails } from "@/app/_components/atoms/event-details";
import * as React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { type Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

export default async function Event({ params }: { params: { id: string } }) {
  const { data } = await fetchEvent(params?.id);
  const event: Tables<Table.Event> | undefined = data?.[0];

  return (
    <>
      {event ? (
        <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-white">
              {event.title}
            </CardTitle>
            <CardDescription className="text-zinc-100 dark:text-zinc-200">{`Il ne vous reste plus qu'à ajouter vos convives`}</CardDescription>
          </CardHeader>
          <div className="absolute right-2 top-[-10px] flex items-center justify-center p-2">
            <Link href={`/events/${event.id}`} prefetch>
              <Button className="bg-red-800 dark:bg-red-950">
                <ArrowLeft />
                <span className="mr-2 hidden md:block">
                  Retour à mon évènement
                </span>
              </Button>
            </Link>
          </div>
          <CardContent className="space-y-4 rounded-lg bg-white">
            <EventDetails event={event} />
          </CardContent>
          <CardContent className="space-y-4 rounded-lg bg-white" id={"list"}>
            {event.status === "active" && (
              <Alert variant="informative" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Votre évènement est déjà publié !</AlertTitle>
                <AlertDescription>
                  {`Vous ne pouvez plus modifier la liste des participants, car votre évènement est déjà actif.`}
                </AlertDescription>
              </Alert>
            )}
            <PersonForm event={event}>
              <PersonList editable event={event} />
            </PersonForm>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div>Not Found</div>
          <Link href={"/new"}>
            <Button>Create new event</Button>
          </Link>
        </div>
      )}
    </>
  );
}
