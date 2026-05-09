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

const answers = {
  eventSlug: "ai-engineer-hack-2026",
  recoveryEmail: "Maya@Example.com ",
  displayName: "Maya",
  teamName: "Cache Money",
  roleToday: "Backend builder",
  cardIntent: "My actual role today",
  buildEnergy: "Bug hunter",
  powers: ["Fixing APIs", "Reading stack traces", "Shipping under pressure"],
  weakness: "Too many tabs",
  relic: "Rubber duck",
  animalCompanionPreference: "Owl",
  detail: "I always blame headers first.",
  consentGallery: true,
};

async function seedEvent(t: ReturnType<typeof convexTest>) {
  const now = Date.now();

  return await t.run(async (ctx) => {
    const eventId = await ctx.db.insert("events", {
      name: "AI Engineers Singapore 2026",
      slug: "ai-engineer-hack-2026",
      startsAt: now,
      isActive: true,
      createdAt: now,
    });
    await ctx.db.insert("eventCounters", {
      eventId,
      nextCardNumber: 1,
      updatedAt: now,
    });

    return eventId;
  });
}

describe("submitQuiz", () => {
  it("creates a participant and queued card run with the next event card number", async () => {
    const t = convexTest(schema, modules);
    const eventId = await seedEvent(t);

    const result = await t.mutation(api.submissions.submitQuiz, { answers });

    const participant = await t.run((ctx) => ctx.db.get(result.participantId));
    const run = await t.run((ctx) => ctx.db.get(result.runId));
    const counter = await t.run((ctx) =>
      ctx.db
        .query("eventCounters")
        .withIndex("by_event", (q) => q.eq("eventId", eventId))
        .unique(),
    );

    expect(result).toMatchObject({
      eventSlug: "ai-engineer-hack-2026",
      cardNumber: 1,
      deckPath: `/events/ai-engineer-hack-2026/deck/${result.participantId}`,
    });
    expect(participant).toMatchObject({
      eventId,
      recoveryEmail: "maya@example.com",
      displayName: "Maya",
      teamName: "Cache Money",
      consentGallery: true,
    });
    expect(run).toMatchObject({
      eventId,
      participantId: result.participantId,
      cardNumber: 1,
      status: "queued",
    });
    expect(counter?.nextCardNumber).toBe(2);
  });

  it("reuses participants by event and normalized recovery email", async () => {
    const t = convexTest(schema, modules);
    await seedEvent(t);

    const first = await t.mutation(api.submissions.submitQuiz, { answers });
    const second = await t.mutation(api.submissions.submitQuiz, {
      answers: {
        ...answers,
        recoveryEmail: "maya@example.com",
        displayName: "Maya Prime",
        teamName: "Prompt Ops",
        consentGallery: false,
      },
    });

    const participant = await t.run((ctx) => ctx.db.get(first.participantId));
    const runs = await t.run((ctx) =>
      ctx.db
        .query("cardRuns")
        .withIndex("by_participant", (q) =>
          q.eq("participantId", first.participantId),
        )
        .collect(),
    );

    expect(second.participantId).toBe(first.participantId);
    expect(second.cardNumber).toBe(2);
    expect(participant).toMatchObject({
      displayName: "Maya Prime",
      teamName: "Prompt Ops",
      consentGallery: false,
    });
    expect(runs.map((run) => run.cardNumber)).toEqual([1, 2]);
  });

  it("fails clearly when the event has not been seeded", async () => {
    const t = convexTest(schema, modules);

    await expect(
      t.mutation(api.submissions.submitQuiz, { answers }),
    ).rejects.toThrow("This event is not ready yet.");
  });
});
