/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as data_allWords from "../data/allWords.js";
import type * as data_notAllowedUsernames from "../data/notAllowedUsernames.js";
import type * as game from "../game.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as lib_CustomEmail from "../lib/CustomEmail.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_validators from "../lib/validators.js";
import type * as misc from "../misc.js";
import type * as ranked from "../ranked.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "data/allWords": typeof data_allWords;
  "data/notAllowedUsernames": typeof data_notAllowedUsernames;
  game: typeof game;
  http: typeof http;
  leaderboard: typeof leaderboard;
  "lib/CustomEmail": typeof lib_CustomEmail;
  "lib/utils": typeof lib_utils;
  "lib/validators": typeof lib_validators;
  misc: typeof misc;
  ranked: typeof ranked;
  user: typeof user;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
