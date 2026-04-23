import Link from "next/link";
import type { Person } from "@/data/types";
import { getAdjacentInGeneration } from "@/lib/person-derivations";

export function AdjacentNav({ person }: { person: Person }) {
  const { prev, next } = getAdjacentInGeneration(person);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Other people in the same generation"
      className="mt-16 grid grid-cols-2 gap-3 border-t border-ink-100 pt-6"
    >
      {prev ? (
        <Link
          href={`/people/${prev.slug}`}
          className="group rounded-md border border-ink-100 bg-parchment px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
        >
          <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-400">
            ← Previous
          </span>
          <span className="mt-1 block font-serif text-base font-semibold text-ink-900 group-hover:text-accent-700">
            {prev.name}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/people/${next.slug}`}
          className="group rounded-md border border-ink-100 bg-parchment px-4 py-3 text-right transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
        >
          <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-400">
            Next →
          </span>
          <span className="mt-1 block font-serif text-base font-semibold text-ink-900 group-hover:text-accent-700">
            {next.name}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
