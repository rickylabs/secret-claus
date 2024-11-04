import { logger, task } from "@trigger.dev/sdk/v3";
import {supabase} from "@/server/db/supabase";
import { Novu } from '@novu/node';
import { env } from "@/env.mjs";
import type {Notification} from "@/server/db/validation";

const novu = new Novu(env.NOVU_SECRET_KEY);

export const novuSendInvite = task({
  id: "send-invite",
  maxDuration: 300, // 5 minutes
  run: async (payload: {
    notification_id: string;
  }, { ctx }) => {
    logger.log("Processing Notification ID", { event_id:payload.notification_id, ctx });

    // Verifying Task
    try {
      const {data: notification, error} = await supabase.from('notification')
          .select("*")
          .eq("id", payload.notification_id)
          .single<Notification | null>()

      if(error ?? !notification) {
        throw new Error(error?.message ?? 'Notification not found');
      }

      logger.log("Found Notification", { notification, ctx });

      if(notification.status !== 'pending') {
        throw new Error('Notification already sent or failed/canceled');
      }

      //Processing Task
      await supabase
          .from("notification")
          .update({
            ...payload,
            status: "processing",
          })
          .eq("id", notification.id)

      const email = notification?.email ?? undefined
      const phone_number = notification?.phone_number?.number ?? undefined

      let novuResponse = null;

      try {
        novuResponse = await novu.trigger('send-invite', {
          to: {
            subscriberId: notification.person_id,
            email: email,
            phone: phone_number
          },
          payload: {
            notification_id: notification.id
          },
          //bridgeUrl: ctx.environment.type === "DEVELOPMENT"  ? "https://c28953be-b743-45cd-a931-d7c3b9308d58.novu.sh/api/novu" : undefined
        });

        await supabase
            .from("notification")
            .update({
                status: "sent",
                sent_at: new Date().toISOString(),
            })
            .eq("id", notification.id)
      } catch (e) {
        console.error(e);
        await supabase
            .from("notification")
            .update({
              status: "failed",
            })
            .eq("id", notification.id)
        const novuError = e as {
          message: string;
        }
        throw new Error(novuError.message )
      }

      if(novuResponse.status >= 400) {
        throw new Error(`Notification Failed with status ${novuResponse.status}`);
      }

      return {
        run_id: ctx.run.id,
        run_status: novuResponse.status,
        message: `Successfully sent invite to ${email ?? phone_number ?? "none"} !`,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
});