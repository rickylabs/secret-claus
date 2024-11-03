import { pgTable, foreignKey, uuid, text, integer, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const event_status = pgEnum("event_status", ['draft', 'active', 'archived', 'cancelled'])
export const notification_mode = pgEnum("notification_mode", ['link', 'email', 'sms', 'push'])
export const notification_status = pgEnum("notification_status", ['pending', 'processing', 'sent', 'failed', 'cancelled'])
export const notification_type = pgEnum("notification_type", ['invite', 'reminder', 'publish', 'info'])



export const event = pgTable("event", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	gift_amount: integer().notNull(),
	event_date: timestamp({ mode: 'string' }).notNull(),
	status: event_status().default('draft').notNull(),
	guest_signup: boolean().default(false).notNull(),
	notify_on_publish: boolean().default(false).notNull(),
	created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	notification_modes: text().default('link').notNull(),
	owner_id: uuid(),
},
(table) => {
	return {
		event_owner_id_person_id_fk: foreignKey({
			columns: [table.owner_id],
			foreignColumns: [person.id],
			name: "event_owner_id_person_id_fk"
		}),
	}
});

export const exclusion = pgTable("exclusion", {
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
			name: "exclusion_event_id_event_id_fk"
		}),
		exclusion_person_a_id_person_id_fk: foreignKey({
			columns: [table.person_a_id],
			foreignColumns: [person.id],
			name: "exclusion_person_a_id_person_id_fk"
		}),
		exclusion_person_b_id_person_id_fk: foreignKey({
			columns: [table.person_b_id],
			foreignColumns: [person.id],
			name: "exclusion_person_b_id_person_id_fk"
		}),
	}
});

export const pairing = pgTable("pairing", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	event_id: uuid().notNull(),
	giver_id: uuid().notNull(),
	receiver_id: uuid(),
	allow_exclusion: integer().default(0).notNull(),
	password: text(),
	created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	confirmed: boolean(),
},
(table) => {
	return {
		pairing_event_id_event_id_fk: foreignKey({
			columns: [table.event_id],
			foreignColumns: [event.id],
			name: "pairing_event_id_event_id_fk"
		}),
		pairing_giver_id_person_id_fk: foreignKey({
			columns: [table.giver_id],
			foreignColumns: [person.id],
			name: "pairing_giver_id_person_id_fk"
		}).onDelete("cascade"),
		pairing_receiver_id_person_id_fk: foreignKey({
			columns: [table.receiver_id],
			foreignColumns: [person.id],
			name: "pairing_receiver_id_person_id_fk"
		}).onDelete("set null"),
	}
});

export const person = pgTable("person", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	phone_number: jsonb(),
	push_subscribed: boolean().default(false).notNull(),
	created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	email: text(),
});

export const notification = pgTable("notification", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	event_id: uuid().notNull(),
	person_id: uuid().notNull(),
	type: notification_type().notNull(),
	email: text(),
	phone_number: jsonb(),
	scheduled_at: timestamp({ mode: 'string' }).notNull(),
	sent_at: timestamp({ mode: 'string' }),
	created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
	status: notification_status().default('pending').notNull(),
},
(table) => {
	return {
		notification_event_id_event_id_fk: foreignKey({
			columns: [table.event_id],
			foreignColumns: [event.id],
			name: "notification_event_id_event_id_fk"
		}),
		notification_person_id_person_id_fk: foreignKey({
			columns: [table.person_id],
			foreignColumns: [person.id],
			name: "notification_person_id_person_id_fk"
		}),
	}
});