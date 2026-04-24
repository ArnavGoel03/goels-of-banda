import type { Metadata } from "next";
import Link from "next/link";
import { traditions } from "@/data/traditions";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Traditions",
  description:
    "Recipes, festivals, rituals, and sayings passed down through the Goel family of Banda.",
  alternates: { canonical: "/traditions" },
};

export default function TraditionsPage() {
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
          Recipes, rituals, festival customs, and sayings that move from one
          generation to the next. Attributed, where possible, to the specific
          person who carries each one.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {traditions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-200 bg-parchment-dark p-8 text-center">
            <p className="font-serif text-xl text-ink-800">
              Nothing written down yet.
            </p>
            <p className="mt-2 text-sm text-ink-600 max-w-md mx-auto">
              Ask a grandparent or an aunt. Write down one recipe, one Karwa
              Chauth ritual, one phrase only they say. This is what future
              generations will thank you for.
            </p>
            <Link
              href="/contribute"
              className="mt-4 inline-block rounded-md bg-accent-700 px-4 py-2 text-sm font-medium text-parchment hover:bg-accent-800 transition-colors"
            >
              Add a tradition →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {traditions.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/traditions/${t.slug}`}
                  className="group block rounded-lg border border-ink-100 bg-parchment p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400"
                >
                  <p className="text-[10px] uppercase tracking-[0.15em] text-accent-700 font-medium">
                    {t.kind}
                    {t.occasion ? ` · ${t.occasion}` : ""}
                  </p>
                  <p className="mt-2 font-serif text-xl text-ink-900 group-hover:text-accent-700">
                    {t.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-600 line-clamp-3">
                    {t.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
