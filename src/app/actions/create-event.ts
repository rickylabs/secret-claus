"use server";

import { supabase, type Tables } from "@/server/db/supabase";
import { type EventFormFields } from "@/app/_components/form/event-form";
import { cookies } from "next/headers";

export async function createEvent(
  data: EventFormFields,
): Promise<Tables<"event"> | void> {
  type EventData = Pick<Tables<"event">, keyof EventFormFields> & {
    gift_amount: number;
    status: string;
  };
  const payload: EventData = {
    ...data,
    gift_amount: Number(data.gift_amount),
    status: "draft"
  };

  const eventPromise = await supabase.from("event").insert(payload).select();

  if (!eventPromise.data || eventPromise.error) {
    console.error(eventPromise.statusText);
    console.error(eventPromise.error);
    return;
  }
  const event = eventPromise.data?.[0] as Tables<"event">;
  cookies().set("event_id", event.id, { secure: true });
  return event;
}