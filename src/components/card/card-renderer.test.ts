import { describe, expect, it } from "vitest";

import type { HackaDeckCardSpec } from "@/lib/card-schema";
import {
  CARD_RENDER_SIZE,
  clampText,
  editionStamp,
  highestStatName,
  readableHexColor,
  textLengthClass,
} from "./card-renderer-utils";

const normalSpec = {
  display_name: "Maya Tan",
  team_name: "Cache Money",
  edition: "AI Engineers Singapore 2026",
  card_number: 12,
  hatched_at_label: "5:04 PM",
  earned_title: "Keeper of Useful Chaos",
  archetype_base: "Debugger",
  card_intent: "My actual role today",
  familiar_species: "Owl",
  familiar_descriptor: "a calm debug owl with tiny round glasses",
  personal_relic: {
    name: "Rubber Duck Lantern",
    visual: "a tiny lantern shaped like a rubber duck",
    meaning: "Keeps the room calm when errors get loud",
  },
  rarity: "Rare",
  print_finish: "Stamped",
  stats: {
    Build: 84,
    Debug: 96,
    Taste: 72,
    Chaos: 61,
  },
  stat_icons: {
    Build: "hammer",
    Debug: "bug",
    Taste: "star",
    Chaos: "bolt",
  },
  signature_move: {
    name: "Trace the Tiny Spark",
    description: "Finds the one missing assumption before the demo notices.",
  },
  field_note: "Usually appears beside three calm tabs and one alarming log.",
  accent_color: "#C97B45",
  art_prompt: "A soft 2D owl familiar.",
  negative_prompt_notes: [],
} satisfies HackaDeckCardSpec;

describe("card renderer helpers", () => {
  it("keeps the collectible card output at 1024x1536", () => {
    expect(CARD_RENDER_SIZE).toEqual({ width: 1024, height: 1536 });
  });

  it("prepares normal card copy and stat metadata deterministically", () => {
    expect(highestStatName(normalSpec.stats)).toBe("Debug");
    expect(editionStamp(normalSpec)).toBe("RARE / STAMPED");
    expect(readableHexColor(normalSpec.accent_color)).toBe("#C97B45");
  });

  it("handles long valid card text with clamping and sizing classes", () => {
    const longName =
      "Alexandria Cassandra Montgomery-Smith The Third, Debug Herald";
    const longTitle =
      "Principal Cartographer of Reasonable Shipping Chaos and Snack Signals";

    expect(clampText(longName, 28)).toBe("Alexandria Cassandra Montgo…");
    expect(clampText(longTitle, 44)).toHaveLength(44);
    expect(clampText(longTitle, 44)).toMatch(/…$/);
    expect(textLengthClass(longTitle, { medium: 28, long: 38 })).toBe(
      "is-long",
    );
    expect(readableHexColor("warm peach")).toBe("#C97B45");
  });
});
