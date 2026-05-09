"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Images, Mail, WandSparkles } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

import { api } from "../../convex/_generated/api";
import {
  animalCompanionOptions,
  buildEnergyOptions,
  roleOptions,
} from "@/lib/form-options";
import { formAnswerSchema } from "@/lib/card-schema";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hackadeck-form-draft";

const roleHints: Record<string, string> = {
  "Frontend builder": "Makes the thing feel real.",
  "Backend builder": "Keeps the hidden machinery humming.",
  "Full-stack chaos agent": "Jumps layers without blinking.",
  "Designer / UI polish": "Finds the part that feels off.",
  "Prompt wrangler": "Negotiates with the model until it behaves.",
  "Data / evals person": "Turns vibes into evidence.",
  "Demo / pitch lead": "Makes the story land.",
  "Product / scope keeper": "Protects the sharp version.",
  "Infra / deployment fixer": "Gets it alive in public.",
  "I am doing everything somehow": "Carries the whole tiny universe.",
};

const energyHints: Record<string, string> = {
  "Calm shipper": "Quietly gets it done.",
  "Deadline gremlin": "Turns pressure into motion.",
  "Pixel perfectionist": "Notices the two pixels.",
  "Bug hunter": "Follows the weird trail.",
  "Idea fountain": "Always has another angle.",
  "Team therapist": "Keeps the room breathing.",
  "Quiet optimizer": "Makes everything smoother.",
  "Demo magician": "Somehow makes it work on stage.",
  "Shortcut goblin": "Finds the tiny trapdoor.",
  "Last-minute philosopher": "Asks the real question at 4:48.",
};

const sectionHeaderClassName =
  "text-lg font-semibold text-[#23201b] sm:text-xl";

function TileRadioGroup({
  name,
  options,
  defaultValue,
  columns = "sm:grid-cols-2",
  hints = {},
}: {
  name: string;
  options: readonly string[];
  defaultValue?: string;
  columns?: string;
  hints?: Record<string, string>;
}) {
  const hasHints = Object.keys(hints).length > 0;

  return (
    <div className={cn("grid gap-3", columns)}>
      {options.map((option) => (
        <label
          key={option}
          className={cn(
            "group relative cursor-pointer rounded-md border border-[#d8ccb9] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#8d5f3a]/60 hover:shadow-[0_12px_28px_rgba(35,32,27,0.08)]",
            hasHints && "min-h-[96px]",
          )}
        >
          <input
            required
            className="peer sr-only"
            defaultChecked={defaultValue === option}
            name={name}
            type="radio"
            value={option}
          />
          <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border border-[#c9bca8] text-white transition peer-checked:border-[#8d5f3a] peer-checked:bg-[#8d5f3a]">
            <Check size={13} aria-hidden="true" />
          </span>
          <span className="block pr-8 text-sm font-semibold text-[#332d25]">
            {option}
          </span>
          {hints[option] ? (
            <span className="mt-2 block text-sm leading-5 text-[#6f6658]">
              {hints[option]}
            </span>
          ) : null}
          <span className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-[#8d5f3a]/25 transition peer-checked:bg-[#8d5f3a]/8 peer-checked:ring-2 peer-focus-visible:ring-2" />
        </label>
      ))}
    </div>
  );
}

interface FormDraft {
  recoveryEmail?: string;
  displayName?: string;
  teamName?: string;
  roleToday?: string;
  buildEnergy?: string;
  eli5?: string;
  animalPreference?: string;
  consentGallery?: boolean;
}

function loadDraft(): FormDraft {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as FormDraft) : {};
  } catch {
    return {};
  }
}

function saveDraft(draft: FormDraft): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota errors
  }
}

const sectionClassName =
  "mt-10 grid gap-6 border-t border-[#d8ccb9] pt-8 sm:mt-12 sm:pt-10";

function safeAccentColor(color: string) {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#8d5f3a";
}

