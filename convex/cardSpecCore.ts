import { z } from "zod";

export const cardSpecSchema = z.object({
  display_name: z.string().min(1).max(24),
  team_name: z.string().max(40).optional(),
  edition: z.string().min(1).max(60),
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
  art_prompt: z.string().min(400),
  negative_prompt_notes: z.array(z.string()).default([]),
});

export type CardSpec = z.infer<typeof cardSpecSchema>;

export type FormAnswersForSpec = {
  eventSlug: string;
  recoveryEmail: string;
  displayName: string;
  teamName?: string;
  roleToday: string;
  cardIntent: string;
  buildEnergy: string;
  powers: string[];
  weakness: string;
  relic: string;
  animalCompanionPreference: string;
  detail?: string;
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

  return `Create a HackaDeck card spec for this participant.

Edition: AI Engineers Singapore 2026
Card number: ${input.cardNumber}
Hatch label: ${input.hatchedAtLabel}

Participant answers:
- Display name: ${answers.displayName}
- Team name: ${answers.teamName || "None"}
- Role today: ${answers.roleToday}
- What the card should capture: ${answers.cardIntent}
- Build energy: ${answers.buildEnergy}
- Hackathon powers: ${answers.powers.join(", ")}
- Harmless weakness: ${answers.weakness}
- Personal relic: ${answers.relic}
- Animal companion preference: ${answers.animalCompanionPreference}
- Tiny personal detail: ${answers.detail || "None"}

Card spec constraints:
- Use the display name exactly as provided.
- Use the team name only if one was provided.
- Set edition, card_number, and hatched_at_label exactly from above.
- Earned title max 40 characters.
- Signature move name max 28 characters; description max 90 characters.
- Field note max 110 characters.
- Stats must be integers from 40 to 99.
- accent_color must be a hex color like #7A5C3E.
- Be affectionate and specific; weaknesses must be kind, never insulting.
- Prefer regular animals. Only use rare creatures if the answers strongly justify it or the participant asked for surprise.

The art_prompt field must be a complete prompt for GPT Image 2, generated directly by you. It must follow this exact section order:

SECTION 1: USE CASE
Include this text: "Create central mascot art only for a vertical collectible hackathon card. This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately."

SECTION 2: HOUSE STYLE
Include this text: "Soft 2D illustration in the style of Sumikko Gurashi or gentle children's book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, gentle expressions. Charming but not saccharine - slightly shy, melancholic warmth. Feels like a beloved desk companion collectible."

SECTION 3: SUBJECT
Describe the familiar, species, visual descriptor, body language, personal relic, and how the earned title appears in its demeanor.

SECTION 4: ENVIRONMENT / HABITAT
Use the tiny detail first if provided, otherwise weakness, relic, and build energy. Make one visible, integrated, affectionate habitat detail.

SECTION 5: COMPOSITION
Include centered full-body character, generous padding, soft pastel background, no card frame, no border.

SECTION 6: CONSTRAINTS
Include this text: "No text, no letters, no numbers, no logos, no trademarks, no watermark, no 3D rendering, no product photography, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, no high contrast, no literal screens or browser windows."`;
}

export function normalizeGeneratedSpec(spec: CardSpec): CardSpec {
  return {
    ...spec,
    team_name: spec.team_name || undefined,
    hatched_at_label: spec.hatched_at_label || undefined,
    known_for: spec.known_for || undefined,
    chaos_tell: spec.chaos_tell || undefined,
    quirk_phrase: spec.quirk_phrase || undefined,
    negative_prompt_notes: spec.negative_prompt_notes ?? [],
  };
}
