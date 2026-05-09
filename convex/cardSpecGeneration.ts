"use node";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import {
  buildCardSpecSystemPrompt,
  buildCardSpecUserPrompt,
  cardSpecSchema,
  normalizeGeneratedSpec,
  type CardSpec,
} from "./cardSpecCore";

const MODEL_ID = "gpt-5.5";

function errorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "The familiar matcher got tangled. Please try again.";
}

export const generateForRun = internalAction({
  args: {
    runId: v.id("cardRuns"),
  },
  handler: async (ctx, args) => {
    const run = await ctx.runMutation(
      internal.cardSpecState.markSpecGenerating,
      {
        runId: args.runId,
      },
    );

    if (!run) {
      return null;
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await client.responses.parse({
        model: MODEL_ID,
        input: [
          {
            role: "system",
            content: buildCardSpecSystemPrompt(),
          },
          {
            role: "user",
            content: buildCardSpecUserPrompt({
              answers: run.formAnswers,
              cardNumber: run.cardNumber,
              hatchedAtLabel: run.hatchedAtLabel,
            }),
          },
        ],
        text: {
          format: zodTextFormat(cardSpecSchema, "hackadeck_card_spec"),
        },
      });

      const parsed = response.output_parsed;
      if (!parsed) {
        throw new Error("The model did not return a valid card spec.");
      }

      const spec: CardSpec = normalizeGeneratedSpec(
        cardSpecSchema.parse(parsed),
      );

      await ctx.runMutation(internal.cardSpecState.completeSpecGeneration, {
        runId: args.runId,
        spec,
      });

      return { status: "art_generating" };
    } catch (error) {
      await ctx.runMutation(internal.cardSpecState.failSpecGeneration, {
        runId: args.runId,
        errorMessage: errorMessage(error),
      });
      return { status: "error" };
    }
  },
});
