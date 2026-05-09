import { Sparkles } from "lucide-react";

import { HackaDeckForm } from "@/components/hackadeck-form";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-6 sm:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-[#8d5f3a] uppercase">
            AI Engineers Singapore 2026
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#23201b] sm:text-5xl">
            HackaDeck
          </h1>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#23201b] text-[#fffaf0]">
          <Sparkles size={22} aria-hidden="true" />
        </div>
      </header>

      <section className="mb-6">
        <p className="max-w-2xl text-lg leading-7 text-[#51493d]">
          Scan, answer a tiny quiz, and hatch your matte field-guide Builder
          Familiar card.
        </p>
      </section>

      <HackaDeckForm />
    </main>
  );
}
