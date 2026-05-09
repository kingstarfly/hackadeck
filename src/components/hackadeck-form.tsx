"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, WandSparkles } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

import { api } from "../../convex/_generated/api";
import {
  animalCompanionOptions,
  buildEnergyOptions,
  cardIntentOptions,
  powerOptions,
  relicOptions,
  roleOptions,
  weaknessOptions,
} from "@/lib/form-options";
import { formAnswerSchema } from "@/lib/card-schema";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hackadeck-form-draft";

interface FormDraft {
  recoveryEmail?: string;
  displayName?: string;
  teamName?: string;
  roleToday?: string;
  cardIntent?: string;
  buildEnergy?: string;
  powers?: string[];
  weakness?: string;
  relic?: string;
  animalCompanionPreference?: string;
  detail?: string;
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

export function HackaDeckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitQuiz = useMutation(api.submissions.submitQuiz);
  const activeEvents = useQuery(api.events.listActive);
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<FormDraft>({});
  const [hydrated, setHydrated] = useState(false);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
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
    if (saved.powers) setSelectedPowers(saved.powers);
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
      cardIntent: String(fd.get("cardIntent") ?? ""),
      buildEnergy: String(fd.get("buildEnergy") ?? ""),
      powers: fd.getAll("powers").map(String),
      weakness: String(fd.get("weakness") ?? ""),
      relic: String(fd.get("relic") ?? ""),
      animalCompanionPreference: String(
        fd.get("animalCompanionPreference") ?? "",
      ),
      detail: String(fd.get("detail") ?? ""),
      consentGallery: fd.get("consentGallery") === "on",
    };
    saveDraft(newDraft);
  }, []);

  const powerHelp = useMemo(() => {
    const remaining = 3 - selectedPowers.length;
    return remaining === 0
      ? "Nice trio."
      : `Pick ${remaining} more ${remaining === 1 ? "power" : "powers"}.`;
  }, [selectedPowers.length]);

  function togglePower(power: string) {
    setSelectedPowers((current) => {
      let next: string[];
      if (current.includes(power)) {
        next = current.filter((item) => item !== power);
      } else if (current.length >= 3) {
        next = current;
      } else {
        next = [...current, power];
      }
      // Persist powers change after state update
      setTimeout(() => persistForm(), 0);
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = formAnswerSchema.safeParse({
      eventSlug: String(formData.get("eventSlug") ?? ""),
      recoveryEmail: String(formData.get("recoveryEmail") ?? ""),
      displayName: String(formData.get("displayName") ?? ""),
      teamName: String(formData.get("teamName") ?? "") || undefined,
      roleToday: String(formData.get("roleToday") ?? ""),
      cardIntent: String(formData.get("cardIntent") ?? ""),
      buildEnergy: String(formData.get("buildEnergy") ?? ""),
      powers: formData.getAll("powers").map(String),
      weakness: String(formData.get("weakness") ?? ""),
      relic: String(formData.get("relic") ?? ""),
      animalCompanionPreference: String(
        formData.get("animalCompanionPreference") ?? "",
      ),
      detail: String(formData.get("detail") ?? "") || undefined,
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
        cardIntent: parsed.data.cardIntent,
        buildEnergy: parsed.data.buildEnergy,
        powers: parsed.data.powers,
        weakness: parsed.data.weakness,
        relic: parsed.data.relic,
        animalCompanionPreference: parsed.data.animalCompanionPreference,
        consentGallery: parsed.data.consentGallery,
        ...(parsed.data.teamName ? { teamName: parsed.data.teamName } : {}),
        ...(parsed.data.detail ? { detail: parsed.data.detail } : {}),
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
      className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-4 shadow-[0_18px_60px_rgba(35,32,27,0.12)] sm:p-6"
      onChange={persistForm}
      onSubmit={handleSubmit}
    >
      <input name="eventSlug" type="hidden" value={eventSlug} />

      <label className="mb-4 grid gap-2">
        <span className="text-sm font-bold text-[#51493d]">Event</span>
        {activeEvents === undefined ? (
          <div className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 text-[#6f6658]">
            Loading events...
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
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
          <span className="text-sm font-bold text-[#51493d]">Display name</span>
          <input
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            defaultValue={draft.displayName}
            maxLength={24}
            name="displayName"
            placeholder="Maya"
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-sm font-bold text-[#51493d]">Team name</span>
        <input
          className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
          defaultValue={draft.teamName}
          maxLength={40}
          name="teamName"
          placeholder="Cache Money"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">Role today</span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="roleToday"
            defaultValue={draft.roleToday ?? ""}
          >
            <option disabled value="">
              Choose your lane
            </option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
            What should this capture?
          </span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="cardIntent"
            defaultValue={draft.cardIntent ?? ""}
          >
            <option disabled value="">
              Pick a vibe
            </option>
            {cardIntentOptions.map((intent) => (
              <option key={intent} value={intent}>
                {intent}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-sm font-bold text-[#51493d]">Build energy</span>
        <select
          required
          className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
          name="buildEnergy"
          defaultValue={draft.buildEnergy ?? ""}
        >
          <option disabled value="">
            Choose your energy
          </option>
          {buildEnergyOptions.map((energy) => (
            <option key={energy} value={energy}>
              {energy}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm font-bold text-[#51493d]">
          Hackathon powers
        </legend>
        <p className="mt-1 text-sm text-[#6f6658]">{powerHelp}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {powerOptions.map((power) => {
            const isSelected = selectedPowers.includes(power);

            return (
              <button
                key={power}
                className={cn(
                  "flex min-h-11 items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-semibold transition",
                  isSelected
                    ? "border-[#8d5f3a] bg-[#8d5f3a] text-white"
                    : "border-[#d8ccb9] bg-white text-[#51493d]",
                )}
                type="button"
                onClick={() => togglePower(power)}
              >
                <span>{power}</span>
                {isSelected ? <Check size={16} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
        {selectedPowers.map((power) => (
          <input key={power} name="powers" type="hidden" value={power} />
        ))}
      </fieldset>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
            Harmless weakness
          </span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="weakness"
            defaultValue={draft.weakness ?? ""}
          >
            <option disabled value="">
              Pick one
            </option>
            {weaknessOptions.map((weakness) => (
              <option key={weakness} value={weakness}>
                {weakness}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
            Hackathon relic
          </span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="relic"
            defaultValue={draft.relic ?? ""}
          >
            <option disabled value="">
              Pick one
            </option>
            {relicOptions.map((relic) => (
              <option key={relic} value={relic}>
                {relic}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
            Animal companion
          </span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="animalCompanionPreference"
            defaultValue={draft.animalCompanionPreference ?? "Surprise me"}
          >
            {animalCompanionOptions.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-sm font-bold text-[#51493d]">
          What tiny detail would make your teammates say "yeah, that's you"?
        </span>
        <textarea
          className="min-h-24 resize-y rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
          defaultValue={draft.detail}
          maxLength={160}
          name="detail"
          placeholder="I always blame headers first."
        />
      </label>

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
        {isSubmitting ? "Starting your card run..." : "Make this card-worthy"}
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
