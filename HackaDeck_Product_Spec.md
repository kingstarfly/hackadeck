# HackaDeck Build Spec

**Goal for 5pm:** ship a working QR-to-card experience where participants answer a short quiz and receive a polished, downloadable hackathon collectible card. The winning demo is a live gallery of real participant cards.

**Core promise:**

> Scan a QR code. In under a minute, hatch your limited-edition hackathon card.

---

## 1. Final product direction

HackaDeck turns a live hackathon into a collectible card wall. Each builder gets matched with a **Builder Familiar**: a small animal companion that captures their hackathon role, strengths, weakness, and chaos pattern.

The style should feel **polished, simple, and shareworthy**, not generically AI-coded.

### House style

**Name:** Matte Field-Guide Builder Familiars

**Visual feel:**

- Premium matte collectible card
- Warm paper or deep charcoal card base
- Clean animal mascot illustration
- Restrained spot-color accents
- Crisp editorial typography
- Subtle paper grain / print texture
- Small stamped hackathon edition mark
- Developer-themed props used sparingly

**Avoid:**

- Neon AI glow
- Holographic cyberpunk
- Glitch / code rain
- Circuit-board patterns
- NFT avatar energy
- Exact Pokémon / Yu-Gi-Oh / Magic / Space Invaders references
- Busy fantasy battle-card layouts
- Full anime chibi as the default

### Default character choice

Default to **regular animal familiars**, not fantasy pets or human avatars.

Why:

- More polished and universally shareable
- Less identity-sensitive than human avatars or selfies
- Easier to keep visually consistent across a gallery
- Gives personality without needing visual explanation
- Avoids the generic AI-avatar look

Use “pet” energy, but present it as a **Builder Familiar**.

---

## 2. MVP scope

### Must ship

1. QR-accessible quiz/form
2. GPT-5.5 structured card-spec generation
3. GPT Image 2 central familiar art generation
4. Programmatic card renderer
5. Downloadable PNG
6. Live gallery wall
7. Basic reroll art button if time allows

### Nice-to-have

1. Team fusion cards
2. Rare print-finish variants
3. Boss recap poster
4. Animated reveal video

### Explicitly cut unless ahead

- Selfie upload
- GitHub avatar import
- Voice quiz host
- Full battle game
- Long video generation
- User-selectable visual styles
- Image-model-generated full card as the default output

---

## 3. Primary artifact

The main artifact is a **vertical PNG trading-card-style profile card**.

Recommended size:

```txt
1024 x 1536 px
2:3 vertical ratio
```

The final card should include:

- Display name
- Archetype title
- Animal familiar species
- Hackathon edition badge
- Central familiar art
- 4 stats max
- Signature move
- One short flavor line
- Team name if present
- Card number / gallery number

The card should read well at thumbnail size. At small size, these should be visible:

1. Familiar silhouette
2. Display name
3. Archetype title

---

## 4. Card layout

### Recommended layout

For a `1024x1536` canvas:

| Section | Approx height | Contents |
|---|---:|---|
| Header | 12% | Name, archetype, edition stamp |
| Art window | 55–60% | Familiar art, large and centered |
| Stats row | 10–12% | 4 stat chips or bars |
| Ability box | 12–16% | Signature move + short description |
| Footer | 4–6% | Team, card number, event mark |

### Typography

Use at most two fonts. For speed, use system fonts unless the team already has a font pipeline.

Suggested CSS stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Suggested type rules:

- Display name: large, bold, max 20 chars before shrink
- Archetype: medium, max 32 chars
- Signature move name: max 24 chars
- Move description: max 70 chars
- Flavor text: max 90 chars
- Avoid paragraphs

### Stats

Use **4 stats**, not 6.

Recommended stats:

- Build
- Debug
- Taste
- Chaos

Alternative set:

- Velocity
- Clarity
- Craft
- Stamina

Use values from 40–99. Keep stat totals somewhat balanced so every card feels flattering.

---

## 5. User flow

