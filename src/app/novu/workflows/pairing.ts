import { workflow } from "@novu/framework";
import { z } from "zod";
import { supabase, type Table } from "@/server/db/supabase";
import {
  type Notification,
  NOTIFICATION_MODE,
  type Person,
  selectEventSchema,
  selectNotificationSchema,
  selectPairingSchema,
  selectPersonSchema,
} from "@/server/db/validation";
import renderPairing, { PAIRING_DEFAULTS } from "../emails/pairing";

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
          .select("*")
          .eq("id", notification.event_id)
          .single();

        if (error) {
          console.log(error);
          throw error;
        }

        return {
          ...eventPayload,
        };
      },
      {
        outputSchema: selectEventSchema,
      },
    );

    const pairing = await step.custom(
      "get-pairing",
      async () => {
        const { data: pairingPayload, error } = await supabase
          .from("pairing")
          .select("*")
          .eq("event_id", notification.event_id)
          .eq("giver_id", person.id)
          .single();

        if (error) {
          console.log(error);
          throw error;
        }

        return {
          ...pairingPayload,
        };
      },
      {
        outputSchema: selectPairingSchema,
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
        if (!person || !event || !pairing)
          throw new Error("No person, event, or pairing found");
        return {
          subject:
            controls.subject ??
            `Découvrez votre invité secret pour ${event.title}`,
          body: await renderPairing({
            ...PAIRING_DEFAULTS,
            owner: owner,
            guest: person,
            event: event,
            link: `${controls.url}/events/${event.id}/pairing/${pairing.id}`,
          }),
        };
      },
      {
        skip: () => !event.notification_modes.includes(NOTIFICATION_MODE.EMAIL),
        controlSchema: z.object({
          url: z.string().optional().default(url),
          subject: z.string().optional(),
        }),
      },
    );

    await step.sms(
      "send-sms",
      (controls) => {
        if (!person || !event || !pairing)
          throw new Error("No person, event, or pairing found");
        return {
          body:
            controls.body ??
            `🎄 ${event.title} sur Secret Claus. Cliquez sur le lien pour découvrir votre invité secret 🎅: ${controls.url}/events/${event.id}/pairing/${pairing.id}`,
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
