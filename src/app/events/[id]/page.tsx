import * as React from "react";
import { type Table } from "@/server/db/supabase";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardSubTitle,
  CardTitle,
} from "@/app/_components/ui/card";
import Link from "next/link";
import { fetchEvent, fetchPairingByEvent } from "@/lib/supabase";
import { EventDetails } from "@/app/_components/atoms/event-details";
import { PersonList } from "@/app/_components/list/person-list";
import { Separator } from "@/app/_components/ui/separator";
import { AlertCircle, Archive, Edit, Users } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { PublishEvent } from "@/app/_components/form/crud/event-publish";
import { type Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

export default async function Event({ params }: { params: { id: string } }) {
  const { data } = await fetchEvent(params?.id);
  const event: Tables<Table.Event> | undefined = data?.[0];
  const { data: pairings } = await fetchPairingByEvent(event?.id);

  return (
    <>
      {event ? (
        <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-white">
              {event.title}
            </CardTitle>
            <CardDescription className="text-zinc-100 dark:text-zinc-200">
              {pairings &&
              pairings.length > 0 &&
              !pairings.find((p) => p.confirmed === null) ? (
                `Vous n'avez plus qu'à publier votre évènement pour pouvoir envoyer le lien a vos convives`
              ) : event.guest_signup ? (
                <span className="text-orange-500">
                  En attente de confirmation de{" "}
                  <strong>
                    {pairings?.filter((p) => p.confirmed === null).length}{" "}
                    convive(s)
                  </strong>
                  {`, s'il ne répondent pas vous pouvez toujours les retirer de la liste des invités pour pouvoir publier l'évènement.`}
                </span>
              ) : (
                `Il ne vous reste plus qu'à ajouter vos convives`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 rounded-lg bg-white">
            <EventDetails event={event} />
            <div className="flex items-center justify-end">
              <Link href={`/events/${event.id}/edit`} prefetch>
                <Button className="bg-red-900/90 hover:bg-red-950">
                  <>
                    <span className="mr-2 hidden md:block">
                      {"Modifier l'évènement"}
                    </span>
                    <Edit className="h-4 w-4" />
                  </>
                </Button>
              </Link>
            </div>
          </CardContent>
          <CardContent
            className="flex items-center justify-center space-y-4 rounded-lg bg-white"
            id={"share"}
          >
            <div className="grid w-full items-center gap-6">
              {event.status === "draft" ? (
                <Alert
                  variant="warning"
                  className="mb-4"
                  hidden={event.guest_signup}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {`Votre évènement n'est pas encore publié !`}
                  </AlertTitle>
                  <AlertDescription>
                    {`Cet événement est en mode brouillon, il n'est pas encore visible par les participants. `}
                    {`Une fois publié, vous pourrez partager le lien d'invitation à vos convives.`}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="informative" className="pt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {`Le boutton de partage à coté de chaque participant vous permet de lui envoyer un lien pour qu'il puisse consulter son invité secret.`}
                  </AlertDescription>
                </Alert>
              )}
              <CardSubTitle className="text-xl font-bold text-red-950">{`Participants:`}</CardSubTitle>
              <PersonList event={event} />
              <Separator className="my-4" />
              <div className="flex w-full items-center justify-between">
                {event.status === "draft" ? (
                  <Link href={`/events/${event.id}/people`} prefetch>
                    <Button className="bg-red-900/90 hover:bg-red-950">
                      <>
                        <span className="mr-2 hidden md:block">
                          {"Gérer les participants"}
                        </span>
                        <Users className="h-4 w-4" />
                      </>
                    </Button>
                  </Link>
                ) : (
                  <Button className="bg-red-900/90 hover:bg-red-950">
                    <>
                      <span className="mr-2 hidden md:block">
                        {"Archiver cet évènement"}
                      </span>
                      <Archive className="h-4 w-4" />
                    </>
                  </Button>
                )}
                <div>
                  <PublishEvent
                    event={event}
                    pairings={pairings as Tables<Table.Pairing>[]}
                  />
                </div>
              </div>
            </div>
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
