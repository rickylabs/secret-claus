import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_HOST: z
        .string()
        .refine(
            (str) => !str.includes("YOUR_PG_URL_HERE"),
            "You forgot to change the default URL"
        ),
    DATABASE_PASSWORD: z
        .string()
        .refine(
            (str) => !str.includes("YOUR_PG_PWD_HERE"),
            "You forgot to add a pswd"
        ),
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    SUPABASE_URL: z
        .string()
        .refine(
            (str) => !str.includes("YOUR_PG_PWD_HERE"),
          "You forgot to add a pswd"
        ),
    SUPABASE_ANON_KEY: z
        .string()
        .refine(
            (str) => !str.includes("YOUR_PG_PWD_HERE"),
          "You forgot to add a pswd"
        ),

  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z
        .string()
        .refine(
            (str) => !str.includes("YOUR_PG_PWD_HERE"),
            "You forgot to add a pswd"
        ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
        .string()
        .refine(
            (str) => !str.includes("YOUR_PG_PWD_HERE"),
            "You forgot to add a pswd"
        ),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});