import { z } from "zod";

export const emailValidator = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(3, "The username mustn't be shorter then 3 characters")
    .max(20, "The username mustn't be longer then 20 characters"),
});
