import { type Config } from "drizzle-kit";
import {pgConfig} from "@/server/db/client";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: pgConfig,
  tablesFilter: ["t3-app_*"],
} satisfies Config;