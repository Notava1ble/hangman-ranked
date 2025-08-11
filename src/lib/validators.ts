import { z } from "zod";

export const credentialValidator = z.object({
  email: z.string().email("Invalid email"),
  name: z
    .string()
    .min(3, "The username mustn't be shorter then 3 characters")
    .max(20, "The username mustn't be longer then 20 characters"),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long"),
});
