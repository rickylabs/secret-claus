import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  event,
  event_status,
  exclusion,
  notification,
  notification_mode,
  notification_status,
  notification_type,
  pairing,
  person,
} from "./schema";
import { z } from "zod";

//JsonB type inference
/*
    -- Basic structure check
    ALTER TABLE "person"
    ADD CONSTRAINT "phone_number_structure_check"
    CHECK (
        (phone_number IS NULL) OR
        (
            phone_number::jsonb ? 'number' AND
            phone_number::jsonb ? 'country' AND
            (phone_number->>'number') IS NOT NULL AND
            (phone_number->>'country') IS NOT NULL
        )
    );
*/
export type PhoneNumber = {
  number: string;
  country: string;
};

// Database type inference
export type Person = typeof person.$inferSelect;
export type NewPerson = typeof person.$inferInsert;

export type Event = typeof event.$inferSelect;
export type NewEvent = typeof event.$inferInsert;

export type Pairing = typeof pairing.$inferSelect;
export type NewPairing = typeof pairing.$inferInsert;

export type Exclusion = typeof exclusion.$inferSelect;
export type NewExclusion = typeof exclusion.$inferInsert;

export type Notification = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;

// Base Insert Schemas - with field omissions
export const insertPersonSchema = createInsertSchema(person).extend({
  phone_number: z.object({
    number: z.string(),
    country: z.string(),
  }).optional(),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEventSchema = createInsertSchema(event).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPairingSchema = createInsertSchema(pairing).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertExclusionSchema = createInsertSchema(exclusion).omit({
  id: true,
});

export const insertNotificationSchema = createInsertSchema(notification).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Select Schemas
export const selectPersonSchema = createSelectSchema(person);
export const selectEventSchema = createSelectSchema(event);
export const selectPairingSchema = createSelectSchema(pairing);
export const selectExclusionSchema = createSelectSchema(exclusion);
export const selectNotificationSchema = createSelectSchema(notification);

// Form Fields Types from base insert schemas
export type PersonFormFields = z.infer<typeof insertPersonSchema>;
export type EventFormFields = z.infer<typeof insertEventSchema>;
export type PairingFormFields = z.infer<typeof insertPairingSchema>;
export type ExclusionFormFields = z.infer<typeof insertExclusionSchema>;
export type NotificationFormFields = z.infer<typeof insertNotificationSchema>;

// Enum Types
export type EventStatusType = (typeof event_status.enumValues)[number];
export type NotificationTypeType =
  (typeof notification_type.enumValues)[number];
export type NotificationStatusType =
  (typeof notification_status.enumValues)[number];
export type NotificationModeType =
  (typeof notification_mode.enumValues)[number];

// Frontend Constants mapped from DB Enums
export const EVENT_STATUS = Object.freeze(
  event_status.enumValues.reduce(
    (acc, val) => ({ ...acc, [val.toUpperCase()]: val }),
    {},
  ),
) as Record<Uppercase<EventStatusType>, EventStatusType>;

export const NOTIFICATION_TYPE = Object.freeze(
  notification_type.enumValues.reduce(
    (acc, val) => ({ ...acc, [val.toUpperCase()]: val }),
    {},
  ),
) as Record<Uppercase<NotificationTypeType>, NotificationTypeType>;

export const NOTIFICATION_STATUS = Object.freeze(
  notification_status.enumValues.reduce(
    (acc, val) => ({ ...acc, [val.toUpperCase()]: val }),
    {},
  ),
) as Record<Uppercase<NotificationStatusType>, NotificationStatusType>;

export const NOTIFICATION_MODE = Object.freeze(
  notification_mode.enumValues.reduce(
    (acc, val) => ({ ...acc, [val.toUpperCase()]: val }),
    {},
  ),
) as Record<Uppercase<NotificationModeType>, NotificationModeType>;

// Extended Validation Schemas with Additional Rules
export const personValidationSchema = insertPersonSchema.extend({
  email: z.string().email(),
  phone_number: z.object({
    number: z.string(),
    country: z.string(),
  })
});

export const eventValidationSchema = insertEventSchema.extend({
  gift_amount: z.coerce
    .number({
      required_error: "Gift amount is required",
      invalid_type_error: "Gift amount must be a number",
    })
    .min(0, "Gift amount must be positive")
    .finite("Gift amount must be a valid number")
    .int("Gift amount must be a whole number"),
  event_date: z
    .string()
    .transform((val) => {
      try {
        console.log(val);
        // Ensure it's a valid date and format it
        return new Date(val).toISOString();
      } catch {
        return val; // Let Zod handle the error
      }
    })
    .pipe(z.string()),
  notification_modes: z
    .union([
      z.string().optional(), // For DB input
      z.array(z.enum(notification_mode.enumValues)).optional(), // For form input
    ])
    .transform((val) => {
      console.log(val);
      // Convert to array if it's a string
      return typeof val === "string" ? val.split(",") : val;
    })
    .transform((arr) => arr?.join(","))
    .default([NOTIFICATION_MODE.LINK]),

  status: z.enum(event_status.enumValues).default(EVENT_STATUS.DRAFT),
});

export const pairingValidationSchema = insertPairingSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  allow_exclusion: z.number().min(0).max(3),
});

export const notificationValidationSchema = insertNotificationSchema.extend({
  type: z.enum(notification_type.enumValues),
  status: z.enum(notification_status.enumValues).default("pending"),
  scheduled_at: z.string().datetime("Invalid scheduling date"),
});

// Relation Types
export type PersonWithRelations = Person & {
  pairings_giver_id?: Pairing[];
  pairings_receiver_id?: Pairing[];
  exclusions_person_a_id?: Exclusion[];
  exclusions_person_b_id?: Exclusion[];
  notifications?: Notification[];
};

export type EventWithRelations = Event & {
  pairings?: Pairing[];
  exclusions?: Exclusion[];
  notifications?: Notification[];
};

export type PairingWithRelations = Pairing & {
  event?: Event;
  person_giver_id?: Person;
  person_receiver_id?: Person;
};

export type ExclusionWithRelations = Exclusion & {
  event?: Event;
  person_person_a_id?: Person;
  person_person_b_id?: Person;
};

export type NotificationWithRelations = Notification & {
  person?: Person;
  event?: Event;
};
