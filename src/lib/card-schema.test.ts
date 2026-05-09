import { describe, expect, it } from "vitest";

import { formAnswerSchema, hackaDeckCardSpecSchema } from "@/lib/card-schema";
import { buildCardSpecUserPrompt, buildFamiliarArtPrompt } from "@/lib/prompts";

describe("HackaDeck schemas and prompts", () => {
  it("accepts the Maya sample form answers and builds safe prompt text", () => {
    const answers = formAnswerSchema.parse({
      eventSlug: "ai-engineer-hack-2026",
      recoveryEmail: "maya@example.com",
      displayName: "Maya",
      teamName: "Cache Money",
      roleToday: "Backend builder",
      buildEnergy: "Bug hunter",
      eli5: "We made a helper that reads your code and finds the bugs for you.",
      animalPreference: "Owl",
      consentGallery: true,
    });

    expect(buildCardSpecUserPrompt(answers)).toContain(
      "Recovery email: maya@example.com",
    );
  });

  it("validates the generated card spec contract", () => {
    expect(() =>
      hackaDeckCardSpecSchema.parse({
        display_name: "Maya",
        team_name: "Cache Money",
        edition: "AI Engineers Singapore 2026",
        earned_title: "Keeper of the Tiny Repro",
        archetype_base: "Bug Hunter",
        card_intent: "My actual role today",
        familiar_species: "Owl",
        familiar_descriptor: "a calm debug owl with tiny glasses",
        personal_relic: {
          name: "Rubber Duck Lantern",
          visual: "a tiny yellow rubber duck holding a warm desk lamp",
          meaning: "helps them debug without panic",
        },
        rarity: "Rare",
        print_finish: "Stamped",
        stats: {
          Build: 82,
          Debug: 96,
          Taste: 74,
          Chaos: 68,
        },
        stat_icons: {
          Build: "hammer",
          Debug: "lantern",
          Taste: "star",
          Chaos: "bolt",
        },
        signature_move: {
          name: "Endpoint Exorcism",
          description: "Turns one haunted API response into clean JSON.",
        },
        field_note: "When the docs go quiet, Maya listens to the headers.",
        accent_color: "#7A5C3E",
        art_prompt: buildFamiliarArtPrompt({
          animalSpecies: "Owl",
          roleToday: "Backend builder",
          buildEnergy: "Bug hunter",
          earnedTitle: "Keeper of the Tiny Repro",
          personalRelicVisual:
            "a tiny yellow rubber duck holding a warm desk lamp",
          eli5: "We made a helper that reads your code and finds the bugs for you.",
        }),
        negative_prompt_notes: ["no neon", "no card text"],
      }),
    ).not.toThrow();
  });
});
