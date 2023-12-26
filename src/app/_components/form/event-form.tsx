"use client"
import * as React from "react";
import {useEffect} from "react";
import {type Control, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/_components/ui/card";
import {Button} from "@/app/_components/ui/button";
import {Cookie, type Table, type Tables} from "@/server/db/supabase";
import {createEvent} from "@/app/actions/create-event";
import {Form,} from "@/app/_components/ui/form";
import TextField from "@/app/_components/form/fields/text-field";
import SelectField from "@/app/_components/form/fields/select-field";
import InputField from "@/app/_components/form/fields/input-field";
import Link from "next/link";
import {Loader2} from "lucide-react";
import {fetchEvent} from "@/lib/supabase";

export const eventFormSchema = z.object({
    title: z.string().min(3),
    notification_mode: z.enum(["link", "email", "sms", "push"]),
    message: z.string(),
    gift_amount: z.string(),
    event_date: z.string()
});

async function retrieveCachedEvent(sessionEventId: Tables<'event'>["id"]){
    const { data } = await fetchEvent(sessionEventId)
    if(data?.length > 0){
        return data?.[0]
    } else {
        return null
    }
}


export type EventFormFields = z.infer<typeof eventFormSchema>;

export function EventForm() {
    const form = useForm<EventFormFields>({
        resolver: zodResolver(eventFormSchema),
    });
    const {
        formState: { isLoading, isSubmitting },
    } = form
    const [event, setEvent] = React.useState<Tables<'event'> | null>(null)
    const control = form.control as unknown as Control

    console.log(event)

    useEffect(() => {
        if(!event?.id){
            const sessionEventId = sessionStorage.getItem("event_id") as Tables<'event'>["id"] | undefined
            if(sessionEventId){
                retrieveCachedEvent(sessionEventId)
                    .then((event) => {
                        if(event){
                            setEvent(event)
                        }
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            }
        }
    }, [event])

    if(event){
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-white">Félicitation votre évènement a été crée 🎉</CardTitle>
                    <CardDescription className="text-zinc-100 dark:text-zinc-200">
                        La prochaine étape consiste à ajouter vos participants.
                    </CardDescription>
                </CardHeader>
                <CardContent className="bg-white p-4 rounded-lg space-y-4 text-red-950">
                    <p>Vous souhaitez créer un autre évènement ?
                        <u
                            className={"font-bold text-red-800 hover:text-red-950 cursor-pointer ml-2"}
                            onClick={() => {
                                sessionStorage.removeItem("event_id")
                                setEvent(null)
                            }}
                        >Nouvel évènement</u>
                    </p>
                    <CardFooter className="flex justify-between pt-4 pb-0 px-0">
                        <Link href={`/events/${event.id}`} prefetch>
                            <Button
                                variant={"outline"}
                                className="bg-white/20 hover:bg-red-800 hover:text-white border-md hover:border-none shadow-none hover:shadow-md"
                            >
                                Consulter mon évènement
                            </Button>
                        </Link>
                        <Link href={`/events/${event.id}/people`} prefetch>
                            <Button
                                className="bg-green-600 hover:bg-green-800 text-white shadow-none hover:shadow-md"
                            >
                                Ajouter des participants
                            </Button>
                        </Link>
                    </CardFooter>
                </CardContent>
            </>
        )
    }


    return (
        <Form {...form}>
            <form
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                action={form.handleSubmit(async (data) => {
                    const valid = await form.trigger();
                    if (!valid) return;
                    try {
                        const payload = await createEvent(data);
                        if(payload) {
                            sessionStorage.setItem("event_id", payload.id)
                            setEvent(payload)
                        }
                    } catch (e) {
                        console.error(e);
                    }
                })}
            >
                <>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold text-white">Créer un nouvel évènement</CardTitle>
                        <CardDescription className="text-zinc-100 dark:text-zinc-200">Vous pourrez ensuite ajouter vos participants.</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white p-4 rounded-lg space-y-4">
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <InputField
                                    control={control}
                                    name={"title"}
                                    label={"Titre"}
                                    placeholder={"Votre évènement"}
                                    message={"Le titre est obligatoire"}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <InputField
                                    control={control}
                                    name={"event_date"}
                                    label={"Date de l'évènement"}
                                    placeholder={new Date().toLocaleDateString()}
                                    message={"La date est obligatoire"}
                                    type={"date"}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <SelectField
                                    control={control}
                                    name={"notification_mode"}
                                    label={"Partage"}
                                    placeholder={"Choisissez une méthode de partage"}
                                    items={[
                                        {
                                            item_value: "link",
                                            item_label: "Lien à partager"
                                        },
                                        {
                                            item_value: "email",
                                            item_label: "Notification email"
                                        },
                                        {
                                            item_value: "sms",
                                            item_label: "Notification SMS"
                                        },
                                        {
                                            item_value: "push",
                                            item_label: "Notification push"
                                        },
                                    ]}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <InputField
                                    control={control}
                                    name={"gift_amount"}
                                    label={"Montant maximal"}
                                    placeholder={"Veuillez entrer un montant chiffré"}
                                    description={"Ce montant sera communiqué à vos invités"}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <TextField
                                    control={control}
                                    name={"message"}
                                    label={"Message"}
                                    placeholder={"Votre message"}
                                    description={"Ce message sera communiqué à vos invités"}
                                />
                            </div>
                            <Button
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-800 text-white shadow-none hover:shadow-md"
                                type="submit"
                            >
                                {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {(isLoading || isSubmitting) ? "Veuillez Patienter.." : "Créer mon évènement"}
                            </Button>
                        </div>
                    </CardContent>
                </>
            </form>
        </Form>
    );
}
