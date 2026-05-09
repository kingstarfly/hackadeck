# HackaDeck Submission And Presentation Prep

## One-line submission

HackaDeck helps hackathon participants turn a one-minute personality quiz into a shareable AI-generated Builder Familiar collectible card and live event deck.

Shorter version:

HackaDeck turns every hackathon builder into a shareable AI-generated collectible card.

## Track fit

Only list tracks where the sponsor tool is visible in the core demo.

Recommended tracks:

- OpenAI / Codex, Best use of GPT-5.5 & Codex: apply. GPT-5.5 is central to the structured card-spec generation, and Codex is a credible part of the build story if the team used it to ship/debug quickly.
- OpenAI / Codex, Best use of GPT Image 2: apply. GPT Image 2 generates the central Builder Familiar art, which is one of the main emotional artifacts in the demo.
- Convex: apply. Convex owns event setup, participant identity, quiz submissions, queued card runs, selected cards/looks, and participant deck state.

Conditional tracks:

- Adaption Labs: apply only if the main judging form allows general sponsor submissions without a required API/tool integration. Treat this as a general product prize, not a technical integration claim.
- Fal: apply only if familiar art or media generation actually uses Fal in the submitted build.
- Best Gen Media Track, Gemini: apply only if Gemini is meaningfully used for generated media. Do not apply if all generation is OpenAI.
- Best Voice Agent Track, Gemini: skip unless a voice flow is live.
- Best use of GPT Realtime 2 or GPT Realtime Translate: skip unless realtime voice/translation is live.
- Best use of the Cursor SDK: skip unless the product or build uses the Cursor SDK, not just Cursor as an editor.
- Most creative use of Exa: skip unless Exa powers a visible research/search feature.
- Best use of Smithery: skip unless Smithery connectors are part of the demo.

Submission default:

1. Best use of GPT-5.5 & Codex
2. Best use of GPT Image 2
3. Convex
4. Adaption Labs, if it is a general placement track

## Core story

Hackathons create a lot of energy, but most participant identity is invisible unless someone wins, presents, or posts online. HackaDeck makes the event feel alive while it is happening: each builder scans a QR code, answers a playful quiz, and gets a polished animal companion card that captures their role, energy, relic, weakness, and tiny chaos pattern.

The AI is not decoration. It is the product behavior: it interprets messy human answers, creates a concise card identity, writes structured card copy, and generates the central familiar art. The app then keeps the artifact consistent enough to form a live gallery wall for the event.

## What To Prove

1. It works: a clean quiz submission creates a card run and lands on a participant deck.
2. It matters: every participant gets a personal artifact, not just winners or presenters.
3. It uses AI deeply: model output drives the card identity, stats, copy, and familiar art.
4. It feels finished enough: the flow has a clear event vocabulary, warm visual direction, state handling, and a believable fallback.

## Two-minute demo run

0:00 - 0:15
Open with the promise:

> HackaDeck turns a live hackathon into a collectible card wall. Scan a QR code, answer a tiny quiz, and hatch your Builder Familiar in under a minute.

0:15 - 0:35
Show the form on mobile or narrow browser. Enter a judge-friendly example:

- Display name: `Maya`
- Role: `Backend builder keeping the demo alive`
- Intent: `My actual role today`
- Energy: `Quietly shipping`
- Powers: choose 2 or 3
- Weakness: `Over-polishing names`
- Relic: `A suspiciously annotated notebook`
- Animal preference: `Surprise me`
- Detail: `Always has spare charging cables`
- Consent: on

0:35 - 1:10
Submit and narrate the pipeline:

> Convex creates an event-scoped participant and card run, then schedules AI generation. OpenAI turns the answers into a structured card spec: title, familiar species, stats, relic, signature move, field note, and an image prompt. The image model creates only the central familiar art, while the app owns the card frame so the gallery stays coherent.

1:10 - 1:35
Show the participant deck status. If the live AI finishes, show the generated familiar and matched copy. If it is still running, switch to a prepared generated card or recording and say:

> The stage fallback is a real run captured earlier. The live path is the same queue and deck flow; we keep a recording because image generation latency is the least interesting thing to gamble with on demo day.

1:35 - 2:00
End on payoff:

> The magic is that every attendee gets a small artifact that feels personal, funny, and event-native. At scale this becomes the live wall: not a leaderboard, but a snapshot of the people building in the room.

## Submission Form Copy

### Project description

HackaDeck is a live hackathon collectible-card experience. Participants scan a QR code, answer a short playful quiz, and receive an AI-generated Builder Familiar: a polished animal companion card with a title, stats, relic, signature move, field note, and generated central art. Event organizers can use it as a live gallery wall that celebrates everyone building, not only the winners.

### Problem

Hackathons are full of memorable personalities and working styles, but the event artifact is usually limited to final demos, photos, or prize lists. Most participants never get a shareable identity inside the event.

### Solution

HackaDeck makes each participant visible through a fast, playful card-generation loop. The product converts messy quiz answers into a structured collectible identity, generates custom familiar art, and saves the result into an event-scoped participant deck.

### AI depth

AI is central to the core loop. The language model interprets participant answers and produces a structured card spec with constrained copy, stats, personality, and an image prompt. The image model then generates central familiar art. The app renders and stores the artifact deterministically so generated cards feel personal without making the gallery visually chaotic.

### Technical notes

- Next.js frontend with shadcn/Radix/Tailwind UI primitives.
- Convex backend for event-scoped participants, card runs, card state, selected looks, and live deck updates.
- OpenAI structured generation for card specs.
- OpenAI image generation for familiar art.
- Designed around a runnable live path plus recorded fallback for demo-day latency.

## Demo Day Checklist

- Run the optional Slidev intro deck: `pnpm dlx @slidev/cli docs/slides/hackadeck-demo.md --open`.
- Seed an active event before the demo.
- Verify the form loads with the event selected.
- Prepare one clean browser profile or incognito window.
- Prepare one sample participant input so typing is fast.
- Have a completed card/deck URL open in a second tab.
- Record the full core loop once before judging.
- Keep a local terminal ready with `pnpm dev` and `pnpm convex:dev`.
- Run `pnpm gate` before the final submission if time allows.
- Do not demo extra routes before the core loop works on stage.

## Fallback Plan

Best case: live submission finishes and the participant deck shows generated familiar art.

Good fallback: live submission shows queued/spec/art progress, then switch to a completed deck from an earlier real run.

Safe fallback: play a 45-second recording of the exact path from form to deck, then show the repo and architecture.

Words to use if fallback is needed:

> Image generation can take longer than a judging slot, so we prepared a recording from the same code path. The important part is that the core state machine and generated artifact are real.

## Claims To Avoid

- Do not claim a fully wired public gallery if the gallery route is still a placeholder.
- Do not claim downloadable final card PNG until the renderer/export path is working.
- Do not claim reroll support until the UI and backend path are wired.
- Do not list sponsor tracks where the tool is not part of the visible product loop.

## Final Pitch

HackaDeck is a tiny identity machine for hackathons. It takes the chaotic, human texture of how people build under pressure and turns it into something they can keep, share, and laugh about with their team. The result is not another AI avatar generator; it is an event-native collectible system where AI writes the personality and art, Convex keeps the live event state moving, and the product makes the room feel more alive.
