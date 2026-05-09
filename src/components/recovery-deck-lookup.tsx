"use client";

import type { FormEvent } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useConvex, useQuery } from "convex/react";
import { useMemo, useState } from "react";

import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RecoveryDeckLookup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convex = useConvex();
  const activeEvents = useQuery(api.events.listActive);
  const urlEventSlug = searchParams.get("event");
  const urlRecoveryEmail = searchParams.get("recoveryEmail") ?? "";
  const [selectedEventSlug, setSelectedEventSlug] = useState<string | null>(
    null,
  );
  const [email, setEmail] = useState(urlRecoveryEmail);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const eventSlug = useMemo(() => {
    if (selectedEventSlug) return selectedEventSlug;
    if (urlEventSlug) return urlEventSlug;
    return activeEvents?.[0]?.slug ?? "";
  }, [activeEvents, selectedEventSlug, urlEventSlug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const recoveryEmail = email.trim();
    if (!eventSlug) {
      setError("Choose an event first.");
      return;
    }
    if (!recoveryEmail) {
      setError("Enter the recovery email you used for your card.");
      return;
    }

    setIsSearching(true);
    try {
      const result = await convex.query(api.deck.findParticipantDeck, {
        eventSlug,
        recoveryEmail,
      });

      if (!result) {
        setError("No deck found for that event and email.");
        setIsSearching(false);
        return;
      }

      router.push(result.deckPath as Route);
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "Could not look up that deck.",
      );
      setIsSearching(false);
    }
  }

  return (
    <section className="mb-6 rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-4 shadow-[0_18px_60px_rgba(35,32,27,0.1)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#51493d]">
            Already created a card?
          </p>
          <p className="mt-1 text-sm leading-5 text-[#6f6658]">
            Find your deck with the recovery email you used.
          </p>
        </div>

        <form className="grid gap-3 sm:min-w-[420px]" onSubmit={handleSubmit}>
          {activeEvents && activeEvents.length > 1 ? (
            <select
              aria-label="Event"
              className="rounded-md border border-[#c9bca8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
              value={eventSlug}
              onChange={(event) => setSelectedEventSlug(event.target.value)}
            >
              {activeEvents.map((event) => (
                <option key={event._id} value={event.slug}>
                  {event.name}
                </option>
              ))}
            </select>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              aria-label="Recovery email"
              className="border-[#c9bca8] bg-white focus-visible:ring-[#8d5f3a]/25"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
            <Button
              className="bg-[#23201b] text-[#fffaf0] hover:bg-[#3a3329]"
              disabled={isSearching || activeEvents === undefined}
              type="submit"
            >
              <Search aria-hidden="true" className="size-4" />
              {isSearching ? "Finding..." : "Find deck"}
            </Button>
          </div>

          {error ? <p className="text-sm text-[#9a3412]">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
