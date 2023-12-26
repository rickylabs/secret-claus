import * as React from "react";
import {type Tables} from "@/server/db/supabase";
import {cookies} from "next/headers";
import {SantaAvatar} from "@/app/_components/atoms/avatar";
import {PersonRemoval} from "@/app/_components/form/crud/person-remove";
import {Button} from "@/app/_components/ui/button";
import {Trash} from "lucide-react";
import {fetchPairingByEvent} from "@/lib/supabase";
import ShareButton from "@/app/_components/atoms/share-button";

interface PersonListProps {
    editable?: boolean
}
export async function PersonList({editable}: PersonListProps) {
    const cookieStore = cookies()
    const event_cookie = cookieStore.get('event_id')
    const { data } = await fetchPairingByEvent(event_cookie?.value)

    if(!data){
        return (
            <div className="flex flex-col justify-center items-center space-y-4"></div>
        )
    }

    return (
        <>
            {data?.map((pairing, index) => {
                const giver = pairing.giver as Tables<"person">
                const event = pairing.event as Tables<"event">
                const receiver = pairing.receiver as Tables<"person">
                return (
                    <div key={index} className="flex items-center space-x-4 space-y-4">
                        <SantaAvatar name={giver.name ?? "Unknown"} id={giver.id}/>
                        <div className="space-y-1 grow">
                            <div className={"text-red-950"}><b>{giver.name}</b></div>
                            {giver.allow_exclusion > 0 && editable &&
                                <div className={"text-sm text-red-950"}>
                                    peut exclure: {giver.allow_exclusion} personne{giver.allow_exclusion > 1 ? "s" : ""}
                                </div>
                            }
                            {receiver ?
                                <div className={"text-sm text-green-950"}>
                                    {`invité secret enregistré !`}
                                </div> :
                                <div className={"text-sm text-red-950"}>
                                    {`en attente d'inscription...`}
                                </div>
                            }
                        </div>
                        {editable ?
                            <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-4">
                                {receiver &&
                                    <Button
                                        //ToDo delete pairing.receiver & pairing.password
                                        variant="outline"
                                        className="hover:bg-red-800 text-white p-1 flex justify-center text-red-600 w-10 md:w-48 hover:text-inherit border-md border-red-100 hover:border-none shadow-none hover:shadow-md
                                        hidden"
                                    >
                                        <span className="mr-2 hidden md:block">{`Supprimer l'invité`}</span><Trash className="h-4 w-4"/>
                                    </Button>
                                }
                                <PersonRemoval personId={giver.id} name={giver.name}/>
                            </div> :
                            <div className="flex flex-row justify-center items-center gap-4">
                                <ShareButton
                                    link={`/events/${event.id}/pairing/${pairing.id}`}
                                    title={`Invitation à ${event.title}`}
                                    description={`Bonjour ${giver.name}, vous êtes invité à participer à l'évènement ${event.title}. Cliquez sur le lien pour découvrir votre invité secret 🎅.`}
                                />
                            </div>
                        }
                    </div>
                )
            })}
        </>
    )
}

