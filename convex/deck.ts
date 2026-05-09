import { v } from "convex/values";

import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { buildArtRerollPrompt } from "./artRerollPrompt";

const MAX_LOOKS_PER_CARD = 4;

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

    const cards = await ctx.db
      .query("cards")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", args.participantId),
      )
      .order("desc")
      .collect();

    const selectedCard = participant.selectedCardId
      ? await ctx.db.get(participant.selectedCardId)
      : null;
    const selectedLook = selectedCard?.selectedLookId
      ? await ctx.db.get(selectedCard.selectedLookId)
      : null;
    const looksByCardId = new Map<
      string,
      Array<{
        _id: string;
        lookNumber: number;
        reason: "initial" | "art_reroll";
        avatarImageUrl: string;
        finalPngUrl?: string;
        createdAt: number;
      }>
    >();

    for (const card of cards) {
      const looks = await ctx.db
        .query("looks")
        .withIndex("by_card_and_look_number", (q) => q.eq("cardId", card._id))
        .collect();

      looksByCardId.set(
        card._id,
        looks
          .filter((look) => look.eventId === event._id)
          .sort((a, b) => a.lookNumber - b.lookNumber)
          .map((look) => ({
            _id: look._id,
            lookNumber: look.lookNumber,
            reason: look.reason,
            avatarImageUrl: look.avatarImageUrl,
            finalPngUrl: look.finalPngUrl,
            createdAt: look.createdAt,
          })),
      );
    }

    return {
      event: {
        _id: event._id,
        name: event.name,
        slug: event.slug,
      },
      participant: {
        _id: participant._id,
        displayName: participant.displayName,
        recoveryEmail: participant.recoveryEmail,
        teamName: participant.teamName,
        consentGallery: participant.consentGallery,
        selectedCardId: participant.selectedCardId,
      },
      selectedCard:
        selectedCard && selectedCard.participantId === participant._id
          ? {
              _id: selectedCard._id,
              cardNumber: selectedCard.cardNumber,
              avatarImageUrl: selectedCard.avatarImageUrl,
              finalPngUrl: selectedCard.finalPngUrl,
              createdAt: selectedCard.createdAt,
              spec: selectedCard.spec,
              selectedLook:
                selectedLook && selectedLook.cardId === selectedCard._id
                  ? {
                      _id: selectedLook._id,
                      lookNumber: selectedLook.lookNumber,
                      reason: selectedLook.reason,
                      avatarImageUrl: selectedLook.avatarImageUrl,
                      finalPngUrl: selectedLook.finalPngUrl,
                      createdAt: selectedLook.createdAt,
                    }
                  : null,
            }
          : null,
      cards: cards
        .filter((card) => card.eventId === event._id)
        .map((card) => ({
          _id: card._id,
          runId: card.runId,
          cardNumber: card.cardNumber,
          selectedLookId: card.selectedLookId,
          avatarImageUrl: card.avatarImageUrl,
          finalPngUrl: card.finalPngUrl,
          isPublic: card.isPublic,
          createdAt: card.createdAt,
          spec: card.spec,
          looks: looksByCardId.get(card._id) ?? [],
        })),
      runs: runs.map((run) => ({
        _id: run._id,
        cardNumber: run.cardNumber,
        cardId: run.cardId,
        rerollForCardId: run.rerollForCardId,
        status: run.status,
        errorMessage: run.errorMessage,
        createdAt: run.createdAt,
        updatedAt: run.updatedAt,
        spec: run.spec,
      })),
    };
  },
});

export const selectCard = mutation({
  args: {
    eventSlug: v.string(),
    participantId: v.id("participants"),
    cardId: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();
    if (!event) {
      throw new Error("Event not found.");
    }

    const participant = await ctx.db.get(args.participantId);
    if (!participant || participant.eventId !== event._id) {
      throw new Error("Participant not found for this event.");
    }

    const card = await ctx.db.get(args.cardId);
    if (
      !card ||
      card.eventId !== event._id ||
      card.participantId !== participant._id
    ) {
      throw new Error("Card not found for this participant deck.");
    }

    await ctx.db.patch(participant._id, { selectedCardId: card._id });

    return { selectedCardId: card._id };
  },
});

export const selectLook = mutation({
  args: {
    eventSlug: v.string(),
    participantId: v.id("participants"),
    cardId: v.id("cards"),
    lookId: v.id("looks"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();
    if (!event) {
      throw new Error("Event not found.");
    }

    const participant = await ctx.db.get(args.participantId);
    if (!participant || participant.eventId !== event._id) {
      throw new Error("Participant not found for this event.");
    }

    const card = await ctx.db.get(args.cardId);
    if (
      !card ||
      card.eventId !== event._id ||
      card.participantId !== participant._id
    ) {
      throw new Error("Card not found for this participant deck.");
    }

    const look = await ctx.db.get(args.lookId);
    if (!look || look.eventId !== event._id || look.cardId !== card._id) {
      throw new Error("Look not found for this card.");
    }

    await ctx.db.patch(card._id, { selectedLookId: look._id });

    return { selectedLookId: look._id };
  },
});

export const requestArtReroll = mutation({
  args: {
    eventSlug: v.string(),
    participantId: v.id("participants"),
    cardId: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();
    if (!event) {
      throw new Error("Event not found.");
    }

    const participant = await ctx.db.get(args.participantId);
    if (!participant || participant.eventId !== event._id) {
      throw new Error("Participant not found for this event.");
    }

    const card = await ctx.db.get(args.cardId);
    if (
      !card ||
      card.eventId !== event._id ||
      card.participantId !== participant._id
    ) {
      throw new Error("Card not found for this participant deck.");
    }

    const activeReroll = await ctx.db
      .query("cardRuns")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", participant._id),
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("rerollForCardId"), card._id),
          q.or(
            q.eq(q.field("status"), "queued"),
            q.eq(q.field("status"), "spec_generating"),
            q.eq(q.field("status"), "art_generating"),
            q.eq(q.field("status"), "rendering"),
          ),
        ),
      )
      .first();
    if (activeReroll) {
      throw new Error("A new look is already hatching for this card.");
    }

    const looks = await ctx.db
      .query("looks")
      .withIndex("by_card_and_look_number", (q) => q.eq("cardId", card._id))
      .collect();
    if (looks.length >= MAX_LOOKS_PER_CARD) {
      throw new Error("This card already has all 4 looks.");
    }

    const now = Date.now();
    const spec = {
      ...card.spec,
      art_prompt: buildArtRerollPrompt(card.spec),
    };
    const runId = await ctx.db.insert("cardRuns", {
      eventId: event._id,
      participantId: participant._id,
      cardNumber: card.cardNumber,
      rerollForCardId: card._id,
      status: "art_generating",
      formAnswers: {
        reason: "art_reroll",
        cardId: card._id,
      },
      spec,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.artRerollGeneration.generateForRun,
      {
        runId,
      },
    );

    return {
      runId,
      remainingLooks: MAX_LOOKS_PER_CARD - looks.length - 1,
    };
  },
});
