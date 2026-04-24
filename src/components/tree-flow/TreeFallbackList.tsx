import Link from "next/link";
import type { Person } from "@/data/types";

// Streamlined, connection-friendly alternative to the interactive tree.
// Shown when the browser reports Save-Data or 2g/3g effective type.
export function TreeFallbackList({ peopleList }: { peopleList: Person[] }) {
  const byGen = new Map<number, Person[]>();
  for (const p of peopleList) {
    const g = p.generation ?? 99;
    const list = byGen.get(g) ?? [];
    list.push(p);
    byGen.set(g, list);
  }
  const sortedGens = [...byGen.keys()].sort((a, b) => a - b);

  return (
    <div className="rounded-lg border border-ink-100 bg-parchment-dark p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-500 font-medium">
        Streamlined view · grouped by generation
      </p>
      <div className="mt-4 space-y-6">
        {sortedGens.map((g) => {
          const list = byGen.get(g)!;
          return (
            <section key={g}>
              <h3 className="font-serif text-lg text-ink-900">
                Generation {g}
              </h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {list.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/people/${p.slug}`}
                      className="block rounded-md border border-ink-100 bg-parchment px-3 py-2 text-sm hover:border-accent-700"
                    >
                      <p className="font-serif text-ink-900">{p.name}</p>
                      {p.currentLocation ? (
                        <p className="mt-0.5 text-xs text-ink-500">
                          {p.currentLocation}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
