import { z } from "zod";

export const hackaDeckCardSpecSchema = z.object({
  display_name: z.string().min(1).max(24),
  team_name: z.string().max(40).optional(),
  edition: z.string().default("AI Engineers Singapore 2026"),
  card_number: z.number().int().positive().optional(),
  hatched_at_label: z.string().max(32).optional(),
  earned_title: z.string().min(1).max(40),
  archetype_base: z.string().min(1).max(40),
  card_intent: z.string().min(1).max(60),
  familiar_species: z.string().min(1).max(32),
  familiar_descriptor: z.string().min(1).max(180),
  personal_relic: z.object({
    name: z.string().min(1).max(40),
    visual: z.string().min(1).max(180),
    meaning: z.string().min(1).max(120),
  }),
  rarity: z.enum(["Common", "Uncommon", "Rare", "Epic", "Legendary"]),
  print_finish: z.enum(["Matte", "Stamped", "Spot Gloss", "Metallic Ink"]),
  stats: z.object({
    Build: z.number().int().min(40).max(99),
    Debug: z.number().int().min(40).max(99),
    Taste: z.number().int().min(40).max(99),
    Chaos: z.number().int().min(40).max(99),
  }),
  stat_icons: z.object({
    Build: z.enum(["hammer", "spark", "stack"]),
    Debug: z.enum(["bug", "magnifier", "lantern"]),
    Taste: z.enum(["star", "leaf", "eye"]),
    Chaos: z.enum(["bolt", "swirl", "comet"]),
  }),
  signature_move: z.object({
    name: z.string().min(1).max(28),
    description: z.string().min(1).max(90),
  }),
  field_note: z.string().min(1).max(110),
  known_for: z.string().max(90).optional(),
  chaos_tell: z.string().max(90).optional(),
  quirk_phrase: z.string().max(60).optional(),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  art_prompt: z.string().min(1),
  negative_prompt_notes: z.array(z.string()).default([]),
});

export type HackaDeckCardSpec = z.infer<typeof hackaDeckCardSpecSchema>;

export const formAnswerSchema = z.object({
  eventSlug: z.string().min(1),
  recoveryEmail: z.string().email(),
  displayName: z.string().min(1).max(24),
  teamName: z.string().max(40).optional(),
  roleToday: z.string().min(1),
  cardIntent: z.string().min(1),
  buildEnergy: z.string().min(1),
  powers: z.array(z.string()).min(1).max(3),
  weakness: z.string().min(1),
  relic: z.string().min(1),
  animalCompanionPreference: z.string().min(1),
  detail: z.string().max(160).optional(),
  consentGallery: z.boolean(),
});

export type FormAnswers = z.infer<typeof formAnswerSchema>;

export type CardRunStatus =
  | "queued"
  | "spec_generating"
  | "art_generating"
  | "rendering"
  | "done"
  | "error";
