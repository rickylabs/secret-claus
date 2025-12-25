import {
  pgTable,
  foreignKey,
  uuid,
  integer,
  text,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
  check,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { type PhoneNumber } from "@/server/db/validation";

export const event_status = pgEnum("event_status", [
  "draft",
  "active",
  "archived",
  "cancelled",
]);
export const notification_type = pgEnum("notification_type", [
  "invite",
  "reminder",
  "publish",
  "info",
]);
export const notification_status = pgEnum("notification_status", [
  "pending",
  "processing",
  "sent",
  "failed",
  "cancelled",
]);
export const notification_mode = pgEnum("notification_mode", [
  "link",
  "email",
  "sms",
  "push",
]);

export const pairing = pgTable(
  "pairing",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    event_id: uuid().notNull(),
    giver_id: uuid().notNull(),
    receiver_id: uuid(),
    confirmed: boolean(),
    allow_exclusion: integer().default(0).notNull(),
    password: text(),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      pairing_event_id_event_id_fk: foreignKey({
        columns: [table.event_id],
        foreignColumns: [event.id],
        name: "pairing_event_id_event_id_fk",
      }),
      pairing_giver_id_person_id_fk: foreignKey({
        columns: [table.giver_id],
        foreignColumns: [person.id],
        name: "pairing_giver_id_person_id_fk",
      }).onDelete("cascade"),
      pairing_receiver_id_person_id_fk: foreignKey({
        columns: [table.receiver_id],
        foreignColumns: [person.id],
        name: "pairing_receiver_id_person_id_fk",
      }).onDelete("set null"),
      // Unique constraint: each person can only be a receiver once per event
      unique_receiver_per_event: uniqueIndex("unique_receiver_per_event")
        .on(table.event_id, table.receiver_id)
        .where(sql`${table.receiver_id} IS NOT NULL`),
    };
  },
);

export const person = pgTable(
  "person",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text(),
    email: text(),
    phone_number: jsonb("phone_number").$type<PhoneNumber>(), // Type-safe JSONB
    push_subscribed: boolean().default(false).notNull(),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  () => {
    return {
      nameRequiredCheck: check(
        "name_required_check",
        sql`(phone_number IS NOT NULL OR email IS NOT NULL OR name IS NOT NULL)`,
      ),
    };
  },
);

export const exclusion = pgTable(
  "exclusion",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    event_id: uuid().notNull(),
    person_a_id: uuid().notNull(),
    person_b_id: uuid().notNull(),
    isBidirectional: boolean().default(false).notNull(),
  },
  (table) => {
    return {
      exclusion_event_id_event_id_fk: foreignKey({
        columns: [table.event_id],
        foreignColumns: [event.id],
        name: "exclusion_event_id_event_id_fk",
      }),
      exclusion_person_a_id_person_id_fk: foreignKey({
        columns: [table.person_a_id],
        foreignColumns: [person.id],
        name: "exclusion_person_a_id_person_id_fk",
      }),
      exclusion_person_b_id_person_id_fk: foreignKey({
        columns: [table.person_b_id],
        foreignColumns: [person.id],
        name: "exclusion_person_b_id_person_id_fk",
      }),
    };
  },
);

export const event = pgTable("event", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  message: text().notNull(),
  gift_amount: integer().notNull(),
  notification_modes: text("notification_modes").notNull().default("link"),
  event_date: timestamp({ mode: "string" }).notNull(),
  status: event_status("status").default("draft").notNull(),
  guest_signup: boolean().default(false).notNull(),
  notify_on_publish: boolean().default(false).notNull(),
  owner_id: uuid(),
  created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
});

export const notification = pgTable(
  "notification",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    event_id: uuid().notNull(),
    person_id: uuid().notNull(),
    type: notification_type("type").notNull(),
    email: text(),
    phone_number: jsonb("phone_number").$type<PhoneNumber>(), // Type-safe JSONB
    scheduled_at: timestamp({ mode: "string" }).notNull(),
    status: notification_status("status").default("pending").notNull(),
    sent_at: timestamp({ mode: "string" }),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    updated_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      notification_event_id_event_id_fk: foreignKey({
        columns: [table.event_id],
        foreignColumns: [event.id],
        name: "notification_event_id_event_id_fk",
      }),
      notification_person_id_person_id_fk: foreignKey({
        columns: [table.person_id],
        foreignColumns: [person.id],
        name: "notification_person_id_person_id_fk",
      }),
    };
  },
);
