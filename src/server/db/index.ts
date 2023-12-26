import {drizzle} from "drizzle-orm/node-postgres";
import {client} from "@/server/db/client";
import {event, pairing, pairingRelation, person} from "@/server/db/schema";

await client.connect();
export const db = drizzle(client,
    {
        schema: {
            person,
            event,
            pairing,
            pairingRelation
        }
    })
