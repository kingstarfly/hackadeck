# HackaDeck Build Spec

**Goal for 5pm:** ship a working QR-to-card experience where participants answer a short playful quiz and receive a polished, downloadable hackathon collectible card. The winning demo is a live gallery of real participant cards.

**Core promise:**

> Scan a QR code. In under a minute, hatch your limited-edition animal companion card.

**Emotional target:**

> The card should feel like something your teammates would lovingly tease you for, while still making you look cool.

---

## 1. Final product direction

HackaDeck turns a live hackathon into a collectible card wall. Each builder gets matched with an **animal companion** that captures their role, working style, harmless weakness, personal relic, and hackathon chaos pattern.

The style should feel **polished, simple, loved, and shareworthy**, not generically AI-coded.

### House style

**Name:** Soft Familiar Collectibles

**Visual feel:**

- Gentle 2D illustration, not 3D rendered
- Soft matte pastel palette (cream, peach, sage, warm gray, soft orange)
- Simple rounded shapes with minimal or no linework
- Dot eyes, subtle expressions, shy body language
- Sumikko Gurashi / children's book illustration energy
- One personal relic or accessory per familiar
- Clean negative space, uncluttered composition
- Charming but not saccharine — slightly melancholic warmth
- Small stamped hackathon edition mark on card frame
- Feels like a desk companion you'd want to keep

**Avoid:**

- 3D vinyl figurine product photography
- Neon AI glow
- Holographic cyberpunk as the default
- Glitch / code rain
- Circuit-board patterns
- NFT avatar energy
- Exact Pokémon / Yu-Gi-Oh / Magic / Space Invaders references
- Busy fantasy battle-card layouts
- Overly detailed or realistic illustration
- Harsh outlines or high contrast
- Full anime chibi as the default
- Wizard robes, staffs, glowing eyes, or generic fantasy RPG styling

### Default character choice

Default to **regular animal familiars**, not fantasy pets or human avatars.

Why:

- More polished and universally shareable
- Less identity-sensitive than human avatars or selfies
- Easier to keep visually consistent across a gallery
- Gives personality without needing visual explanation
- Avoids the generic AI-avatar look
- Lets the card feel affectionate instead of self-serious

Use "pet" energy, but present it as an **animal companion**.

### Core design principle

Do not optimize only for “accurate role matching.” Optimize for:

1. recognizable at thumbnail size
2. flattering
3. funny enough to share
4. specific enough to feel personal
5. consistent enough for the gallery

### Design system layers

The visual design uses **layered contrast** — structured UI chrome frames illustrated content.

| Layer | Direction | Rationale |
|-------|-----------|-----------|
| **Website** | Swiss-inspired: warm neutrals (cream, warm gray), clean sans-serif, generous whitespace, minimal chrome | Functional container that lets cards shine. Like museum walls for art. |
| **Card frame** | Structured zones, readable typography, warm paper tones, subtle texture | Bridge between functional UI and illustrated art. Clear hierarchy for stats/text. |
| **Avatar art** | Full Sumikko energy: soft pastel, illustrated, character in personal habitat | The personalized, magical artifact. The star of the show. |

**Website palette:**
- Background: warm cream `#FAF7F2` or soft warm gray
- Text: dark charcoal `#2D2A26`, never pure black
- Typography: Inter / system sans-serif
- Minimal decorative elements — the cards provide visual richness

**Card frame principles:**
- Structured zones (header, art window, stats, ability, footer)
- Warm neutral background (cream/paper tones)
- One accent color per card, pulled from avatar palette
- Subtle paper grain texture
- Readable at thumbnail AND full size
- Consistent template across all cards for gallery coherence

**Why layered contrast works:**
- The content (cards) is already visually rich and illustrated
- Structured chrome creates intentional contrast — cards feel special
- Avoids “same-y” feeling if everything is soft pastels
- Functional clarity for the webapp, emotional richness for the artifact

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
3. Icon reference / mini game manual page
4. Boss recap poster
5. Animated reveal video

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

The main artifact is a **vertical PNG collectible profile card**.

Recommended size:

```txt
1024 x 1536 px
2:3 vertical ratio
```

The final card should include:

- Display name
- Earned title
- Animal familiar species
- Personal relic
- Hackathon edition badge
- Central familiar art
- 4 stat icons or stat chips
- Signature move
- Field note / flavor line
- Team name if present
- Card number / hatch time / gallery number

The card should read well at thumbnail size. At small size, these should be visible:

1. familiar silhouette
2. display name
3. earned title

---

## 4. Card layout

### Recommended layout

For a `1024x1536` canvas:

