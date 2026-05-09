import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import schema from "./schema";

declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<unknown>>;
  }
}

const modules = import.meta.glob("./**/*.*s");

const baseSpec = {
  display_name: "Maya",
  edition: "AI Engineers Singapore 2026",
  card_number: 1,
  earned_title: "Keeper of the Tiny Repro",
  archetype_base: "Bug Hunter",
  card_intent: "My actual role today",
  familiar_species: "Owl",
  familiar_descriptor: "a calm debug owl",
  personal_relic: {
    name: "Rubber Duck Lantern",
    visual: "a tiny yellow rubber duck holding a warm desk lamp",
    meaning: "helps them debug without panic",
  },
  rarity: "Rare" as const,
  print_finish: "Stamped" as const,
  stats: { Build: 82, Debug: 96, Taste: 74, Chaos: 68 },
  signature_move: {
    name: "Endpoint Exorcism",
    description: "Turns one haunted API response into clean JSON.",
  },
  stat_icons: {
    Build: "hammer" as const,
    Debug: "lantern" as const,
    Taste: "star" as const,
    Chaos: "bolt" as const,
  },
  field_note: "Spotted listening to headers when the docs go quiet.",
  accent_color: "#7A5C3E",
  art_prompt: "Create a calm debug owl.",
  negative_prompt_notes: ["no text"],
};

async function seedEvent(t: ReturnType<typeof convexTest>, slug: string) {
  const now = Date.now();

  return await t.run(async (ctx) => {
    return await ctx.db.insert("events", {
      name: slug,
      slug,
      startsAt: now,
      isActive: true,
      createdAt: now,
    });
  });
}

async function seedParticipantDeck(
  t: ReturnType<typeof convexTest>,
  args: { eventId: string; email: string; displayName: string },
) {
  return await t.run(async (ctx) => {
    const now = Date.now();
    const participantId = await ctx.db.insert("participants", {
      eventId: args.eventId as never,
      recoveryEmail: args.email,
      displayName: args.displayName,
      consentGallery: true,
      createdAt: now,
    });

    const firstRunId = await ctx.db.insert("cardRuns", {
      eventId: args.eventId as never,
      participantId,
      cardNumber: 1,
      status: "done",
      formAnswers: {},
      createdAt: now - 1000,
      updatedAt: now - 1000,
    });
    const firstCardId = await ctx.db.insert("cards", {
      eventId: args.eventId as never,
      participantId,
      runId: firstRunId,
      cardNumber: 1,
      spec: baseSpec,
      avatarImageUrl: "https://example.com/owl.png",
      isFavorite: false,
      isPublic: true,
      createdAt: now - 1000,
    });
    const firstLookId = await ctx.db.insert("looks", {
      eventId: args.eventId as never,
      cardId: firstCardId,
      runId: firstRunId,
      lookNumber: 1,
      reason: "initial",
      specSnapshot: baseSpec,
      avatarImageUrl: "https://example.com/owl-look-1.png",
      createdAt: now - 1000,
    });

    const secondRunId = await ctx.db.insert("cardRuns", {
      eventId: args.eventId as never,
      participantId,
      cardNumber: 2,
      status: "done",
      formAnswers: {},
      createdAt: now,
      updatedAt: now,
    });
    const secondCardId = await ctx.db.insert("cards", {
      eventId: args.eventId as never,
      participantId,
      runId: secondRunId,
      cardNumber: 2,
      spec: {
        ...baseSpec,
        card_number: 2,
        earned_title: "Captain of Last-Minute Polish",
        familiar_species: "Otter",
      },
      avatarImageUrl: "https://example.com/otter.png",
      isFavorite: false,
      isPublic: true,
      createdAt: now,
    });
    const secondLookId = await ctx.db.insert("looks", {
      eventId: args.eventId as never,
      cardId: secondCardId,
      runId: secondRunId,
      lookNumber: 1,
      reason: "initial",
      specSnapshot: {
        ...baseSpec,
        card_number: 2,
        earned_title: "Captain of Last-Minute Polish",
        familiar_species: "Otter",
      },
      avatarImageUrl: "https://example.com/otter-look-1.png",
      createdAt: now,
    });
    const rerollLookId = await ctx.db.insert("looks", {
      eventId: args.eventId as never,
      cardId: secondCardId,
      runId: secondRunId,
      lookNumber: 2,
      reason: "art_reroll",
      specSnapshot: {
        ...baseSpec,
        card_number: 2,
        earned_title: "Captain of Last-Minute Polish",
        familiar_species: "Otter",
      },
      avatarImageUrl: "https://example.com/otter-look-2.png",
      createdAt: now + 1,
    });

    await ctx.db.patch(firstCardId, { selectedLookId: firstLookId });
    await ctx.db.patch(firstRunId, { cardId: firstCardId });
    await ctx.db.patch(secondCardId, { selectedLookId: secondLookId });
    await ctx.db.patch(secondRunId, { cardId: secondCardId });
    await ctx.db.patch(participantId, { selectedCardId: secondCardId });

    return {
      participantId,
      firstCardId,
      secondRunId,
      secondCardId,
      secondLookId,
      rerollLookId,
    };
  });
}

