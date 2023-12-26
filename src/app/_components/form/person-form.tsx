"use client"
import * as React from "react";
import {Button} from "@/app/_components/ui/button"
import {type Control, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation"
import * as z from "zod";
import InputField from "@/app/_components/form/fields/input-field";
import {Loader2} from "lucide-react";
import {Form} from "@/app/_components/ui/form";
import CheckboxField from "@/app/_components/form/fields/checkbox-field";
import {createPerson} from "@/app/actions/create-person";
import {Skeleton} from "@/app/_components/ui/skeleton";
import {Separator} from "@/app/_components/ui/separator";
import {toast} from "@/app/_components/ui/use-toast";

export const personFormSchema = z.object({
  person_name: z.string().min(3),
  phone_number: z.string().optional(),
  allow_exclusion: z.string(),
  push_subscribed: z.boolean(),
});

export type PersonFormFields = z.infer<typeof personFormSchema>;

interface PersonFormProps {
  children: React.ReactNode
}
export function PersonForm({children}:PersonFormProps) {
  const form = useForm<PersonFormFields>({
    resolver: zodResolver(personFormSchema),
  });
  const {
    formState: { isLoading , isSubmitting},
  } = form
  const router = useRouter();
  const control = form.control as unknown as Control
  return (
    <>
          <div className="grid w-full items-center gap-4">
            <div className="text-green-900">Vos participants:</div>
            {children}
            {isSubmitting &&
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full"/>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]"/>
                    <Skeleton className="h-4 w-[200px]"/>
                  </div>
                </div>
            }
            <Separator className="my-4"/>
            <div className="text-green-900">Ajouter un invité:</div>
            <Form {...form}>
              <form
                  id={"add"}
                  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                  // @ts-ignore
                  action={form.handleSubmit(async (data) => {
                    if (isLoading || isSubmitting) return;
                    const valid = await form.trigger();
                    if (!valid) return;
                    try {
                      const payload = await createPerson(data);
                      if(payload){
                        router.refresh()
                        toast({
                          variant: "informative",
                          title: payload.name ? `${payload.name} a été ajouté à la liste des invités.` : 'invité ajouté avec succès.',
                        })
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  })}
                  className="flex flex-col space-y-4"
              >
                <div className="flex flex-col space-y-1.5">
                  <InputField
                      control={control}
                      name={"person_name"}
                      label={"Nom"}
                      placeholder={"Le prénom (et nom) de votre invité"}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <InputField
                      control={control}
                      name={"phone_number"}
                      label={"Téléphone"}
                      placeholder={"(optionnel) numéro de téléphone de votre invité"}
                      type={'tel'}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <InputField
                      control={control}
                      name={"allow_exclusion"}
                      label={"Nombre d'exclusion"}
                      placeholder={"Nombre de personne(s) à exclure"}
                      description={"Vous pouvez autoriser chaque invité à exclure un certain nombre de personne"}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <CheckboxField
                      control={control}
                      name={"push_subscribed"}
                      label={"Notifier"}
                      description={"En cochant cette case vous activer les notification pour cet invité"}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Button disabled={isLoading} variant="outline" className="bg-green-600 hover:bg-green-800 text-white"
                          type="submit">
                    {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {(isLoading || isSubmitting) ? "Veuillez Patienter.." : "Ajouter"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
    </>
  )
}