| Section | Approx height | Contents |
|---|---:|---|
| Header | 12% | Name, earned title, edition stamp |
| Art window | 55–60% | Familiar art, large and centered |
| Trait / stats strip | 10–12% | personal relic chip + 4 icon stats |
| Ability box | 12–16% | Signature move + short description + field note |
| Footer | 4–6% | Team, card number, hatch time, event mark |

### Typography

Use at most two fonts. For speed, use system fonts unless the team already has a font pipeline.

Suggested CSS stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Suggested type rules:

- Display name: large, bold, max 20 chars before shrink
- Earned title: medium, max 36 chars
- Relic chip: max 32 chars
- Signature move name: max 26 chars
- Move description: max 76 chars
- Field note: max 96 chars
- Avoid paragraphs

### Stats / icons

Use **4 stats**, not 6. To save space, the card can show **themed icons + small values**, while a separate “manual” explains each icon.

Default stat names for data/spec:

- Build
- Debug
- Taste
- Chaos

Front-of-card display can be icon-first:

| Stat | Icon direction | Meaning |
|---|---|---|
| Build | hammer / spark / stack | execution, shipping, making |
| Debug | bug / magnifier / lantern | problem solving, reliability |
| Taste | star / leaf / eye | design sense, product judgment, polish |
| Chaos | lightning / swirl / comet | creativity, curveballs, weird energy |

Implementation note: keep full stat names in the data model for accessibility/tooltips, but render compact icons on the card.

Suggested display:

```txt
[hammer] 88  [bug] 96  [star] 72  [bolt] 63
```

Future manual idea:

- `/manual` route or printable one-pager
- Explains stat icons, rarity stamps, familiar species, relic types, and card numbering
- Fun gallery companion, not needed for MVP

---

## 5. User flow

1. Participant scans QR code.
2. Quiz loads instantly on mobile.
3. Participant answers mostly multiple-choice questions.
4. They tap **Make this card-worthy**.
5. App creates a structured card spec with GPT-5.5.
6. App generates central familiar art with GPT Image 2.
7. App renders final card PNG deterministically.
8. User lands on their participant deck page.
9. User can download PNG, create another look, pick their favorite card/look,
   or view gallery.
10. Card appears on live gallery wall if consented.

Target experience:

```txt
45–60 seconds from scan to card reveal
```

Status copy should feel playful:

- Reading your build aura...
- Matching your familiar...
- Forging your tiny relic...
- Writing your field note...
- Hatching card art...
- Printing your card...

---

## 6. Quiz design

The quiz should feel like a tiny personality quiz, not a form. The goal is to
get someone from scan to submission with low inertia, then let GPT-5.5 infer the
richer card details.

### Required fields

- Email
- Display name
- Role today
- Build energy
- One tiny personal detail, optional
- Gallery opt-in, default checked

### Better free-text prompt

Use this instead of “Add one boring or funny detail about yourself”:

> What tiny detail would make your teammates say “yeah, that’s you”?

Examples shown as placeholder chips:

- “I always have 40 tabs open.”
- “I keep saying the CSS is almost done.”
- “I brought three chargers and no water bottle.”
- “I name variables dramatically.”
- “I keep asking if we need auth.”

### Question set

#### 1. Display name

Short text.

#### 2. Email

Required text.

Email is an unverified recovery key for finding generated assets again if the
participant loses their result link. It is not treated as proof of identity and
does not create a full account.

#### 3. What are you mostly doing today?

Single choice:

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

#### 4. What is your build energy?

Single choice:

- Calm shipper
- Deadline gremlin
- Pixel perfectionist
- Bug hunter
- Idea fountain
- Team therapist
- Quiet optimizer
- Demo magician
- Shortcut goblin
- Last-minute philosopher

#### 5. One recognizable detail

Optional short text, supported by example chips. This replaces the older powers,
weakness, relic, and animal preference questions. If the user leaves it blank,
the generator should infer a kind, ordinary companion and a simple developer
prop from role today and build energy.

#### 6. Consent

Checkbox:

- Show my card in the public gallery for hackathon vibes.

Default checked.

---

## 7. Personalization model

The card should be built around a **specific, affectionate truth**, not just role matching.

### Matching formula

```txt
role + build energy + optional tiny detail
→ familiar + earned title + personal relic + signature move + field note
```

The generator infers card intent, powers, weakness, relic, and animal companion
from the short quiz answers. Do not ask participants to tune these before they
have seen their first card.

### Personalization slots

Every generated card should include these:

- **Earned title:** a funny nickname or role title that feels specific
- **Personal relic:** one small object or prop tied to their answers
- **Signature move:** one special action they perform during the sprint
- **Field note:** one affectionate line that sounds like a teammate wrote it
- **Quirk phrase:** an optional short phrase used in flavor, tooltip, or card back later

### Earned title patterns

Use title patterns like:

