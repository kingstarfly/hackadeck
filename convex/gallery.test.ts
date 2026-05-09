import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
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

async function seedEvent(
  t: ReturnType<typeof convexTest>,
  slug: string,
  name = "AI Engineers Singapore 2026",
) {
  const now = Date.now();

  return await t.run(async (ctx) => {
    return await ctx.db.insert("events", {
      name,
      slug,
      startsAt: now,
      isActive: true,
      createdAt: now,
    });
  });
}

async function seedCard(
  t: ReturnType<typeof convexTest>,
  args: {
    eventId: string;
    cardNumber: number;
    displayName: string;
    consentGallery: boolean;
    isPublic: boolean;
    selected?: boolean;
    createdAt?: number;
  },
) {
  return await t.run(async (ctx) => {
    const participantId = await ctx.db.insert("participants", {
      eventId: args.eventId as never,
      recoveryEmail: `${args.displayName.toLowerCase()}@example.com`,
      displayName: args.displayName,
      teamName: "Cache Money",
      consentGallery: args.consentGallery,
      createdAt: args.createdAt ?? Date.now(),
    });
    const runId = await ctx.db.insert("cardRuns", {
      eventId: args.eventId as never,
      participantId,
      cardNumber: args.cardNumber,
      status: "done",
      formAnswers: { roleToday: "Backend builder" },
      createdAt: args.createdAt ?? Date.now(),
      updatedAt: args.createdAt ?? Date.now(),
    });
    const cardId = await ctx.db.insert("cards", {
      eventId: args.eventId as never,
      participantId,
      runId,
      cardNumber: args.cardNumber,
      spec: {
        ...baseSpec,
        display_name: args.displayName,
        card_number: args.cardNumber,
      },
      avatarImageUrl: `https://example.com/${args.cardNumber}.png`,
      isFavorite: false,
      isPublic: args.isPublic,
      createdAt: args.createdAt ?? Date.now(),
    });
    const lookId = await ctx.db.insert("looks", {
      eventId: args.eventId as never,
      cardId,
      runId,
      lookNumber: 1,
      reason: "initial",
      specSnapshot: {
        ...baseSpec,
        display_name: args.displayName,
        card_number: args.cardNumber,
      },
      avatarImageUrl: `https://example.com/look-${args.cardNumber}.png`,
      createdAt: args.createdAt ?? Date.now(),
    });

    await ctx.db.patch(cardId, { selectedLookId: lookId });
    if (args.selected ?? true) {
      await ctx.db.patch(participantId, { selectedCardId: cardId });
    }

    return cardId;
  });
}

describe("getEventGallery", () => {
  it("returns public consented selected cards for one event, newest first", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");
    const otherEventId = await seedEvent(t, "other-hack");
    const now = Date.now();

    await seedCard(t, {
      eventId,
      cardNumber: 1,
      displayName: "Older",
      consentGallery: true,
      isPublic: true,
      createdAt: now - 1000,
    });
    await seedCard(t, {
      eventId,
      cardNumber: 2,
      displayName: "Private Card",
      consentGallery: true,
      isPublic: false,
      createdAt: now,
    });
    await seedCard(t, {
      eventId,
      cardNumber: 3,
      displayName: "No Consent",
      consentGallery: false,
      isPublic: true,
      createdAt: now + 1000,
    });
    await seedCard(t, {
      eventId: otherEventId,
      cardNumber: 4,
      displayName: "Other Event",
      consentGallery: true,
      isPublic: true,
      createdAt: now + 2000,
    });
    await seedCard(t, {
      eventId,
      cardNumber: 5,
      displayName: "Newest",
      consentGallery: true,
      isPublic: true,
      createdAt: now + 3000,
    });

    const gallery = await t.query(api.gallery.getEventGallery, {
      eventSlug: "ai-engineer-hack-2026",
    });

    expect(gallery?.event.slug).toBe("ai-engineer-hack-2026");
    expect(gallery?.cardCount).toBe(2);
    expect(gallery?.cards.map((card) => card.displayName)).toEqual([
      "Newest",
      "Older",
    ]);
    expect(gallery?.cards[0]).toMatchObject({
      cardNumber: 5,
      teamName: "Cache Money",
      earnedTitle: "Keeper of the Tiny Repro",
      avatarImageUrl: "https://example.com/look-5.png",
    });
  });

  it("excludes public cards that are not the participant selected card", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t, "ai-engineer-hack-2026");

    await seedCard(t, {
      eventId,
      cardNumber: 1,
      displayName: "Unselected",
      consentGallery: true,
      isPublic: true,
      selected: false,
    });

    const gallery = await t.query(api.gallery.getEventGallery, {
      eventSlug: "ai-engineer-hack-2026",
    });

    expect(gallery?.cardCount).toBe(0);
    expect(gallery?.cards).toEqual([]);
  });
});
