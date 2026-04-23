import type { Metadata } from "next";
import { people } from "@/data/people";
import { PersonCard } from "@/components/PersonCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Everyone in the family",
  description:
    "Every member of the Goel family of Banda — living, deceased, across generations and continents. Click any name for their individual profile.",
  alternates: { canonical: "/people" },
};

const order: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

export default function PeoplePage() {
  const grouped: Record<number, typeof people> = {};
  for (const p of people) {
    const gen = p.generation ?? 0;
    (grouped[gen] ||= []).push(p);
  }

  const gens = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => (order[a] ?? a) - (order[b] ?? b));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "People", url: `${site.baseUrl}/people` },
        ])}
      />
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {people.length} profiles
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Everyone in the family
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Organised by generation — from the founding brothers in the 1820s to
          Raghav, born February 2026. Click any card to open that person&rsquo;s full
          profile.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        {gens.map((gen) => (
          <div key={gen} className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-accent-700 mb-3">
              {genTitle(gen)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[gen]
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((p) => (
                  <PersonCard person={p} key={p.slug} />
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function genTitle(gen: number): string {
  switch (gen) {
    case 1:
      return "Generation 1 — the founding brothers (1820s)";
    case 2:
      return "Generation 5 — grandparents' generation";
    case 3:
      return "Generation 6 — parents' generation";
    case 4:
      return "Generation 7 — cousins and Arnav's generation";
    case 5:
      return "Generation 8 — the newborn";
    default:
      return `Generation ${gen}`;
  }
}
