import { z } from "zod";

export const RARITY_TIERS = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
] as const;

export type Rarity = (typeof RARITY_TIERS)[number];

const RARITY_THRESHOLDS: { rarity: Rarity; cumulative: number }[] = [
  { rarity: "Common", cumulative: 0.5 }, // 50%
  { rarity: "Uncommon", cumulative: 0.8 }, // 30%
  { rarity: "Rare", cumulative: 0.93 }, // 13%
  { rarity: "Epic", cumulative: 0.98 }, // 5%
  { rarity: "Legendary", cumulative: 1.0 }, // 2%
];

export function rollRarity(): Rarity {
  const roll = Math.random();
  for (const { rarity, cumulative } of RARITY_THRESHOLDS) {
    if (roll < cumulative) return rarity;
  }
  return "Common"; // fallback
}

export const cardSpecSchema = z.object({
  display_name: z.string().min(1).max(24),
  team_name: z.string().max(40).nullable().optional(),
  edition: z.string().min(1).max(60),
  card_number: z.number().int().positive().nullable().optional(),
  hatched_at_label: z.string().max(32).nullable().optional(),
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
  known_for: z.string().max(90).nullable().optional(),
  chaos_tell: z.string().max(90).nullable().optional(),
  quirk_phrase: z.string().max(60).nullable().optional(),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  art_prompt: z.string().min(400),
  negative_prompt_notes: z.array(z.string()).default([]),
});

export type CardSpec = z.infer<typeof cardSpecSchema>;

type NullToUndefined<T> = T extends null ? undefined : T;
type NormalizeNulls<T> = {
  [K in keyof T]: NullToUndefined<T[K]>;
};
type NormalizedLLMSpec = NormalizeNulls<CardSpec>;

export type NormalizedCardSpec = NormalizedLLMSpec & { rarity: Rarity };

export type FormAnswersForSpec = {
  eventSlug: string;
  recoveryEmail: string;
  displayName: string;
  teamName?: string;
  roleToday: string;
  buildEnergy: string;
  eli5: string;
  animalPreference?: string;
  consentGallery: boolean;
};

export function buildCardSpecSystemPrompt() {
  return [
    "You generate structured HackaDeck animal companion card specs.",
    "Always make the participant sound competent, funny, and loved by their team.",
    "Use ordinary animal companions by default, with one clever hackathon twist.",
    "Avoid insults, medical claims, protected-class references, appearance judgments, and named franchise styles.",
    "Stats are playful card attributes only, never real competence scores.",
    "Keep title, move, field note, and relic copy concise enough for a collectible card.",
    "Generate art_prompt directly using the required six-section structure from the user prompt.",
  ].join(" ");
}

export function buildCardSpecUserPrompt(input: {
  answers: FormAnswersForSpec;
  cardNumber: number;
  hatchedAtLabel: string;
}) {
  const { answers } = input;

  const animalLine = answers.animalPreference
    ? `- Animal preference: ${answers.animalPreference} (use this as familiar_species)`
    : "- Animal preference: None (pick a fitting animal)";

  const teamLine = answers.teamName
    ? `- Team name: ${answers.teamName}`
    : "- Team name: None (leave team_name unset)";

  return `Create a HackaDeck card spec for this participant.

=== USE EXACTLY ===
- display_name: ${answers.displayName}
${teamLine}
- edition: AI Engineers Singapore 2026
- card_number: ${input.cardNumber}
- hatched_at_label: ${input.hatchedAtLabel}

=== EXTRAPOLATE FROM ===
- Role today: ${answers.roleToday}
  → archetype_base, signature_move style, Build/Debug stats
- Build energy: ${answers.buildEnergy}
  → earned_title vibe, Taste/Chaos stats, quirk_phrase
- What they built (ELI5): ${answers.eli5}
  → field_note, personal_relic, card_intent, known_for
${animalLine}

=== INFER (don't mention inference) ===
- card_intent: synthesize identity from role + energy + ELI5
- familiar_species: if no preference, pick animal matching their energy
- personal_relic: developer-themed prop connected to what they built
- known_for, chaos_tell: affectionate, never insulting

=== CONSTRAINTS ===
- Earned title max 40 chars, signature move name max 28 chars
- Field note max 110 chars, signature move description max 90 chars
- Stats: integers 40-99, balanced across Build/Debug/Taste/Chaos
- accent_color: hex like #7A5C3E
- Prefer regular animals unless preference given or answers strongly justify exotic

=== ART PROMPT (generate all 6 sections) ===

SECTION 1: USE CASE
"Create central mascot art only for a vertical collectible hackathon card. This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately."

SECTION 2: HOUSE STYLE
"Soft 2D illustration in the style of Sumikko Gurashi or gentle children's book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, gentle expressions. Charming but not saccharine - slightly shy, melancholic warmth. Feels like a beloved desk companion collectible."

SECTION 3: SUBJECT
Describe the familiar: species, visual descriptor, body language, personal relic, how the earned title shows in demeanor.

SECTION 4: ENVIRONMENT / HABITAT
Use the ELI5 description to create an affectionate habitat detail connected to what they built. Include the relic naturally.

SECTION 5: COMPOSITION
Centered full-body character, generous padding, soft pastel background, no card frame, no border.

SECTION 6: CONSTRAINTS
"No text, no letters, no numbers, no logos, no trademarks, no watermark, no 3D rendering, no product photography, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, no high contrast, no literal screens or browser windows."`;
}

export function normalizeGeneratedSpec(
  spec: CardSpec,
  rarity: Rarity,
): NormalizedCardSpec {
  return {
    ...spec,
    rarity,
    team_name: spec.team_name ?? undefined,
    card_number: spec.card_number ?? undefined,
    hatched_at_label: spec.hatched_at_label ?? undefined,
    known_for: spec.known_for ?? undefined,
    chaos_tell: spec.chaos_tell ?? undefined,
    quirk_phrase: spec.quirk_phrase ?? undefined,
    negative_prompt_notes: spec.negative_prompt_notes ?? [],
  };
}