- Keeper of [specific thing]
- Captain of [team behavior]
- The One Who [funny behavior]
- Patron Saint of [hackathon pain]
- Whisperer of [technical object]
- Guardian of [demo outcome]
- Warden of [chaos source]
- Tender of [small personal relic]

Examples:

- Keeper of the Tiny Repro
- Button State Whisperer
- Guardian of the Happy Path
- The One Who Reads the Logs
- Captain of “Just One More Fix”
- Merge Conflict Therapist
- Patron Saint of Working Demos
- Pixel Treaty Negotiator
- Calm Waters Captain

### Kindness rule

Always make the user sound competent, funny, and loved by their team. Weaknesses should be affectionate, never insulting.

Bad:

```txt
Bad at planning.
```

Good:

```txt
Says “quick fix” with heroic optimism.
```

Bad:

```txt
Easily distracted.
```

Good:

```txt
Follows one side quest and returns with treasure.
```

Bad:

```txt
Doesn’t know CSS.
```

Good:

```txt
Negotiates with CSS like it is an ancient spirit.
```

---

## 8. Card spec JSON

Generate this with GPT-5.5 using structured outputs / JSON schema.

### Schema shape

```ts
type HackaDeckCardSpec = {
  display_name: string;
  team_name?: string;
  edition: "AI Engineers Singapore 2026" | string;
  card_number?: number;
  hatched_at_label?: string; // e.g. "Hatched 12:43 PM"

  earned_title: string;
  archetype_base: string;
  card_intent: string;

  familiar_species: string;
  familiar_descriptor: string;

  personal_relic: {
    name: string;        // "Rubber Duck Lantern"
    visual: string;      // "a tiny yellow rubber duck holding a warm desk lamp"
    meaning: string;     // "helps them debug without panic"
  };

  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  print_finish: "Matte" | "Stamped" | "Spot Gloss" | "Metallic Ink";

  stats: {
    Build: number;
    Debug: number;
    Taste: number;
    Chaos: number;
  };

  stat_icons: {
    Build: "hammer" | "spark" | "stack";
    Debug: "bug" | "magnifier" | "lantern";
    Taste: "star" | "leaf" | "eye";
    Chaos: "bolt" | "swirl" | "comet";
  };

  signature_move: {
    name: string;
    description: string;
  };

  field_note: string;
  known_for?: string;
  chaos_tell?: string;
  quirk_phrase?: string;

  accent_color: string;
  
  // Generated directly by GPT-5.5, not template-interpolated
  // Follows section-by-section structure defined in "Art prompt generation guidance"
  art_prompt: string;
};
```

### Content constraints

- Keep everything flattering, funny, and harmless.
- Do not generate insults, medical claims, protected-class references, or appearance judgments.
- Do not imply real competence scores. Stats are playful card attributes only.
- Do not use copyrighted card-game terminology or named franchise styles.
- Titles should be short and punchy.
- Prefer ordinary animals with one clever coding twist.
- One meaningful personal relic is better than many generic props.
- Do not crowd the card with lore; save extra copy for the deck page or future
  manual.

### Art prompt generation guidance

GPT-5.5 generates the `art_prompt` field directly — no template interpolation. The prompt should follow this section-by-section structure, with some sections fixed and others adapted to the participant.

---

**SECTION 1: USE CASE** *(always include verbatim)*

```
Create central mascot art only for a vertical collectible hackathon card.
This image will be placed inside a rendered card frame. The app will add 
all text, stats, badges, and layout separately.
```

---

**SECTION 2: HOUSE STYLE** *(always include verbatim)*

```
Soft 2D illustration in the style of Sumikko Gurashi or gentle children's 
book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), 
minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, 
gentle expressions. Charming but not saccharine — slightly shy, melancholic 
warmth. Feels like a beloved desk companion collectible.
```

---

**SECTION 3: SUBJECT** *(adapt to participant)*

Describe the familiar as flowing prose. Include:
- Species and visual descriptor
- Body language reflecting their build energy
- Personal relic integrated naturally (held, worn, nearby)
- How the earned title manifests in their demeanor

Example:
> A small, calm owl with tiny round glasses and a folded API note tucked under one wing. Sits with patient, watchful energy — the posture of someone who finds the bug everyone else missed. A tiny rubber duck glows softly beside them like a desk lamp companion.

---

**SECTION 4: ENVIRONMENT / HABITAT** *(adapt — this is the personal magic)*

The familiar exists in a personal micro-habitat derived from quiz answers. This creates the "that's me!" moment.

**Input sources** (priority order):
1. `tiny_detail` — free-text quirk ("40 tabs open", "three chargers")
2. `role_today` — what they are mostly doing
3. `build_energy` — working style

The generator may invent a simple personal relic or harmless weakness if needed,
but should not expose that as extra quiz work.

**Environment principles:**

