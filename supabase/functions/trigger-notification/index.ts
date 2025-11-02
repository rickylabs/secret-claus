// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { tasks } from "npm:@trigger.dev/sdk@latest/v3";
import type { novuSendInvite } from "@/server/workflow/send-invite.ts";
import type { Notification } from "@/server/db/validation.ts";

export const NOTIFICATION_TYPE = {
  INVITE: 'invite',
  REMINDER: 'reminder',
  PUBLISH: 'publish',
  INFO: 'info'
} as const;

interface SupabaseNotificationEvent {
  type: "UPDATE" | "INSERT" | "DELETE";
  table: "notification";
  record: Notification;
  schema: "public";
  old_record: Notification | null;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
Deno.serve(async (req) => {
    try {
        const payload = await req.json();

        // Add logging
        console.log("Received payload:", JSON.stringify(payload));
        console.log("Record status:", payload.record?.status);
        console.log("Record type:", payload.record?.type);

        if (payload.record.status !== "pending") {
            console.log("Skipping: Status is not pending");
            return new Response(JSON.stringify({
                status: 201,
                message: "No pending notification found"
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        let taskType;
        switch(payload.record.type) {
            case NOTIFICATION_TYPE.INVITE:
                taskType = "send-invite";
                break;
            case NOTIFICATION_TYPE.PUBLISH:
                taskType = "send-pairing";
                break;
            default:
                console.error("Invalid task type:", payload.record.type);
                throw new Error(`Invalid task type: ${payload.record.type}`);
        }

        console.log("Triggering task:", taskType, "for notification:", payload.record.id);

        const job = await tasks.trigger(taskType, {
            notification_id: payload.record.id
        });

        console.log("Job triggered successfully:", JSON.stringify(job));

        return new Response(JSON.stringify(job), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error in edge function:", error);
        return new Response(JSON.stringify({
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/trigger-notification' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
