import Link from "next/link";
import type { EducationEntry, Person } from "@/data/types";
import { schoolsBySlug } from "@/data/schools";

export function EducationPanel({ person }: { person: Person }) {
  const entries = person.education ?? [];
  if (entries.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-semibold text-ink-900">Education</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {entries.map((e, i) => (
          <li key={i}>
            <EducationCard entry={e} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EducationCard({ entry }: { entry: EducationEntry }) {
  const school = entry.schoolSlug ? schoolsBySlug[entry.schoolSlug] : undefined;
  const name = school?.name ?? entry.schoolName ?? "School";
  const city = school?.city ?? entry.city;
  const website = school?.website;
  const years = entry.years
    ? entry.years[0] === entry.years[1]
      ? `${entry.years[0]}`
      : `${entry.years[0]}–${entry.years[1]}`
    : undefined;

  const inner = (
    <div className="rounded-md border border-ink-100 bg-parchment px-4 py-3 hover:border-accent-700 transition-colors h-full">
      <p className="font-serif text-lg text-ink-900 leading-tight">{name}</p>
      {entry.degree ? (
        <p className="mt-0.5 text-sm text-ink-700">
          {entry.degree}
          {entry.field ? ` · ${entry.field}` : null}
        </p>
      ) : null}
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

  if (website) {
    return (
      <Link href={website} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
