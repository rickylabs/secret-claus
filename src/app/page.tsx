import { Cookie, type Table } from "@/server/db/supabase";
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
import { type Tables } from "@/types/supabase";

export const revalidate = 60; //revalidate the data at most: every minute

export default async function Home() {
  const cookieStore = cookies();
  const event_cache = cookieStore.get(Cookie.EventId);

  const { data } = await fetchEvent(event_cache?.value);
  const event: Tables<Table.Event> | undefined = data?.[0];

  return (
    <>
      <header className="flex flex-col space-y-4 text-center">
        <h2 className="text-xl text-red-300">
          {`Recevez un cadeau surprise d'une personne choisie au hasard dans votre groupe 🎅`}
        </h2>
      </header>
      <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
        {event && (
          <Alert variant="success" className="py-4">
            <AlertTitle className="pb-2 text-base">
              <b>Consulter votre dernier évènement ?</b>
            </AlertTitle>
            <div className="flex flex-col space-y-4">
              <AlertDescription className={"text-green-100"}>
                Vous avez déjà créé un évènement{" "}
                <b className={"text-white"}>{event?.title}</b>, vous pouvez le
                consulter en cliquant sur le bouton ci-dessous.
              </AlertDescription>
              <Link href={`/events/${event?.id}`} className="ml-auto">
                <Button
                  variant={"default"}
                  className="bg-green-700 hover:bg-green-800"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="ml-2">{`Voir mon évènement`}</span>
                </Button>
              </Link>
            </div>
          </Alert>
        )}
        <CardHeader>
          <div className="flex-column flex items-center justify-center space-x-2">
            <h2 className="text-center text-xl font-bold text-white">
              Créez votre évènement en quelques clics!
            </h2>
          </div>
        </CardHeader>
        <div className="flex justify-center">
          <Link href={"/events/new"}>
            <Button
              size="lg"
              variant={"outline"}
              className="bg-white/20 shadow-none hover:border-none hover:bg-red-800 hover:shadow-md"
            >
              <CalendarPlus className="h-4 w-4" />
              <span className="ml-2">{`Nouvel évènement`}</span>
            </Button>
          </Link>
        </div>
      </Card>
      <div className="flex w-full max-w-xl flex-col space-y-8 lg:w-3/4">
        <IntroStep
          icon={<CalendarIcon className="h-12 w-12" />}
          title={"1. Créez votre évènement"}
          description={
            "Créez votre évènement et configurez les conditions de participation"
          }
        />
        <IntroStep
          icon={<UserPlus className="h-12 w-12" />}
          title={"2. Ajoutez vos participants"}
          description={
            "Préparez votre liste d'invités et configurer la logique de tirage au sort"
          }
        />
        <IntroStep
          icon={<Share2 className="h-12 w-12" />}
          title={"3. Partagez votre évènement"}
          description={
            "partagez à chaque invités un lien unique pour qu'ils puissent consulter leur invité secret"
          }
        />
      </div>
    </>
  );
}
