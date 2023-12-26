import {Client} from "pg";
import {env} from "@/env.mjs";

export const pgConfig = {
    host: env.DATABASE_HOST,
    user: 'postgres',
    password: env.DATABASE_PASSWORD,
    database: "postgres",
    port: 5432,
}
export const client = new Client(pgConfig)