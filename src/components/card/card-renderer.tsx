"use client";

import { Download } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { HackaDeckCardSpec } from "@/lib/card-schema";
import { CARD_RENDER_SIZE } from "./card-renderer-utils";
import { HackaDeckCard } from "./hackadeck-card";

const CARD_PADDING = 24;
const PREVIEW_CARD_WIDTH = 380;
const PREVIEW_CARD_HEIGHT = Math.round(
  PREVIEW_CARD_WIDTH * (CARD_RENDER_SIZE.height / CARD_RENDER_SIZE.width),
);
const PREVIEW_SCALE = PREVIEW_CARD_WIDTH / CARD_RENDER_SIZE.width;
const PREVIEW_CONTAINER_WIDTH = PREVIEW_CARD_WIDTH + CARD_PADDING * 2;
const PREVIEW_CONTAINER_HEIGHT = PREVIEW_CARD_HEIGHT + CARD_PADDING * 2;

const EXPORT_PADDING = Math.round(CARD_PADDING / PREVIEW_SCALE);
const EXPORT_WIDTH = CARD_RENDER_SIZE.width + EXPORT_PADDING * 2;
const EXPORT_HEIGHT = CARD_RENDER_SIZE.height + EXPORT_PADDING * 2;

type CardRendererProps = {
  spec: HackaDeckCardSpec;
  imageUrl: string;
  cardNumber: number;
  eventName: string;
  participantDisplayName: string;
  selectedLookLabel?: string;
};

export function CardRenderer({
  spec,
  imageUrl,
  cardNumber,
  eventName,
  participantDisplayName,
  selectedLookLabel,
}: CardRendererProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function downloadPng() {
    const node = cardRef.current;
    if (!node || isExporting) return;

    setIsExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
        canvasWidth: EXPORT_WIDTH,
        canvasHeight: EXPORT_HEIGHT,
        style: { opacity: "1" },
      });
      const link = document.createElement("a");
      link.download = `hackadeck-card-${cardNumber}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Visible preview: scaled down */}
      <div
        className="flex items-center justify-center overflow-hidden rounded-2xl bg-[#e8e2d8]"
        style={{
          width: PREVIEW_CONTAINER_WIDTH,
          height: PREVIEW_CONTAINER_HEIGHT,
          padding: CARD_PADDING,
        }}
        aria-label="Rendered HackaDeck card"
      >
        <div
          style={{
            width: PREVIEW_CARD_WIDTH,
            height: PREVIEW_CARD_HEIGHT,
          }}
        >
          <HackaDeckCard
            spec={spec}
            imageUrl={imageUrl}
            cardNumber={cardNumber}
            eventName={eventName}
            participantDisplayName={participantDisplayName}
            selectedLookLabel={selectedLookLabel}
            previewScale={PREVIEW_SCALE}
          />
        </div>
      </div>

      {/* Hidden full-size card for export */}
      <div
        ref={cardRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: EXPORT_WIDTH,
          height: EXPORT_HEIGHT,
          backgroundColor: "#e8e2d8",
          borderRadius: Math.round(24 / PREVIEW_SCALE),
          pointerEvents: "none",
          opacity: 0,
          zIndex: -9999,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: EXPORT_PADDING,
            left: EXPORT_PADDING,
          }}
        >
          <HackaDeckCard
            spec={spec}
            imageUrl={imageUrl}
            cardNumber={cardNumber}
            eventName={eventName}
            participantDisplayName={participantDisplayName}
            isExporting
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={downloadPng}
        disabled={isExporting}
        className="min-h-11"
      >
        <Download aria-hidden="true" className="size-4" />
        {isExporting ? "Preparing PNG..." : "Download PNG"}
      </Button>
    </div>
  );
}
