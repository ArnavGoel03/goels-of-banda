import Link from "next/link";
import type { CareerEntry, Person } from "@/data/types";
import { businessesBySlug } from "@/data/businesses";

export function CareerPanel({ person }: { person: Person }) {
  const entries = person.career ?? [];
  if (entries.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-semibold text-ink-900">Career</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {entries.map((e, i) => (
          <li key={i}>
            <CareerCard entry={e} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CareerCard({ entry }: { entry: CareerEntry }) {
  const biz = entry.businessSlug ? businessesBySlug[entry.businessSlug] : undefined;
  const orgName = biz?.name ?? entry.businessName ?? "Independent";
  const city = biz?.city ?? entry.city;
  const years = entry.years
    ? `${entry.years[0]}${
        entry.years[1] ? `–${entry.years[1]}` : entry.current ? "–present" : ""
      }`
    : entry.current
      ? "Present"
      : undefined;

  const inner = (
    <div className="rounded-md border border-ink-100 bg-parchment px-4 py-3 hover:border-accent-700 transition-colors h-full">
      <p className="font-serif text-lg text-ink-900 leading-tight">{entry.role}</p>
      <p className="mt-0.5 text-sm text-ink-700">{orgName}</p>
      <p className="mt-1 text-xs text-ink-500">
        {years}
        {years && city ? " · " : null}
        {city}
      </p>
      {entry.notes ? (
        <p className="mt-2 text-xs text-ink-600 italic">{entry.notes}</p>
      ) : null}
    </div>
  );

  if (entry.businessSlug) {
    return (
      <Link href={`/businesses/${entry.businessSlug}`} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
