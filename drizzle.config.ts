import { env } from "@/env.mjs";
import { type Config } from "drizzle-kit";

export default {
  schema: ["./src/server/db/schema.ts", "./src/server/db/relations.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schemaFilter: ["public"],
  tablesFilter: ["*"],
  introspect: {
    casing: "preserve",
  },
  migrations: {
    prefix: "timestamp",
    schema: "public",
  }
} satisfies Config;