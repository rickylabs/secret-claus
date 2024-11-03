"use client";
import * as React from "react";
import { Button } from "@/app/_components/ui/button";
import { type Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import InputField from "@/app/_components/form/fields/input-field";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import CheckboxField from "@/app/_components/form/fields/checkbox-field";
import { createPerson } from "@/app/actions/create-person";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Separator } from "@/app/_components/ui/separator";
import { toast } from "@/app/_components/ui/use-toast";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { cn } from "@/lib/utils";
import { type Table } from "@/server/db/supabase";
import { type Tables } from "@/types/supabase";
import {
  insertPersonSchema,
  NOTIFICATION_MODE,
  type PersonFormFields,
  type PhoneNumber,
} from "@/server/db/validation";
import PhoneField from "@/app/_components/form/fields/phone-field";
import { z } from "zod";
import { updatePerson } from "@/app/actions/update-person";
import {CardSubTitle} from "@/app/_components/ui/card";

interface PersonFormProps {
  children?: React.ReactNode;
  event?: Tables<Table.Event>;
  person?: Tables<Table.Person>;
}

const createValidationSchema = (event?: Tables<Table.Event>) => {
  const hasEmailNotification = event?.notification_modes.includes(
    NOTIFICATION_MODE.EMAIL,
  );
  const hasSmsNotification = event?.notification_modes.includes(
    NOTIFICATION_MODE.SMS,
  );

  return insertPersonSchema.superRefine((data, ctx) => {
    console.log(data)
    // Validate email if email notifications are enabled
    if (hasEmailNotification && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required when email notifications are enabled",
        path: ["email"],
      });
    }

    // Validate phone number if SMS notifications are enabled
    if (hasSmsNotification && !data.phone_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number is required when SMS notifications are enabled",
        path: ["phone_number"],
      });
    }
  });
};

export function PersonForm({ children, event, person }: PersonFormProps) {
  const form = useForm<PersonFormFields>({
    defaultValues: {
      ...person,
      phone_number: person?.phone_number
        ? (person.phone_number as PhoneNumber)
        : undefined
    },
    resolver: zodResolver(person ? insertPersonSchema.extend({confirmed: z.boolean().optional()}) : createValidationSchema(event)),
  });
  const {
    formState: { isLoading, isSubmitting, errors },
  } = form;
  const router = useRouter();
  const control = form.control as unknown as Control;
  const [showAllowExclusion, setShowAllowExclusion] = React.useState<boolean>(false);
  const phone_number = form.watch("phone_number");

  console.log(phone_number, errors);

  return (
    <>
      <div className="grid w-full items-center gap-4">
        <CardSubTitle className={cn("text-xl font-bold text-red-950", person ? "hidden" : "block")}>
          Participants:
        </CardSubTitle>
        {children}
        {isSubmitting && (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
        {event?.status === "draft" && (
          <>
            <Separator className={cn("my-4", person ? "hidden" : "block")} />
            <CardSubTitle className={cn("text-xl font-bold text-red-950", person ? "hidden" : "block")}>
              Ajouter un invité:
            </CardSubTitle>
            <Form {...form}>
              <form
                id={"add"}
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                action={form.handleSubmit(async (data) => {
                  if (isLoading || isSubmitting) return;
                  console.log(data)
                  const valid = await form.trigger();
                  if (!valid) return;
                  try {
                    const payload = person
                      ? await updatePerson(person.id, data)
                      : await createPerson(data);
                    if (payload) {
                      router.refresh();
                      toast({
                        variant: "informative",
                        title: payload.name
                          ? person
                            ? `Merci ${payload.name}, vos informations ont été enregistrées`
                            : `${payload.name} a été ajouté à la liste des invités.`
                          : "invité ajouté avec succès.",
                      });
                    }
                  } catch (e) {
                    console.error(e);
                    toast({
                      variant: "destructive",
                      title: "Une erreur est sruvenue.",
                    });
                  }
                })}
                className="flex flex-col space-y-4"
              >
                <div className="flex flex-col space-y-1.5">
                  <InputField
                    control={control}
                    name={"name"}
                    label={"Nom"}
                    placeholder={"Le prénom (et nom) de l'invité"}
                  />
                </div>
                {event?.notification_modes.includes(NOTIFICATION_MODE.SMS) && (
                  <div className="flex flex-col space-y-1.5">
                    <PhoneField
                      control={control}
                      name={"phone_number"}
                      label={"Téléphone"}
                      defaultCountry={"CH"}
                      placeholder={"numéro de téléphone de l'invité"}
                    />
                  </div>
                )}
                {event?.notification_modes.includes(
                  NOTIFICATION_MODE.EMAIL,
                ) && (
                  <div className="flex flex-col space-y-1.5">
                    <InputField
                      control={control}
                      name={"email"}
                      label={"Email"}
                      placeholder={"Email de votre invité"}
                      type={"email"}
                    />
                  </div>
                )}
                {!person && (
                  <>
                    {/*<div className="flex flex-col space-y-1.5">
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={showAllowExclusion}
                            onCheckedChange={(checked) =>
                              setShowAllowExclusion(!!checked)
                            }
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className={"text-red-500"}>
                            {
                              "Autoriser l'invité à exclure d'autre(s) invité(s)"
                            }
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    </div>*/}
                    <div
                      className={cn(
                        "flex-col space-y-1.5",
                        showAllowExclusion ? "flex" : "hidden",
                      )}
                    >
                      <InputField
                        control={control}
                        name={"allow_exclusion"}
                        label={"Nombre d'exclusion"}
                        placeholder={"Nombre de personne(s) à exclure"}
                        description={
                          "Vous pouvez autoriser chaque invité à exclure un certain nombre de personne"
                        }
                      />
                    </div>
                  </>
                )}
                {person && (
                  <div className="flex flex-col space-y-1.5">
                    <CheckboxField
                      control={control}
                      name={"confirmed"}
                      label={"Confirmation"}
                      description={
                        "En cochant cette case vous confirmez votre participation à cet événement"
                      }
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Button
                    disabled={isLoading}
                    variant="outline"
                    className="mx-auto w-52 bg-green-600 text-white hover:bg-green-800"
                    type="submit"
                  >
                    {(isLoading || isSubmitting) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading || isSubmitting
                      ? "Veuillez Patienter.."
                      : person ? "Enregistrer" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </>
  );
}
