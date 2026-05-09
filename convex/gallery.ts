import { v } from "convex/values";

import { query } from "./_generated/server";

const DEFAULT_LIMIT = 72;
const MAX_LIMIT = 120;

export const getEventGallery = query({
  args: {
    eventSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();

    if (!event) {
      return null;
    }

    const limit = Math.min(Math.max(args.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const publicCards = await ctx.db
      .query("cards")
      .withIndex("by_event_and_public_created", (q) =>
        q.eq("eventId", event._id).eq("isPublic", true),
      )
      .order("desc")
      .take(limit);

    const cards = [];

    for (const card of publicCards) {
      const participant = await ctx.db.get(card.participantId);
      if (
        !participant ||
        participant.eventId !== event._id ||
        participant.selectedCardId !== card._id ||
        !participant.consentGallery ||
        !card.isPublic
      ) {
        continue;
      }

      const selectedLook = card.selectedLookId
        ? await ctx.db.get(card.selectedLookId)
        : null;

      cards.push({
        _id: card._id,
        cardNumber: card.cardNumber,
        createdAt: card.createdAt,
        displayName: participant.displayName,
        teamName: participant.teamName,
        earnedTitle: card.spec.earned_title,
        familiarSpecies: card.spec.familiar_species,
        avatarImageUrl:
          selectedLook && selectedLook.cardId === card._id
            ? selectedLook.avatarImageUrl
            : card.avatarImageUrl,
        finalPngUrl:
          selectedLook && selectedLook.cardId === card._id
            ? selectedLook.finalPngUrl
            : card.finalPngUrl,
        accentColor: card.spec.accent_color,
      });
    }

    return {
      event: {
        _id: event._id,
        name: event.name,
        slug: event.slug,
      },
      cardCount: cards.length,
      limit,
      cards,
    };
  },
});
