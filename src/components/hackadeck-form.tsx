"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Gem,
  Mail,
  Palette,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
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

const detailExamples = [
  "I always have 40 tabs open.",
  "I keep saying the CSS is almost done.",
  "I brought three chargers and no water bottle.",
  "I name variables dramatically.",
  "I keep asking if we need auth.",
  "I explain bugs with tiny diagrams.",
] as const;

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

const intentHints: Record<string, string> = {
  "My actual role today": "A faithful builder portrait.",
  "My chaotic inner builder": "The truest version, emotionally.",
  "My team energy": "Your place in the group spell.",
  "My secret superpower": "Make the hidden strength visible.",
  "Surprise me, but be kind": "Let HackaDeck choose the flattering read.",
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

const weaknessHints: Record<string, string> = {
  "Too many tabs": "Browser archaeology.",
  "Scope creep magnet": "Every idea has potential.",
  "CSS betrayal": "The layout had other plans.",
  "Merge conflict aura": "Git knows your name.",
  "Forgot to eat": "Fueled by momentum.",
  "Over-polishes buttons": "One more hover state.",
  "Names variables dramatically": "Every const has lore.",
  'Says "one quick refactor"': "Famously dangerous words.",
  "Trusts the API docs too much": "Optimism with headers.",
  "Demo gremlin attractor": "The laptop senses fear.",
  "Keeps changing the prompt": "Almost there, one more wording.",
  "Needs one more coffee": "The classic power source.",
};

const relicHints: Record<string, string> = {
  "Coffee cup": "The build potion.",
  "Rubber duck": "Small debugging witness.",
  Headphones: "Focus shield enabled.",
  "Sticky notes": "Thoughts with adhesive.",
  "Cable mess": "A nest of possibilities.",
  Hoodie: "Portable comfort mode.",
  Snacks: "Emergency morale.",
  "Tiny plant": "Desk-level optimism.",
  "Whiteboard marker": "Plans become visible.",
  "Lucky keyboard key": "Tiny talisman.",
  "Terminal lantern": "Guides the late-night path.",
  "Surprise me": "Let the card pick the prop.",
};

const animalHints: Record<string, string> = {
  "Surprise me": "Best match from your answers.",
  Owl: "Patient, watchful, precise.",
  Fox: "Clever shortcuts and product sense.",
  Raccoon: "Resourceful late-night problem solving.",
  Capybara: "Unbothered team comfort.",
  Otter: "Playful, fast, curious.",
  Crow: "Finds shiny useful things.",
  Cat: "Selective focus, strong opinions.",
  Turtle: "Steady progress, durable calm.",
  Dog: "Loyal momentum and demo energy.",
  Moth: "Drawn to the glowing screen.",
};

function FieldText({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#8d5f3a] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-light tracking-tight text-[#23201b]">
        {title}
      </h2>
      {children ? (
        <p className="max-w-[60ch] text-sm leading-6 text-[#6f6658]">
          {children}
        </p>
      ) : null}
    </div>
  );
}

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
  return (
    <div className={cn("grid gap-3", columns)}>
      {options.map((option) => (
        <label
          key={option}
          className="group relative min-h-[96px] cursor-pointer rounded-md border border-[#d8ccb9] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#8d5f3a]/60 hover:shadow-[0_12px_28px_rgba(35,32,27,0.08)]"
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

const sectionClassName =
  "mt-12 grid gap-8 border-t border-[#d8ccb9] pt-10 sm:mt-14 sm:pt-12";
const questionClassName = "grid gap-4";
const questionLegendClassName =
  "mb-5 flex items-center gap-2 text-base font-semibold text-[#3c352c]";

export function HackaDeckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitQuiz = useMutation(api.submissions.submitQuiz);
  const activeEvents = useQuery(api.events.listActive);
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<FormDraft>({});
  const [hydrated, setHydrated] = useState(false);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [detailValue, setDetailValue] = useState("");
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
    setDetailValue(saved.detail ?? "");
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

  function chooseDetailExample(example: string) {
    setDetailValue(example);
    setTimeout(() => persistForm(), 0);
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

      <section className={sectionClassName}>
        <FieldText eyebrow="Basics" title="Name your card">
          The email only helps you find your card again. The name is what goes
          on the artifact.
        </FieldText>
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
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#51493d]">
            Team name
          </span>
          <input
            className="rounded-md border border-[#c9bca8] bg-white px-3 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            defaultValue={draft.teamName}
            maxLength={40}
            name="teamName"
            placeholder="Cache Money"
          />
        </label>
      </section>

      <section className={sectionClassName}>
        <FieldText eyebrow="Builder vibe" title="Choose your silhouette">
          Fast choices, no overthinking. These steer the title, stats, and field
          note.
        </FieldText>

        <fieldset className={questionClassName}>
          <legend className={questionLegendClassName}>
            <Sparkles size={16} aria-hidden="true" />
            What are you mostly doing today?
          </legend>
          <TileRadioGroup
            name="roleToday"
            options={roleOptions}
            defaultValue={draft.roleToday}
            hints={roleHints}
          />
        </fieldset>

        <fieldset className={questionClassName}>
          <legend className={questionLegendClassName}>
            <Palette size={16} aria-hidden="true" />
            What should this card capture?
          </legend>
          <TileRadioGroup
            name="cardIntent"
            options={cardIntentOptions}
            defaultValue={draft.cardIntent}
            hints={intentHints}
          />
        </fieldset>

        <fieldset className={questionClassName}>
          <legend className={questionLegendClassName}>
            <Zap size={16} aria-hidden="true" />
            What is your build energy?
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
        <FieldText eyebrow="Powers" title="Pick your strongest three">
          Choose 1-3. A tight trio makes a better card than a full resume.
        </FieldText>

        <fieldset className="grid gap-4">
          <legend className="sr-only">Hackathon powers</legend>
          <p className="text-base font-semibold text-[#3c352c]">{powerHelp}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {powerOptions.map((power) => {
              const isSelected = selectedPowers.includes(power);

              return (
                <button
                  key={power}
                  className={cn(
                    "flex min-h-[72px] items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(35,32,27,0.08)]",
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
      </section>

      <section className={sectionClassName}>
        <FieldText eyebrow="Card ingredients" title="Add the lovable evidence">
          A harmless flaw, a desk relic, and a familiar choice give the card its
          tiny story.
        </FieldText>

        <fieldset className={questionClassName}>
          <legend className={questionLegendClassName}>
            <CircleHelp size={16} aria-hidden="true" />
            Pick your harmless weakness
          </legend>
          <TileRadioGroup
            name="weakness"
            options={weaknessOptions}
            defaultValue={draft.weakness}
            hints={weaknessHints}
          />
        </fieldset>

        <fieldset className={questionClassName}>
          <legend className={questionLegendClassName}>
            <Gem size={16} aria-hidden="true" />
            What object belongs on your card?
          </legend>
          <TileRadioGroup
            name="relic"
            options={relicOptions}
            defaultValue={draft.relic}
            columns="sm:grid-cols-3"
            hints={relicHints}
          />
        </fieldset>

        <fieldset className={questionClassName}>
          <legend className={questionLegendClassName}>
            <Sparkles size={16} aria-hidden="true" />
            Pick your familiar, or let us choose
          </legend>
          <TileRadioGroup
            name="animalCompanionPreference"
            options={animalCompanionOptions}
            defaultValue={draft.animalCompanionPreference ?? "Surprise me"}
            columns="sm:grid-cols-3"
            hints={animalHints}
          />
        </fieldset>
      </section>

      <section className={sectionClassName}>
        <FieldText eyebrow="Tiny detail" title="Give the card one human tell">
          Pick an example or write your own. This is optional, but it is often
          where the funniest card detail comes from.
        </FieldText>

        <div className="flex flex-wrap gap-3">
          {detailExamples.map((example) => (
            <button
              key={example}
              className="rounded-full border border-[#d8ccb9] bg-white px-4 py-2.5 text-left text-sm font-medium text-[#51493d] transition hover:border-[#8d5f3a] hover:bg-[#8d5f3a]/8"
              type="button"
              onClick={() => chooseDetailExample(example)}
            >
              {example}
            </button>
          ))}
        </div>

        <label className="grid gap-3">
          <span className="text-base font-semibold text-[#3c352c]">
            Or write the thing your teammates would recognize
          </span>
          <textarea
            className="min-h-28 resize-y rounded-md border border-[#c9bca8] bg-white px-4 py-3 outline-none focus:border-[#8d5f3a] focus:ring-2 focus:ring-[#8d5f3a]/25"
            maxLength={160}
            name="detail"
            onChange={(event) => setDetailValue(event.target.value)}
            placeholder="I always blame headers first."
            value={detailValue}
          />
          <span className="text-xs text-[#6f6658]">
            {detailValue.length}/160 characters
          </span>
        </label>
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
