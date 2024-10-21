import postgres from "postgres";
import { env } from "@/env.mjs";

export const client = postgres(env.DATABASE_URL);
