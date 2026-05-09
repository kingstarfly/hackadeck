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
  participants: defineTable({
    email: v.string(),
    displayName: v.string(),
    teamName: v.optional(v.string()),
    consentGallery: v.boolean(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  cardRuns: defineTable({
    participantId: v.id("participants"),
    status: v.union(
      v.literal("queued"),
      v.literal("spec_generating"),
      v.literal("art_generating"),
      v.literal("rendering"),
      v.literal("done"),
      v.literal("error"),
    ),
    formAnswers: v.any(),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_participant", ["participantId"]),

  cards: defineTable({
    participantId: v.id("participants"),
    runId: v.id("cardRuns"),
    cardNumber: v.number(),
    spec: cardSpec,
    avatarImageUrl: v.string(),
    finalPngUrl: v.optional(v.string()),
    isFavorite: v.boolean(),
    isPublic: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_participant", ["participantId"])
    .index("by_public_created", ["isPublic", "createdAt"]),

  teams: defineTable({
    teamName: v.string(),
    memberParticipantIds: v.array(v.id("participants")),
    teamCardId: v.optional(v.id("cards")),
    createdAt: v.number(),
  }).index("by_team_name", ["teamName"]),
});
