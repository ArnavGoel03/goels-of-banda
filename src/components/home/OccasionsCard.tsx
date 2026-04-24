import Link from "next/link";
import { upcomingOccasions } from "@/lib/occasions";

export function OccasionsCard() {
  const items = upcomingOccasions(new Date(), 45).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-2">
        Coming up in the family
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((o) => (
          <li
            key={`${o.kind}-${o.person.slug}-${o.month}-${o.day}`}
            className="rounded-md border border-ink-100 bg-parchment px-4 py-3"
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-accent-700 font-medium">
              {o.kind === "birthday" ? "Birthday" : "Anniversary"} ·{" "}
              {o.daysAway === 0
                ? "today"
                : o.daysAway === 1
                  ? "tomorrow"
                  : `in ${o.daysAway} days`}
            </p>
            <p className="mt-1 font-serif text-lg text-ink-900">
              {o.kind === "birthday" ? (
                <Link href={`/people/${o.person.slug}`} className="hover:text-accent-700">
                  {o.person.name}
                </Link>
              ) : (
                <>
                  <Link href={`/people/${o.person.slug}`} className="hover:text-accent-700">
                    {o.person.name}
                  </Link>{" "}
                  &amp;{" "}
                  <Link
                    href={`/people/${o.otherPerson!.slug}`}
                    className="hover:text-accent-700"
                  >
                    {o.otherPerson!.name}
                  </Link>
                </>
              )}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              {o.monthDayLabel}
              {o.age != null
                ? o.kind === "birthday"
                  ? ` · turning ${o.age}`
                  : ` · ${o.age} years`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
