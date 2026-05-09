"use client";

import { forwardRef, type CSSProperties } from "react";

import type { HackaDeckCardSpec } from "@/lib/card-schema";
import {
  STAT_LABELS,
  STAT_ORDER,
  clampText,
  highestStatName,
  readableHexColor,
  type CardStatName,
} from "./card-renderer-utils";

const STAT_ICONS: Record<CardStatName, string> = {
  Build: "/stat-icons/build.png",
  Debug: "/stat-icons/debug.png",
  Taste: "/stat-icons/taste.png",
  Chaos: "/stat-icons/chaos.png",
};

function StatBox(props: {
  stat: CardStatName;
  value: number;
  isHighlighted: boolean;
  accentColor: string;
}) {
  return (
    <div
      className="relative flex min-w-[190px] flex-col items-center overflow-hidden rounded-[18px] border-[4px] bg-[#fffaf1] px-3 pt-3 pb-2 shadow-[0_8px_0_rgb(45_42_38_/_0.08)]"
      style={{
        borderColor: props.isHighlighted ? props.accentColor : "#d4cfc6",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[10px]"
        style={{
          backgroundColor: props.isHighlighted ? props.accentColor : "#d4cfc6",
        }}
      />
      <div className="flex w-full items-center justify-center gap-3">
        <img
          src={STAT_ICONS[props.stat]}
          alt=""
          className="size-12 object-contain"
          draggable={false}
        />
        <span
          className="text-[54px] leading-none font-[900] tabular-nums"
          style={{
            color: props.isHighlighted ? props.accentColor : "#2d2a26",
          }}
        >
          {props.value}
        </span>
      </div>
      <span className="mt-1 text-[22px] leading-none font-[900] tracking-[0.1em] text-[#2d2a26]/60 uppercase">
        {STAT_LABELS[props.stat]}
      </span>
    </div>
  );
}

function TextSizer({
  text,
  mediumAt,
  longAt,
  base,
  medium,
  long,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  mediumAt: number;
  longAt: number;
  base: string;
  medium: string;
  long: string;
  className?: string;
  as?: "span" | "h3" | "h4" | "p";
}) {
  const len = text.length;
  const sizeClass = len > longAt ? long : len > mediumAt ? medium : base;
  return <Tag className={`${sizeClass} ${className}`}>{text}</Tag>;
}

export type HackaDeckCardProps = {
  spec: HackaDeckCardSpec;
  imageUrl: string;
  cardNumber: number;
  eventName: string;
  participantDisplayName: string;
  selectedLookLabel?: string;
  isExporting?: boolean;
  previewScale?: number;
};

export const HackaDeckCard = forwardRef<HTMLDivElement, HackaDeckCardProps>(
  function HackaDeckCard(
    {
      spec,
      imageUrl,
      cardNumber,
      eventName,
      participantDisplayName,
      selectedLookLabel,
      isExporting = false,
      previewScale,
    },
    ref,
  ) {
    const accentColor = readableHexColor(spec.accent_color);
    const highestStat = highestStatName(spec.stats);
    const displayName = clampText(
      spec.display_name || participantDisplayName,
      20,
    );
    const title = clampText(spec.earned_title, 28);
    const teamName = clampText(spec.team_name, 20);
    const moveName = clampText(spec.signature_move.name, 22);
    const moveDescription = clampText(spec.signature_move.description, 88);
    const fieldNote = clampText(spec.field_note, 76);

    const cardStyle: CSSProperties = {
      "--hd-accent": accentColor,
      transform:
        isExporting || !previewScale ? "none" : `scale(${previewScale})`,
      transformOrigin: "top left",
    } as CSSProperties;

    return (
      <div
        ref={ref}
        className="relative flex h-[1536px] w-[1024px] flex-col overflow-hidden rounded-[40px] border-[12px] font-sans text-[#2d2a26]"
        style={{
          ...cardStyle,
          borderColor: "#c9b99a",
          background: `
            radial-gradient(circle at 20% 15%, rgb(255 255 255 / 0.6), transparent 30%),
            linear-gradient(180deg, #f5f0e6 0%, #ebe4d6 100%)
          `,
        }}
        data-exporting={isExporting ? "true" : undefined}
      >
        {/* Inner border accent */}
        <div
          className="pointer-events-none absolute inset-[8px] rounded-[28px] border-[4px]"
          style={{ borderColor: accentColor }}
        />

        {/* Header */}
        <header className="flex items-start justify-between px-[56px] pt-[48px] pb-[24px]">
          <div className="min-w-0 flex-1">
            <TextSizer
              as="h3"
              text={displayName.toUpperCase()}
              mediumAt={12}
              longAt={16}
              base="text-[72px]"
              medium="text-[60px]"
              long="text-[50px]"
              className="leading-[0.95] font-[900] tracking-tight"
            />
            <p
              className="mt-2 text-[32px] font-bold tracking-wide uppercase"
              style={{ color: accentColor }}
            >
              {title}
            </p>
          </div>

          {/* Rarity badge */}
          <span className="shrink-0 text-[28px] font-[900] tracking-[0.08em] text-[#2d2a26]/50 uppercase">
            {spec.rarity || "Common"}
          </span>
        </header>

        {/* Art section */}
        <section className="relative mx-[48px] min-h-0 flex-1 overflow-hidden rounded-[24px] border-[6px] border-[#c9b99a]">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 60%, rgb(255 255 255 / 0.7), transparent 50%),
                color-mix(in srgb, ${accentColor}, #f5f0e6 85%)
              `,
            }}
          />
          <img
            src={imageUrl}
            alt={`${spec.familiar_species} familiar art for ${displayName}`}
            crossOrigin="anonymous"
            draggable={false}
            className="relative h-full w-full object-contain"
          />
          {selectedLookLabel && !isExporting ? (
            <span className="absolute right-[20px] bottom-[20px] rounded-lg bg-[#faf7f2]/90 px-4 py-2 text-[18px] font-bold tracking-[0.08em] text-[#2d2a26]/60 uppercase">
              {selectedLookLabel}
            </span>
          ) : null}
        </section>

        {/* Stats bar */}
        <section className="grid grid-cols-4 gap-4 px-[48px] py-[28px]">
          {STAT_ORDER.map((stat) => (
            <StatBox
              key={stat}
              stat={stat}
              value={spec.stats[stat]}
              isHighlighted={stat === highestStat}
              accentColor={accentColor}
            />
          ))}
        </section>

        {/* Ability section */}
        <section className="mx-[48px] mb-[24px] overflow-hidden rounded-[18px] border-[4px] border-[#d4cfc6] bg-[#fffaf1] shadow-[0_10px_0_rgb(45_42_38_/_0.08)]">
          {/* Move name banner */}
          <div
            className="flex min-h-[82px] items-center justify-center px-10 text-center"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor}, #ffffff 24%))`,
            }}
          >
            <TextSizer
              text={moveName}
              mediumAt={14}
              longAt={18}
              base="text-[40px]"
              medium="text-[34px]"
              long="text-[30px]"
              className="leading-none font-[900] tracking-wide text-white uppercase"
            />
          </div>

          <div className="px-[34px] pt-[20px] pb-[24px]">
            {/* Description */}
            <p className="text-center text-[32px] leading-[1.18] font-[800] text-[#2d2a26]/85">
              {moveDescription}
            </p>

            {/* Field note */}
            <p className="mx-auto mt-3 max-w-[760px] border-t-[3px] border-[#d4cfc6] pt-3 text-center text-[27px] leading-[1.22] font-[750] text-[#2d2a26]/60 italic">
              {fieldNote}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-center gap-4 px-[48px] pb-[36px] text-[22px] font-bold tracking-[0.04em] text-[#2d2a26]/50">
          <span>{teamName || "Solo Build"}</span>
          <span className="text-[#2d2a26]/30">•</span>
          <span>#{String(cardNumber).padStart(3, "0")}</span>
          <span className="text-[#2d2a26]/30">•</span>
          <span className="uppercase">{eventName}</span>
        </footer>
      </div>
    );
  },
);
