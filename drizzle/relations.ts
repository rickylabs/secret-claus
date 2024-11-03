import { relations } from "drizzle-orm/relations";
import { person, event, exclusion, pairing, notification } from "./schema";

export const eventRelations = relations(event, ({one, many}) => ({
	person: one(person, {
		fields: [event.owner_id],
		references: [person.id]
	}),
	exclusions: many(exclusion),
	pairings: many(pairing),
	notifications: many(notification),
}));

export const personRelations = relations(person, ({many}) => ({
	events: many(event),
	exclusions_person_a_id: many(exclusion, {
		relationName: "exclusion_person_a_id_person_id"
	}),
	exclusions_person_b_id: many(exclusion, {
		relationName: "exclusion_person_b_id_person_id"
	}),
	pairings_giver_id: many(pairing, {
		relationName: "pairing_giver_id_person_id"
	}),
	pairings_receiver_id: many(pairing, {
		relationName: "pairing_receiver_id_person_id"
	}),
	notifications: many(notification),
}));

export const exclusionRelations = relations(exclusion, ({one}) => ({
	event: one(event, {
		fields: [exclusion.event_id],
		references: [event.id]
	}),
	person_person_a_id: one(person, {
		fields: [exclusion.person_a_id],
		references: [person.id],
		relationName: "exclusion_person_a_id_person_id"
	}),
	person_person_b_id: one(person, {
		fields: [exclusion.person_b_id],
		references: [person.id],
		relationName: "exclusion_person_b_id_person_id"
	}),
}));

export const pairingRelations = relations(pairing, ({one}) => ({
	event: one(event, {
		fields: [pairing.event_id],
		references: [event.id]
	}),
	person_giver_id: one(person, {
		fields: [pairing.giver_id],
		references: [person.id],
		relationName: "pairing_giver_id_person_id"
	}),
	person_receiver_id: one(person, {
		fields: [pairing.receiver_id],
		references: [person.id],
		relationName: "pairing_receiver_id_person_id"
	}),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	event: one(event, {
		fields: [notification.event_id],
		references: [event.id]
	}),
	person: one(person, {
		fields: [notification.person_id],
		references: [person.id]
	}),
}));