import { v } from "convex/values";

import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";

const formAnswersValidator = v.object({
  eventSlug: v.string(),
  recoveryEmail: v.string(),
  displayName: v.string(),
  teamName: v.optional(v.string()),
  roleToday: v.string(),
  cardIntent: v.string(),
  buildEnergy: v.string(),
  powers: v.array(v.string()),
  weakness: v.string(),
  relic: v.string(),
  animalCompanionPreference: v.string(),
  detail: v.optional(v.string()),
  consentGallery: v.boolean(),
});

function cleanOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function assertLength(value: string, label: string, max: number) {
  if (value.trim().length === 0) {
    throw new Error(`${label} is required.`);
  }

  if (value.length > max) {
    throw new Error(`${label} is too long.`);
  }
}

export const submitQuiz = mutation({
  args: {
    answers: formAnswersValidator,
  },
  handler: async (ctx, args) => {
    const answers = args.answers;
    const eventSlug = answers.eventSlug.trim();
    const recoveryEmail = answers.recoveryEmail.trim().toLowerCase();
    const displayName = answers.displayName.trim();
    const teamName = cleanOptional(answers.teamName);
    const detail = cleanOptional(answers.detail);

    assertLength(eventSlug, "Event", 120);
    assertLength(recoveryEmail, "Recovery email", 320);
    assertLength(displayName, "Display name", 24);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
      throw new Error("Enter a valid recovery email.");
    }
    if (teamName && teamName.length > 40) {
      throw new Error("Team name is too long.");
    }
    if (detail && detail.length > 160) {
      throw new Error("Tiny detail is too long.");
    }
    if (answers.powers.length < 1 || answers.powers.length > 3) {
      throw new Error("Choose one to three hackathon powers.");
    }

    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", eventSlug))
      .unique();
    if (!event) {
      throw new Error("This event is not ready yet.");
    }

    const counter = await ctx.db
      .query("eventCounters")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .unique();
    if (!counter) {
      throw new Error("This event is missing its card counter.");
    }

    const now = Date.now();
    const existingParticipant = await ctx.db
      .query("participants")
      .withIndex("by_event_and_recovery_email", (q) =>
        q.eq("eventId", event._id).eq("recoveryEmail", recoveryEmail),
      )
      .unique();

    const participantId =
      existingParticipant?._id ??
      (await ctx.db.insert("participants", {
        eventId: event._id,
        recoveryEmail,
        displayName,
        ...(teamName ? { teamName } : {}),
        consentGallery: answers.consentGallery,
        createdAt: now,
      }));

    if (existingParticipant) {
      await ctx.db.patch(existingParticipant._id, {
        displayName,
        teamName,
        consentGallery: answers.consentGallery,
      });
    }

    const cardNumber = counter.nextCardNumber;
    await ctx.db.patch(counter._id, {
      nextCardNumber: cardNumber + 1,
      updatedAt: now,
    });

    const normalizedAnswers = {
      ...answers,
      eventSlug,
      recoveryEmail,
      displayName,
      ...(teamName ? { teamName } : {}),
      ...(detail ? { detail } : {}),
    };

    const runId = await ctx.db.insert("cardRuns", {
      eventId: event._id,
      participantId,
      cardNumber,
      status: "queued",
      formAnswers: normalizedAnswers,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.cardSpecGeneration.generateForRun,
      {
        runId,
      },
    );

    return {
      eventSlug,
      participantId,
      runId,
      cardNumber,
      deckPath: `/events/${eventSlug}/deck/${participantId}`,
    };
  },
});