1. Participant scans QR code.
2. Quiz loads instantly on mobile.
3. Participant answers mostly multiple-choice questions.
4. They tap **Make this card-worthy**.
5. App creates a structured card spec with GPT-5.5.
6. App generates central familiar art with GPT Image 2.
7. App renders final card PNG deterministically.
8. User sees result page.
9. User can download PNG, reroll art, or view gallery.
10. Card appears on live gallery wall.

Target experience:

```txt
45–60 seconds from scan to card reveal
```

---

## 6. Form design

Keep the form playful and low-cognitive-load.

### Required fields

- Display name
- Team name, optional but shown inline
- Role today
- 2–3 hackathon powers
- Harmless weakness
- Familiar type
- Optional visual detail
- Consent to generate and show card

### One free-text field

Label:

> Add one boring or funny detail about yourself.

The LLM rewrites this into flavor, move text, or passive personality.

### Role options

- Frontend builder
- Backend builder
- Full-stack chaos agent
- Designer / UI polish
- Prompt wrangler
- Data / evals person
- Demo / pitch lead
- Product / scope keeper
- Infra / deployment fixer
- I am doing everything somehow

### Power options

- Debugging weird errors
- Making ugly things usable
- Explaining chaos clearly
- Shipping under pressure
- Finding shortcuts
- Writing prompts
- Fixing APIs
- Making demos shiny
- Keeping the team calm
- Turning docs into code
- Reading stack traces
- Talking to sponsors

### Weakness options

- Too many tabs
- Scope creep magnet
- CSS betrayal
- Merge conflict aura
- Forgot to eat
- Over-polishes buttons
- Names variables dramatically
- Says “one quick refactor”
- Trusts the API docs too much
- Demo gremlin attractor

### Familiar options

Default dropdown:

- Surprise me
- Owl
- Fox
- Raccoon
- Capybara
- Otter
- Crow
- Cat
- Turtle
- Dog

Rare hidden pool:

- Axolotl
- Ghost
- Slime
- Rock
- Seedling
- BSOD Gremlin

Use rare options only when the spec generator decides it fits or when the user selects “Surprise me.”

---

## 7. Card spec JSON

Generate this with GPT-5.5 using structured outputs / JSON schema.

### Schema shape

```ts
type HackaDeckCardSpec = {
  display_name: string;
  team_name?: string;
  edition: "AI Engineers Singapore 2026" | string;
  card_number?: number;

  archetype_title: string;
  familiar_species: string;
  familiar_descriptor: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
  print_finish: "Matte" | "Stamped" | "Spot Gloss" | "Metallic Ink";

  stats: {
    Build: number;
    Debug: number;
    Taste: number;
    Chaos: number;
  };

  signature_move: {
    name: string;
    description: string;
  };

  passive?: {
    name: string;
    description: string;
  };

  flavor_text: string;
  accent_color: string;
  art_prompt: string;
  negative_prompt_notes: string[];
};
```

### Content constraints

- Keep everything flattering, funny, and harmless.
- Do not generate insults, medical claims, protected-class references, or appearance judgments.
- Do not imply real competence scores. Stats are playful card attributes only.
- Do not use copyrighted card-game terminology or named franchise styles.
- Titles should be short and punchy.
- Prefer ordinary animals with one clever coding twist.

### Example spec

```json
{
  "display_name": "Maya",
  "team_name": "Cache Money",
  "edition": "AI Engineers Singapore 2026",
  "card_number": 17,
  "archetype_title": "Keeper of Header Owl",
  "familiar_species": "Owl",
  "familiar_descriptor": "a calm little debug owl with tiny round glasses and a folded API note",
  "rarity": "Rare",
  "print_finish": "Stamped",
  "stats": {
    "Build": 82,
    "Debug": 96,
    "Taste": 74,
    "Chaos": 68
  },
  "signature_move": {
    "name": "Endpoint Exorcism",
    "description": "Turns one haunted API response into clean JSON."
  },
  "passive": {
    "name": "37 Open Tabs",
    "description": "Loses focus briefly, then finds the exact tab at the worst possible moment."
  },
  "flavor_text": "When the docs go silent, Maya starts listening to the headers.",
  "accent_color": "#7A5C3E",
  "art_prompt": "...",
  "negative_prompt_notes": ["no neon", "no holographic effects", "no card text"]
}
```

