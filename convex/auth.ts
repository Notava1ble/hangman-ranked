import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google],
  callbacks: {
    /**
     * Fully replace Convex Auth’s default upsert logic.
     * Must return either an existing user ID or the newly inserted one.
     */
    async createOrUpdateUser(ctx: MutationCtx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }

      const email = args.profile.email;
      const phone = args.profile.phone;

      // const emailVerificationTime =
      //   args.profile.emailVerified === true ? Date.now() : undefined;
      // const phoneVerificationTime =
      //   args.profile.phoneVerified === true ? Date.now() : undefined;

      const name = (args.profile.name as string | undefined) ?? undefined;
      const image =
        (args.profile.image as string | undefined) ??
        (args.profile.picture as string | undefined) ??
        undefined;

      const userId = await ctx.db.insert("users", {
        email,
        phone,
        name,
        image,
        elo: 1200,
      });

      return userId;
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
