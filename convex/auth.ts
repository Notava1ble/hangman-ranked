import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

import { randomSuffix } from "./lib/utils";
import { ConvexError } from "convex/values";
import CustomEmail from "./lib/CustomEmail";
import { notAllowedUsernames } from "./data/notAllowedUsernames";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google, CustomEmail],
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

      // Check if name is already taken
      if (args.provider.id === "password" && args.profile.name) {
        const name = (args.profile.name as string).toLowerCase();

        if (notAllowedUsernames.has(name.toLowerCase())) {
          throw new ConvexError("This username is not allowed");
        }
        if (!/^[A-Za-z0-9_]+$/.test(name)) {
          throw new ConvexError("Invalid characters");
        }

        const sameNameUser = await ctx.db
          .query("users")
          .withIndex("name", (q) => q.eq("name", name))
          .unique();
        if (sameNameUser) {
          throw new ConvexError("This username is taken");
        }

        const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

        const userId = await ctx.db.insert("users", {
          email,
          phone,
          name,
          image,
          elo: 1200,
        });

        return userId;
      }
      const name =
        (args.profile.name as string | undefined) ??
        email?.split("@")[0] ??
        undefined;

      const finalName = await generateUniqueName(ctx, name);
      const image =
        (args.profile.image as string | undefined) ??
        (args.profile.picture as string | undefined) ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=random`;

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
  let attempts = 0;
  const maxAttempts = 10;
  while (
    await ctx.db
      .query("users")
      .withIndex("name", (q) => q.eq("name", finalName))
      .unique()
  ) {
    if (attempts >= maxAttempts) {
      // Fall back to timestamp-based unique name
      finalName = `${normalized}_${Date.now()}`;
      break;
    }
    const suffix = randomSuffix();
    const candidate = `${normalized}_${suffix}`;
    // Ensure the final name doesn't exceed field limits (I know it wont but still)
    finalName = candidate.length > 20 ? candidate.slice(0, 20) : candidate;
    attempts++;
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
