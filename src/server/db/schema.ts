import {relations} from "drizzle-orm";
import {boolean, integer, pgTable, text, timestamp, uuid,} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {type z} from "zod";

export const person = pgTable(
    "person",
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: text("name").notNull(),
        phone_number: text("phone_number"),
        push_subscribed: boolean("push_subscribed").notNull().default(false),
        allow_exclusion: integer("allow_exclusion").notNull().default(0),
        created_at: timestamp("created_at").defaultNow().notNull(),
        updated_at: timestamp("updated_at").defaultNow().notNull(),
    }
);

export const event = pgTable(
    "event",
    {
        id: uuid('id').defaultRandom().primaryKey(),
        title: text("title").notNull(),
        message: text("message").notNull(),
        rules: text("rules"),
        gift_amount: integer("gift_amount").notNull(),
        notification_mode: text("notification_mode").notNull(),
        event_date: timestamp("created_at").notNull(),
        created_at: timestamp("created_at").defaultNow().notNull(),
        updated_at: timestamp("updated_at").defaultNow().notNull(),
    }
);
// Schema for inserting a user - can be used to validate API requests
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
export const insertEventSchema = createInsertSchema(event);
export type EventFormFields = z.infer<typeof insertEventSchema>;
export const pairing = pgTable(
    "pairing",
    {
        id: uuid('id').defaultRandom().primaryKey(),
        giver_id: uuid("giver_id").references(() => person.id).notNull(),
        receiver_id: uuid("receiver_id").references(() => person.id),
        event_id: uuid("event_id").references(() => event.id).notNull(),
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