---

## 8. Animal mapping guidance

Use this as a soft guide, not a hard rule.

| Familiar | Good fit |
|---|---|
| Owl | Debugging, review, backend, careful reasoning |
| Fox | Strategy, prompts, product thinking, APIs |
| Raccoon | Infra, toolsmithing, chaos, scrappy fixes |
| Capybara | PM, team glue, calm under pressure |
| Otter | Frontend, playful builder, collaboration |
| Crow | Research, memory, docs, synthesis |
| Cat | Design taste, independence, frontend polish |
| Turtle | Reliability, backend, persistence |
| Dog | Demo energy, team support, morale |
| Moth | Late-night focus, obsessive polish, bright screens |
| Axolotl | Experimental ideas, resilience, weird charm |
| Ghost | Debugging invisible failures, async weirdness |
| Slime | Glue code, integration work, adapting to anything |
| Seedling | First-time builder, growth, learning |
| BSOD Gremlin | Chaos gremlin, demo risk, cursed debugging |

---

## 9. Image generation strategy

Use **GPT Image 2** for central familiar art only.

Do not rely on the image model to render the final card text. Render text and layout in code.

### Live generation settings

```ts
model: "gpt-image-2"
size: "1024x1024"
quality: "low"
```

Use `low` for fast live generation during the event.

### Hero/demo settings

```ts
model: "gpt-image-2"
size: "1024x1024"
quality: "medium"
```

Use `medium` for sample cards, hero screenshots, and judging fallback assets.

### Optional full-card poster settings

Only if ahead of schedule:

```ts
model: "gpt-image-2"
size: "1024x1536"
quality: "medium"
```

Use this for a demo-only “collector poster” or “rare print” version, not for the core downloadable card.

---

## 10. Exact familiar art prompt template

Use this as the default GPT Image 2 prompt.

```txt
Create central mascot art only for a vertical collectible hackathon card.

Use case:
This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately.

House style:
Premium matte editorial mascot illustration. Warm off-white paper feel, restrained spot-color palette, clean ink outline, subtle print grain, simple rounded shapes, crisp readable silhouette, charming but not childish. It should feel like a polished conference collectible or modern field-guide card, not a fantasy battle card.

Subject:
A {animal_species} builder familiar representing a hackathon participant.

Participant traits:
- Role: {role_today}
- Strengths: {powers}
- Harmless weakness: {weakness}
- Archetype: {archetype}
- Optional detail: {visual_detail}

Visual direction:
Show the familiar as a clever desk companion with one small developer-themed prop if useful: tiny laptop, sticky note, coffee cup, cable, rubber duck, terminal card, checklist, or small tool. Keep the prop subtle and integrated.

Composition:
Single centered character, full body visible, generous padding, three-quarter view, clean silhouette. Simple warm background shape or paper-toned backdrop. No card frame.

Constraints:
No text, no letters, no numbers, no logos, no trademarks, no watermark, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no busy background.
```

---

## 11. Reroll prompt template

```txt
Create a new variation of the same builder familiar concept.

Preserve:
- same animal species: {animal_species}
- same role: {role_today}
- same strengths: {powers}
- same harmless weakness: {weakness}
- same archetype: {archetype}
- same premium matte editorial field-guide style
- no text, no logos, no card border

Change:
- pose
- expression
- small prop arrangement
- background shape

Keep the character centered, full body visible, with generous padding and a clean silhouette.

Avoid neon, holographic rainbow effects, cyberpunk, glitch, code rain, circuit patterns, and busy backgrounds.
```

---

## 12. Rare print-finish prompt template

Use as an edit-style enhancement if supported in the implementation.

```txt
Create a rarer print-finish version of the same familiar.

Preserve:
- same animal species
- same silhouette
- same prop
- same warm matte editorial style
- same restrained palette
- no text, no logos, no card border

Change only:
- add a small embossed edition-seal feeling
- add subtle metallic ink accents
- add tasteful spot-gloss highlights
- make it feel more collectible without becoming futuristic

Avoid neon, holographic rainbow effects, glitch, cyberpunk, code rain, circuit patterns, and busy backgrounds.
```

