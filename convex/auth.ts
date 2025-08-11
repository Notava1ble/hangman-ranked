import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

import { randomSuffix } from "./lib/utils";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google, Password],
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

      const name =
        (args.profile.name as string | undefined) ??
        email?.split("@")[0] ??
        undefined;

      const finalName = await generateUniqueName(ctx, name);
      const image =
        (args.profile.image as string | undefined) ??
        (args.profile.picture as string | undefined) ??
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

      const userId = await ctx.db.insert("users", {
        email,
        phone,
        name: finalName,
        image,
        elo: 1200,
      });

      return userId;
    },
  },
});

export async function generateUniqueName(
  ctx: QueryCtx,
  baseName: string | undefined
): Promise<string> {
  let normalized = (baseName ?? "user")
    .trim()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();

  normalized = normalized.split("_")[0];
  // Ensure it’s not empty after normalization
  if (!normalized) {
    normalized = "user";
  }
  if (normalized.length > 10) {
    normalized = normalized.slice(0, 10);
  }

  // Try base name + random suffix until available
  let finalName = normalized;
  while (
    await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", finalName))
      .unique()
  ) {
    const suffix = randomSuffix();
    finalName = `${normalized}_${suffix}`;
  }

  return finalName;
}

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
