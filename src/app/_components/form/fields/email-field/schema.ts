import { z } from "zod";

export const emailArraySchema = z
  .array(z.string().email("Invalid email address"))
  .min(1, "At least one email is required")
  .refine(
    (emails) => new Set(emails).size === emails.length,
    "Email addresses must be unique",
  );