function LatestCardPreview({ eventSlug }: { eventSlug: string }) {
  const gallery = useQuery(
    api.gallery.getEventGallery,
    eventSlug ? { eventSlug, limit: 3 } : "skip",
  );

  if (gallery === undefined) {
    return (
      <section className="mt-6 rounded-md border border-[#d8ccb9] bg-white/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#51493d]">
          <Images size={16} aria-hidden="true" />
          Latest cards
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-md bg-[#ede4d5]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!gallery || gallery.cards.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-md border border-[#d8ccb9] bg-white/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[#51493d]">
            <Images size={16} aria-hidden="true" />
            Latest cards
          </p>
          <p className="mt-1 text-xs leading-5 text-[#6f6658]">
            A peek at what people are hatching from this event.
          </p>
        </div>
        <Link
          href={`/events/${eventSlug}`}
          className="shrink-0 rounded-sm bg-[#23201b] px-2.5 py-1 text-xs font-semibold text-[#fffaf0] transition-opacity hover:opacity-80"
        >
          View full gallery
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {gallery.cards.map((card) => {
          const accentColor = safeAccentColor(card.accentColor);

          return (
            <article
              key={card._id}
              className="min-w-0 overflow-hidden rounded-md border border-[#d8ccb9] bg-[#fffaf0]"
              style={{ borderTopColor: accentColor, borderTopWidth: 4 }}
            >
              <div className="aspect-[4/5] bg-[#ede4d5]">
                <img
                  src={card.avatarImageUrl}
                  alt={`${card.earnedTitle} card for ${card.displayName}`}
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-black text-[#332d25]">
                  {card.displayName}
                </p>
                <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-4 text-[#6f6658]">
                  {card.earnedTitle}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function HackaDeckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitQuiz = useMutation(api.submissions.submitQuiz);
  const activeEvents = useQuery(api.events.listActive);
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<FormDraft>({});
  const [hydrated, setHydrated] = useState(false);
  const [eli5Value, setEli5Value] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = loadDraft();
    const recoveryEmail = searchParams.get("recoveryEmail");
    setDraft({
      ...saved,
      ...(recoveryEmail ? { recoveryEmail } : {}),
    });
    setEli5Value(saved.eli5 ?? "");
    setHydrated(true);
  }, [searchParams]);

  const urlEventSlug = searchParams.get("event");
  const defaultEventSlug = useMemo(() => {
    if (urlEventSlug) return urlEventSlug;
    if (activeEvents && activeEvents.length > 0) return activeEvents[0].slug;
    return "";
  }, [urlEventSlug, activeEvents]);
  const [selectedEventSlug, setSelectedEventSlug] = useState<string | null>(
    null,
  );
  const eventSlug = selectedEventSlug ?? defaultEventSlug;

  // Persist form on change
  const persistForm = useCallback(() => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const newDraft: FormDraft = {
      recoveryEmail: String(fd.get("recoveryEmail") ?? ""),
      displayName: String(fd.get("displayName") ?? ""),
      teamName: String(fd.get("teamName") ?? ""),
      roleToday: String(fd.get("roleToday") ?? ""),
      buildEnergy: String(fd.get("buildEnergy") ?? ""),
      eli5: String(fd.get("eli5") ?? ""),
      animalPreference: String(fd.get("animalPreference") ?? ""),
      consentGallery: fd.get("consentGallery") === "on",
    };
    saveDraft(newDraft);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const teamNameRaw = String(formData.get("teamName") ?? "").trim();
    const animalRaw = String(formData.get("animalPreference") ?? "");
    const animalPreference =
      animalRaw && animalRaw !== "Surprise me" ? animalRaw : undefined;

    const parsed = formAnswerSchema.safeParse({
      eventSlug: String(formData.get("eventSlug") ?? ""),
      recoveryEmail: String(formData.get("recoveryEmail") ?? ""),
      displayName: String(formData.get("displayName") ?? ""),
      teamName: teamNameRaw || undefined,
      roleToday: String(formData.get("roleToday") ?? ""),
      buildEnergy: String(formData.get("buildEnergy") ?? ""),
      eli5: String(formData.get("eli5") ?? ""),
      animalPreference,
      consentGallery: formData.get("consentGallery") === "on",
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your answers.");
      return;
    }

    setIsSubmitting(true);
    try {
      const answers = {
        eventSlug: parsed.data.eventSlug,
        recoveryEmail: parsed.data.recoveryEmail,
        displayName: parsed.data.displayName,
        roleToday: parsed.data.roleToday,
        buildEnergy: parsed.data.buildEnergy,
        eli5: parsed.data.eli5,
        consentGallery: parsed.data.consentGallery,
        ...(parsed.data.teamName ? { teamName: parsed.data.teamName } : {}),
        ...(parsed.data.animalPreference
          ? { animalPreference: parsed.data.animalPreference }
          : {}),
      };
      const result = await submitQuiz({ answers });
      router.push(result.deckPath as Route);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The card run could not be started.",
      );
      setIsSubmitting(false);
    }
  }

  // Don't render until hydrated to avoid defaultValue mismatch
  if (!hydrated) {
    return (
      <div className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-4 shadow-[0_18px_60px_rgba(35,32,27,0.12)] sm:p-6">
        <div className="animate-pulse text-[#6f6658]">Loading...</div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-5 shadow-[0_18px_60px_rgba(35,32,27,0.12)] sm:p-8"
      onChange={persistForm}
      onSubmit={handleSubmit}
    >
      <input name="eventSlug" type="hidden" value={eventSlug} />

      <label className="grid gap-2">
        <span className="text-xs font-semibold tracking-[0.18em] text-[#8d5f3a] uppercase">
          Event
        </span>
        {activeEvents === undefined ? (
          <div className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 text-[#6f6658]">
            Loading events…
          </div>
        ) : activeEvents.length === 0 ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-700">
            No active events found. Check back soon!
          </div>
        ) : (
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            value={eventSlug}
            onChange={(e) => setSelectedEventSlug(e.target.value)}
          >
            {activeEvents.map((event) => (
              <option key={event._id} value={event.slug}>
                {event.name}
              </option>
            ))}
          </select>
        )}
      </label>

      <LatestCardPreview eventSlug={eventSlug} />

      <section className={sectionClassName}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#51493d]">
              <Mail size={16} aria-hidden="true" />
              Recovery email
            </span>
            <input
              required
              className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
              defaultValue={draft.recoveryEmail}
              name="recoveryEmail"
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#51493d]">
              Display name
            </span>
            <input
              required
              className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
              defaultValue={draft.displayName}
              maxLength={24}
              name="displayName"
              placeholder="Maya"
            />
          </label>

          <label className="grid gap-2 sm:col-span-2">
            <span className="text-sm font-semibold text-[#51493d]">
              Team name{" "}
              <span className="font-normal text-[#6f6658]">(optional)</span>
            </span>
            <input
              className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
              defaultValue={draft.teamName}
              maxLength={40}
              name="teamName"
              placeholder="Cache Money"
            />
          </label>
        </div>
      </section>

      <section className={sectionClassName}>
        <fieldset className="grid gap-4">
          <legend className={sectionHeaderClassName}>
            What are you mostly doing today?
          </legend>
          <TileRadioGroup
            name="roleToday"
            options={roleOptions}
            defaultValue={draft.roleToday}
            hints={roleHints}
          />
        </fieldset>
      </section>

      <section className={sectionClassName}>
        <fieldset className="grid gap-4">
          <legend className={sectionHeaderClassName}>
            What's your build energy?
          </legend>
          <TileRadioGroup
            name="buildEnergy"
            options={buildEnergyOptions}
            defaultValue={draft.buildEnergy}
            hints={energyHints}
          />
        </fieldset>
      </section>

      <section className={sectionClassName}>
        <label className="grid gap-4">
          <span className={sectionHeaderClassName}>
            What are you making? Explain it like I'm five.
          </span>
          <textarea
            required
            className="min-h-28 resize-y rounded-md border border-[#c9bca8] bg-white px-4 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            maxLength={200}
            name="eli5"
            onChange={(event) => setEli5Value(event.target.value)}
            placeholder="We made a helper that reads your emails and tells you which ones matter."
            value={eli5Value}
          />
          <span className="-mt-2 text-xs text-[#6f6658]">
            {eli5Value.length}/200 characters
          </span>
        </label>
      </section>

      <section className={sectionClassName}>
        <fieldset className="grid gap-4">
          <legend className={sectionHeaderClassName}>
            Pick your animal companion
          </legend>
          <TileRadioGroup
            name="animalPreference"
            options={animalCompanionOptions}
            defaultValue={draft.animalPreference ?? "Surprise me"}
            columns="grid-cols-2 sm:grid-cols-4"
          />
        </fieldset>
      </section>

      <label className="mt-4 flex items-start gap-3 rounded-md border border-[#d8ccb9] bg-white p-3">
        <input
          defaultChecked={draft.consentGallery ?? true}
          className="mt-1 h-4 w-4 accent-[#8d5f3a]"
          name="consentGallery"
          type="checkbox"
        />
        <span className="text-sm font-medium text-[#51493d]">
          Show my card briefly in the public gallery for hackathon vibes.
        </span>
      </label>

      <button
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#23201b] px-5 py-4 text-base font-black text-[#fffaf0] transition hover:bg-[#3a332a] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting || !eventSlug}
        type="submit"
      >
        <WandSparkles size={18} aria-hidden="true" />
        {isSubmitting ? "Starting your card run..." : "Hatch my card"}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
      {error ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
