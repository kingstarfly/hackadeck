"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import type { Route } from "next";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { CardRenderer } from "@/components/card/card-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const SPEC_STEPS = [
  "Reading your build aura...",
  "Matching your familiar...",
  "Forging your tiny relic...",
  "Writing your field note...",
];

const STATUS_COPY = {
  queued: "Reading your build aura...",
  spec_generating: "Matching your familiar...",
  art_generating: "Hatching card art...",
  rendering: "Printing your card...",
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

export function ParticipantDeckStatus(props: {
  eventSlug: string;
  participantId: string;
}) {
  const deck = useQuery(api.deck.getParticipantDeck, {
    eventSlug: props.eventSlug,
    participantId: props.participantId as Id<"participants">,
  });

  const newestRun = deck?.runs[0];
  const specStep = useMemo(() => {
    if (!newestRun) {
      return SPEC_STEPS[0];
    }
    const index = Math.floor(newestRun.updatedAt / 3500) % SPEC_STEPS.length;
    return SPEC_STEPS[index];
  }, [newestRun]);

  if (deck === undefined) {
    return (
      <div className="mt-8 space-y-4 rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!deck || !newestRun) {
    return (
      <div className="mt-8 rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-5">
        <p className="font-semibold text-[#23201b]">Deck not found</p>
        <p className="mt-2 text-sm text-[#655c4e]">
          This event or participant link does not match a card run yet.
        </p>
      </div>
    );
  }

  const activeCopy =
    newestRun.status === "spec_generating"
      ? specStep
      : STATUS_COPY[newestRun.status];

  return (
    <section className="mt-8 rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#8d5f3a]">
            {deck.participant.displayName}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#23201b]">
            {activeCopy}
          </h2>
        </div>
        <Badge variant="secondary">Card #{newestRun.cardNumber}</Badge>
      </div>

      <Progress
        value={statusProgress(newestRun.status)}
        className="mt-5 h-2 bg-[#eadfcd]"
      />

      {newestRun.status === "error" ? (
        <p className="mt-4 rounded-md bg-[#fff0e8] p-3 text-sm text-[#7b341e]">
          {newestRun.errorMessage ||
            "Please start another card run when you are ready."}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-6 text-[#655c4e]">
          {newestRun.status === "done"
            ? "Your first look is saved to this participant deck."
            : "Keep this page open while the run moves through the card forge."}
        </p>
      )}

      {deck.selectedCard ? (
        <div className="mt-6">
          <CardRenderer
            spec={deck.selectedCard.spec}
            imageUrl={
              deck.selectedCard.selectedLook?.avatarImageUrl ??
              deck.selectedCard.avatarImageUrl
            }
            cardNumber={deck.selectedCard.cardNumber}
            eventName={deck.event.name}
            participantDisplayName={deck.participant.displayName}
            selectedLookLabel={`Look ${
              deck.selectedCard.selectedLook?.lookNumber ?? 1
            }`}
          />
        </div>
      ) : null}

      {newestRun.spec ? (
        <div className="mt-5 rounded-md border border-[#e3d7c4] bg-[#faf7f2] p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#8d5f3a] uppercase">
            Matched familiar
          </p>
          <p className="mt-2 text-lg font-bold text-[#23201b]">
            {newestRun.spec.earned_title} · {newestRun.spec.familiar_species}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#655c4e]">
            {newestRun.spec.field_note}
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href={`/?event=${deck.event.slug}` as Route}>
            Start another card
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/events/${deck.event.slug}` as Route}>View gallery</Link>
        </Button>
      </div>
    </section>
  );
}
