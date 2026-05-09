export const HACKADECK_EDITION = "AI Engineers Singapore 2026";

export const CARD_SIZE = {
  width: 1024,
  height: 1536,
} as const;

export const GENERATION_STATUS_COPY = {
  queued: "Finding your familiar",
  spec_generating: "Writing your card lore",
  art_generating: "Hatching the familiar art",
  rendering: "Printing the card",
  done: "Card ready",
  error: "The hatch stalled",
} as const;
