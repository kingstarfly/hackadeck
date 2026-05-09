import { z } from "zod";

export const hackaDeckCardSpecSchema = z.object({
  display_name: z.string().min(1).max(24),
  team_name: z.string().max(40).optional(),
  edition: z.string().default("AI Engineers Singapore 2026"),
  card_number: z.number().int().positive().optional(),
  archetype_title: z.string().min(1).max(40),
  familiar_species: z.string().min(1).max(32),
  familiar_descriptor: z.string().min(1).max(180),
  rarity: z.enum(["Common", "Uncommon", "Rare", "Legendary"]),
  print_finish: z.enum(["Matte", "Stamped", "Spot Gloss", "Metallic Ink"]),
  stats: z.object({
    Build: z.number().int().min(40).max(99),
    Debug: z.number().int().min(40).max(99),
    Taste: z.number().int().min(40).max(99),
    Chaos: z.number().int().min(40).max(99),
  }),
  signature_move: z.object({
    name: z.string().min(1).max(28),
    description: z.string().min(1).max(90),
  }),
  passive: z
    .object({
      name: z.string().min(1).max(28),
      description: z.string().min(1).max(100),
    })
    .optional(),
  flavor_text: z.string().min(1).max(110),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  art_prompt: z.string().min(1),
  negative_prompt_notes: z.array(z.string()).default([]),
});

export type HackaDeckCardSpec = z.infer<typeof hackaDeckCardSpecSchema>;

export const formAnswerSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(24),
  teamName: z.string().max(40).optional(),
  roleToday: z.string().min(1),
  powers: z.array(z.string()).min(1).max(3),
  weakness: z.string().min(1),
  familiarType: z.string().min(1),
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
