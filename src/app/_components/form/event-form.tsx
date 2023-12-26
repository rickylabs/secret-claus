"use client"
import * as React from "react";
import {useEffect} from "react";
import {type Control, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/_components/ui/card";
import {Button} from "@/app/_components/ui/button";
import {type Tables} from "@/server/db/supabase";
import {createEvent} from "@/app/actions/create-event";
import {Form,} from "@/app/_components/ui/form";
import TextField from "@/app/_components/form/fields/text-field";
import SelectField from "@/app/_components/form/fields/select-field";
import InputField from "@/app/_components/form/fields/input-field";
import Link from "next/link";
import {Loader2} from "lucide-react";

export const eventFormSchema = z.object({
    title: z.string().min(3),
    notification_mode: z.enum(["link", "email", "sms", "push"]),
    message: z.string(),
    gift_amount: z.string(),
    event_date: z.string()
});


export type EventFormFields = z.infer<typeof eventFormSchema>;

export function EventForm() {
    const form = useForm<EventFormFields>({
        resolver: zodResolver(eventFormSchema),
    });
    const {
        formState: { isLoading, isSubmitting },
    } = form
    const [eventId, setEventId] = React.useState<Tables<'event'>["id"] | null>(null)
    const control = form.control as unknown as Control

    useEffect(() => {
        if(!eventId){
            const sessionEventId = sessionStorage.getItem("event_id") as Tables<'event'>["id"] | undefined
            if(sessionEventId){
                setEventId(sessionEventId)
            }
        }
    }, [eventId])

    if(eventId){
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-white">Félicitation votre évènement a été crée 🎉</CardTitle>
                    <CardDescription className="text-zinc-100 dark:text-zinc-200">
                        La prochaine étape consiste à ajouter vos participants.
                    </CardDescription>
                </CardHeader>
                <CardContent className="bg-white p-6 rounded-lg space-y-4">
                    <Link href={`/events/${eventId}/people`} prefetch>
                        <Button className="bg-red-800 dark:bg-red-950">Ajouter des participants</Button>
                    </Link>

                    <Link href={`/events/${eventId}`} prefetch>
                        <Button className="bg-red-800 dark:bg-red-950">Consulter mon évènement</Button>
                    </Link>
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
                            setEventId(payload.id)
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
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4 pb-0 px-0">
                        <Link href={"/"}>
                            <Button
                                className="bg-white/20 hover:bg-red-800 hover:border-none shadow-none hover:shadow-md"
                                disabled={isLoading}
                            >
                                Retour
                            </Button>
                        </Link>
                        <Button
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-800 text-white shadow-none hover:shadow-md"
                            type="submit"
                        >
                            {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {(isLoading || isSubmitting) ? "Veuillez Patienter.." : "Créer"}
                        </Button>
                    </CardFooter>
                </>
            </form>
        </Form>
    );
}
