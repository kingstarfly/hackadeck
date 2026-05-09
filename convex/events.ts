import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Get active events
    const activeEvents = await ctx.db
      .query("events")
      .withIndex("by_active_and_starts_at", (q) => q.eq("isActive", true))
      .take(20);

    // Get recently started events (within 24h) that may not be marked active yet
    const recentEvents = await ctx.db
      .query("events")
      .withIndex("by_active_and_starts_at")
      .take(50);

    const recentInactive = recentEvents.filter(
      (e) => !e.isActive && e.startsAt >= oneDayAgo,
    );

    // Combine and dedupe
    const allEvents = [...activeEvents, ...recentInactive];
    const seen = new Set<string>();
    const uniqueEvents = allEvents.filter((e) => {
      if (seen.has(e._id)) return false;
      seen.add(e._id);
      return true;
    });

    // Sort by startsAt descending (most recent first)
    return uniqueEvents.sort((a, b) => b.startsAt - a.startsAt);
  },
});

export const seedEvent = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    startsAt: v.number(),
    endsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      return { eventId: existing._id, created: false };
    }

    const now = Date.now();
    const eventId = await ctx.db.insert("events", {
      name: args.name,
      slug: args.slug,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      isActive: true,
      createdAt: now,
    });

    await ctx.db.insert("eventCounters", {
      eventId,
      nextCardNumber: 1,
      updatedAt: now,
    });

    return { eventId, created: true };
  },
});
