import { env } from "@/env.mjs";
import { createClient, type PostgrestError } from "@supabase/supabase-js";
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

export type DbResult<T> = T extends PromiseLike<infer U> ? U : T
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : T
export type DbResultErr = PostgrestError
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export enum Table {
    Event = 'event',
    Pairing = 'pairing',
    Person = 'person',
    Exclusion = 'exclusion',
}

export enum Cookie {
    EventId = 'event_id',
}
export const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options)