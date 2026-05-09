import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import schema from "./schema";

declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<unknown>>;
  }
}

const modules = import.meta.glob("./**/*.*s");

describe("Convex schema", () => {
  it("stores participants using recovery email as the hackathon identity", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const participantId = await t.run(async (ctx) => {
      const eventId = await ctx.db.insert("events", {
        name: "AI Engineer Hack 2026",
        slug: "ai-engineer-hack-2026",
        startsAt: now,
        isActive: true,
        createdAt: now,
      });

      return await ctx.db.insert("participants", {
        eventId,
        recoveryEmail: "maya@example.com",
        displayName: "Maya",
        teamName: "Cache Money",
        consentGallery: true,
        createdAt: now,
      });
    });

    const participant = await t.run((ctx) => ctx.db.get(participantId));

    expect(participant).toMatchObject({
      recoveryEmail: "maya@example.com",
      displayName: "Maya",
      consentGallery: true,
    });
  });

  it("stores a card with selectable looks", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();
    const spec = {
      display_name: "Maya",
      team_name: "Cache Money",
      edition: "AI Engineers Singapore 2026",
      card_number: 17,
      archetype_title: "Keeper of the Tiny Repro",
      familiar_species: "Owl",
      familiar_descriptor: "a calm debug owl",
      rarity: "Rare" as const,
      print_finish: "Stamped" as const,
      stats: { Build: 82, Debug: 96, Taste: 74, Chaos: 68 },
      signature_move: {
        name: "Endpoint Exorcism",
        description: "Turns one haunted API response into clean JSON.",
      },
      flavor_text: "Spotted listening to headers when the docs go quiet.",
      accent_color: "#7A5C3E",
      art_prompt: "Create a calm debug owl.",
      negative_prompt_notes: ["no text"],
    };

    const ids = await t.run(async (ctx) => {
      const eventId = await ctx.db.insert("events", {
        name: "AI Engineer Hack 2026",
        slug: "ai-engineer-hack-2026",
        startsAt: now,
        isActive: true,
        createdAt: now,
      });
      const participantId = await ctx.db.insert("participants", {
        eventId,
        recoveryEmail: "maya@example.com",
        displayName: "Maya",
        teamName: "Cache Money",
        consentGallery: true,
        createdAt: now,
      });
      const runId = await ctx.db.insert("cardRuns", {
        eventId,
        participantId,
        cardNumber: 17,
        status: "done",
        formAnswers: { roleToday: "Backend builder" },
        createdAt: now,
        updatedAt: now,
      });
      const cardId = await ctx.db.insert("cards", {
        eventId,
        participantId,
        runId,
        cardNumber: 17,
        spec,
        avatarImageUrl: "https://example.com/owl.png",
        finalPngUrl: "https://example.com/card.png",
        isFavorite: true,
        isPublic: true,
        createdAt: now,
      });
      const lookId = await ctx.db.insert("looks", {
        eventId,
        cardId,
        runId,
        lookNumber: 1,
        reason: "initial",
        specSnapshot: spec,
        avatarImageUrl: "https://example.com/owl.png",
        finalPngUrl: "https://example.com/card.png",
        createdAt: now,
      });

      await ctx.db.patch(cardId, { selectedLookId: lookId });
      await ctx.db.patch(participantId, { selectedCardId: cardId });
      await ctx.db.patch(runId, { cardId });

      return { eventId, participantId, cardId, lookId };
    });

    const participant = await t.run((ctx) => ctx.db.get(ids.participantId));
    const card = await t.run((ctx) => ctx.db.get(ids.cardId));

    expect(participant?.selectedCardId).toBe(ids.cardId);
    expect(participant?.eventId).toBe(ids.eventId);
    expect(card?.selectedLookId).toBe(ids.lookId);
    expect(card?.eventId).toBe(ids.eventId);
  });

  it("stores an event-scoped card counter", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const ids = await t.run(async (ctx) => {
      const eventId = await ctx.db.insert("events", {
        name: "AI Engineer Hack 2026",
        slug: "ai-engineer-hack-2026",
        startsAt: now,
        isActive: true,
        createdAt: now,
      });
      const counterId = await ctx.db.insert("eventCounters", {
        eventId,
        nextCardNumber: 1,
        updatedAt: now,
      });

      return { eventId, counterId };
    });

    const counter = await t.run((ctx) => ctx.db.get(ids.counterId));

    expect(counter).toMatchObject({
      eventId: ids.eventId,
      nextCardNumber: 1,
    });
  });
});
