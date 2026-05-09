"use node";

import OpenAI from "openai";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const IMAGE_MODEL_ID = "gpt-image-2";
const IMAGE_SIZE = "1024x1024";
const IMAGE_QUALITY = "low";

function errorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "The familiar art could not hatch. Please try again.";
}

function imageBytesFromBase64(imageBase64: string) {
  const buffer = Buffer.from(imageBase64, "base64");
  return new Blob([buffer], { type: "image/png" });
}

export const generateForRun = internalAction({
  args: {
    runId: v.id("cardRuns"),
  },
  handler: async (ctx, args) => {
    const run = await ctx.runMutation(internal.artState.markArtGenerating, {
      runId: args.runId,
    });

    if (!run) {
      return null;
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await client.images.generate({
        model: IMAGE_MODEL_ID,
        prompt: run.artPrompt,
        size: IMAGE_SIZE,
        quality: IMAGE_QUALITY,
        n: 1,
      });

      const imageBase64 = response.data?.[0]?.b64_json;
      if (!imageBase64) {
        throw new Error("The image model did not return image data.");
      }

      const storageId = await ctx.storage.store(
        imageBytesFromBase64(imageBase64),
      );
      const avatarImageUrl = await ctx.storage.getUrl(storageId);
      if (!avatarImageUrl) {
        throw new Error("The generated art could not be loaded from storage.");
      }

      await ctx.runMutation(internal.artState.completeArtGeneration, {
        runId: args.runId,
        avatarImageUrl,
      });

      return {
        status: "done",
        model: IMAGE_MODEL_ID,
        size: IMAGE_SIZE,
        quality: IMAGE_QUALITY,
      };
    } catch (error) {
      await ctx.runMutation(internal.artState.failArtGeneration, {
        runId: args.runId,
        errorMessage: errorMessage(error),
      });
      return { status: "error" };
    }
  },
});
