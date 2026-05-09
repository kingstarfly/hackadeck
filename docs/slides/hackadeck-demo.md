---
theme: none
title: HackaDeck Demo
info: 2-minute hackathon submission walkthrough for HackaDeck
class: hackadeck
transition: fade
layout: cover
fonts:
  sans: Inter
drawings:
  persist: false
mdc: true
---

<style>
:root {
  --hd-bg: #edeae6;
  --hd-ink: #2d2a26;
  --hd-muted: #6f6658;
  --hd-card: #faf7f2;
  --hd-border: #dad6d0;
  --hd-accent: #d99058;
  --hd-sage: #bfd2bc;
}

.slidev-layout {
  background: var(--hd-bg);
  color: var(--hd-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: 0;
}

.slidev-layout h1 {
  font-size: 4.7rem;
  line-height: .92;
  font-weight: 300;
  letter-spacing: 0;
  max-width: 11ch;
}

.slidev-layout h2 {
  font-size: 3.25rem;
  line-height: 1;
  font-weight: 300;
  letter-spacing: 0;
  max-width: 15ch;
}

.slidev-layout p,
.slidev-layout li {
  color: color-mix(in srgb, var(--hd-ink) 72%, transparent);
  font-size: 1.35rem;
  line-height: 1.45;
}

.slidev-layout ul {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
  display: grid;
  gap: .85rem;
}

.slidev-layout li {
  border-top: 1px solid var(--hd-border);
  padding-top: .85rem;
}

.hd-grid {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 4rem;
  align-items: center;
  height: 100%;
}

.hd-mark {
  width: 17rem;
  aspect-ratio: 1;
  border: 1px solid var(--hd-border);
  background: var(--hd-card);
  display: grid;
  place-items: center;
}

.hd-mark img {
  width: 100%;
  height: 100%;
}

.hd-kicker {
  color: var(--hd-muted);
  font-size: .85rem;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.hd-card {
  background: var(--hd-card);
  border: 1px solid var(--hd-border);
  padding: 2rem;
}

.hd-stack {
  display: grid;
  gap: 1rem;
}

.hd-badge {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  border: 1px solid var(--hd-ink);
  padding: .35rem .65rem;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.hd-demo {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2.5rem;
}

.hd-step {
  min-height: 10rem;
  background: var(--hd-card);
  border: 1px solid var(--hd-border);
  padding: 1rem;
}

.hd-step strong {
  display: block;
  font-size: 2.4rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 1.4rem;
}

.hd-step span {
  color: var(--hd-muted);
  font-size: 1rem;
  line-height: 1.35;
}

.hd-accent {
  color: var(--hd-accent);
}
</style>

<div class="hd-grid">
  <div>
    <div class="hd-kicker">AI Engineers Singapore 2026</div>
    <h1>HackaDeck</h1>
    <p style="max-width: 33rem; margin-top: 2rem;">
      AI-generated Builder Familiar cards for live hackathons.
    </p>
  </div>
  <div class="hd-mark">
    <img src="../../assets/brand/hackadeck-mascot-logo.svg" alt="HackaDeck mascot logo" />
  </div>
</div>

<!--
Say:
HackaDeck turns every hackathon participant into a shareable AI-generated Builder Familiar card.
-->

---

## layout: default

<div class="hd-grid">
  <div>
    <div class="hd-kicker">Problem</div>
    <h2>Hackathons remember winners. We remember builders.</h2>
  </div>
  <div class="hd-card">
    <ul>
      <li>Most participants vanish after demos and prize lists.</li>
      <li>The room has personality before the final presentations.</li>
      <li>Everyone should leave with a small artifact worth sharing.</li>
    </ul>
  </div>
</div>

<!--
Say:
Hackathons are full of memorable personalities and working styles, but most of that disappears. HackaDeck gives every builder a personal event artifact.
-->

---

## layout: default

<div>
  <div class="hd-kicker">AI core</div>
  <h2>AI is the card engine, not garnish.</h2>

  <div class="hd-demo">
    <div class="hd-step">
      <strong>01</strong>
      <span>Quiz captures role, energy, powers, weakness, relic, and tiny detail.</span>
    </div>
    <div class="hd-step">
      <strong>02</strong>
      <span>GPT-5.5 creates a structured card identity, stats, copy, and image prompt.</span>
    </div>
    <div class="hd-step">
      <strong>03</strong>
      <span>GPT Image 2 hatches the central Builder Familiar art.</span>
    </div>
    <div class="hd-step">
      <strong>04</strong>
      <span>Convex keeps the event deck and participant state live.</span>
    </div>
  </div>
</div>

<!--
Say:
The model interprets messy human answers into a constrained collectible identity. Image generation creates the familiar art, while Convex keeps the event state moving.
-->

---

## layout: default

<div class="hd-grid">
  <div>
    <div class="hd-kicker">Live walkthrough</div>
    <h2>Scan. Answer. Hatch. Share.</h2>
    <p style="max-width: 34rem; margin-top: 2rem;">
      Now I’ll show the core loop: form to participant deck to completed familiar.
    </p>
  </div>
  <div class="hd-stack">
    <div class="hd-badge">Demo path</div>
    <div class="hd-card">
      <ul>
        <li>Open quiz with event selected.</li>
        <li>Submit one prepared participant.</li>
        <li>Show status, then completed run.</li>
      </ul>
    </div>
  </div>
</div>

<!--
Say:
For the video, the product is the star from here. If live image generation takes too long, I’ll switch to a completed run from the same flow.
-->
