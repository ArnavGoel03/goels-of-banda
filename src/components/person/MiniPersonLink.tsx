import Link from "next/link";
import type { Person } from "@/data/types";

export function MiniPersonLink({ person }: { person: Person }) {
  return (
    <Link
      href={`/people/${person.slug}`}
      className="group inline-flex flex-col rounded-md border border-ink-100 bg-parchment px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
    >
      <span className="font-serif text-base font-semibold text-ink-900 group-hover:text-accent-700 leading-tight">
        {person.name}
        {!person.isLiving ? (
          <span className="ml-1 text-ink-300">✝</span>
        ) : null}
      </span>
      {person.currentLocation && person.isLiving ? (
        <span className="mt-0.5 text-[11px] text-ink-500">
          {person.currentLocation}
        </span>
      ) : person.familyRole ? (
        <span className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-ink-400">
          {person.familyRole}
        </span>
      ) : null}
    </Link>
  );
}
