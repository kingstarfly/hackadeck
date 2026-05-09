"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, WandSparkles } from "lucide-react";
import { useMutation } from "convex/react";
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

export function HackaDeckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitQuiz = useMutation(api.submissions.submitQuiz);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventSlug = searchParams.get("event") ?? "ai-engineer-hack-2026";

  const powerHelp = useMemo(() => {
    const remaining = 3 - selectedPowers.length;
    return remaining === 0
      ? "Nice trio."
      : `Pick ${remaining} more ${remaining === 1 ? "power" : "powers"}.`;
  }, [selectedPowers.length]);

  function togglePower(power: string) {
    setSelectedPowers((current) => {
      if (current.includes(power)) {
        return current.filter((item) => item !== power);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, power];
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

  return (
    <form
      className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-4 shadow-[0_18px_60px_rgba(35,32,27,0.12)] sm:p-6"
      onSubmit={handleSubmit}
    >
      <input name="eventSlug" type="hidden" value={eventSlug} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
            Recovery email
          </span>
          <input
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
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
            defaultValue=""
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
            defaultValue=""
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
          defaultValue=""
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
            defaultValue=""
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
            defaultValue=""
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
            defaultValue="Surprise me"
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
          maxLength={160}
          name="detail"
          placeholder="I always blame headers first."
        />
      </label>

      <label className="mt-4 flex items-start gap-3 rounded-md border border-[#d8ccb9] bg-white p-3">
        <input
          defaultChecked
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
        disabled={isSubmitting}
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
