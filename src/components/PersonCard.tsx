import Link from "next/link";
import type { Person } from "@/data/types";
import { displayBirth, displayDeath } from "@/lib/schema";

export function PersonCard({ person }: { person: Person }) {
  const born = displayBirth(person);
  const died = displayDeath(person);
  return (
    <Link
      href={`/people/${person.slug}`}
      className="group block rounded-md border border-ink-100 bg-parchment p-4 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-serif text-lg font-semibold text-ink-900 group-hover:text-accent-700">
          {person.name}
          {!person.isLiving ? <span className="ml-1 text-ink-400">✝</span> : null}
        </p>
        {person.familyRole ? (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.1em] text-ink-400">
            {shortRole(person.familyRole)}
          </span>
        ) : null}
      </div>
      {person.altNames && person.altNames.length > 0 ? (
        <p className="mt-0.5 text-sm italic text-ink-500">
          {person.altNames.map((n) => `"${n}"`).join(" · ")}
        </p>
      ) : null}
      <dl className="mt-2 space-y-0.5 text-xs text-ink-600">
        {born ? (
          <div>
            <span className="text-ink-400">b. </span>
            {born}
          </div>
        ) : null}
        {died ? (
          <div>
            <span className="text-ink-400">d. </span>
            {died}
          </div>
        ) : null}
        {person.currentLocation && person.isLiving ? (
          <div>
            <span className="text-ink-400">in </span>
            {person.currentLocation}
          </div>
        ) : null}
        {person.occupation ? (
          <div className="mt-1 text-accent-700">{person.occupation}</div>
        ) : null}
      </dl>
    </Link>
  );
}

function shortRole(role: string): string {
  const map: Record<string, string> = {
    Self: "You",
    Father: "Father",
    Mother: "Mother",
    Sister: "Sister",
    "Paternal grandfather": "Dadaji",
    "Paternal grandmother": "Dadiji",
    "Maternal grandfather": "Nanaji",
    "Maternal grandmother": "Naniji",
  };
  return map[role] ?? "";
}
