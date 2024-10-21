import { Cookie, type Table, type Tables } from "@/server/db/supabase";
import { cookies } from "next/headers";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { fetchEvent } from "@/lib/supabase";
import { Card, CardHeader } from "@/app/_components/ui/card";
import { IntroStep } from "@/app/_components/atoms/intro-step";
import React from "react";
import { CalendarPlus, EyeIcon, Share2, UserPlus } from "lucide-react";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";

export const revalidate = 60; //revalidate the data at most: every minute

export default async function Home() {
    const cookieStore = cookies()
    const event_cache = cookieStore.get(Cookie.EventId)

    const { data } = await fetchEvent(event_cache?.value)
    const event: Tables<Table.Event> | undefined  = data?.[0]

    return (
        <>
            <header className="flex flex-col space-y-4 text-center">
                <h2 className="text-xl text-red-300">{`🎄 Noël Enchanté : Découvrez votre `}<b className={"text-white"}>{`Secret Claus!`}</b>🎅</h2>
            </header>
            <Card
                className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
                {event &&
                    <Alert variant="success" className="py-4">
                        <AlertTitle className="text-base pb-2"><b>Consulter votre dernier évènement ?</b></AlertTitle>
                        <div className="flex flex-col space-y-4">
                            <AlertDescription className={"text-green-100"}>
                                Vous avez déjà créé un évènement <b className={"text-white"}>{event?.title}</b>, vous pouvez le consulter en cliquant sur le bouton ci-dessous.
                            </AlertDescription>
                            <Link href={`/events/${event?.id}`} className="ml-auto">
                                <Button
                                    variant={"default"}
                                    className="bg-green-700 hover:bg-green-800"
                                >
                                    <EyeIcon className="h-4 w-4"/><span className="ml-2">{`Voir mon évènement`}</span>
                                </Button>
                            </Link>
                        </div>
                    </Alert>
                }
                <CardHeader>
                    <div className="flex flex-column space-x-2 items-center justify-center">
                        <h2 className="text-xl font-bold text-center text-white">Créez votre évènement en quelques clics!</h2>
                    </div>
                </CardHeader>
                <div className="flex justify-center">
                    <Link href={"/events/new"}>
                        <Button
                            variant={"outline"}
                            className="bg-white/20 hover:bg-red-800 hover:border-none shadow-none hover:shadow-md"
                        >
                            <CalendarPlus className="h-4 w-4"/><span className="ml-2">{`Nouvel évènement`}</span>
                        </Button>
                    </Link>
                </div>
            </Card>
            <div className="flex flex-col space-y-8 w-full lg:w-3/4 max-w-xl">
                <IntroStep
                    icon={<CalendarIcon className="w-12 h-12"/>}
                    title={"1. Créez votre évènement"}
                    description={"Créez votre évènement et configurez les conditions de participation"}
                />
                <IntroStep
                    icon={<UserPlus className="w-12 h-12"/>}
                    title={"2. Ajoutez vos participants"}
                    description={"Préparez votre liste d'invités et configurer la logique de tirage au sort"}
                />
                <IntroStep
                    icon={<Share2 className="w-12 h-12"/>}
                    title={"3. Partagez votre évènement"}
                    description={"partagez à chaque invités un lien unique pour qu'ils puissent consulter leur invité secret"}
                />
            </div>

        </>
    );
}