---

## 13. Card rendering implementation

Recommended renderer options:

1. **SVG string → PNG** using `sharp` / `resvg`
2. **HTML/CSS card → screenshot** using Playwright/Puppeteer
3. **Canvas renderer** in browser or Node

Fastest hackathon path:

- Render with HTML/CSS in the browser for preview.
- Export PNG using `html-to-image` or server-side screenshot.
- If PNG export is flaky, provide browser screenshot/download fallback.

### Renderer inputs

- `cardSpec`
- `avatarImageUrl`
- `cardNumber`
- `createdAt`

### Renderer rules

- All text comes from `cardSpec`, not the image model.
- Clamp and wrap text fields.
- Shrink font for long names.
- Use one accent color per card.
- Use consistent card template across all users.
- Crop avatar art into a large art window with padding.
- Add subtle paper grain as CSS/SVG texture if time allows.

---

## 14. Suggested stack

### Frontend

- Next.js
- Vercel deploy
- Mobile-first quiz
- Desktop gallery wall route

### Backend / realtime

- Convex for records, statuses, and live gallery updates

Use Convex:

- Queries for gallery and card pages
- Mutations for deterministic DB writes
- Actions for OpenAI / image generation calls

### AI

- GPT-5.5 for structured card spec
- GPT Image 2 for familiar art

### Storage

Store generated art and final PNG URLs. Options:

- Convex file storage if available
- Vercel Blob
- S3/R2 if already configured
- Base64 temporarily only if needed for hack speed, but avoid for gallery scale

---

## 15. Data model

### `participants`

```ts
{
  _id: Id<"participants">;
  displayName: string;
  teamName?: string;
  consentGallery: boolean;
  createdAt: number;
}
```

### `cardRuns`

```ts
{
  _id: Id<"cardRuns">;
  participantId: Id<"participants">;
  status: "queued" | "spec_generating" | "art_generating" | "rendering" | "done" | "error";
  formAnswers: Record<string, unknown>;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}
```

### `cards`

```ts
{
  _id: Id<"cards">;
  participantId: Id<"participants">;
  runId: Id<"cardRuns">;
  cardNumber: number;
  spec: HackaDeckCardSpec;
  avatarImageUrl: string;
  finalPngUrl?: string;
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: number;
}
```

### `teams`

```ts
{
  _id: Id<"teams">;
  teamName: string;
  memberParticipantIds: Id<"participants">[];
  teamCardId?: Id<"cards">;
  createdAt: number;
}
```

---

## 16. Routes

| Route | Purpose |
|---|---|
| `/` | QR landing page / quiz |
| `/card/[id]` | Result page and PNG download |
| `/gallery` | Live public gallery wall |
| `/admin` | Optional: force regenerate, hide card, view errors |

---

## 17. Generation lifecycle

1. Create participant record.
2. Create card run with `queued` status.
3. Start Convex action: `generateCardSpec`.
4. Save spec and set status `art_generating`.
5. Start image generation from `spec.art_prompt`.
6. Save avatar image URL.
7. Render final PNG.
8. Save card record.
9. Set run status `done`.
10. Gallery query updates live.

### Failure handling

If image generation fails:

- Show friendly retry button.
- Keep generated text spec.
- Allow fallback placeholder familiar.

If PNG rendering fails:

- Show live HTML card preview.
- Allow user to screenshot/share.
- Keep card in gallery if possible.

---

## 18. Reroll behavior

### Reroll Art

- Keep same card spec.
- Generate new avatar art with reroll prompt.
- Render new PNG.
- Save as new version.

### Rewrite Text

- Keep original form answers.
- Generate new card spec.
- Keep same animal species unless user requests change.

### Limit

Use playful copy:

> You have 2 rerolls before the portal closes.

Reason: cost control and faster decisions.

---

## 19. Gallery

The gallery is the strongest demo artifact.

Minimum viable gallery:

- Grid of public cards
- Auto-updates when new cards finish
- Click card to open detail page
- Show count: “23 builders hatched”

