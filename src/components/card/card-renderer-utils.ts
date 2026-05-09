import type { HackaDeckCardSpec } from "@/lib/card-schema";

export const CARD_RENDER_SIZE = {
  width: 1024,
  height: 1536,
} as const;

export type CardStatName = keyof HackaDeckCardSpec["stats"];

export const STAT_ORDER: CardStatName[] = ["Build", "Debug", "Taste", "Chaos"];

export const STAT_LABELS: Record<CardStatName, string> = {
  Build: "Build",
  Debug: "Debug",
  Taste: "Taste",
  Chaos: "Chaos",
};

export function clampText(value: string | null | undefined, maxLength: number) {
  const normalized = (value ?? "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function readableHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#C97B45";
}

export function textLengthClass(
  value: string,
  thresholds: { medium: number; long: number },
) {
  if (value.length >= thresholds.long) {
    return "is-long";
  }
  if (value.length >= thresholds.medium) {
    return "is-medium";
  }
  return "is-normal";
}

export function highestStatName(stats: HackaDeckCardSpec["stats"]) {
  return STAT_ORDER.reduce((winner, stat) =>
    stats[stat] > stats[winner] ? stat : winner,
  );
}

export function editionStamp(spec: HackaDeckCardSpec) {
  const rarity = clampText(spec.rarity, 12).toUpperCase();
  const finish = clampText(spec.print_finish, 14).toUpperCase();
  return `${rarity} / ${finish}`;
}