| Principle | Meaning |
|-----------|---------|
| VISIBLE | Noticeable at thumbnail size. Teammates point and say "that's the tabs thing." |
| INTEGRATED | Familiar sits on, among, or surrounded by the detail. Part of the scene. |
| ON-BRAND | Soft pastel, illustrated. No literal tech. Translate: tabs → papers, debugging → magnifying glass. |
| CLEAR | Connection between answer and visual is graspable, not a puzzle. |
| AFFECTIONATE | Cozy, charming, like the familiar's natural habitat. |
| COMMITTED | One strong visible detail beats several subtle ones. |

**Example environment translations:**

| Quiz Input | Environment in Prompt |
|------------|----------------------|
| "40 tabs open" | perched on a towering pile of overlapping papers, some sliding off the edge |
| "three chargers, no water bottle" | nestled in a cozy tangle of cables, empty mug nearby |
| "forgot to eat" | surrounded by scattered snack wrappers and crumbs, looking content |
| "keeps changing the prompt" | sitting among crumpled paper balls and crossed-out notes |
| "CSS is almost done" | surrounded by floating color swatches and tiny alignment marks |
| "names variables dramatically" | posed on a tiny spotlight stage with theatrical lighting |

**Lighting mood** (derive from `build_energy`):
- Deadline gremlin, Last-minute philosopher → warm late-night lamp glow
- Calm shipper, Quiet optimizer → soft morning light
- Demo magician → warm spotlight / stage lighting
- Default → soft diffuse daylight

If no clear environmental detail emerges, a simple cozy desk scene with the relic is fine. Don't force it.

---

**SECTION 5: COMPOSITION** *(always include, minor adaptation OK)*

```
Single centered character, full body visible, generous padding for card 
framing. Soft pastel background with the habitat elements. No card frame, 
no border.
```

---

**SECTION 6: CONSTRAINTS** *(always include verbatim)*

```
No text, no letters, no numbers, no logos, no trademarks, no watermark, 
no 3D rendering, no product photography, no neon, no holographic effects, 
no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, 
no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, 
no high contrast, no literal screens or browser windows.
```

---

**Full example art_prompt:**

```
Create central mascot art only for a vertical collectible hackathon card.
This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately.

Soft 2D illustration in the style of Sumikko Gurashi or gentle children's book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, gentle expressions. Charming but not saccharine — slightly shy, melancholic warmth. Feels like a beloved desk companion collectible.

A small, calm owl with tiny round glasses perched thoughtfully. Patient, watchful energy — the posture of someone who finds the bug everyone else missed. A tiny rubber duck sits beside them, glowing softly like a warm desk lamp.

The owl is perched among a scattered pile of API documentation pages and folded sticky notes, some sliding off the edge of an unseen desk. Warm late-night lamp glow with soft amber tones fills the scene.

Single centered character, full body visible, generous padding for card framing. Soft pastel background with the habitat elements. No card frame, no border.

No text, no letters, no numbers, no logos, no trademarks, no watermark, no 3D rendering, no product photography, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, no high contrast, no literal screens or browser windows.
```

### Example spec

```json
{
  "display_name": "Maya",
  "team_name": "Cache Money",
  "edition": "AI Engineers Singapore 2026",
  "card_number": 17,
  "hatched_at_label": "Hatched 12:43 PM",
  "earned_title": "Keeper of the Tiny Repro",
  "archetype_base": "Bug Hunter",
  "card_intent": "My actual role today",
  "familiar_species": "Owl",
  "familiar_descriptor": "a calm little debug owl with tiny round glasses and a folded API note",
  "personal_relic": {
    "name": "Rubber Duck Lantern",
    "visual": "a tiny yellow rubber duck holding a warm desk lamp beside the owl",
    "meaning": "helps them debug without panic"
  },
  "rarity": "Rare",
  "print_finish": "Stamped",
  "stats": {
    "Build": 82,
    "Debug": 96,
    "Taste": 74,
    "Chaos": 68
  },
  "stat_icons": {
    "Build": "hammer",
    "Debug": "lantern",
    "Taste": "star",
    "Chaos": "bolt"
  },
  "signature_move": {
    "name": "Endpoint Exorcism",
    "description": "Turns one haunted API response into clean JSON."
  },
  "field_note": "Spotted listening to headers when the docs go quiet.",
  "known_for": "Finds the one missing env var.",
  "chaos_tell": "Opens 37 tabs and somehow knows where everything is.",
  "quirk_phrase": "Show me the headers.",
  "accent_color": "#7A5C3E",
  "art_prompt": "Create central mascot art only for a vertical collectible hackathon card. This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately.\n\nSoft 2D illustration in the style of Sumikko Gurashi or gentle children's book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, gentle expressions. Charming but not saccharine — slightly shy, melancholic warmth. Feels like a beloved desk companion collectible.\n\nA small, calm owl with tiny round glasses perched thoughtfully. Patient, watchful energy — the posture of someone who finds the bug everyone else missed. A tiny rubber duck sits beside them, glowing softly like a warm desk lamp.\n\nThe owl is perched among a scattered pile of API documentation pages and folded sticky notes, some sliding off the edge of an unseen desk. Warm late-night lamp glow with soft amber tones fills the scene.\n\nSingle centered character, full body visible, generous padding for card framing. Soft pastel background with the habitat elements. No card frame, no border.\n\nNo text, no letters, no numbers, no logos, no trademarks, no watermark, no 3D rendering, no product photography, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, no high contrast, no literal screens or browser windows."
}
```

