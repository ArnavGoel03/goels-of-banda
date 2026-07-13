import type { Metadata } from "next";
import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { listTraditions, mediaUrl } from "@/lib/contributions";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Traditions",
  description:
    "Festival customs, rituals and sayings passed down through the Goel family of Banda, attributed to the person who carries each one.",
  alternates: { canonical: "/traditions" },
};

const KIND_LABEL: Record<string, string> = {
  festival: "Festival custom",
  ritual: "Ritual",
  saying: "Saying",
  custom: "Custom",
};

export default async function TraditionsPage() {
  const traditions = await listTraditions();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Traditions", url: `${site.baseUrl}/traditions` },
        ])}
      />
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {traditions.length} {traditions.length === 1 ? "entry" : "entries"}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Traditions
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Rituals, festival customs, and sayings that move from one generation to
          the next. Attributed, where possible, to the specific person who carries
          each one. Recipes have{" "}
          <Link href="/recipes" className="text-accent-700 underline">
            their own page
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {traditions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-200 bg-parchment-dark p-8 text-center">
            <p className="font-serif text-xl text-ink-800">Nothing written down yet.</p>
            <p className="mt-2 mx-auto max-w-md text-sm text-ink-600">
              Ask a grandparent or an aunt. Write down one Karwa Chauth ritual,
              one thing that is never done on a Tuesday, one phrase only they say.
              This is what future generations will thank you for.
            </p>
            <Link
              href="/contribute/new"
              className="mt-4 inline-block rounded-md bg-accent-700 px-4 py-2 text-sm font-medium text-parchment hover:bg-accent-800 transition-colors"
            >
              Add a tradition →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {traditions.map((t) => (
              <EntryCard
                key={t.id}
                href={`/traditions/${t.slug}`}
                title={t.title}
                meta={[KIND_LABEL[t.kind] ?? t.kind, t.occasion].filter(Boolean).join(" · ")}
                summary={t.summary ?? t.body.slice(0, 180)}
                toldBy={t.toldBy}
                hasAudio={Boolean(t.audioKey)}
                photoUrl={mediaUrl(t.photoKey)}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
