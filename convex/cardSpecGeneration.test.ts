import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { NormalizedCardSpec } from "./cardSpecCore";
import schema from "./schema";

declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<unknown>>;
  }
}

const modules = import.meta.glob("./**/*.*s");

const answers = {
  eventSlug: "ai-engineer-hack-2026",
  recoveryEmail: "maya@example.com",
  displayName: "Maya",
  teamName: "Cache Money",
  roleToday: "Backend builder",
  buildEnergy: "Bug hunter",
  eli5: "We made a helper that reads your code and finds the bugs for you.",
  animalPreference: "Owl",
  consentGallery: true,
};

const validSpec: NormalizedCardSpec = {
  display_name: "Maya",
  edition: "AI Engineers Singapore 2026",
  card_number: 1,
  hatched_at_label: "Hatched 12:43 PM",
  earned_title: "Keeper of Tiny Headers",
  archetype_base: "Bug Hunter",
  card_intent: "My actual role today",
  familiar_species: "Owl",
  familiar_descriptor: "a calm little debug owl with tiny round glasses",
  personal_relic: {
    name: "Rubber Duck Lantern",
    visual: "a tiny rubber duck glowing beside the owl",
    meaning: "helps them debug without panic",
  },
  rarity: "Rare",
  print_finish: "Stamped",
  stats: {
    Build: 82,
    Debug: 96,
    Taste: 74,
    Chaos: 68,
  },
  stat_icons: {
    Build: "hammer",
    Debug: "lantern",
    Taste: "star",
    Chaos: "bolt",
  },
  signature_move: {
    name: "Header Whisper",
    description: "Turns one haunted API response into clean JSON.",
  },
  field_note: "Spotted listening to headers when the docs go quiet.",
  known_for: "Finds the one missing env var.",
  chaos_tell: "Opens many tabs and somehow knows where everything is.",
  quirk_phrase: "Show me the headers.",
  accent_color: "#7A5C3E",
  art_prompt:
    "Create central mascot art only for a vertical collectible hackathon card. This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately.\n\nSoft 2D illustration in the style of Sumikko Gurashi or gentle children's book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, gentle expressions. Charming but not saccharine - slightly shy, melancholic warmth. Feels like a beloved desk companion collectible.\n\nA calm owl with tiny round glasses and a rubber duck lantern.\n\nThe owl sits among folded header notes and soft paper tabs.\n\nSingle centered character, full body visible, generous padding for card framing. Soft pastel background with the habitat elements. No card frame, no border.\n\nNo text, no letters, no numbers, no logos, no trademarks, no watermark, no 3D rendering, no product photography, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, no high contrast, no literal screens or browser windows.",
  negative_prompt_notes: [],
};

async function seedQueuedRun(t: ReturnType<typeof convexTest>) {
  const now = Date.now();

  return await t.run(async (ctx) => {
    const eventId = await ctx.db.insert("events", {
      name: "AI Engineers Singapore 2026",
      slug: "ai-engineer-hack-2026",
      startsAt: now,
      isActive: true,
      createdAt: now,
    });
    const participantId = await ctx.db.insert("participants", {
      eventId,
      recoveryEmail: answers.recoveryEmail,
      displayName: answers.displayName,
      consentGallery: true,
      createdAt: now,
    });
    const runId = await ctx.db.insert("cardRuns", {
      eventId,
      participantId,
      cardNumber: 1,
      status: "queued",
      formAnswers: answers,
      createdAt: now,
      updatedAt: now,
    });

    return { eventId, participantId, runId };
  });
}

describe("card spec generation state", () => {
  it("stores a validated spec and advances the run to art generation", async () => {
    const t = convexTest(schema, modules);
    const { runId, participantId } = await seedQueuedRun(t);

    const marked = await t.mutation(internal.cardSpecState.markSpecGenerating, {
      runId,
    });
    await t.mutation(internal.cardSpecState.completeSpecGeneration, {
      runId,
      spec: validSpec,
    });

    const run = await t.run((ctx) => ctx.db.get(runId));
    const deck = await t.query(api.deck.getParticipantDeck, {
      eventSlug: answers.eventSlug,
      participantId: participantId as Id<"participants">,
    });

    expect(marked).toMatchObject({
      cardNumber: 1,
      formAnswers: answers,
    });
    expect(run).toMatchObject({
      status: "art_generating",
      spec: validSpec,
    });
    expect(deck?.runs[0]).toMatchObject({
      status: "art_generating",
      spec: validSpec,
    });
  });

  it("records participant-readable errors without needing a live OpenAI call", async () => {
    const t = convexTest(schema, modules);
    const { runId } = await seedQueuedRun(t);

    await t.mutation(internal.cardSpecState.markSpecGenerating, { runId });
    await t.mutation(internal.cardSpecState.failSpecGeneration, {
      runId,
      errorMessage: "The model returned invalid card JSON.",
    });

    const run = await t.run((ctx) => ctx.db.get(runId));

    expect(run).toMatchObject({
      status: "error",
      errorMessage: "The model returned invalid card JSON.",
    });
  });
});

describe("art generation state", () => {
  it("creates the initial card and look from generated art", async () => {
    const t = convexTest(schema, modules);
    const { runId, participantId } = await seedQueuedRun(t);

    await t.mutation(internal.cardSpecState.markSpecGenerating, { runId });
    await t.mutation(internal.cardSpecState.completeSpecGeneration, {
      runId,
      spec: validSpec,
    });

    const marked = await t.mutation(internal.artState.markArtGenerating, {
      runId,
    });
    const completed = await t.mutation(
      internal.artState.completeArtGeneration,
      {
        runId,
        avatarImageUrl: "https://example.com/familiar.png",
      },
    );

    const run = await t.run((ctx) => ctx.db.get(runId));
    const participant = await t.run((ctx) => ctx.db.get(participantId));
    const card = await t.run(async (ctx) =>
      run?.cardId ? await ctx.db.get(run.cardId) : null,
    );
    const look = await t.run(async (ctx) =>
      card?.selectedLookId ? await ctx.db.get(card.selectedLookId) : null,
    );

    expect(marked).toMatchObject({
      artPrompt: validSpec.art_prompt,
    });
    expect(completed).toMatchObject({
      status: "done",
    });
    expect(run).toMatchObject({
      status: "done",
      cardId: card?._id,
    });
    expect(participant?.selectedCardId).toBe(card?._id);
    expect(card).toMatchObject({
      eventId: run?.eventId,
      participantId,
      runId,
      cardNumber: 1,
      selectedLookId: look?._id,
      spec: validSpec,
      avatarImageUrl: "https://example.com/familiar.png",
      isPublic: true,
    });
    expect(look).toMatchObject({
      eventId: run?.eventId,
      cardId: card?._id,
      runId,
      lookNumber: 1,
      reason: "initial",
      specSnapshot: validSpec,
      avatarImageUrl: "https://example.com/familiar.png",
    });
  });

  it("records art generation failures on the card run", async () => {
    const t = convexTest(schema, modules);
    const { runId } = await seedQueuedRun(t);

    await t.mutation(internal.cardSpecState.markSpecGenerating, { runId });
    await t.mutation(internal.cardSpecState.completeSpecGeneration, {
      runId,
      spec: validSpec,
    });
    await t.mutation(internal.artState.failArtGeneration, {
      runId,
      errorMessage: "The image request was rejected.",
    });

    const run = await t.run((ctx) => ctx.db.get(runId));

    expect(run).toMatchObject({
      status: "error",
      errorMessage: "The image request was rejected.",
    });
    expect(run?.cardId).toBeUndefined();
  });
});