---

## 9. Animal mapping guidance

Use this as a soft guide, not a hard rule. Match emotional behavior, not just role.

| Familiar | Good fit |
|---|---|
| Owl | Debugging, review, backend, careful reasoning, watches quietly |
| Fox | Strategy, prompts, product thinking, APIs, clever shortcuts |
| Raccoon | Infra, toolsmithing, chaos, scrappy fixes, log digging |
| Capybara | PM, team glue, calm under pressure, scope diplomacy |
| Otter | Frontend, playful builder, collaboration, demo delight |
| Crow | Research, memory, docs, synthesis, context gathering |
| Cat | Design taste, independence, frontend polish, pixel judgment |
| Turtle | Reliability, backend, persistence, steady deployment |
| Dog | Demo energy, team support, morale, sponsor friendliness |
| Moth | Late-night focus, obsessive polish, bright screens |
| Axolotl | Experimental ideas, resilience, weird charm |
| Ghost | Debugging invisible failures, async weirdness |
| Slime | Glue code, integration work, adapting to anything |
| Seedling | First-time builder, growth, learning |
| BSOD Gremlin | Chaos gremlin, demo risk, cursed debugging |

---

## 10. Copy style guide

### Voice

Affectionate, specific, lightly magical, never mean.

### Good phrases

- “Spotted near...”
- “Known for...”
- “Summoned by...”
- “Can sense...”
- “Gains +12 morale when...”
- “Turns panic into...”
- “Returns from side quests with...”
- “Negotiates with...”
- “Keeps one tiny...”
- “Somehow always finds...”

### Phrase examples

- Spotted near the snack table, calmly refactoring reality.
- Known habitat: wherever the Wi-Fi is strongest.
- First appeared at 11:42am holding three half-ideas and one good branch.
- Says “quick fix” with dangerous confidence.
- Summoned by a failing test and cold coffee.
- Can de-escalate scope creep with one nod.
- Found the root cause three folders away from the crime scene.
- Turns panic into a three-step plan.

---

## 11. Image generation strategy

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

## 12. Art prompt generation

The `art_prompt` field is generated directly by GPT-5.5 as part of the card spec — not template-interpolated.

See **Section 8: Art prompt generation guidance** for the section-by-section structure that GPT-5.5 follows when generating art prompts.

The key principle: some sections are fixed (house style, constraints) while others adapt to the participant (subject, environment/habitat).

---

## 13. Reroll prompt generation

For rerolls, GPT-5.5 generates a variation prompt that preserves identity while changing pose/expression.

**Reroll prompt structure:**

```txt
Create a new variation of the same builder familiar concept.

[INSERT ORIGINAL ART_PROMPT HERE]

VARIATION INSTRUCTIONS:
Keep everything about the character and environment the same:
- Same animal species and visual traits
- Same personal relic
- Same environment / habitat setting
- Same lighting mood
- Same soft 2D illustration style (Sumikko Gurashi / children's book energy)
- Same muted pastel palette

Change only:
- Pose (still shy/gentle, but different position)
- Expression (subtle variation in dot eyes or head tilt)
- Accessory arrangement within the same habitat
- Slight background color variation (same mood, different soft pastel)
```

Keep the character centered, full body visible, with generous padding and a clean silhouette.

---

## 14. Rare print-finish prompt template

Use as an edit-style enhancement if supported in the implementation.

```txt
Create a rarer version of the same familiar with subtle special details.

Preserve:
- same animal species
- same silhouette and pose
- same personal relic/accessory
- same soft 2D illustration style
- same muted pastel palette base
- no text, no logos, no card border

Change only:
- add a subtle warm glow or soft halo behind the familiar
- add a tiny sparkle or star accent near the relic
- slightly warmer or more saturated accent color
- add a delicate pattern to the accessory (tiny dots, subtle texture)
- make it feel slightly more precious without losing the gentle aesthetic

Avoid neon, holographic rainbow effects, 3D rendering, glitch, cyberpunk, code rain, circuit patterns, busy backgrounds, harsh lighting, and dramatic effects.
```

