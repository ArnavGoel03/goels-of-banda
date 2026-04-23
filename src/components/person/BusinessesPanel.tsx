import Link from "next/link";
import type { Person } from "@/data/types";
import { getBusiness } from "@/data/businesses";

export function BusinessesPanel({ person }: { person: Person }) {
  const list = (person.businessSlugs ?? [])
    .map((s) => getBusiness(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  if (list.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
        Businesses
      </h2>
      <ul className="mt-5 space-y-4">
        {list.map((b) => (
          <li
            key={b.slug}
            className="border-l-2 border-gold pl-4 py-1"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <Link
                href={`/businesses/${b.slug}`}
                className="font-serif text-lg font-semibold text-ink-900 hover:text-accent-700"
              >
                {b.name}
              </Link>
              {b.website ? (
                <a
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent-700 hover:text-accent-800 underline decoration-1 underline-offset-2"
                >
                  {hostnameOf(b.website)} ↗
                </a>
              ) : null}
            </div>
            <p className="mt-0.5 text-sm text-ink-600">
              {b.kind} · {b.city}
              {b.state ? `, ${b.state}` : ""}
              {b.established ? ` · est. ${b.established}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
