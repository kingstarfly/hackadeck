"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Check, Image, LoaderCircle, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import type { Route } from "next";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { CardRenderer } from "@/components/card/card-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SPEC_STEPS = [
  "Reading your build aura…",
  "Matching your familiar…",
  "Forging your tiny relic…",
  "Writing your field note…",
];

const STATUS_COPY = {
  queued: "Reading your build aura…",
  spec_generating: "Matching your familiar…",
  art_generating: "Hatching card art…",
  rendering: "Printing your card…",
  done: "Your animal companion is ready.",
  error: "The familiar matcher got tangled.",
} as const;

function statusProgress(status: keyof typeof STATUS_COPY) {
  switch (status) {
    case "queued":
      return 12;
    case "spec_generating":
      return 44;
    case "art_generating":
      return 68;
    case "rendering":
      return 86;
    case "done":
      return 100;
    case "error":
      return 100;
  }
}

function formatRunLabel(card: {
  spec: { earned_title: string; familiar_species: string };
  createdAt: number;
}) {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(card.createdAt));

  return `${card.spec.earned_title} · ${card.spec.familiar_species} · ${time}`;
}

export function ParticipantDeckStatus(props: {
  eventSlug: string;
  participantId: string;
}) {
  const participantId = props.participantId as Id<"participants">;
  const deck = useQuery(api.deck.getParticipantDeck, {
    eventSlug: props.eventSlug,
    participantId,
  });
  const selectCard = useMutation(api.deck.selectCard);
  const selectLook = useMutation(api.deck.selectLook);

  const activeRun = deck?.runs.find((run) =>
    ["queued", "spec_generating", "art_generating", "rendering"].includes(
      run.status,
    ),
  );
  const selectedCard =
    deck?.cards.find((card) => card._id === deck.participant.selectedCardId) ??
    deck?.cards[0] ??
    null;
  const selectedLook =
    selectedCard?.looks.find(
      (look) => look._id === selectedCard.selectedLookId,
    ) ??
    selectedCard?.looks[0] ??
    null;
  const activeStep = useMemo(() => {
    if (!activeRun) {
      return SPEC_STEPS[0];
    }
    const index = Math.floor(activeRun.updatedAt / 3500) % SPEC_STEPS.length;
    return SPEC_STEPS[index];
  }, [activeRun]);

  if (deck === undefined) {
    return (
      <div className="border-border bg-card mt-8 space-y-4 border p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="border-border bg-card mt-8 border p-5">
        <p className="text-foreground font-semibold">Deck not found</p>
        <p className="text-foreground/70 mt-2 text-sm">
          This event or participant link does not match a card run yet.
        </p>
      </div>
    );
  }

  const activeCopy = activeRun
    ? activeRun.status === "spec_generating"
      ? activeStep
      : STATUS_COPY[activeRun.status]
    : null;
  const startAnotherHref =
    `/?event=${deck.event.slug}&recoveryEmail=${encodeURIComponent(
      deck.participant.recoveryEmail,
    )}` as Route;

  return (
    <section className="mt-8 space-y-8">
      {activeRun ? (
        <div className="border-border bg-card border p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-foreground/70 text-sm font-semibold">
                Card run #{activeRun.cardNumber}
              </p>
              <h2 className="text-foreground mt-1 text-2xl font-light tracking-tight">
                {activeCopy}
              </h2>
            </div>
            <Badge variant="secondary">
              <LoaderCircle
                aria-hidden="true"
                className="size-3 animate-spin"
              />
              In progress
            </Badge>
          </div>
          <Progress
            value={statusProgress(activeRun.status)}
            className="bg-border mt-5 h-2"
          />
        </div>
      ) : null}

      {selectedCard ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div>
            <CardRenderer
              spec={selectedCard.spec}
              imageUrl={
                selectedLook?.avatarImageUrl ?? selectedCard.avatarImageUrl
              }
              cardNumber={selectedCard.cardNumber}
              eventName={deck.event.name}
              participantDisplayName={deck.participant.displayName}
              selectedLookLabel={`Look ${selectedLook?.lookNumber ?? 1}`}
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-foreground/50 text-sm font-semibold tracking-wide uppercase">
                Selected card
              </p>
              <h2 className="text-foreground mt-2 text-3xl font-light tracking-tight">
                {selectedCard.spec.earned_title}
              </h2>
              <p className="text-foreground/70 mt-3 max-w-[60ch] text-base leading-relaxed">
                {selectedCard.spec.field_note}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                disabled={deck.participant.selectedCardId === selectedCard._id}
                onClick={() =>
                  void selectCard({
                    eventSlug: deck.event.slug,
                    participantId,
                    cardId: selectedCard._id as Id<"cards">,
                  })
                }
              >
                <Check aria-hidden="true" className="size-4" />
                Use this card
              </Button>
              <Button asChild variant="outline">
                <Link href={startAnotherHref}>Start another card</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/events/${deck.event.slug}` as Route}>
                  View gallery
                </Link>
              </Button>
            </div>

            <div>
              <h3 className="text-foreground text-lg font-medium">Looks</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {selectedCard.looks.map((look) => {
                  const isSelected = look._id === selectedCard.selectedLookId;

                  return (
                    <button
                      key={look._id}
                      type="button"
                      className={cn(
                        "group bg-card focus-visible:ring-ring/30 border p-2 text-left transition focus-visible:ring-2 focus-visible:outline-none",
                        isSelected
                          ? "border-foreground"
                          : "border-border hover:border-foreground/40",
                      )}
                      onClick={() =>
                        void selectLook({
                          eventSlug: deck.event.slug,
                          participantId,
                          cardId: selectedCard._id as Id<"cards">,
                          lookId: look._id as Id<"looks">,
                        })
                      }
                    >
                      <span className="bg-background block aspect-square overflow-hidden">
                        <img
                          src={look.avatarImageUrl}
                          alt={`Look ${look.lookNumber}`}
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span className="text-foreground mt-2 flex items-center justify-between gap-2 text-sm font-medium">
                        Look {look.lookNumber}
                        {isSelected ? (
                          <Check aria-hidden="true" className="size-4" />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
                {selectedCard.looks.length === 0 ? (
                  <div className="border-border text-foreground/60 border border-dashed p-4 text-sm">
                    <Image aria-hidden="true" className="mb-2 size-4" />
                    First look is still being saved.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-border bg-card border p-5">
          <Sparkles aria-hidden="true" className="text-foreground/50 size-5" />
          <h2 className="text-foreground mt-3 text-2xl font-light">
            Your first card is hatching
          </h2>
          <p className="text-foreground/70 mt-2 text-sm leading-6">
            Keep this page open while generation runs. Your card will appear
            here as soon as the first look lands.
          </p>
        </div>
      )}

      <div className="border-border bg-card border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-foreground text-lg font-medium">
            Previous cards
          </h3>
          <Badge variant="outline">{deck.cards.length} saved</Badge>
        </div>

        <div className="mt-4 grid gap-2">
          {deck.cards.map((card) => {
            const isCurrent = selectedCard?._id === card._id;

            return (
              <button
                key={card._id}
                type="button"
                className={cn(
                  "focus-visible:ring-ring/30 flex items-center justify-between gap-4 border px-3 py-3 text-left transition focus-visible:ring-2 focus-visible:outline-none",
                  isCurrent
                    ? "border-foreground bg-background"
                    : "border-border hover:border-foreground/40",
                )}
                onClick={() =>
                  void selectCard({
                    eventSlug: deck.event.slug,
                    participantId,
                    cardId: card._id as Id<"cards">,
                  })
                }
              >
                <span className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-medium">
                    {formatRunLabel(card)}
                  </span>
                  <span className="text-foreground/50 mt-1 block text-xs">
                    Card #{card.cardNumber}
                  </span>
                </span>
                {isCurrent ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : null}
              </button>
            );
          })}
          {deck.cards.length === 0 ? (
            <p className="text-foreground/60 text-sm">
              Completed cards will collect here, newest first.
            </p>
          ) : null}
        </div>

        {deck.runs.some((run) => run.status === "error") ? (
          <div className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {deck.runs.find((run) => run.status === "error")?.errorMessage ??
              "A card run failed. Start another card when you are ready."}
          </div>
        ) : null}
      </div>
    </section>
  );
}
