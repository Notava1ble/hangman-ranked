import { z } from "zod";

export const emailValidator = z.object({
  email: z.string().email().max(254, "Email is too long"),
  name: z
    .string()
    .trim()
    .min(3, "The username must not be shorter than 3 characters")
    .max(20, "The username must not be longer than 20 characters"),
});
