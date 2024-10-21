import * as React from "react";
import { type Tables } from "@/server/db/supabase";
import { cookies } from "next/headers";
import { SantaAvatar } from "@/app/_components/atoms/avatar";
import { PersonRemoval } from "@/app/_components/form/crud/person-remove";
import { Button } from "@/app/_components/ui/button";
import {Trash} from "lucide-react";
import { fetchPairingByEvent } from "@/lib/supabase";
import ShareButton from "@/app/_components/atoms/share-button";
import { ExclusionList } from "@/app/_components/form/crud/exclusion-update";
import type { PairingExtended } from "@/app/events/[id]/pairing/[pairing_id]/page";
import {cn} from "@/lib/utils";

interface PersonListProps {
    event: Tables<"event">;
    editable?: boolean;
}
export async function PersonList({event, editable}: PersonListProps) {
    const cookieStore = cookies()
    const event_cookie = cookieStore.get('event_id')
    const { data: pairings } = await fetchPairingByEvent(event_cookie?.value)

    if(!pairings?.length){
        return (
            <div className="flex flex-col justify-center items-center space-y-4 text-gray-500">
                Ajoutez vos participants ils seront listés ici
            </div>
        )
    }

    return (
        <>
            {pairings?.map((pairing, index) => {
                const giver = pairing.giver as Tables<"person">
                const event = pairing.event as Tables<"event">
                const receiver = pairing.receiver as Tables<"person">


                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 space-y-4"
                  >
                    <SantaAvatar name={giver.name ?? "Unknown"} id={giver.id} />
                    <div className="grow space-y-1">
                      <div className={"text-red-950"}>
                        <b>{giver.name}</b>
                      </div>
                      {pairing.allow_exclusion > 0 && editable && (
                        <div className={"text-sm text-red-950"}>
                          peut exclure: {pairing.allow_exclusion} personne
                          {pairing.allow_exclusion > 1 ? "s" : ""}
                        </div>
                      )}
                      {receiver ? (
                        <div className={"text-sm text-green-950"}>
                          {`invité secret enregistré !`}
                        </div>
                      ) : (
                        <div className={"text-sm text-red-950"}>
                          {`en attente d'inscription...`}
                        </div>
                      )}
                    </div>
                    {editable ? (
                      <div className="flex flex-col-reverse items-center justify-center gap-4 md:flex-row">
                        <div
                          className={
                            cn(
                                "flex flex-col-reverse items-center justify-center gap-4 md:flex-row",
                                event.status === "active" ? "pointer-events-none" : ""
                            )
                          }
                        >
                          {pairings && (
                            <ExclusionList
                              pairing={pairing as unknown as PairingExtended}
                              pairings={
                                pairings as unknown as PairingExtended[]
                              }
                              disabled={event.status === "active"}
                            />
                          )}
                        </div>
                        {receiver && (
                          <Button
                            //ToDo delete pairing.receiver & pairing.password
                            variant="outline"
                            className="border-md flex hidden w-10 justify-center border-red-100 p-1 text-red-600 text-white shadow-none hover:border-none hover:bg-red-800 hover:text-inherit hover:shadow-md md:w-48"
                          >
                            <span className="mr-2 hidden md:block">{`Supprimer l'invité`}</span>
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                        <PersonRemoval
                          eventId={event.id}
                          personId={giver.id}
                          name={giver.name}
                          disabled={event.status === "active"}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-center gap-4">
                        <ShareButton
                          link={`/events/${event.id}/pairing/${pairing.id}`}
                          title={`Invitation à ${event.title}`}
                          description={`Bonjour ${giver.name}, vous êtes invité à participer à l'évènement ${event.title}. Cliquez sur le lien pour découvrir votre invité secret 🎅.`}
                          disabled={event.status === "draft"}
                        />
                      </div>
                    )}
                  </div>
                );
            })}
        </>
    )
}

