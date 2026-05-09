import type { FormAnswers } from "@/lib/card-schema";

export function buildFamiliarArtPrompt(input: {
  animalSpecies: string;
  roleToday: string;
  buildEnergy: string;
  earnedTitle: string;
  personalRelicVisual: string;
  eli5: string;
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
- Build energy: ${input.buildEnergy}
- Earned title: ${input.earnedTitle}
- Personal relic: ${input.personalRelicVisual}
- What they built: ${input.eli5}

Visual direction:
Show the familiar as a small desk companion observed during a real hackathon. Include exactly one meaningful personal relic or developer-themed prop connected to what they built. The relic should feel specific to this person. One meaningful prop is better than many generic coding objects.

Composition:
Single centered character, full body visible, generous padding, three-quarter view, clean silhouette. Simple warm background shape or paper-toned backdrop. No card frame.

Constraints:
No text, no letters, no numbers, no logos, no trademarks, no watermark, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no busy background, no wizard robes, no fantasy armor, no magical staffs, no dramatic spell effects, no glowing eyes.`;
}

export function buildCardSpecSystemPrompt() {
  return [
    "You generate structured HackaDeck animal companion cards.",
    "Keep everything flattering, funny, harmless, and concise.",
    "Use ordinary animal familiars by default, with one clever hackathon twist.",
    "Do not reference protected classes, appearance judgments, medical claims, or copyrighted card-game styles.",
    "Stats are playful card attributes only, from 40 to 99, and should feel balanced.",
  ].join(" ");
}

export function buildCardSpecUserPrompt(answers: FormAnswers) {
  const teamLine = answers.teamName
    ? `Team name: ${answers.teamName}`
    : "Team name: None";
  const animalLine = answers.animalPreference
    ? `Animal preference: ${answers.animalPreference}`
    : "Animal preference: Surprise me";

  return `Create a HackaDeck card spec for this participant.

Event: ${answers.eventSlug}
Recovery email: ${answers.recoveryEmail}
Display name: ${answers.displayName}
${teamLine}
Role today: ${answers.roleToday}
Build energy: ${answers.buildEnergy}
What they built (ELI5): ${answers.eli5}
${animalLine}
Edition: AI Engineers Singapore 2026`;
}
