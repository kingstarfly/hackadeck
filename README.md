# HackaDeck

HackaDeck turns a live hackathon into a collectible card wall. Participants answer a quick personality-style quiz, then the app generates a structured card identity, central familiar art, and a downloadable collectible card for the event gallery.

## Technology

- **GPT-5.5** powers structured card-spec generation: familiar species, title, stats, relic, signature move, field note, accent palette, and the image prompt used for the artwork.
- **GPT Image 2** (`gpt-image-2`) generates the central familiar art only. The app renders all card text, layout, stats, badges, and export surfaces in code so the final card stays readable and consistent.
- **Convex** provides the realtime backend: event-scoped submissions, participant/card-run state, scheduled generation jobs, generated-image storage, and live gallery queries.
- **Next.js 16** and **React 19** power the app UI, event routes, participant deck flow, gallery wall, and card pages.
- **Tailwind CSS 4**, **Radix/shadcn primitives**, **lucide-react**, and **Hugeicons** provide the frontend styling and controls.
- **OpenAI Node SDK** calls GPT-5.5 through structured responses and GPT Image 2 through image generation.
- **html-to-image** exports rendered cards as downloadable PNGs.
- **TypeScript**, **Vitest**, **convex-test**, **oxlint**, and **Prettier** keep the codebase typed, tested, linted, and formatted.

## Development

Install dependencies:

```bash
pnpm install
```

Run the Next.js app:

```bash
pnpm dev
```

Run Convex locally:

```bash
pnpm convex:dev
```

Check the project before shipping:

```bash
pnpm gate
```

## Configuration

Create `.env.local` with the app/backend values used by the local deployment:

```bash
NEXT_PUBLIC_CONVEX_URL=...
OPENAI_API_KEY=...
```