---

## 15. Card rendering implementation

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
- Use icon components or inline SVG for stats.
- Always include accessible labels for stat icons in HTML.

### Icon implementation note

Use one simple icon set for speed, such as Lucide, Heroicons, or inline SVGs. Avoid overly detailed icons because they will be small on-card.

Example renderer shape:

```tsx
const stats = [
  { key: "Build", value: spec.stats.Build, icon: Hammer, label: "Build" },
  { key: "Debug", value: spec.stats.Debug, icon: Bug, label: "Debug" },
  { key: "Taste", value: spec.stats.Taste, icon: Star, label: "Taste" },
  { key: "Chaos", value: spec.stats.Chaos, icon: Zap, label: "Chaos" },
];
```

---

## 16. Suggested stack

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

- Convex file storage as the preferred MVP storage path
- Vercel Blob if Convex file storage blocks the team
- S3/R2 if already configured
- Base64 temporarily only if needed for hack speed, but avoid for gallery scale

### Generation ownership

Use Convex actions to orchestrate generation and status updates:

- GPT-5.5 structured card spec generation
- GPT Image 2 familiar art generation
- Asset upload/storage references
- Card run status transitions
- Card/look creation and selection

The browser may handle final PNG export if server-side rendering is flaky. In
that fallback, keep the Convex card/look records authoritative and upload the
PNG URL when available.

---

## 17. Data model

### `events`

```ts
{
  _id: Id<"events">;
  name: string;
  slug: string; // e.g. "ai-engineer-hack-2026"
  startsAt: number;
  endsAt?: number;
  isActive: boolean;
  createdAt: number;
}
```

An event is the top-level container for participant decks, cards, looks, and the
public event page. Card numbers are scoped to an event.

Event details are populated by the team, not participants. MVP can use a seed
script or direct admin/database edit for the current hackathon event. A minimal
admin page for creating/editing events is useful only if time allows.

### `eventCounters`

```ts
{
  _id: Id<"eventCounters">;
  eventId: Id<"events">;
  nextCardNumber: number;
  updatedAt: number;
}
```

Use an event-scoped counter to assign card numbers safely. Assign the card
number when the card run is created, so in-progress generation can say
`Card #024 is hatching`.

### `participants`

```ts
{
  _id: Id<"participants">;
  eventId: Id<"events">;
  recoveryEmail: string;
  displayName: string;
  teamName?: string;
  consentGallery: boolean;
  selectedCardId?: Id<"cards">;
  createdAt: number;
}
```

A participant is the lightweight owner record for a recovery email within an
event. On first submission for an event, create the participant. On later
submissions with the same normalized recovery email for the same event, reuse
the participant, update the display name and gallery consent, clear any legacy
team name, and show their existing cards on the deck page.

### `cardRuns`

```ts
{
  _id: Id<"cardRuns">;
  eventId: Id<"events">;
  participantId: Id<"participants">;
  cardNumber: number;
  status: "queued" | "spec_generating" | "art_generating" | "rendering" | "done" | "error";
  formAnswers: Record<string, unknown>;
  cardId?: Id<"cards">;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}
```

A card run is one complete quiz submission and generation flow. It becomes a
card when generation succeeds. Starting over creates a new card run under the
same recovery email instead of mutating previous answers.

### `cards`

```ts
{
  _id: Id<"cards">;
  eventId: Id<"events">;
  participantId: Id<"participants">;
  runId: Id<"cardRuns">;
  cardNumber: number;
  selectedLookId?: Id<"looks">;
  spec: HackaDeckCardSpec;
  avatarImageUrl: string;
  finalPngUrl?: string;
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: number;
}
```

The `cards` row stores the currently selected art and PNG for fast deck and
gallery reads. The historical generated assets live in `looks`.

### `looks`

```ts
{
  _id: Id<"looks">;
  eventId: Id<"events">;
  cardId: Id<"cards">;
  runId: Id<"cardRuns">;
  lookNumber: number;
  reason: "initial" | "art_reroll";
  specSnapshot: HackaDeckCardSpec;
  avatarImageUrl: string;
  finalPngUrl?: string;
  createdAt: number;
}
```

A look is a generated visual output for the same card identity. The deck page
can show an art picker inside the selected card.

### `teams`

```ts
{
  _id: Id<"teams">;
  eventId: Id<"events">;
  teamName: string;
  memberParticipantIds: Id<"participants">[];
  teamCardId?: Id<"cards">;
  createdAt: number;
}
```

---

## 18. Routes

