"use client";

import {
  Bug,
  ChevronsUp,
  Download,
  Eye,
  Hammer,
  Leaf,
  Lightbulb,
  Magnet,
  Sparkles,
  Star,
  Telescope,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import type { HackaDeckCardSpec } from "@/lib/card-schema";
import {
  CARD_RENDER_SIZE,
  STAT_LABELS,
  STAT_ORDER,
  clampText,
  editionStamp,
  highestStatName,
  readableHexColor,
  textLengthClass,
  type CardStatName,
} from "./card-renderer-utils";

type CardRendererProps = {
  spec: HackaDeckCardSpec;
  imageUrl: string;
  cardNumber: number;
  eventName: string;
  participantDisplayName: string;
  selectedLookLabel?: string;
};

const statIcons: Record<string, LucideIcon> = {
  hammer: Hammer,
  spark: Sparkles,
  stack: ChevronsUp,
  bug: Bug,
  magnifier: Telescope,
  lantern: Lightbulb,
  star: Star,
  leaf: Leaf,
  eye: Eye,
  bolt: Zap,
  swirl: Magnet,
  comet: Sparkles,
};

function StatIcon(props: {
  stat: CardStatName;
  iconName: string;
  value: number;
  isHighlighted: boolean;
}) {
  const Icon = statIcons[props.iconName] ?? Star;
  const label = `${STAT_LABELS[props.stat]} stat: ${props.value}`;

  return (
    <div
      className="hd-card__stat"
      data-highlighted={props.isHighlighted ? "true" : undefined}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" strokeWidth={2.4} />
      <span>{props.value}</span>
    </div>
  );
}

export function CardRenderer({
  spec,
  imageUrl,
  cardNumber,
  eventName,
  participantDisplayName,
  selectedLookLabel,
}: CardRendererProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const accentColor = readableHexColor(spec.accent_color);
  const highestStat = highestStatName(spec.stats);
  const displayName = clampText(
    spec.display_name || participantDisplayName,
    28,
  );
  const title = clampText(spec.earned_title, 44);
  const teamName = clampText(spec.team_name, 34);
  const relicName = clampText(spec.personal_relic.name, 34);
  const moveName = clampText(spec.signature_move.name, 32);
  const moveDescription = clampText(spec.signature_move.description, 100);
  const fieldNote = clampText(spec.field_note, 118);
  const hatchedAt = clampText(spec.hatched_at_label, 28);

  async function downloadPng() {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    setIsDownloading(true);
    node.dataset.exporting = "true";
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        width: CARD_RENDER_SIZE.width,
        height: CARD_RENDER_SIZE.height,
        canvasWidth: CARD_RENDER_SIZE.width,
        canvasHeight: CARD_RENDER_SIZE.height,
        backgroundColor: "#FAF7F2",
      });
      const link = document.createElement("a");
      link.download = `hackadeck-card-${cardNumber}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      delete node.dataset.exporting;
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="hd-card-shell" aria-label="Rendered HackaDeck card">
        <div
          ref={cardRef}
          className="hd-card"
          style={{ "--hd-card-accent": accentColor } as CSSProperties}
        >
          <header className="hd-card__header">
            <div className="min-w-0">
              <p className="hd-card__eyebrow">{spec.edition}</p>
              <h3
                className={`hd-card__name ${textLengthClass(displayName, {
                  medium: 18,
                  long: 24,
                })}`}
              >
                {displayName}
              </h3>
              <p
                className={`hd-card__title ${textLengthClass(title, {
                  medium: 28,
                  long: 38,
                })}`}
              >
                {title}
              </p>
            </div>
            <div className="hd-card__stamp" aria-label={editionStamp(spec)}>
              <span>{spec.rarity}</span>
              <strong>{spec.print_finish}</strong>
            </div>
          </header>

          <section className="hd-card__art" aria-label="Familiar art">
            <img
              src={imageUrl}
              alt={`${spec.familiar_species} familiar art for ${displayName}`}
              crossOrigin="anonymous"
              draggable={false}
              className="hd-card__art-image"
            />
            {selectedLookLabel ? (
              <span className="hd-card__look">{selectedLookLabel}</span>
            ) : null}
          </section>

          <section
            className="hd-card__stats"
            aria-label="Card traits and stats"
          >
            <div className="hd-card__relic" title={spec.personal_relic.meaning}>
              <span>{relicName}</span>
            </div>
            <div className="hd-card__stat-grid">
              {STAT_ORDER.map((stat) => (
                <StatIcon
                  key={stat}
                  stat={stat}
                  iconName={spec.stat_icons[stat]}
                  value={spec.stats[stat]}
                  isHighlighted={stat === highestStat}
                />
              ))}
            </div>
          </section>

          <section className="hd-card__ability">
            <div>
              <p className="hd-card__ability-label">Signature move</p>
              <h4
                className={`hd-card__move ${textLengthClass(moveName, {
                  medium: 22,
                  long: 28,
                })}`}
              >
                {moveName}
              </h4>
              <p className="hd-card__description">{moveDescription}</p>
            </div>
            <p className="hd-card__field-note">{fieldNote}</p>
          </section>

          <footer className="hd-card__footer">
            <span>{teamName || "Solo build"}</span>
            <span>#{String(cardNumber).padStart(4, "0")}</span>
            <span>{hatchedAt || "Freshly hatched"}</span>
            <span>{eventName}</span>
          </footer>
        </div>
      </div>

      <Button
        type="button"
        onClick={downloadPng}
        disabled={isDownloading}
        className="min-h-11"
      >
        <Download aria-hidden="true" className="size-4" />
        {isDownloading ? "Preparing PNG..." : "Download PNG"}
      </Button>
    </div>
  );
}
