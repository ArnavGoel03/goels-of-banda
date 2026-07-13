import type { Metadata } from "next";
import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { listMemories, mediaUrl } from "@/lib/contributions";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Memories",
  description:
    "Anecdotes told by the Goel family of Banda: how people met, what the town looked like, what was said. Recorded in their own voices where we could.",
  alternates: { canonical: "/memories" },
};

export default async function MemoriesPage() {
  const memories = await listMemories();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Memories", url: `${site.baseUrl}/memories` },
        ])}
      />

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {memories.length} {memories.length === 1 ? "memory" : "memories"}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Memories
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Told, not researched. The{" "}
          <Link href="/stories" className="text-accent-700 underline">
            stories
          </Link>{" "}
          are the sourced history of this family; these are the things only one
          person remembers, in the words they remember them in. A rough date is
          fine here. Most of family history happened &quot;sometime in the 60s&quot;.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {memories.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink-200 bg-parchment-dark p-8 text-center">
            <p className="font-serif text-xl text-ink-800">Nobody has told one yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
              Ask the oldest person you can reach a single question: what do you
              remember about Banda when you were small? Then press record.
            </p>
            <Link
              href="/contribute/new"
              className="mt-6 inline-block rounded-md bg-ink-900 px-6 py-3 text-white hover:opacity-90"
            >
              Record the first one
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4">
            {memories.map((m) => (
              <EntryCard
                key={m.id}
                href={`/memories/${m.slug}`}
                title={m.title}
                meta={m.occurredOn}
                summary={m.body.slice(0, 180)}
                toldBy={m.toldBy}
                hasAudio={Boolean(m.audioKey)}
                photoUrl={mediaUrl(m.photoKey)}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
