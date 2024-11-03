// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { tasks } from "npm:@trigger.dev/sdk@latest/v3";
import {type novuSendInvite} from "@/server/workflow/send-invite.ts";
import {type Notification} from "@/server/db/validation.ts";

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

Deno.serve(async (req) => {
  const payload = await req.json() as SupabaseNotificationEvent;

  if(payload.record.status !== "pending"){
     return new Response(
        JSON.stringify({status: 201, message:"No pending notification found"}),
        { headers: { "Content-Type": "application/json" } },
    )
  }

  try {
    let taskType: string;
    switch (payload.record.type) {
      case NOTIFICATION_TYPE.INVITE:
        taskType = "send-invite"
        break;
      case NOTIFICATION_TYPE.PUBLISH:
        taskType = "send-pairing"
        break;
      default:
        throw new Error("Invalid task type");
    }

    const job = await tasks.trigger<typeof novuSendInvite>(taskType, { notification_id: payload.record.id });

    return new Response(
        JSON.stringify(job),
        { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
        JSON.stringify({ error: error }),
        { headers: { "Content-Type": "application/json" } },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/trigger-notification' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
