/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as artGeneration from "../artGeneration.js";
import type * as artRerollGeneration from "../artRerollGeneration.js";
import type * as artRerollPrompt from "../artRerollPrompt.js";
import type * as artRerollState from "../artRerollState.js";
import type * as artState from "../artState.js";
import type * as cardSpecCore from "../cardSpecCore.js";
import type * as cardSpecGeneration from "../cardSpecGeneration.js";
import type * as cardSpecState from "../cardSpecState.js";
import type * as deck from "../deck.js";
import type * as events from "../events.js";
import type * as gallery from "../gallery.js";
import type * as submissions from "../submissions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  artGeneration: typeof artGeneration;
  artRerollGeneration: typeof artRerollGeneration;
  artRerollPrompt: typeof artRerollPrompt;
  artRerollState: typeof artRerollState;
  artState: typeof artState;
  cardSpecCore: typeof cardSpecCore;
  cardSpecGeneration: typeof cardSpecGeneration;
  cardSpecState: typeof cardSpecState;
  deck: typeof deck;
  events: typeof events;
  gallery: typeof gallery;
  submissions: typeof submissions;
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
