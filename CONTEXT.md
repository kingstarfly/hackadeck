# HackaDeck

HackaDeck is a live hackathon collectible-card experience where participants answer a short quiz and receive a shareable Builder Familiar card.

## Language

**Participant**:
A hackathon attendee within an event who submits quiz answers to generate a card.

**Event**:
A hackathon or live gathering that owns its participant decks, cards, looks, and public event page.
_Avoid_: global gallery

**Event Slug**:
A stable URL-safe identifier for an event, such as `ai-engineer-hack-2026`.

**Builder Familiar**:
An animal companion card persona generated from a participant's hackathon role, energy, powers, weakness, relic, and tiny detail.
_Avoid_: avatar, pet

**Card**:
The generated collectible artifact shown to the participant and optionally in the public gallery.

**Card Run**:
A complete quiz submission and generation flow that produces a card when successful.
_Avoid_: attempt

**Look**:
A generated visual output for the same card identity.
_Avoid_: art variant

**Recovery email**:
A required, unverified email string used as a lightweight recovery key for generated assets.
_Avoid_: account email, login, verified identity

**Participant Deck**:
The event-scoped management page where a participant can view previous cards, choose the selected card/look, download assets, and start another card.

**Event Page**:
The public page for one event, including the live gallery wall and any event-level deck views or highlights.

## Relationships

- An **Event** has one or more **Participants**.
- A **Participant** belongs to exactly one **Event**.
- An **Event** has one **Event Page**.
- A **Participant** can create one or more **Card Runs** within that **Event**.
- A **Card Run** produces at most one **Card**.
- A **Card** belongs to exactly one **Participant**.
- A **Card** has one or more **Looks**.
- A **Participant** has one **Participant Deck**.
- A **Participant** chooses one **Card** as their selected card.
- A **Card** chooses one **Look** as its selected look.
- A selected **Card** appears on the **Event Page** only when the **Participant** consents to public display.
- A **Recovery email** can help find a **Participant**'s generated assets for an **Event** but does not prove ownership.

## Example Dialogue

> **Dev:** "Should we validate the **Recovery email** before letting someone see their **Card** again?"
> **Domain expert:** "No. It is a lightweight recovery key, not an account or proof of identity."

## Flagged Ambiguities

- "email" could imply account auth or verified identity; resolved: HackaDeck uses **Recovery email** as a required, unverified recovery key.