Good gallery details:

- Filter by team
- Sort newest first
- Big-screen mode
- Hide private cards
- Highlight recent card with a small “just hatched” state

Target by 4pm:

```txt
10–20 real participant cards
```

---

## 20. Demo script

1. Show QR code.
2. Ask one person nearby to scan.
3. They answer the quiz in under 60 seconds.
4. Show generation status: “matching familiar”, “writing move”, “hatching art”, “printing card”.
5. Reveal their card.
6. Download PNG.
7. Open gallery wall with many participant cards.
8. Reroll one card’s art or show a rare print-finish variant.
9. End with: “By the end of the hackathon, the event has its own living deck of builders.”

---

## 21. Judging pitch

Use this short pitch:

> HackaDeck turns a live hackathon into a collectible card wall. Participants scan a QR code, answer a 60-second quiz, and GPT-5.5 transforms their role, strengths, and harmless weakness into a structured card spec. GPT Image 2 hatches a polished animal familiar in our house style, and our renderer turns it into a clean downloadable PNG. The gallery updates live, so the event becomes its own deck of builders.

Prize positioning:

- **GPT Image 2:** style-controlled live generation of consistent, shareable familiar art
- **GPT-5.5:** structured card-spec generation, persona mapping, stat balancing, flavor writing
- **Convex:** realtime gallery, statuses, reroll versions, public/private card state

---

## 22. Build timeline

| Time | Target |
|---|---|
| 10:00–10:30 | Lock schema, form, card layout, prompt template |
| 10:30–11:15 | Build QR quiz and create participant/card run |
| 11:15–12:00 | Generate structured card spec |
| 12:00–1:00 | Generate familiar art |
| 1:00–2:00 | Render final card PNG |
| 2:00–2:45 | Build gallery |
| 2:45–3:30 | Add reroll art or polish statuses |
| 3:30–4:15 | Recruit participants and generate real cards |
| 4:15–5:00 | Submit, record fallback video, polish pitch |

### Hard cut rule

At 2pm, if something is not working, cut everything except:

> quiz → spec → familiar art → rendered PNG → gallery

---

## 23. Acceptance criteria

By submission time, the app should support:

- A participant can scan QR and complete quiz on mobile.
- App generates a structured card spec.
- App generates central familiar art.
- App renders a vertical card with readable text.
- User can download or save the PNG.
- Public cards appear in a gallery.
- The team can demo at least 5 real cards, ideally 10–20.

Definition of “good enough”:

- The card looks polished at a glance.
- The text is readable.
- The gallery feels coherent.
- The flow works without the team manually editing outputs.

---

## 24. Sample card concepts for testing

### Maya

- Role: Backend builder
- Powers: Fixing APIs, reading stack traces, shipping under pressure
- Weakness: Too many tabs
- Familiar: Owl
- Detail: “I always blame headers first.”

### Jules

- Role: Designer / UI polish
- Powers: Making ugly things usable, making demos shiny, explaining chaos clearly
- Weakness: Over-polishes buttons
- Familiar: Cat
- Detail: “I can spend 20 minutes choosing a border radius.”

### Ravi

- Role: Infra / deployment fixer
- Powers: Debugging weird errors, finding shortcuts, keeping the team calm
- Weakness: Demo gremlin attractor
- Familiar: Raccoon
- Detail: “I have a folder called final-final-v3.”

### Lin

- Role: Product / scope keeper
- Powers: Keeping the team calm, explaining chaos clearly, talking to sponsors
- Weakness: Scope creep magnet
- Familiar: Capybara
- Detail: “I say no gently but often.”

---

## 25. Final design decision summary

- Use **Builder Familiar** as the default identity form.
- Use mostly **regular animals** for polish and shareability.
- Use **Matte Field-Guide** style instead of holo-tech/neon AI visuals.
- Generate **central art only** with GPT Image 2.
- Render card layout and text in code.
- Keep the card simple: large art, name, title, 4 stats, one move, one flavor line.
- Make the gallery the main demo moment.
- Build personal cards first; team cards and battle posters are extensions.