| Route | Purpose |
|---|---|
| `/` | QR landing page / quiz, with event selector and recovery email |
| `/events/[slug]` | Public event page with gallery wall and event-level highlights |
| `/events/[slug]/deck/[participantId]` | Primary participant result and management page for previous cards, looks, selected event card, and starting another card |
| `/events/[slug]/recover` | Find a participant deck by recovery email for one event |
| `/events/[slug]/manual` | Optional icon / rarity / familiar reference manual |
| `/admin` | Optional: create/edit events, force regenerate, hide card, view errors |

### Event selection

The quiz includes an event selector. Default to the most recent active event
when only one likely event exists.

Selector options should be limited to recently active events to reduce wrong
event selection:

- Show events where `isActive` is true.
- Also show events that started within the last 24 hours.
- Display event name and start time, not just slug.

QR codes for an event should deep-link with the slug preselected when possible.

### Event page

The event page is the public artifact for one event. It replaces a generic
global gallery wall.

Minimum viable event page:

- Event name
- QR/link to hatch a card for that event
- Live gallery wall of selected public cards
- Count: `23 builders hatched`
- Cards sorted newest first by card creation timestamp
- Big-screen friendly layout

Cut from MVP:

- Team filters
- Rarity filters
- Manual sorting controls
- Dedicated card/look detail pages

### Participant deck page

The participant deck page is the primary participant-facing result and
management page for one recovery email within one event. MVP does not need a
separate card or look detail page.

It should show:

- Selected card at the top
- Previous cards, newest first
- Status of in-progress card runs
- Looks for the selected card
- Collapsible quiz answers for each card
- Actions: `Use this card`, `Try another look`, `Use this look`, `Download PNG`,
  `Start another card`, `View gallery`

The deck page is not treated as secure account management. It is a convenient
place to recover generated cards and assets for the event.

UX rule:

- A card comes from one quiz submission and has one set of quiz answers.
- A look is the same answers and card identity with different generated art.
- Do not show the word "run" to participants; show in-progress or failed card
  runs as card status rows like `Hatching a new card...` or
  `Card failed to hatch. Retry`.

---

## 19. Generation lifecycle

1. Create participant record.
2. Reuse an existing participant when normalized recovery email and event match.
3. Increment the event counter and assign the next card number.
4. Create card run with `queued` status and assigned card number.
5. Start Convex action: `generateCardSpec`.
6. Save spec and set status `art_generating`.
7. Start image generation from `spec.art_prompt`.
8. Save avatar image URL.
9. Render final PNG.
10. Save card record and initial look.
11. Auto-select the newly completed card for the participant.
12. Set card run status `done`.
13. Event page gallery query updates live.

### Failure handling

If image generation fails:

- Show friendly retry button.
- Keep generated text spec.
- Allow fallback placeholder familiar.

If PNG rendering fails:

- Show live HTML card preview.
- Allow user to screenshot/share.
- Keep card in gallery if possible.

Retry rules:

- Failed card run: allow `Retry hatching card`, reusing the same form answers
  and card number.
- Failed look generation: allow retry without consuming an additional look slot.
- Do not create duplicate cards for retries of the same failed run.

---

## 20. Reroll behavior

### Start New Card

- User can start over from the quiz from the deck page.
- A new card keeps the same recovery email and can reuse display/team defaults.
- A completed card appears in the result-page card selector.
- A newly completed card is automatically selected as the participant's current
  card.
- Card selector labels should use human-readable card identity, not raw ids:

```txt
Keeper of the Tiny Repro · Owl · 12:43 PM
Pixel Treaty Negotiator · Cat · 12:51 PM
```

Selection copy:

```txt
Use this card
```

Meaning: this is the card shown by default on recovery and, if gallery opt-in is
enabled, the card shown in the public gallery.

### Create Another Look

- Keep same card spec.
- Generate new avatar art with reroll prompt.
- Render new PNG.
- Save as a new `looks` row.
- Update the main `cards` row to point at the selected look.
- Keep art picking scoped inside the current card.
- Limit to 4 total looks per card, including the initial look.

User-facing action copy:

```txt
Try another look
```

Selection copy:

```txt
Use this look
```

### Rewrite Text

- Cut from MVP.
- If added later, model it as a new card run unless there is a strong reason to
  keep the same answers.

### Edit Answers

- Supported by starting a new card.
- Do not mutate previous form answers.

### Limit

Use playful copy:

> You can try 3 more looks for this card.

Reason: cost control and faster decisions.

---

## 21. Gallery

The gallery is the strongest demo artifact.

Minimum viable gallery:

- Grid of public cards
- Auto-updates when new cards finish
- Click card to focus or highlight it in the gallery
- Show count: “23 builders hatched”
- Show one selected card per participant/recovery email

Good event page details:

- Big-screen mode
- Hide private cards
- Highlight recent card with a small “just hatched” state
- Let participants choose the card/look that appears in the gallery

Target by 4pm:

