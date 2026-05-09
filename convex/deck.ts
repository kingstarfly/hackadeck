import { v } from "convex/values";

import { query } from "./_generated/server";

export const getParticipantDeck = query({
  args: {
    eventSlug: v.string(),
    participantId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();
    if (!event) {
      return null;
    }

    const participant = await ctx.db.get(args.participantId);
    if (!participant || participant.eventId !== event._id) {
      return null;
    }

    const runs = await ctx.db
      .query("cardRuns")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", args.participantId),
      )
      .order("desc")
      .take(10);

    return {
      event: {
        name: event.name,
        slug: event.slug,
      },
      participant: {
        _id: participant._id,
        displayName: participant.displayName,
        recoveryEmail: participant.recoveryEmail,
        teamName: participant.teamName,
        consentGallery: participant.consentGallery,
      },
      runs: runs.map((run) => ({
        _id: run._id,
        cardNumber: run.cardNumber,
        status: run.status,
        errorMessage: run.errorMessage,
        updatedAt: run.updatedAt,
        spec: run.spec,
      })),
    };
  },
});
