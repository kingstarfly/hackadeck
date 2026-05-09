"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, QrCode, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";

import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HackaDeckCard } from "@/components/card/hackadeck-card";
import type { HackaDeckCardSpec } from "@/lib/card-schema";

const GALLERY_LIMIT = 72;

function buildersLabel(count: number) {
  return `${count} ${count === 1 ? "builder" : "builders"} hatched`;
}

const CARD_WIDTH = 1024;
const CARD_HEIGHT = 1536;

function ScaledGalleryCard({
  children,
  createdAt,
}: {
  children: React.ReactNode;
  createdAt: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      setScale(el.offsetWidth / CARD_WIDTH);
    };
    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <article
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}` }}
      >
        {scale > 0 ? (
          <div
            className="origin-top-left"
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              transform: `scale(${scale})`,
            }}
          >
            {children}
          </div>
        ) : null}
      </article>
      <p className="text-foreground/70 mt-2 text-right text-xs">
        {formatDistanceToNow(createdAt, { addSuffix: true })}
      </p>
    </div>
  );
}

export function EventGalleryWall({ slug }: { slug: string }) {
  const gallery = useQuery(api.gallery.getEventGallery, {
    eventSlug: slug,
    limit: GALLERY_LIMIT,
  });
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const hatchUrl = useMemo(() => {
    const path = `/?event=${encodeURIComponent(slug)}`;
    return origin ? `${origin}${path}` : path;
  }, [origin, slug]);

  const qrUrl = useMemo(() => {
    return `https://quickchart.io/qr?size=176&margin=1&text=${encodeURIComponent(hatchUrl)}`;
  }, [hatchUrl]);

  if (gallery === undefined) {
    return <GalleryLoading />;
  }

  if (gallery === null) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-10 sm:px-8">
        <p className="text-foreground/50 text-sm font-semibold tracking-[0.18em] uppercase">
          Event page
        </p>
        <h1 className="text-foreground mt-3 text-4xl font-light tracking-tight text-balance sm:text-6xl">
          This event is still tucked away.
        </h1>
        <p className="text-foreground/70 mt-5 max-w-[60ch] text-base leading-relaxed">
          The hatch link is ready once the event has been seeded in Convex.
        </p>
        <Button asChild className="mt-8 w-fit">
          <Link href="/">
            <Sparkles aria-hidden="true" className="size-4" />
            Hatch a card
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <header className="border-border bg-background border-b px-5 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <div>
            <p className="text-foreground/50 text-sm font-semibold tracking-[0.18em] uppercase">
              Live event page
            </p>
            <h1 className="text-foreground mt-3 max-w-5xl text-5xl font-light tracking-tight text-balance sm:text-7xl">
              {gallery.event.name}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {buildersLabel(gallery.cardCount)}
              </Badge>
              <Button asChild>
                <a href={hatchUrl}>
                  <Sparkles aria-hidden="true" className="size-4" />
                  Hatch a card
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={hatchUrl}>
                  <ExternalLink aria-hidden="true" className="size-4" />
                  Open hatch link
                </a>
              </Button>
            </div>
          </div>
          <div className="border-border bg-card w-fit border p-3">
            {origin ? (
              <Image
                src={qrUrl}
                alt={`QR code for ${gallery.event.name} hatch link`}
                width={176}
                height={176}
                unoptimized
              />
            ) : (
              <div className="bg-secondary grid size-44 place-items-center">
                <QrCode
                  aria-hidden="true"
                  className="text-foreground/45 size-12"
                />
              </div>
            )}
            <p className="text-foreground/55 mt-3 max-w-44 text-xs leading-5 break-all">
              {hatchUrl}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {gallery.cards.length === 0 ? (
          <div className="border-border bg-card/50 grid min-h-[42vh] place-items-center border border-dashed p-8 text-center">
            <div>
              <p className="text-foreground text-3xl font-light tracking-tight">
                No familiars hatched yet.
              </p>
              <p className="text-foreground/65 mt-3 max-w-[56ch] text-base leading-relaxed">
                The wall is listening. Participants can still hatch from the
                link above while the first card warms up.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {gallery.cards.map((card) => (
              <ScaledGalleryCard key={card._id} createdAt={card.createdAt}>
                <HackaDeckCard
                  spec={card.spec as HackaDeckCardSpec}
                  imageUrl={card.avatarImageUrl}
                  cardNumber={card.cardNumber}
                  eventName={gallery.event.name}
                  participantDisplayName={card.displayName}
                />
              </ScaledGalleryCard>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function GalleryLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <Skeleton className="h-4 w-44" />
          <Skeleton className="mt-5 h-16 w-full max-w-3xl" />
          <div className="mt-6 flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <Skeleton className="size-52" />
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/6]" />
        ))}
      </div>
    </main>
  );
}
