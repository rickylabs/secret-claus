"use client";
import * as React from "react";
import { Button } from "@/app/_components/ui/button";
import { type Control, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/app/_components/ui/form";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "@/app/_components/form/fields/select-field";
import { type Table, type Tables } from "@/server/db/supabase";
import { toast } from "@/app/_components/ui/use-toast";
import { generateReceiver } from "@/app/actions/update-pairing";
import PasswordField from "@/app/_components/form/fields/password-field";
import { type PairingExtended } from "@/app/events/[id]/pairing/[pairing_id]/page";

export const pairingFormSchema = z.object({
  persons: z.array(z.string()).optional(),
  password: z.string().min(3),
  confirmPassword: z.string().min(3).optional(),
});

export type PairingFormFields = z.infer<typeof pairingFormSchema>;

interface PersonItemProps {
    item_value: Tables<Table.Person>["id"]
    item_label: Tables<Table.Person>["name"]
}

export type PairingFormProps = {
    pairing: Partial<PairingExtended>
    people: PersonItemProps[]
}

export function PairingForm({pairing, people}: PairingFormProps) {
    const form = useForm<PairingFormFields>({
        resolver: zodResolver(pairingFormSchema),
    });
    const {
        formState: { isLoading , isSubmitting},
    } = form
    const router = useRouter();
    const control = form.control as unknown as Control

    return (
        <>
            <Form {...form}>
                <form
                    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                    // @ts-ignore
                    action={form.handleSubmit(async (data) => {
                        const {confirmPassword, ...rest} = data
                        if(confirmPassword !== data.password){
                            toast({
                                variant: "destructive",
                                title: `Les mots de passe ne correspondent pas.`,
                            })
                            return;
                        }
                        const valid = await form.trigger();
                        if (!valid) return;
                        if(data?.persons && data.persons.length > pairing.allow_exclusion!){
                            toast({
                                variant: "destructive",
                                title: `Vous n'êtes pas autorisé à exclure plus de ${pairing.allow_exclusion} participant(s).`,
                            })
                            return;
                        }
                        try {
                            const payload = await generateReceiver(pairing, people, rest)
                            if(payload){
                                router.refresh()
                                toast({
                                    variant: "informative",
                                    title: `Votre invité secret a été généré avec succès !`,
                                })
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    })}
                >
                    <div className="grid w-full justify-center items-center gap-4">
                        <div className={pairing.allow_exclusion ? "flex flex-col space-y-1.5" : "hidden"}>
                            <SelectField
                                control={control}
                                name={"persons"}
                                label={"Exclure du tirage"}
                                placeholder={"Select persons"}
                                description={`Vous êtes autorisé à exclure ${pairing.allow_exclusion} participant(s) du tirage.`}
                                items={people}
                                isMulti
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <PasswordField
                                control={control}
                                name={"password"}
                                label={"Créer un mot de passe"}
                                placeholder={"Entrez un mot de passe"}
                                description={`Votre mot de passe permettra de protéger l'accès à votre invité secret.`}
                                type={"password"}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <PasswordField
                                control={control}
                                name={"confirmPassword"}
                                label={"Confirmer votre mot de passe"}
                                placeholder={"Entrez le même mot de passe"}
                                type={"password"}
                            />
                        </div>
                        <Button
                            disabled={isLoading || isSubmitting}
                            variant="outline"
                            className="bg-green-600 hover:bg-green-800 text-white w-52"
                            type="submit"
                        >
                            {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {(isLoading || isSubmitting) ? "Veuillez Patienter.." : "Générer mon invité secret"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}