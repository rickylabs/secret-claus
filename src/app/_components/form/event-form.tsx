"use client";
import * as React from "react";
import { useEffect } from "react";
import { type Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSubTitle,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { type Table } from "@/server/db/supabase";
import { createEvent } from "@/app/actions/create-event";
import { Form } from "@/app/_components/ui/form";
import TextField from "@/app/_components/form/fields/text-field";
import SelectField from "@/app/_components/form/fields/select-field";
import InputField from "@/app/_components/form/fields/input-field";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { fetchEvent } from "@/lib/supabase";
import { updateEvent } from "@/app/actions/update-event";
import {
  type EventFormFields,
  eventValidationSchema,
  NOTIFICATION_MODE, type PhoneNumber,
} from "@/server/db/validation";
import { type Tables } from "@/types/supabase";
import MultiEmailField from "@/app/_components/form/fields/email-field";
import { MultiPhoneField } from "@/app/_components/form/fields/phone-field/multi";
import { emailArraySchema } from "@/app/_components/form/fields/email-field/schema";
import { phoneArraySchema } from "@/app/_components/form/fields/phone-field/schema";
import CheckboxField from "@/app/_components/form/fields/checkbox-field";
import { z } from "zod";
import PhoneField from "@/app/_components/form/fields/phone-field";
import {cn} from "@/lib/utils";
import {EventDetails} from "@/app/_components/atoms/event-details";

async function retrieveCachedEvent(sessionEventId: string) {
  const { data } = await fetchEvent(sessionEventId);
  if (data && data?.length > 0) {
    return data?.[0];
  } else {
    return null;
  }
}

type EventFormProps = {
  initialEvent?: Tables<Table.Event>;
};

// Base form fields without recipients
export interface BaseEventFormFields extends EventFormFields {
  notification_modes: string;
  // Owner specific fields
  owner_name: string;
  owner_email?: string;
  owner_phone_number?: PhoneNumber;
}

// Email notification specific fields
export interface EmailEventFormFields extends BaseEventFormFields {
  notification_modes: string; // Will include 'email'
  recipients_email_addresses: string[];
  recipients_phone_numbers?: never; // Explicitly exclude phone fields
}

// SMS notification specific fields
export interface SMSEventFormFields extends BaseEventFormFields {
  notification_modes: string; // Will include 'sms'
  recipients_phone_numbers: PhoneNumber[];
  recipients_email_addresses?: never; // Explicitly exclude email fields
}

// Combined fields for both notifications
export interface CombinedEventFormFields extends BaseEventFormFields {
  notification_modes: string; // Will include both 'email' and 'sms'
  recipients_email_addresses: string[];
  recipients_phone_numbers: PhoneNumber[];
}

// Union type for all possible form fields
export type EventFormFieldsExtended =
  | BaseEventFormFields
  | EmailEventFormFields
  | SMSEventFormFields
  | CombinedEventFormFields;

export function EventForm({ initialEvent }: EventFormProps) {
  const form = useForm<EventFormFieldsExtended>({
    defaultValues: {
      notify_on_publish: true,
      ...initialEvent
    },
    resolver: (values, context, options) => {
      let schema = eventValidationSchema;

      if (values.notification_modes?.includes(NOTIFICATION_MODE.EMAIL)) {
        schema = schema.extend({
          recipients_email_addresses:
            !initialEvent && values.guest_signup
              ? emailArraySchema
              : emailArraySchema.optional(),
        });
      }

      if (values.notification_modes?.includes(NOTIFICATION_MODE.SMS)) {
        schema = schema.extend({
          recipients_phone_numbers:
            !initialEvent && values.guest_signup
              ? phoneArraySchema
              : phoneArraySchema.optional(),
        });
      }

      if (!initialEvent) {
        schema = schema.extend({
          owner_name: z.string(),
          owner_email: z.string().email().optional(),
          owner_phone_number: z
            .object({
              number: z.string(),
              country: z.string(),
            })
            .optional(),
        });
      }

      return zodResolver(schema)(values, context, options);
    },
  });
  const {
    watch,
    formState: { isLoading, isSubmitting, errors },
  } = form;
  const [event, setEvent] = React.useState<Tables<Table.Event> | null>(null);
  const control = form.control as unknown as Control;
  const notification_modes = watch("notification_modes");
  const guest_signup = watch("guest_signup");

  console.log(errors);

  //add a useEfect here to ensure we don't have email and sms mode simultaneously selected
  useEffect(() => {
    if (notification_modes?.includes(NOTIFICATION_MODE.EMAIL) && notification_modes?.includes(NOTIFICATION_MODE.SMS)) {
      form.setError("notification_modes", {
        type: "manual",
        message: "Vous ne pouvez pas sélectionner simultanément le partage par email et sms !"
      });
      form.setValue("notification_modes", "link")
    }
  }, [form, notification_modes]);

  useEffect(() => {
    if (!event?.id && !initialEvent) {
      const sessionEventId = sessionStorage.getItem("event_id") as
        | Tables<"event">["id"]
        | undefined;
      if (sessionEventId) {
        retrieveCachedEvent(sessionEventId)
          .then((event) => {
            if (event) {
              setEvent(event);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }, [event, initialEvent]);

  useEffect(() => {
    const notifyOnPublish = form.getValues("notify_on_publish");
    if (
      !notifyOnPublish &&
      (guest_signup ??
        notification_modes?.includes(NOTIFICATION_MODE.EMAIL) ??
        notification_modes?.includes(NOTIFICATION_MODE.SMS))
    ) {
      form.setValue("notify_on_publish", true);
    }
  }, [form, guest_signup, notification_modes]);

  if (event) {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-white">
            Félicitation votre évènement {event.title} a été{" "}
            {initialEvent ? "mis à jour" : "crée"} 🎉
          </CardTitle>
          <CardDescription className="text-zinc-100 dark:text-zinc-200">
            <>
              {event.guest_signup
                ? `Une fois que vos invités auront confirmé leur participation, vous pourrez affiner les règles pour chaque participant et publier votre évènement pour permettre à vos invités de découvrir leur ami secret.`
                : "La prochaine étape consiste à ajouter vos participants à votre évènement. Vous pourrez ensuite le publier pour permettre à vos invités de découvrir leur ami secret."}
              <br/>
              <br/>
              {`Vous souhaitez peut être créer un `}
                <u
                  className={
                    "cursor-pointer font-bold"
                  }
                  onClick={() => {
                    sessionStorage.removeItem("event_id");
                    setEvent(null);
                  }}
                >
                  Nouvel évènement ?
                </u>
            </>
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4 space-y-4 rounded-lg bg-white p-4 text-red-950">
          <EventDetails event={event} />
          <CardFooter className="flex flex-wrap justify-center gap-2 px-0 pb-4 pt-4 md:flex-row md:justify-between">
            <Link href={`/events/${event.id}`} prefetch>
              <Button
                variant={event.guest_signup ? "default" : "outline"}
                className={cn(
                  "border-md bg-white/20 shadow-none hover:border-none hover:bg-red-800 hover:text-white hover:shadow-md",
                  event.guest_signup ? "bg-red-800 text-white" : "",
                )}
              >
                Consulter mon évènement
              </Button>
            </Link>
            {!event.guest_signup && (
              <Link href={`/events/${event.id}/people`} prefetch>
                <Button className="bg-green-600 text-white shadow-none hover:bg-green-800 hover:shadow-md">
                  Ajouter des participants
                </Button>
              </Link>
            )}
          </CardFooter>
        </CardContent>
      </>
    );
  }

  return (
    <Form {...form}>
      <form
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        action={form.handleSubmit(async (data) => {
          console.log(data);
          const valid = await form.trigger();
          if (!valid) return;
          try {
            const payload = initialEvent
              ? await updateEvent(initialEvent.id, data)
              : await createEvent(data);
            if (payload) {
              sessionStorage.setItem("event_id", payload.id);
              setEvent(payload);
            }
          } catch (e) {
            console.error(e);
          }
        })}
      >
        <div className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-white">
              {initialEvent
                ? "Modifier votre évènement"
                : "Créer un nouvel évènement"}
            </CardTitle>
            {initialEvent ? (
              <CardDescription className="text-zinc-100 dark:text-zinc-200">
                Vous pouvez modifier les informations de votre évènement.
              </CardDescription>
            ) : (
              <CardDescription className="text-zinc-100 dark:text-zinc-200">
                {`Créez un évènement et partagez le lien avec vos invités pour qu'ils puissent participer à l'évènement, vous pouvez également les inviter par email ou SMS pour qu'ils puissent confirmer leur participation.`}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4 rounded-lg bg-white p-4">
            <CardSubTitle className="text-xl font-bold text-red-950">
              {`Détails de l'évènement`}
            </CardSubTitle>
            <CardDescription className="!mt-2 text-zinc-100 dark:text-zinc-400">
              {`Informations concernant votre évènement et son fonctionnement`}
            </CardDescription>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <InputField
                  control={control}
                  name={"title"}
                  label={"Titre"}
                  placeholder={initialEvent?.title ?? "Votre évènement"}
                  message={"Le titre est obligatoire"}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <InputField
                  control={control}
                  name={"event_date"}
                  label={"Date de l'évènement"}
                  placeholder={
                    initialEvent?.event_date ??
                    new Date().toLocaleDateString("fr-CH")
                  }
                  message={"La date est obligatoire"}
                  type={"datetime-local"}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <InputField
                  control={control}
                  name={"gift_amount"}
                  label={"Montant maximal"}
                  type={"number"}
                  placeholder={
                    initialEvent?.gift_amount.toString() ??
                    "Veuillez entrer un montant chiffré"
                  }
                  description={"Ce montant sera communiqué à vos invités"}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <TextField
                  control={control}
                  name={"message"}
                  label={"Message"}
                  placeholder={initialEvent?.message ?? "Votre message"}
                  description={"Ce message sera communiqué à vos invités"}
                />
              </div>
              {!initialEvent && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <SelectField
                      control={control}
                      isMulti={true}
                      name={"notification_modes"}
                      label={"Partage"}
                      placeholder={"Choisissez une méthode de partage"}
                      defaultValue={["link"]}
                      items={[
                        {
                          item_value: "link",
                          item_label: "Lien à partager",
                          disabled: "par défaut",
                        },
                        {
                          item_value: "email",
                          item_label: "Notification email",
                        },
                        {
                          item_value: "sms",
                          item_label: "Notification SMS",
                        },
                        {
                          item_value: "push",
                          item_label: "Notification push",
                          disabled: "Bientôt disponible !",
                        },
                      ]}
                    />
                  </div>
                  {(notification_modes?.includes(NOTIFICATION_MODE.SMS) ||
                    notification_modes?.includes(NOTIFICATION_MODE.EMAIL)) && (
                    <>
                      <div className="flex flex-col space-y-1.5">
                        <CheckboxField
                          control={control}
                          name="guest_signup"
                          label="Confirmation d'inscritpion"
                          description="Les invités seront notifiés et devront confirmer leur participation à l'évènement"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <CheckboxField
                          control={control}
                          name="notify_on_publish"
                          label="Notification de publication"
                          description="Les invités seront notifiés lors de la publication de l'évènement pour découvrir leur ami secret"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </CardContent>
          <CardContent className="space-y-4 rounded-lg bg-white p-4">
            <CardSubTitle className="text-xl font-bold text-red-950">
              {`Origanisateur de l'évènement`}
            </CardSubTitle>
            <CardDescription className="!mt-2 text-zinc-100 dark:text-zinc-400">
              {`Vos informations personnelles`}
            </CardDescription>
            <div className="grid w-full items-center gap-4">
              {!initialEvent && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <InputField
                      control={control}
                      name={"owner_name"}
                      label={"Votre nom"}
                      placeholder={"Votre prénom et nom"}
                      message={"Votre nom est obligatoire"}
                    />
                  </div>
                  {notification_modes?.includes(NOTIFICATION_MODE.SMS) && (
                    <div className="flex flex-col space-y-1.5">
                      <PhoneField
                        control={control}
                        name={"owner_phone_number"}
                        label={"Votre numéro de téléphone"}
                        placeholder={"Votre numéro de téléphone"}
                        message={"Votre numéro de téléphone est obligatoire"}
                        defaultCountry="CH"
                      />
                    </div>
                  )}
                  {notification_modes?.includes(NOTIFICATION_MODE.EMAIL) && (
                    <div className="flex flex-col space-y-1.5">
                      <InputField
                        control={control}
                        name={"owner_email"}
                        label={"Votre email"}
                        placeholder={"Votre email"}
                        message={"Votre email est obligatoire"}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
          {!initialEvent && guest_signup && (
            <CardContent className="space-y-4 rounded-lg bg-white p-4">
              <CardSubTitle className="text-xl font-bold text-red-950">
                {`Liste des invités`}
              </CardSubTitle>
              <CardDescription className="!mt-2 text-zinc-100 dark:text-zinc-400">
                {`Ajoutez les informations de vos invités, il n'est pas neécéssaire de renseigner vos coordonnées puisque vous êtes l'organisateur de l'évènement`}
              </CardDescription>
              <div className="grid w-full items-center gap-4">
                <>
                  {notification_modes?.includes(NOTIFICATION_MODE.SMS) && (
                    <div className="flex flex-col space-y-1.5">
                      <MultiPhoneField
                        control={control}
                        name="recipients_phone_numbers"
                        label="Numéros de téléphone"
                        placeholder="Ajoutez les numéros de téléphone de vos invités"
                        defaultCountry="CH"
                      />
                    </div>
                  )}
                  {notification_modes?.includes(NOTIFICATION_MODE.EMAIL) && (
                    <MultiEmailField
                      control={control}
                      name="recipients_email_addresses"
                      label="Adresses email"
                      placeholder="Ajoutez les adresses email de vos invités"
                      description="Press Enter or Space to add an email"
                    />
                  )}
                </>
              </div>
            </CardContent>
          )}

          <Button
            disabled={isLoading}
            className="mx-auto bg-green-600 text-white shadow-none hover:bg-green-800 hover:shadow-md"
            type="submit"
          >
            {(isLoading || isSubmitting) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading || isSubmitting
              ? "Veuillez Patienter.."
              : initialEvent
                ? "Modifier mon évènement"
                : "Créer mon évènement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