```txt
10–20 real participant cards
```

---

## 22. Demo script

1. Show QR code.
2. Ask one person nearby to scan.
3. They answer the quiz in under 60 seconds.
4. Show generation status: “matching familiar”, “forging relic”, “writing field note”, “hatching art”, “printing card”.
5. Reveal their card.
6. Download PNG.
7. Open gallery wall with many participant cards.
8. Reroll one card’s art or show a rare print-finish variant.
9. End with: “By the end of the hackathon, the event has its own living deck of builders.”

---

## 23. Judging pitch

Use this short pitch:

> HackaDeck turns a live hackathon into a collectible card wall. Participants scan a QR code, answer a short personality-style quiz, and GPT-5.5 transforms their role, energy, and optional tiny personal detail into a structured card spec with an inferred title, relic, stats, and familiar identity. GPT Image 2 hatches a polished animal familiar in our house style, and our renderer turns it into a clean downloadable PNG. The gallery updates live, so the event becomes its own deck of builders.

Prize positioning:

- **GPT Image 2:** style-controlled live generation of consistent, shareable familiar art
- **GPT-5.5:** structured card-spec generation, persona mapping, stat balancing, relic matching, title/field-note writing
- **Convex:** realtime gallery, statuses, reroll versions, public/private card state

---

## 24. Build timeline

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

## 25. Acceptance criteria

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
- The familiar art feels coherent across the gallery.
- At least one card makes the user laugh and say “that’s me.”
- The flow works without the team manually editing outputs.

---

## 26. Sample card concepts for testing

### Maya

- Role: Backend builder
- Card intent: My actual role today
- Build energy: Bug hunter
- Powers: Fixing APIs, reading stack traces, shipping under pressure
- Weakness: Too many tabs
- Relic: Rubber duck
- Familiar: Owl
- Detail: “I always blame headers first.”

Expected card:

```txt
Maya
Keeper of the Tiny Repro
Familiar: Debug Owl
Relic: Rubber Duck Lantern
Move: Endpoint Exorcism
Turns one haunted API response into clean JSON.
Field Note: Spotted listening to headers when the docs go quiet.
```

### Jules

- Role: Designer / UI polish
- Card intent: My secret superpower
- Build energy: Pixel perfectionist
- Powers: Making ugly things usable, making demos shiny, explaining chaos clearly
- Weakness: Over-polishes buttons
- Relic: Whiteboard marker
- Familiar: Cat
- Detail: “I can spend 20 minutes choosing a border radius.”

Expected card:

```txt
Jules
Pixel Treaty Negotiator
Familiar: Interface Cat
Relic: Alignment Marker
Move: Button State Blessing
Makes hover, active, and disabled finally agree.
Field Note: Can sense a 2px imbalance from across the room.
```

### Ravi

- Role: Infra / deployment fixer
- Card intent: My chaotic inner builder
- Build energy: Deadline gremlin
- Powers: Debugging weird errors, finding shortcuts, keeping the team calm
- Weakness: Demo gremlin attractor
- Relic: Cable mess
- Familiar: Raccoon
- Detail: “I have a folder called final-final-v3.”

Expected card:

```txt
Ravi
Merge Conflict Archaeologist
Familiar: Root-Cause Raccoon
Relic: Emergency Cable Knot
Move: Blame Without Shame
Finds the culprit commit and keeps morale intact.
Field Note: Digs through logs like they contain buried treasure.
```

### Lin

- Role: Product / scope keeper
- Card intent: My team energy
- Build energy: Team therapist
- Powers: Keeping the team calm, explaining chaos clearly, talking to sponsors
- Weakness: Scope creep magnet
- Relic: Snacks
- Familiar: Capybara
- Detail: “I say no gently but often.”

Expected card:

```txt
Lin
Calm Waters Captain
Familiar: Scope Capybara
Relic: Snack Treaty Mug
Move: Vibe Alignment
Turns panic into a three-step plan.
Field Note: Can de-escalate scope creep with one nod.
```

---

## 27. Final design decision summary

- Use **animal companion** as the only MVP identity form.
- Use mostly **regular animals** for polish and shareability.
- Use **Soft Familiar Collectibles** style (Sumikko Gurashi / children's book energy) instead of holo-tech/neon AI visuals.
- Add **personal relics**, **earned titles**, and **field notes** so cards feel loved.
- Generate **central art only** with GPT Image 2.
- Render card layout and text in code.
- Use **4 icon-based stats** to save space; explain icons later in an optional manual.
- Make the quiz feel like a playful personality quiz with mostly MCQ answers.
- Keep the card simple: large art, name, earned title, relic, icon stats, one move, one field note.
- Make the gallery the main demo moment.
- Build personal cards first; team cards, manual, and battle posters are extensions.
