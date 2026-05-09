import type { FormAnswers } from "@/lib/card-schema";

export function buildFamiliarArtPrompt(input: {
  animalSpecies: string;
  roleToday: string;
  powers: string[];
  weakness: string;
  archetype: string;
  visualDetail?: string;
}) {
  return `Create central mascot art only for a vertical collectible hackathon card.

Use case:
This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately.

House style:
Premium matte editorial mascot illustration. Warm off-white paper feel, restrained spot-color palette, clean ink outline, subtle print grain, simple rounded shapes, crisp readable silhouette, charming but not childish. It should feel like a polished conference collectible or modern field-guide card, not a fantasy battle card.

Subject:
A ${input.animalSpecies} builder familiar representing a hackathon participant.

Participant traits:
- Role: ${input.roleToday}
- Strengths: ${input.powers.join(", ")}
- Harmless weakness: ${input.weakness}
- Archetype: ${input.archetype}
- Optional detail: ${input.visualDetail || "None"}

Visual direction:
Show the familiar as a clever desk companion with one small developer-themed prop if useful: tiny laptop, sticky note, coffee cup, cable, rubber duck, terminal card, checklist, or small tool. Keep the prop subtle and integrated.

Composition:
Single centered character, full body visible, generous padding, three-quarter view, clean silhouette. Simple warm background shape or paper-toned backdrop. No card frame.

Constraints:
No text, no letters, no numbers, no logos, no trademarks, no watermark, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no busy background.`;
}

export function buildCardSpecSystemPrompt() {
  return [
    "You generate structured HackaDeck Builder Familiar cards.",
    "Keep everything flattering, funny, harmless, and concise.",
    "Use ordinary animal familiars by default, with one clever hackathon twist.",
    "Do not reference protected classes, appearance judgments, medical claims, or copyrighted card-game styles.",
    "Stats are playful card attributes only, from 40 to 99, and should feel balanced.",
  ].join(" ");
}

export function buildCardSpecUserPrompt(answers: FormAnswers) {
  return `Create a HackaDeck card spec for this participant.

Email identity: ${answers.email}
Display name: ${answers.displayName}
Team: ${answers.teamName || "None"}
Role today: ${answers.roleToday}
Powers: ${answers.powers.join(", ")}
Harmless weakness: ${answers.weakness}
Familiar preference: ${answers.familiarType}
Detail: ${answers.detail || "None"}
Edition: AI Engineers Singapore 2026`;
}
