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

export interface PairingExtended extends Tables<Table.Pairing> {
  event: Tables<Table.Event> | null;
  giver: Tables<Table.Person> | null;
  receiver: Tables<Table.Person> | null;
}
export default async function Pairing({ params }: { params: { id: string, pairing_id: string } }) {
    const { data:pairingPayload } = await fetchPairing(params?.pairing_id)
    const { data:participants } = await fetchPairingByEvent(params?.id)
    const pairing: Partial<PairingExtended> | undefined  = pairingPayload?.[0]

    if (!pairing) {
        return <div>Not Found</div>
    }

    if (!pairing.event) {
        return <div>Not Event Found</div>
    }

    if (!pairing.giver) {
        return <div>Not Giver Found</div>
    }

    if (!participants?.length) {
        return <div>No participants found</div>
    }

    const giver = pairing.giver;
    const event = pairing.event;
    const people = participants.filter(payload =>
        //@ts-expect-error: Type 'Tables<Table.Person>' is not assignable to type 'PersonItemProps'.
        payload.giver.id !== giver.id
    )
        .map(payload => {
            return {
                //@ts-expect-error: Type 'Tables<Table.Person>' is not assignable to type 'PersonItemProps'.
                item_value: payload.giver.id,
                //@ts-expect-error: Type 'Tables<Table.Person>' is not assignable to type 'PersonItemProps'.
                item_label: payload.giver.name
            }
        })

    return (
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
            <CardHeader className="gap-5">
                <div className="flex flex-row items-center gap-5">
                    <SantaAvatar name={giver.name} id={giver.id}/>
                    <CardTitle className="text-4xl font-bold text-white">Welcome, {giver.name}!</CardTitle>
                </div>
                <CardDescription className="text-lg text-zinc-100 dark:text-zinc-200">You are participating in the event: <b>{event.title}</b></CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-6 rounded-lg space-y-4">
                <EventDetails event={event}/>
            </CardContent>
            <CardContent className="bg-white p-6 rounded-lg space-y-4">
                {pairing.receiver ?
                    <PasswordProvider>
                        <SecretGuest pairing={pairing}/>
                    </PasswordProvider>:
                    <>
                        <div className="text-md italic text-red-950">
                            {`Une fois généré, votre invité secret ne pourra être consulté qu'une seule fois. N'oublier pas d'enregistrer votre participant ou vous enregistrer avant de quitter la page.`}
                        </div>
                        <PairingForm pairing={pairing} people={people}/>
                    </>
                }
            </CardContent>
        </Card>
    );
}