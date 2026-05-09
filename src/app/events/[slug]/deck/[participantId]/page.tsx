import Link from "next/link";

import { Button } from "@/components/ui/button";

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
        Your Builder Familiar card run has started. The generation controls land
        here next, and this page already has the participant deck URL shape.
      </p>
      <dl className="mt-8 grid gap-3 rounded-lg border border-[#d8ccb9] bg-[#fffaf0]/92 p-4 text-sm text-[#51493d]">
        <div>
          <dt className="font-bold">Event</dt>
          <dd>{slug}</dd>
        </div>
        <div>
          <dt className="font-bold">Participant</dt>
          <dd className="break-all">{participantId}</dd>
        </div>
      </dl>
      <Button asChild className="mt-6 w-fit">
        <Link href={`/?event=${slug}`}>Start another card</Link>
      </Button>
    </main>
  );
}
