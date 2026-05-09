"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, WandSparkles } from "lucide-react";

import {
  buildEnergyOptions,
  cardFormOptions,
  cardIntentOptions,
  familiarOptions,
  powerOptions,
  relicOptions,
  roleOptions,
  weaknessOptions,
} from "@/lib/form-options";
import { cn } from "@/lib/utils";

export function HackaDeckForm() {
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);

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

  return (
    <form className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-4 shadow-[0_18px_60px_rgba(35,32,27,0.12)] sm:p-6">
      <input name="eventSlug" type="hidden" value="ai-engineer-hack-2026" />

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
          <span className="text-sm font-bold text-[#51493d]">Card form</span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="cardForm"
            defaultValue="Builder Familiar"
          >
            {cardFormOptions.map((form) => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#51493d]">
            Familiar preference
          </span>
          <select
            required
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            name="familiarPreference"
            defaultValue="Surprise me"
          >
            {familiarOptions.map((familiar) => (
              <option key={familiar} value={familiar}>
                {familiar}
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
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#23201b] px-5 py-4 text-base font-black text-[#fffaf0] transition hover:bg-[#3a332a]"
        type="submit"
      >
        <WandSparkles size={18} aria-hidden="true" />
        Make this card-worthy
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
