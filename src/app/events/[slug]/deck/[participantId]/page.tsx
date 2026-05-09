import { ParticipantDeckStatus } from "@/components/participant-deck-status";

type DeckPageProps = {
  params: Promise<{
    slug: string;
    participantId: string;
  }>;
};

export default async function DeckPage({ params }: DeckPageProps) {
  const { slug, participantId } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-10 sm:px-8">
      <p className="text-foreground/50 text-sm font-semibold tracking-wide uppercase">
        Participant deck
      </p>
      <h1 className="text-foreground mt-3 text-4xl font-light tracking-tight sm:text-5xl">
        Your HackaDeck cards
      </h1>
      <p className="text-foreground/70 mt-5 max-w-[60ch] text-lg leading-7">
        Pick the card and look you want on the event wall, download your
        collectible PNG, or start another card under this same participant.
      </p>
      <ParticipantDeckStatus eventSlug={slug} participantId={participantId} />
    </main>
  );
}
