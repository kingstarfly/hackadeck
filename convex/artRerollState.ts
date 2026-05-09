import { v } from "convex/values";

import { internalMutation } from "./_generated/server";

const MAX_LOOKS_PER_CARD = 4;

export const markArtRerollGenerating = internalMutation({
  args: {
    runId: v.id("cardRuns"),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (
      !run ||
      run.status !== "art_generating" ||
      !run.spec ||
      !run.rerollForCardId
    ) {
      return null;
    }

    const card = await ctx.db.get(run.rerollForCardId);
    if (!card || card.participantId !== run.participantId) {
      throw new Error("Card not found for this reroll.");
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

export const completeArtReroll = internalMutation({
  args: {
    runId: v.id("cardRuns"),
    avatarImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run) {
      throw new Error("Card run not found.");
    }
    if (
      run.status !== "art_generating" ||
      !run.spec ||
      !run.cardNumber ||
      !run.rerollForCardId
    ) {
      throw new Error("Card run is not ready for reroll completion.");
    }

    const card = await ctx.db.get(run.rerollForCardId);
    if (
      !card ||
      card.eventId !== run.eventId ||
      card.participantId !== run.participantId
    ) {
      throw new Error("Card not found for this reroll.");
    }

    const existingLooks = await ctx.db
      .query("looks")
      .withIndex("by_card_and_look_number", (q) => q.eq("cardId", card._id))
      .collect();
    if (existingLooks.length >= MAX_LOOKS_PER_CARD) {
      throw new Error("This card already has all 4 looks.");
    }

    const nextLookNumber =
      Math.max(0, ...existingLooks.map((look) => look.lookNumber)) + 1;
    const now = Date.now();
    const lookId = await ctx.db.insert("looks", {
      eventId: run.eventId,
      cardId: card._id,
      runId: run._id,
      lookNumber: nextLookNumber,
      reason: "art_reroll",
      specSnapshot: run.spec,
      avatarImageUrl: args.avatarImageUrl,
      createdAt: now,
    });

    await ctx.db.patch(card._id, { selectedLookId: lookId });
    await ctx.db.patch(run._id, {
      status: "done",
      cardId: card._id,
      errorMessage: undefined,
      updatedAt: now,
    });

    return { status: "done", lookId, lookNumber: nextLookNumber };
  },
});

export const failArtReroll = internalMutation({
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
        args.errorMessage || "That new look wandered off. Please try again.",
      updatedAt: Date.now(),
    });

    return { status: "error" };
  },
});
