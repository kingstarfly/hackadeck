import { v } from "convex/values";

import { internalMutation } from "./_generated/server";
import { cardSpecValidator } from "./schema";

function formatHatchedAt(timestamp: number) {
  return new Intl.DateTimeFormat("en-SG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Singapore",
  }).format(timestamp);
}

export const markSpecGenerating = internalMutation({
  args: {
    runId: v.id("cardRuns"),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);

    if (!run || run.status !== "queued" || !run.cardNumber) {
      return null;
    }

    await ctx.db.patch(run._id, {
      status: "spec_generating",
      errorMessage: undefined,
      updatedAt: Date.now(),
    });

    return {
      cardNumber: run.cardNumber,
      formAnswers: run.formAnswers,
      hatchedAtLabel: `Hatched ${formatHatchedAt(run.createdAt)}`,
    };
  },
});

export const completeSpecGeneration = internalMutation({
  args: {
    runId: v.id("cardRuns"),
    spec: cardSpecValidator,
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);

    if (!run) {
      throw new Error("Card run not found.");
    }
    if (run.status !== "spec_generating") {
      throw new Error("Card run is not generating a spec.");
    }

    await ctx.db.patch(run._id, {
      spec: args.spec,
      status: "art_generating",
      errorMessage: undefined,
      updatedAt: Date.now(),
    });

    return { status: "art_generating" };
  },
});

export const failSpecGeneration = internalMutation({
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
        args.errorMessage ||
        "The familiar matcher got tangled. Please try again.",
      updatedAt: Date.now(),
    });

    return { status: "error" };
  },
});
