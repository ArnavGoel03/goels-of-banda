import type { Metadata } from "next";
import Link from "next/link";
import { documents } from "@/data/documents";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Letters, invitation cards, shop ledgers, certificates, and old family photographs of the Goel family of Banda.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Archive", url: `${site.baseUrl}/archive` },
        ])}
      />
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {documents.length} {documents.length === 1 ? "item" : "items"}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Family archive
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Letters, invitation cards, shop ledgers, certificates, and old
          photographs. The physical record behind the people on this site.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-200 bg-parchment-dark p-8 text-center">
            <p className="font-serif text-xl text-ink-800">
              Nothing scanned yet.
            </p>
            <p className="mt-2 text-sm text-ink-600 max-w-md mx-auto">
              If you have a letter, wedding invitation, ledger page, or a
              photograph of the heritage shop that should live here, please
              contribute it.
            </p>
            <Link
              href="/contribute"
              className="mt-4 inline-block rounded-md bg-accent-700 px-4 py-2 text-sm font-medium text-parchment hover:bg-accent-800 transition-colors"
            >
              Contribute a document →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {documents.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/archive/${d.slug}`}
                  className="group block rounded-lg border border-ink-100 bg-parchment p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400"
                >
                  <p className="text-[10px] uppercase tracking-[0.15em] text-accent-700 font-medium">
                    {d.kind} {d.date?.year ? `· ${d.date.year}` : ""}
                  </p>
                  <p className="mt-2 font-serif text-xl text-ink-900 group-hover:text-accent-700">
                    {d.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-600 line-clamp-3">
                    {d.description}
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
