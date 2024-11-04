import { workflow } from "@novu/framework";
import { z } from "zod";
import renderInvite, { INVITE_DEFAULTS } from "../emails/invite";
import { supabase } from "@/server/db/supabase";
import {
  type Notification,
  NOTIFICATION_MODE,
  type Person,
  selectEventSchema,
  selectNotificationSchema,
  selectPersonSchema,
} from "@/server/db/validation";

export const inviteWorkflow = workflow(
  "send-invite",
  async ({ step, payload }) => {
    const url = process.env.VERCEL_URL ?? "http://localhost:3000";

    const notification = await step.custom(
      "get-notification",
      async () => {
        const { data: notificationPayload, error } = await supabase
          .from("notification")
          .select("*")
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
        return {
          subject:
            controls.subject ??
            `${owner.name} vous invite à l'évènement ${event.title} !`,
          body: await renderInvite({
            ...INVITE_DEFAULTS,
            owner: owner,
            guest: person,
            event: event,
            link: `${controls.url}/events/${event.id}/people/${person.id}`,
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
        return {
          body:
            controls.body ??
            `${owner.name} vous a invité à l'évènement ${event.title} sur Secret Claus. Cliquez sur le lien pour participer à l'évènement 🎅: ${controls.url}/events/${event.id}/people/${person.id}`,
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
