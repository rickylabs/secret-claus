import { relations, sql } from "drizzle-orm";
import {
    boolean,
    integer, pgEnum,
    pgTable,
    text,
    timestamp,
    unique,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";

export const person = pgTable(
  "person",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    phone_number: text("phone_number"),
    push_subscribed: boolean("push_subscribed").notNull().default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailPartialIdx: uniqueIndex("email_partial_idx")
      .on(table.email)
      .where(sql`${table.email} IS NOT NULL`),
    phonePartialIdx: uniqueIndex("phone_partial_idx")
      .on(table.phone_number)
      .where(sql`${table.phone_number} IS NOT NULL`),
  }),
);

// Schema for inserting a user - can be used to validate API requests

export const insertPersonSchema = createInsertSchema(person);
export type PersonFormFields = z.infer<typeof insertPersonSchema>;

export const EventStatus = pgEnum('event_status', ['draft', 'active', 'archived', 'cancelled']);

export const event = pgTable(
    "event",
    {
        id: uuid('id').defaultRandom().primaryKey(),
        title: text("title").notNull(),
        message: text("message").notNull(),
        rules: text("rules"),
        gift_amount: integer("gift_amount").notNull(),
        notification_mode: text("notification_mode").notNull(),
        event_date: timestamp("event_date").notNull(),
        status: EventStatus('status').notNull().default('draft'),
        created_at: timestamp("created_at").defaultNow().notNull(),
        updated_at: timestamp("updated_at").defaultNow().notNull(),
    }
);
// Schema for inserting a user - can be used to validate API requests
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
export const insertEventSchema = createInsertSchema(event);
export type EventFormFields = z.infer<typeof insertEventSchema>;

export const exclusion = pgTable(
    "exclusion",
    {
        id: uuid('id').defaultRandom().primaryKey(),
        event_id: uuid("event_id").references(() => event.id).notNull(),
        person_a_id: uuid("person_a_id").references(() => person.id).notNull(),
        person_b_id: uuid("person_b_id").references(() => person.id).notNull(),
        isBidirectional: boolean("isBidirectional").notNull().default(false),
    },
    (table) => ({
        uniqueExclusion: unique().on(table.event_id, table.person_a_id, table.person_b_id),
    })
);

export const pairing = pgTable(
    "pairing",
    {
        id: uuid('id').defaultRandom().primaryKey(),
        event_id: uuid("event_id").notNull().references(() => event.id),
        giver_id: uuid('giver_id').notNull().references(() => person.id, { onDelete: 'cascade' }),
        receiver_id: uuid('receiver_id').references(() => person.id, { onDelete: 'set null' }),
        allow_exclusion: integer("allow_exclusion").notNull().default(0),
        password: text("password"),
        created_at: timestamp("created_at").defaultNow().notNull(),
        updated_at: timestamp("updated_at").defaultNow().notNull(),
    }
);

export const pairingRelation = relations(pairing, ({ one }) => ({
    giver: one(person, {
        fields: [pairing.giver_id],
        references: [person.id],
    }),
    receiver: one(person, {
        fields: [pairing.receiver_id],
        references: [person.id],
    }),
    event: one(event, {
        fields: [pairing.event_id],
        references: [event.id],
    })
}));