describe("participant deck", () => {
  it("finds a participant deck by event slug and normalized recovery email", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const deckIds = await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });

    const result = await t.query(api.deck.findParticipantDeck, {
      eventSlug: "ai-engineer-hack-2026",
      recoveryEmail: " Maya@Example.com ",
    });

    expect(result).toEqual({
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
      deckPath: `/events/ai-engineer-hack-2026/deck/${deckIds.participantId}`,
    });
  });

  it("does not recover a deck from a different event", async () => {
    const t = convexTest(schema, modules);
    await seedEvent(t, "other-event");
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });

    const result = await t.query(api.deck.findParticipantDeck, {
      eventSlug: "other-event",
      recoveryEmail: "maya@example.com",
    });

    expect(result).toBeNull();
  });

  it("returns cards newest first with looks for the scoped event participant", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const otherEventId = await seedEvent(t, "other-hack");
    const deckIds = await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });
    await seedParticipantDeck(t, {
      eventId: otherEventId,
      email: "maya@example.com",
      displayName: "Other Maya",
    });

    const deck = await t.query(api.deck.getParticipantDeck, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
    });

    expect(deck?.cards.map((card) => card.cardNumber)).toEqual([2, 1]);
    expect(deck?.cards[0]?.looks.map((look) => look.lookNumber)).toEqual([
      1, 2,
    ]);
    expect(deck?.participant.selectedCardId).toBe(deckIds.secondCardId);
  });

  it("updates selected card and look only inside the participant event scope", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const otherEventId = await seedEvent(t, "other-hack");
    const deckIds = await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });
    const otherDeckIds = await seedParticipantDeck(t, {
      eventId: otherEventId,
      email: "other@example.com",
      displayName: "Other",
    });

    await t.mutation(api.deck.selectCard, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
      cardId: deckIds.firstCardId,
    });
    await t.mutation(api.deck.selectLook, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
      cardId: deckIds.secondCardId,
      lookId: deckIds.rerollLookId,
    });

    const participant = await t.run((ctx) => ctx.db.get(deckIds.participantId));
    const secondCard = await t.run((ctx) => ctx.db.get(deckIds.secondCardId));

    expect(participant?.selectedCardId).toBe(deckIds.firstCardId);
    expect(secondCard?.selectedLookId).toBe(deckIds.rerollLookId);

    await expect(
      t.mutation(api.deck.selectCard, {
        eventSlug: "ai-engineer-hack-2026",
        participantId: deckIds.participantId,
        cardId: otherDeckIds.secondCardId,
      }),
    ).rejects.toThrow("Card not found for this participant deck.");
    await expect(
      t.mutation(api.deck.selectLook, {
        eventSlug: "ai-engineer-hack-2026",
        participantId: deckIds.participantId,
        cardId: deckIds.secondCardId,
        lookId: otherDeckIds.rerollLookId,
      }),
    ).rejects.toThrow("Look not found for this card.");
  });

  it("requests an art reroll as a pending run with preserved identity prompt", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const deckIds = await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });

    const result = await t.mutation(api.deck.requestArtReroll, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
      cardId: deckIds.secondCardId,
    });
    const run = await t.run((ctx) => ctx.db.get(result.runId));

    expect(result.remainingLooks).toBe(1);
    expect(run).toMatchObject({
      status: "art_generating",
      cardNumber: 2,
      rerollForCardId: deckIds.secondCardId,
      spec: {
        familiar_species: "Otter",
        personal_relic: baseSpec.personal_relic,
      },
    });
    expect(run?.cardId).toBeUndefined();
    expect(run?.spec?.art_prompt).toContain(
      "Preserve the same Builder Familiar identity",
    );
    expect(run?.spec?.art_prompt).toContain("change the pose, expression");
  });

  it("creates reroll looks with incremented numbering and selects the new look", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const deckIds = await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });

    const { runId } = await t.mutation(api.deck.requestArtReroll, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
      cardId: deckIds.secondCardId,
    });
    const marked = await t.mutation(
      internal.artRerollState.markArtRerollGenerating,
      { runId },
    );
    const completed = await t.mutation(
      internal.artRerollState.completeArtReroll,
      {
        runId,
        avatarImageUrl: "https://example.com/otter-look-3.png",
      },
    );

    const deck = await t.query(api.deck.getParticipantDeck, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
    });
    const card = await t.run((ctx) => ctx.db.get(deckIds.secondCardId));

    expect(marked?.artPrompt).toContain("SECTION 3: SUBJECT");
    expect(completed).toMatchObject({ status: "done", lookNumber: 3 });
    expect(deck?.cards[0]?.looks.map((look) => look.lookNumber)).toEqual([
      1, 2, 3,
    ]);
    expect(deck?.cards[0]?.looks[2]).toMatchObject({
      reason: "art_reroll",
      avatarImageUrl: "https://example.com/otter-look-3.png",
    });
    expect(card?.selectedLookId).toBe(completed.lookId);
  });

  it("enforces the 4 look limit and blocks concurrent rerolls", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const deckIds = await seedParticipantDeck(t, {
      eventId,
      email: "maya@example.com",
      displayName: "Maya",
    });
    await t.run(async (ctx) => {
      const now = Date.now();
      await ctx.db.insert("looks", {
        eventId: eventId as never,
        cardId: deckIds.secondCardId,
        runId: deckIds.secondRunId,
        lookNumber: 3,
        reason: "art_reroll",
        specSnapshot: baseSpec,
        avatarImageUrl: "https://example.com/otter-look-3.png",
        createdAt: now,
      });
    });

    const pending = await t.mutation(api.deck.requestArtReroll, {
      eventSlug: "ai-engineer-hack-2026",
      participantId: deckIds.participantId,
      cardId: deckIds.secondCardId,
    });

    await expect(
      t.mutation(api.deck.requestArtReroll, {
        eventSlug: "ai-engineer-hack-2026",
        participantId: deckIds.participantId,
        cardId: deckIds.secondCardId,
      }),
    ).rejects.toThrow("A new look is already hatching for this card.");

    await t.mutation(internal.artRerollState.completeArtReroll, {
      runId: pending.runId,
      avatarImageUrl: "https://example.com/otter-look-4.png",
    });

    await expect(
      t.mutation(api.deck.requestArtReroll, {
        eventSlug: "ai-engineer-hack-2026",
        participantId: deckIds.participantId,
        cardId: deckIds.secondCardId,
      }),
    ).rejects.toThrow("This card already has all 4 looks.");
  });
});
