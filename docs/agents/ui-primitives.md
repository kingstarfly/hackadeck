# HackaDeck UI Primitives

Status: `ready-for-agent`

## Design System Overview

HackaDeck uses **layered contrast** — cooler gallery walls frame warm collectible cards.

| Layer      | Direction                                                        | Palette                                           |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| Website    | Cooler stone gallery wall, clean sans-serif, generous whitespace | Stone `#EDEAE6`, charcoal `#2D2A26`               |
| Card frame | Warm paper, structured zones, card-specific accent               | Cream `#FAF7F2` + accent from `spec.accent_color` |
| Avatar art | Sumikko Gurashi soft pastel illustration                         | Generated, not coded                              |

**Why gallery wall?** Cards are warm objects displayed on neutral walls. The temperature contrast makes cards feel like collectible artifacts, not wallpaper.

## Palette

| Role       | Value                     | CSS Var        | Usage                            |
| ---------- | ------------------------- | -------------- | -------------------------------- |
| Background | `#EDEAE6` (cooler stone)  | `--background` | Page background, gallery wall    |
| Foreground | `#2D2A26` (dark charcoal) | `--foreground` | Primary text, never pure black   |
| Card       | `#FAF7F2` (warm cream)    | `--card`       | Card surfaces — the warm objects |
| Border     | `#DAD6D0` (cooler border) | `--border`     | Subtle dividers                  |
| Muted      | `#6F6658`                 | `--ink-soft`   | Secondary text                   |

### Opacity hierarchy (Swiss principle)

Use opacity to create hierarchy, not different hues:

- Primary: `text-foreground` (full)
- Secondary: `text-foreground/70`
- Tertiary: `text-foreground/40`
- Disabled: `text-foreground/20`

## Typography

**Font:** Inter (already configured in globals.css)

| Role    | Tailwind                                         | Usage             |
| ------- | ------------------------------------------------ | ----------------- |
| Display | `text-5xl md:text-7xl font-light tracking-tight` | Hero, page titles |
| H1      | `text-4xl font-light tracking-tight`             | Section headers   |
| H2      | `text-2xl font-light`                            | Subsections       |
| H3      | `text-lg font-medium`                            | Component headers |
| Body    | `text-base leading-relaxed max-w-[60ch]`         | Paragraphs        |
| Small   | `text-sm`                                        | Supporting text   |
| Caption | `text-xs tracking-wide uppercase`                | Labels, metadata  |

**Rules:**

- Headings use `font-light` or `font-normal`, never bold
- Body text never exceeds `max-w-[60ch]`
- Use `text-balance` on headings to prevent widows

## Component Inventory

Located in `src/components/ui/`:

| Component  | File              | Quiz | Gallery | Card |
| ---------- | ----------------- | :--: | :-----: | :--: |
| Button     | `button.tsx`      |  ✓   |    ✓    |  -   |
| Input      | `input.tsx`       |  ✓   |    -    |  -   |
| Label      | `label.tsx`       |  ✓   |    -    |  -   |
| Checkbox   | `checkbox.tsx`    |  ✓   |    -    |  -   |
| RadioGroup | `radio-group.tsx` |  ✓   |    -    |  -   |
| Badge      | `badge.tsx`       |  -   |    ✓    |  ✓   |
| Progress   | `progress.tsx`    |  ✓   |    -    |  -   |
| Skeleton   | `skeleton.tsx`    |  -   |    ✓    |  -   |

### Usage Notes

**RadioGroup** — Quiz single-choice questions:

```tsx
<RadioGroup defaultValue="option1">
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option1" id="r1" />
    <Label htmlFor="r1">Frontend builder</Label>
  </div>
</RadioGroup>
```

**Checkbox** — Quiz multi-select and consent:

```tsx
<Checkbox id="consent" />
<Label htmlFor="consent">Show my card in the public gallery</Label>
```

**Progress** — Generation status:

```tsx
<Progress value={66} />
<p className="text-sm text-foreground/60">Hatching card art…</p>
```

**Badge** — Rarity, stats, team:

```tsx
<Badge variant="secondary">Rare</Badge>
<Badge variant="outline">Cache Money</Badge>
```

**Skeleton** — Gallery loading:

```tsx
<Skeleton className="h-[300px] w-[200px]" />
```

## Custom Components (Not shadcn)

These components need custom implementation:

| Component       | Purpose                               | Location                  |
| --------------- | ------------------------------------- | ------------------------- |
| `CardRenderer`  | Programmatic card PNG generation      | `src/components/card/`    |
| `QuizForm`      | Multi-step personality quiz           | `src/components/quiz/`    |
| `GalleryGrid`   | Live-updating card wall               | `src/components/gallery/` |
| `StatusStepper` | Generation progress with playful copy | `src/components/status/`  |

## Swiss-Aligned Styling Rules

1. **No border-radius on structural elements** — Use `rounded-none` or `rounded-sm` max. Buttons and inputs can have subtle rounding.

2. **Generous whitespace** — Section padding minimum `py-16`, standard `py-24`.

3. **One accent per context** — Card renderer uses `spec.accent_color`. Website uses warm neutrals only.

4. **Mobile-first** — All components work at 320px. Use `sm:`, `md:`, `lg:` prefixes.

5. **Focus states required** — Use `focus-visible:ring-2 focus-visible:ring-ring/30` (already in shadcn defaults).

6. **No decorative elements** — Cards provide visual richness. Website is the neutral frame.

## Status Copy (Playful)

Generation states should use this copy from the product spec:

- `Reading your build aura…`
- `Matching your familiar…`
- `Forging your tiny relic…`
- `Writing your field note…`
- `Hatching card art…`
- `Printing your card…`

## Card Layout (Not CSS, Reference Only)

Cards are rendered programmatically to PNG. The card frame uses:

- 1024×1536px canvas (2:3 vertical)
- Warm paper background (`#FAF7F2`) with subtle grain
- Structured zones: header 12%, art 55-60%, stats 10-12%, ability 12-16%, footer 4-6%

### Card accent color lever

Each card pulls an accent color from `spec.accent_color` (generated by GPT-5.5 based on the avatar palette). Use this accent sparingly to give each card personality while keeping the frame template consistent:

- **Header tint** — subtle accent wash behind name/title
- **Border accent** — thin accent line on card edge or header bottom
- **Stat highlight** — accent on the highest stat icon
- **Rarity badge** — accent background for Rare/Epic/Legendary

**Rule:** One accent per card, used at 2-3 touch points max. The accent adds personality; the warm cream frame stays consistent across gallery.

See `docs/HackaDeck_Product_Spec.md` Section 4 for full layout spec.

## Adding New Components

1. Prefer shadcn CLI: `npx shadcn@latest add <component>`
2. If shadcn doesn't fit, create in `src/components/` with same patterns
3. Use CSS vars from globals.css, not hardcoded colors
4. Follow Swiss styling rules above
