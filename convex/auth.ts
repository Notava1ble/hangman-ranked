import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google],
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }
      return ctx.db.insert("users", {
        ...args,
        elo: 1200,
      });
    },
  },
});

export const loggedInUser = query({
  handler: async (ctx) => {
    return getLoggedInUserHelper(ctx);
  },
});

export const getLoggedInUserHelper = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }
  return user;
};
