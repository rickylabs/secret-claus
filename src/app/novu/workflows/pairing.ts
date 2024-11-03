import { workflow } from "@novu/framework";
import { z } from "zod";
import {supabase, type Table} from "@/server/db/supabase";
import {
    NOTIFICATION_MODE,
    type Notification,
    selectEventSchema,
    selectNotificationSchema,
    selectPersonSchema,
    type Person, selectPairingSchema,
} from "@/server/db/validation";
import renderPairing, {PAIRING_DEFAULTS} from "../emails/pairing";
import type {Tables} from "@/types/supabase";

type EventWithPairings = Tables<Table.Event> & {
    pairings: Array<Tables<Table.Pairing>>
};

export const pairingWorkflow = workflow(
  "send-pairing",
  async ({ step, payload }) => {
    const url = process.env.VERCEL_URL ?? "http://localhost:3000";

    const notification = await step.custom(
      "get-notification",
      async () => {
        const { data: notificationPayload, error } = await supabase
          .from("notification")
          .select(`*`)
          .eq("id", payload.notification_id)
          .single();

        if (error) {
          console.log(error);
          throw error;
        }

        return {
          ...(notificationPayload as Notification),
        };
      },
      {
        outputSchema: selectNotificationSchema,
      },
    );

    const event = await step.custom(
      "get-event",
      async () => {
        const { data: eventPayload, error } = await supabase
          .from("event")
          .select(`
            *,
            pairings:pairing (*)
          `)
          .eq("id", notification.event_id)
          .single<EventWithPairings>();

        if (error) {
          console.log(error);
          throw error;
        }

        return {
          ...eventPayload,
        };
      },
      {
        outputSchema: selectEventSchema.extend({
            pairings: selectPairingSchema.array(),
        }),
      },
    );

    const person = await step.custom(
      "get-person",
      async () => {
        const { data: personPayload, error } = await supabase
          .from("person")
          .select("*")
          .eq("id", notification.person_id)
          .single();

        if (error) {
          console.log(error);
          throw error;
        }

        return {
          ...(personPayload as Person),
        };
      },
      {
        outputSchema: selectPersonSchema,
      },
    );

    const owner = await step.custom(
      "get-owner",
      async () => {
        const { data: personPayload, error } = await supabase
          .from("person")
          .select("*")
          .eq("id", event.owner_id!)
          .single();

        if (error) {
          console.log(error);
          throw error;
        }

        return {
            ...(personPayload as Person),
        };
      },
      {
        outputSchema: selectPersonSchema,
        skip: () => !event.owner_id,
      },
    );


    await step.email(
      "send-email",
      async (controls) => {
        console.log(event, controls);
        if (!person || !event) throw new Error("No person or event found");
        const pairing = event.pairings.find((pairing) => pairing.giver_id === person.id);
        if(process.env.NODE_ENV === "production" && !pairing) throw new Error("No pairing found for person");
        return {
          subject: controls.subject ?? `${owner.name} vous invite à l'évènement ${event.title} !`,
          body: await renderPairing({
            ...PAIRING_DEFAULTS,
            owner: owner,
            guest: person,
            event: event,
            link: `${controls.url}/events/${event.id}/pairing/${pairing?.id}`,
          }),
        };
      },
      {
        skip: () => !event.notification_modes.includes(NOTIFICATION_MODE.EMAIL),
        controlSchema: z.object({
            url: z.string().optional().default(url),
            subject: z.string().optional()
        }),
      },
    );

    await step.sms(
      "send-sms",
      (controls) => {
        if (!person || !event) throw new Error("No person or event found");
        const pairing = event.pairings.find(
          (pairing) => pairing.giver_id === person.id,
        );
        if(process.env.NODE_ENV === "production" && !pairing) throw new Error("No pairing found for person");
        return {
          body: controls.body ?? `🎄 ${event.title} sur Secret Claus. Cliquez sur le lien pour découvrir votre invité secret 🎅: ${url}/events/${event.id}/pairing/${pairing?.id}`,
        };
      },
      {
        skip: () => !event.notification_modes.includes(NOTIFICATION_MODE.SMS),
        controlSchema: z.object({
          url: z.string().optional().default(url),
          body: z.string().optional(),
        }),
      },
    );
  },
  {
    payloadSchema: z.object({
      notification_id: z.string(),
    }),
  },
);
