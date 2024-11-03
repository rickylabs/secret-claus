import { z } from "zod";

export const phoneArraySchema = z
  .array(
    z.object({
      number: z.string(),
      country: z.string(),
    }),
  )
  .min(1, "At least one phone number is required")
  .refine((phones) => {
    return new Set(phones.map((p) => p.number)).size === phones.length;
  }, "Phone numbers must be unique");
