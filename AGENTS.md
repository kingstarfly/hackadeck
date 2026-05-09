<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `kingstarfly/hackadeck`. See `docs/agents/issue-tracker.md`.

Before closing any implementation issue:

1. Commit the implementation.
2. Run `pnpm gate` and make sure it passes. This includes `pnpm convex:check`, which runs `convex dev --once` to push Convex schema/functions to the configured dev deployment and regenerate TypeScript bindings.
3. Update the issue body so completed acceptance criteria are checked off (`- [x]`).
4. Leave the required completion comment with notes, deviations, setup, and follow-ups.
5. Close the issue.

### Triage labels

Use the default triage label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: read root `CONTEXT.md` and relevant ADRs in `docs/adr/` when they exist. See `docs/agents/domain.md`.

### Frontend UI

Use shadcn/Radix/Tailwind primitives for standard app controls before creating new one-off elements. Prefer existing components from `src/components/ui`; when a missing shadcn component fits the interaction, add it with the shadcn CLI instead of hand-rolling a lookalike. Bespoke styling is fine for the collectible card renderer and gallery presentation when the artifact needs custom layout.

**UI reference docs:**

- `docs/agents/ui-primitives.md` — component inventory, HackaDeck warm palette, layered contrast system
- `/swiss-design` skill — Swiss International Style foundations (typography, spacing, opacity hierarchy)
- `docs/HackaDeck_Product_Spec.md` — full product spec including card layout, quiz design, copy style
