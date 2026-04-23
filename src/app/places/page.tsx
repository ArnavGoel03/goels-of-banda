import type { Metadata } from "next";
import Link from "next/link";
import { places } from "@/data/places";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Places",
  description:
    "The places where the Goel family lives and works, from the ancestral home in Banda, Uttar Pradesh to California, Ohio, Dubai, and across northern India.",
  alternates: { canonical: "/places" },
};

export default function PlacesPage() {
  const india = places.filter((p) => p.country === "India");
  const abroad = places.filter((p) => p.country !== "India");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Places", url: `${site.baseUrl}/places` },
        ])}
      />

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {places.length} cities · 3 continents
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Where the family lives
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          A family whose gravitational centre is the Banda-Jhansi-Kanpur triangle in
          Uttar Pradesh, with marriages and migrations reaching outward to Delhi,
          Chandigarh, Dubai, California, and Ohio.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-6">
        <h2 className="font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
          India
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {india.map((p) => (
            <PlaceCard key={p.slug} place={p} />
          ))}
        </div>

        <h2 className="mt-12 font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
          Abroad
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {abroad.map((p) => (
            <PlaceCard key={p.slug} place={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function PlaceCard({ place }: { place: (typeof places)[number] }) {
  return (
    <div className="rounded-md border border-ink-100 bg-parchment p-4">
      <p className="font-serif text-lg font-semibold text-ink-900">{place.name}</p>
      <p className="mt-1 text-sm text-ink-600">{place.connection}</p>
      {place.personSlugs.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs">
          {place.personSlugs.slice(0, 6).map((slug) => (
            <Link
              key={slug}
              href={`/people/${slug}`}
              className="text-accent-700 underline decoration-1 underline-offset-2"
            >
              {slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}
          {place.personSlugs.length > 6 ? (
            <span className="text-ink-400">+{place.personSlugs.length - 6} more</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
