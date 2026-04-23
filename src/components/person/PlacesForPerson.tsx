import Link from "next/link";
import type { Person } from "@/data/types";
import { getPlacesForPerson } from "@/lib/person-derivations";

export function PlacesForPerson({ person }: { person: Person }) {
  const list = getPlacesForPerson(person);
  if (list.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
        Connected places
      </h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {list.map((pl) => (
          <li key={pl.slug}>
            <Link
              href={`/places#${pl.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-100 bg-parchment px-3 py-1.5 text-sm text-ink-700 hover:border-accent-400 hover:text-accent-700"
            >
              <span className="text-ink-300">◉</span>
              {pl.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
