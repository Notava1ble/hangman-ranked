import { z } from "zod";

export const credentialValidator = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long"),
});
