import { fetchEvent, fetchPairingByGiverId, fetchPerson } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import type { Table } from "@/server/db/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import * as React from "react";
import { EventDetails } from "@/app/_components/atoms/event-details";

export default async function Person({
  params,
}: {
  params: { id: string; person_id: string };
}) {
  const { data } = await fetchEvent(params?.id);
  const event: Tables<Table.Event> | undefined = data?.[0];

  if (!event) {
    return <div>Event not found</div>;
  }

  const { data: person } = await fetchPerson(params?.person_id);

  if (!person) {
    return <div>Person not found</div>;
  }

  const { data: pairing } = await fetchPairingByGiverId(person.id, event.id);

  if (!pairing) {
    return <div>Pairing not found</div>;
  }

  return (
    <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          {`Merci ${
            person.name ? person.name + " " : ""
          } pour votre confirmation !`}
        </CardTitle>
        <CardDescription className="text-lg text-zinc-100 dark:text-zinc-200">
          {`Vous ${
            pairing.confirmed ? "participez" : "ne participez pas"
          } à l'évènement:`}{" "}
          <br />
          <strong>{event.title}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 rounded-lg bg-white p-6">
        <EventDetails event={event} />
        {pairing.confirmed ? (
          <p className="text-red-500">{`Vous serez notifié pour découvrir votre ami secret aussitôt que l'organisateur aura publié l'évènement.`}</p>
        ) : (
          <p>{`L'organisateur a été informé de votre absence.`}</p>
        )}
      </CardContent>
    </Card>
  );
}
