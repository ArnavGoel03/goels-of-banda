import type { Metadata } from "next";
import Link from "next/link";
import { stories } from "@/data/stories";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Long-form stories about the Goel family of Banda: the 1820s founding, the 2000 split, and the Jhansi-Banda intermarriage pattern.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Stories", url: `${site.baseUrl}/stories` },
        ])}
      />
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {stories.length} pieces
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Stories
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Long-form pieces about the inflection points of the Goel family, why
          the shop is named what it is, why the split of 2000 mattered, and how
          marriage ties stitched Banda to Jhansi.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {stories.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/stories/${s.slug}`}
                className="group block h-full rounded-lg border border-ink-100 bg-parchment p-6 border-l-2 border-l-gold transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent-700 font-medium">
                  {s.era ?? s.kind}
                </p>
                <p className="mt-3 font-serif text-2xl font-semibold text-ink-900 group-hover:text-accent-700 leading-tight">
                  {s.title}
                </p>
                <p className="mt-2 text-sm text-ink-600">{s.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
