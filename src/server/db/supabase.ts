import { env } from "@/env.mjs";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/types/supabase";

const options = {
  db: {
    //schema: 'public',
  },
  auth: {
    //autoRefreshToken: true,
    //persistSession: true,
    //detectSessionInUrl: true
  },
  global: {
    //headers: { 'x-my-custom-header': 'my-app-name' },
  },
};

export enum Table {
  Event = "event",
  Pairing = "pairing",
  Person = "person",
  Exclusion = "exclusion",
  Notification = "notification",
}

export enum Cookie {
  EventId = "event_id",
}
export const supabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
);
