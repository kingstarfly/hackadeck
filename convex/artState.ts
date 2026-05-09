import { v } from "convex/values";

import { internalMutation } from "./_generated/server";

export const markArtGenerating = internalMutation({
  args: {
    runId: v.id("cardRuns"),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.status !== "art_generating" || !run.spec) {
      return null;
    }

    await ctx.db.patch(run._id, {
      errorMessage: undefined,
      updatedAt: Date.now(),
    });

    return {
      artPrompt: run.spec.art_prompt,
    };
  },
});

export const completeArtGeneration = internalMutation({
  args: {
    runId: v.id("cardRuns"),
    avatarImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run) {
      throw new Error("Card run not found.");
    }
    if (run.status !== "art_generating" || !run.spec || !run.cardNumber) {
      throw new Error("Card run is not ready for art completion.");
    }

    const participant = await ctx.db.get(run.participantId);
    if (!participant) {
      throw new Error("Participant not found.");
    }

    const now = Date.now();
    await ctx.db.patch(run._id, {
      status: "rendering",
      errorMessage: undefined,
      updatedAt: now,
    });

    const cardId = await ctx.db.insert("cards", {
      eventId: run.eventId,
      participantId: run.participantId,
      runId: run._id,
      cardNumber: run.cardNumber,
      spec: run.spec,
      avatarImageUrl: args.avatarImageUrl,
      isFavorite: false,
      isPublic: participant.consentGallery,
      createdAt: now,
    });

    const lookId = await ctx.db.insert("looks", {
      eventId: run.eventId,
      cardId,
      runId: run._id,
      lookNumber: 1,
      reason: "initial",
      specSnapshot: run.spec,
      avatarImageUrl: args.avatarImageUrl,
      createdAt: now,
    });

    await ctx.db.patch(cardId, { selectedLookId: lookId });
    await ctx.db.patch(run.participantId, { selectedCardId: cardId });
    await ctx.db.patch(run._id, {
      status: "done",
      cardId,
      updatedAt: Date.now(),
    });

    return { status: "done", cardId, lookId };
  },
});

export const failArtGeneration = internalMutation({
  args: {
    runId: v.id("cardRuns"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run) {
      return null;
    }

    await ctx.db.patch(run._id, {
      status: "error",
      errorMessage:
        args.errorMessage || "The familiar art could not hatch. Please retry.",
      updatedAt: Date.now(),
    });

    return { status: "error" };
  },
});
