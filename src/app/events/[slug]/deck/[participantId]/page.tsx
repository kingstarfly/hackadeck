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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-10 sm:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] text-[#8d5f3a] uppercase">
        AI Engineers Singapore 2026
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#23201b] sm:text-5xl">
        Your card is queued
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-7 text-[#51493d]">
        Your animal companion card run has started. Keep this page open while
        the live deck updates itself.
      </p>
      <ParticipantDeckStatus eventSlug={slug} participantId={participantId} />
    </main>
  );
}
