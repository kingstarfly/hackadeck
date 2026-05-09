import Link from "next/link";

type CardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      <section className="aspect-[2/3] rounded-lg border border-[#d8ccb9] bg-[#fffaf0] p-5 shadow-[0_20px_70px_rgba(35,32,27,0.16)]">
        <div className="grid h-full place-items-center rounded-md border border-dashed border-[#b9aa95] text-center text-[#6f6658]">
          Card preview {id}
        </div>
      </section>

      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#8d5f3a] uppercase">
          Builder Familiar
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Your card is hatching
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-7 text-[#51493d]">
          This route is ready for the generated spec, familiar art, PNG export,
          reroll controls, and gallery sharing.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            className="rounded-md bg-[#23201b] px-4 py-2 text-sm font-bold text-[#fffaf0]"
            href="/gallery"
          >
            View gallery
          </Link>
          <Link
            className="rounded-md border border-[#b9aa95] px-4 py-2 text-sm font-bold"
            href="/"
          >
            Make another
          </Link>
        </div>
      </section>
    </main>
  );
}
