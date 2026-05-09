import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const cardSpec = v.object({
  display_name: v.string(),
  team_name: v.optional(v.string()),
  edition: v.string(),
  card_number: v.optional(v.number()),
  archetype_title: v.string(),
  familiar_species: v.string(),
  familiar_descriptor: v.string(),
  rarity: v.union(
    v.literal("Common"),
    v.literal("Uncommon"),
    v.literal("Rare"),
    v.literal("Legendary"),
  ),
  print_finish: v.union(
    v.literal("Matte"),
    v.literal("Stamped"),
    v.literal("Spot Gloss"),
    v.literal("Metallic Ink"),
  ),
  stats: v.object({
    Build: v.number(),
    Debug: v.number(),
    Taste: v.number(),
    Chaos: v.number(),
  }),
  signature_move: v.object({
    name: v.string(),
    description: v.string(),
  }),
  passive: v.optional(
    v.object({
      name: v.string(),
      description: v.string(),
    }),
  ),
  flavor_text: v.string(),
  accent_color: v.string(),
  art_prompt: v.string(),
  negative_prompt_notes: v.array(v.string()),
});

export default defineSchema({
  events: defineTable({
    name: v.string(),
    slug: v.string(),
    startsAt: v.number(),
    endsAt: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_and_starts_at", ["isActive", "startsAt"]),

  eventCounters: defineTable({
    eventId: v.id("events"),
    nextCardNumber: v.number(),
    updatedAt: v.number(),
  }).index("by_event", ["eventId"]),

  participants: defineTable({
    eventId: v.id("events"),
    recoveryEmail: v.string(),
    displayName: v.string(),
    teamName: v.optional(v.string()),
    consentGallery: v.boolean(),
    selectedCardId: v.optional(v.id("cards")),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_and_recovery_email", ["eventId", "recoveryEmail"]),

  cardRuns: defineTable({
    eventId: v.id("events"),
    participantId: v.id("participants"),
    cardNumber: v.optional(v.number()),
    status: v.union(
      v.literal("queued"),
      v.literal("spec_generating"),
      v.literal("art_generating"),
      v.literal("rendering"),
      v.literal("done"),
      v.literal("error"),
    ),
    formAnswers: v.any(),
    cardId: v.optional(v.id("cards")),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_participant", ["participantId"]),

  cards: defineTable({
    eventId: v.id("events"),
    participantId: v.id("participants"),
    runId: v.id("cardRuns"),
    cardNumber: v.number(),
    selectedLookId: v.optional(v.id("looks")),
    spec: cardSpec,
    avatarImageUrl: v.string(),
    finalPngUrl: v.optional(v.string()),
    isFavorite: v.boolean(),
    isPublic: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_participant", ["participantId"])
    .index("by_event_and_public_created", ["eventId", "isPublic", "createdAt"]),

  looks: defineTable({
    eventId: v.id("events"),
    cardId: v.id("cards"),
    runId: v.id("cardRuns"),
    lookNumber: v.number(),
    reason: v.union(v.literal("initial"), v.literal("art_reroll")),
    specSnapshot: cardSpec,
    avatarImageUrl: v.string(),
    finalPngUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_card", ["cardId"])
    .index("by_card_and_look_number", ["cardId", "lookNumber"]),

  teams: defineTable({
    eventId: v.id("events"),
    teamName: v.string(),
    memberParticipantIds: v.array(v.id("participants")),
    teamCardId: v.optional(v.id("cards")),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_and_team_name", ["eventId", "teamName"]),
});
