import { z } from "zod";

export const credentialValidator = z.object({
  email: z.string().email("Invalid email").max(254, "Email is too long"),
  name: z
    .string()
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Only letters, numbers, and underscores are allowed"
    )
    .min(3, "The username must not be shorter than 3 characters")
    .max(20, "The username must not be longer than 20 characters"),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long")
    .max(72, "The password must not exceed 72 characters"),
});
