import { client } from "@/server/db/client";
//import {event, exclusion, pairing, pairingRelation, person} from "@/server/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";

export const db = drizzle(client);

/*export const db = drizzle(client,
    {
        schema: {
            person,
            event,
            pairing,
            pairingRelation,
            exclusion
        }
    })*/
