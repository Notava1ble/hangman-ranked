import { ConvexError } from "convex/values";
import { Password } from "@convex-dev/auth/providers/Password";
import { emailValidator } from "./validators";

export default Password({
  profile(params) {
    if (params.flow === "signUp") {
      const { error, data } = emailValidator.safeParse(params);
      if (error) {
        throw new ConvexError(error.format());
      }
      return { email: data.email, name: data.name };
    }
    return { email: params.email as string, name: params.name as string };
  },
});
