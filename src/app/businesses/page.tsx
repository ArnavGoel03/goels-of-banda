import type { Metadata } from "next";
import Link from "next/link";
import { businesses } from "@/data/businesses";
import { site } from "@/data/config";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Family businesses",
  description:
    "Enterprises owned or run by members of the Goel family of Banda and their extended family — heritage jewellery firms in Banda, manufacturing in Kanpur and Chandigarh, stockbroking in Agra and Dubai, ceramics in Jaipur.",
  alternates: { canonical: "/businesses" },
};

export default function BusinessesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Businesses", url: `${site.baseUrl}/businesses` },
        ])}
      />
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {businesses.length} enterprises
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Family businesses
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          The Goel family and those they have married into run or have founded a range
          of businesses across India and the UAE. Several are publicly registered
          companies with documented filings.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          {businesses.map((b) => (
            <div
              key={b.slug}
              className="group relative flex flex-col rounded-md border border-ink-100 border-l-2 border-l-gold bg-parchment p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
            >
              <Link
                href={`/businesses/${b.slug}`}
                className="absolute inset-0 rounded-md"
                aria-label={`Open ${b.name}`}
              />
              <p className="font-serif text-xl font-semibold text-ink-900 group-hover:text-accent-700">
                {b.name}
              </p>
              <p className="mt-1 text-sm text-ink-600">
                {b.kind} · {b.city}
                {b.state ? `, ${b.state}` : ""}
                {b.established ? ` · est. ${b.established}` : ""}
              </p>
              {b.website ? (
                <a
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 mt-3 inline-flex w-fit items-center gap-1 rounded-md border border-ink-100 bg-parchment-dark px-2.5 py-1 text-xs text-accent-700 hover:border-accent-400 hover:text-accent-800"
                >
                  {new URL(b.website).hostname.replace(/^www\./, "")} ↗
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
