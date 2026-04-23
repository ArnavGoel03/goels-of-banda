import type { Person } from "@/data/types";

export function SourcesPanel({ person }: { person: Person }) {
  if (!person.sources || person.sources.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
        Sources
      </h2>
      <ul className="mt-4 space-y-1 text-sm">
        {person.sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-700 hover:text-accent-800 underline decoration-1 underline-offset-2"
            >
              {s.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
