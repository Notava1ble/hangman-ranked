import { ConvexError } from "convex/values";
import { Password } from "@convex-dev/auth/providers/Password";
import { emailValidator } from "./validators";

export default Password({
  profile(params) {
    const { error } = emailValidator.safeParse(params);
    if (error && params.flow === "signUp") {
      throw new ConvexError(error.format());
    }
    return { email: params.email as string, name: params.name as string };
  },
});
