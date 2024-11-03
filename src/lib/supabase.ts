import { supabase, Table } from "@/server/db/supabase";
import type { Tables } from "@/types/supabase";
import type {NotificationTypeType, PhoneNumber} from "@/server/db/validation";

export const fetchEvent = async (event_id: string | undefined) => {
  return event_id
    ? await supabase.from(Table.Event).select("*").eq("id", event_id)
    : { data: [] };
};

export const fetchPerson = async (person_id: string) => {
  return supabase.from(Table.Person).select("*").eq("id", person_id).single();
};

export const fetchPairing = async (pairing_id: string | undefined) => {
  return pairing_id
    ? await supabase
        .from("pairing")
        .select(
          `
                id,
                event_id,
                event (*),
                giver_id,
                giver:person!pairing_giver_id_person_id_fk (*),
                confirmed,
                receiver_id,
                receiver:person!pairing_receiver_id_person_id_fk (*),
                password,
                allow_exclusion
            `,
        )
        .eq("id", pairing_id)
    : { data: [] };
};

export const fetchPairingByEvent = async (event_id: string | undefined) => {
  return event_id
    ? await supabase
        .from("pairing")
        .select(
          `
                id,
                event_id,
                event (*),
                giver_id,
                giver:person!pairing_giver_id_person_id_fk (*),
                confirmed,
                receiver_id,
                receiver:person!pairing_receiver_id_person_id_fk (*),
                allow_exclusion
            `,
        )
        .eq("event_id", event_id)
    : { data: [] };
};

export const fetchPairingByGiverId = async (giver_id: string, eventId: string ) => {
    return supabase
        .from("pairing")
        .select(
            `
                id,
                event_id,
                event (*),
                giver_id,
                giver:person!pairing_giver_id_person_id_fk (*),
                confirmed,
                receiver_id,
                receiver:person!pairing_receiver_id_person_id_fk (*),
                allow_exclusion
            `,
        )
        .eq("giver_id", giver_id)
        .eq("event_id", eventId)
        .single()
}

export const fetchExclusionByGiverId = async (
  event_id: string,
  giver_id: string,
) => {
  return supabase
      .from("exclusion")
      .select("*")
      .eq("event_id", event_id)
      .eq("person_a_id", giver_id);
};

// Base type without recipient
type BaseNotificationPayload = {
  type: NotificationTypeType;
  event_id: string;
  person_id?: string;
  scheduled_at?: string;
};

// Email notification
type EmailNotificationPayload = BaseNotificationPayload & {
  email: string;
  phone_number?: never;
};

// Phone notification
type PhoneNotificationPayload = BaseNotificationPayload & {
  email?: never;
  phone_number: PhoneNumber;
};

// Dual notification
type DualNotificationPayload = BaseNotificationPayload & {
  email: string | null;
  phone_number: PhoneNumber | null;
};

// Combined type
export type ScheduleNotificationPayload =
    | EmailNotificationPayload
    | PhoneNotificationPayload
    | DualNotificationPayload;

export const scheduleNotification = async ({
 type,
 event_id,
 person_id,
 scheduled_at,
 email,
 phone_number
}: ScheduleNotificationPayload) => {
  // Validate scheduled_at
  if (scheduled_at) {
    const scheduledDate = new Date(scheduled_at);
    if (new Date() > scheduledDate || isNaN(scheduledDate.getTime())) {
      throw new Error("Invalid date");
    }
  }

  // Validate phone number if provided
  if (phone_number && (!phone_number.number || !phone_number.country)) {
    throw new Error("Invalid phone number");
  }

  try {
    const { data, error } = await supabase
        .from("notification")
        // @ts-expect-error - TS(2345) - Argument of type 'ScheduleNotificationPayload' is not assignable to parameter of type 'Record<string, any>'
        .insert({
          event_id,
          person_id,
          type,
          status: "pending",
          email,
          phone_number,
          scheduled_at: scheduled_at ?? new Date(Date.now() + (60000 * 5)).toISOString(),
        })
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to schedule notification");
  }
};

type CreatePersonPayload = {
  event_id: string;
  name?: string;
  email?: string;
  confirmed?: boolean;
  phone_number?: PhoneNumber;
  allow_exclusion?: number;
};


export const createPersonWithPairing = async ({
  event_id,
  name,
  email,
  confirmed,
  phone_number,
  allow_exclusion = 0,
}: CreatePersonPayload): Promise<Tables<Table.Person> | null> => {
  // Start a Supabase transaction
  const { data: person, error: personError } = await supabase
    .from("person")
    .insert({
      name,
      email,
      phone_number,
    })
    .select()
    .single();

  if (personError) {
    console.error("Error creating person:", personError);
    throw personError;
  }

  // Create the pairing
  const { error: pairingError } = await supabase.from("pairing").insert({
    event_id,
    giver_id: person.id,
    confirmed: confirmed ?? null,
    allow_exclusion,
  });

  if (pairingError) {
    // If pairing creation fails, we should ideally roll back the person creation
    // Since Supabase doesn't support true transactions, we'll manually delete the person
    await supabase.from("person").delete().eq("id", person.id);
    console.error("Error creating pairing:", pairingError);
    throw pairingError;
  }

  return person as Tables<Table.Person>;
};
