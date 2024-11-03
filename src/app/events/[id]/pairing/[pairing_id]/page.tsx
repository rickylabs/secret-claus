import { fetchPairing, fetchPairingByEvent } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { PairingForm } from "@/app/_components/form/pairing-form";
import { SantaAvatar } from "@/app/_components/atoms/avatar";
import { EventDetails } from "@/app/_components/atoms/event-details";
import { SecretGuest } from "@/app/_components/form/password-form";
import { PasswordProvider } from "@/context/password-context";
import { type Tables } from "@/types/supabase";
import { type Table } from "@/server/db/supabase";
import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/app/_components/ui/alert";
import * as React from "react";

export interface PairingExtended extends Tables<Table.Pairing> {
  event: Tables<Table.Event> | null;
  giver: Tables<Table.Person> | null;
  receiver: Tables<Table.Person> | null;
}
export default async function Pairing({
  params,
}: {
  params: { id: string; pairing_id: string };
}) {
  const { data: pairingPayload } = await fetchPairing(params?.pairing_id);
  const { data: participants } = await fetchPairingByEvent(params?.id);
  const pairing: Partial<PairingExtended> | undefined = pairingPayload?.[0];

  if (!pairing) {
    return <div>Not Found</div>;
  }

  if (!pairing.event) {
    return <div>Not Event Found</div>;
  }

  if (!pairing.giver) {
    return <div>Not Giver Found</div>;
  }

  if (!participants?.length) {
    return <div>No participants found</div>;
  }

  const giver = pairing.giver;
  const event = pairing.event;
  const people = participants
    .filter(
      (payload) =>
        //@ts-expect-error: Type 'Tables<Table.Person>' is not assignable to type 'PersonItemProps'.
        payload.giver.id !== giver.id,
    )
    .map((payload) => {
      return {
        //@ts-expect-error: Type 'Tables<Table.Person>' is not assignable to type 'PersonItemProps'.
        item_value: payload.giver.id,
        //@ts-expect-error: Type 'Tables<Table.Person>' is not assignable to type 'PersonItemProps'.
        item_label: payload.giver.name,
      };
    });

  return (
    <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
      <CardHeader className="gap-5">
        <div className="flex flex-row items-center gap-5">
          <SantaAvatar name={giver.name ?? ""} id={giver.id} />
          <CardTitle className="text-4xl font-bold text-white">
            {`Bienvenue ${giver.name} !`}
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-zinc-100 dark:text-zinc-200">
          {`Vous partiez à l'évènement: `}<b>{event.title}</b>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 rounded-lg bg-white p-6">
        <EventDetails event={event} />
      </CardContent>
      <CardContent className="space-y-4 rounded-lg bg-white p-6">
        {pairing.receiver ? (
          <PasswordProvider>
            <SecretGuest pairing={pairing} />
          </PasswordProvider>
        ) : (

          <>
            <Alert
                variant="warning"
                className="mb-4"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {`Une fois généré, votre invité secret ne pourra être consulté qu'une seule fois 🤫`}
              </AlertTitle>
              <AlertDescription>
                {`Vous devrez ensuite entrer le mot de passe ci-dessous pour pouvoir le consulter à nouveau, pensez donc à le noter quelque part !`}
              </AlertDescription>
            </Alert>
            <PairingForm pairing={pairing} people={people} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
