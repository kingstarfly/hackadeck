import Link from "next/link";

export default function GalleryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-[#8d5f3a] uppercase">
            Live deck
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Gallery wall
          </h1>
        </div>
        <Link
          className="rounded-md bg-[#23201b] px-4 py-2 text-sm font-bold text-[#fffaf0]"
          href="/"
        >
          Hatch a card
        </Link>
      </header>

      <div className="grid min-h-96 place-items-center rounded-lg border border-dashed border-[#b9aa95] bg-[#fffaf0]/70 p-8 text-center">
        <div>
          <p className="text-2xl font-black">No familiars hatched yet.</p>
          <p className="mt-2 max-w-md text-[#6f6658]">
            Convex-backed live cards will land here as soon as generation is
            wired up.
          </p>
        </div>
      </div>
    </main>
  );
}
