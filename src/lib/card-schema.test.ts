import { describe, expect, it } from "vitest";

import { formAnswerSchema, hackaDeckCardSpecSchema } from "@/lib/card-schema";
import { buildCardSpecUserPrompt, buildFamiliarArtPrompt } from "@/lib/prompts";

describe("HackaDeck schemas and prompts", () => {
  it("accepts the Maya sample form answers and builds safe prompt text", () => {
    const answers = formAnswerSchema.parse({
      email: "maya@example.com",
      displayName: "Maya",
      teamName: "Cache Money",
      roleToday: "Backend builder",
      powers: [
        "Fixing APIs",
        "Reading stack traces",
        "Shipping under pressure",
      ],
      weakness: "Too many tabs",
      familiarType: "Owl",
      detail: "I always blame headers first.",
      consentGallery: true,
    });

    expect(buildCardSpecUserPrompt(answers)).toContain(
      "Email identity: maya@example.com",
    );
  });

  it("validates the generated card spec contract", () => {
    expect(() =>
      hackaDeckCardSpecSchema.parse({
        display_name: "Maya",
        team_name: "Cache Money",
        edition: "AI Engineers Singapore 2026",
        archetype_title: "Keeper of Header Owl",
        familiar_species: "Owl",
        familiar_descriptor: "a calm debug owl with tiny glasses",
        rarity: "Rare",
        print_finish: "Stamped",
        stats: {
          Build: 82,
          Debug: 96,
          Taste: 74,
          Chaos: 68,
        },
        signature_move: {
          name: "Endpoint Exorcism",
          description: "Turns one haunted API response into clean JSON.",
        },
        flavor_text: "When the docs go quiet, Maya listens to the headers.",
        accent_color: "#7A5C3E",
        art_prompt: buildFamiliarArtPrompt({
          animalSpecies: "Owl",
          roleToday: "Backend builder",
          powers: [
            "Fixing APIs",
            "Reading stack traces",
            "Shipping under pressure",
          ],
          weakness: "Too many tabs",
          archetype: "Keeper of Header Owl",
          visualDetail: "tiny round glasses",
        }),
        negative_prompt_notes: ["no neon", "no card text"],
      }),
    ).not.toThrow();
  });
});
