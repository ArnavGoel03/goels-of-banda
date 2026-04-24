import Link from "next/link";
import type { Person } from "@/data/types";
import { getLifeEvents, type LifeEvent } from "@/lib/person-derivations";

export function LifeTimeline({ person }: { person: Person }) {
  const events = getLifeEvents(person);
  if (events.length < 2) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
        Life timeline
      </h2>
      <ol className="mt-6 relative pl-6 border-l border-ink-100">
        {events.map((ev, i) => (
          <li key={i} className="relative pb-5 last:pb-0">
            <span
              className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border border-parchment ${dotColor(ev.kind)}`}
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-lg font-semibold text-ink-900 tabular-nums">
                {ev.yearApprox ? `c. ${ev.year}` : ev.year}
              </span>
              <EventTitle ev={ev} />
            </div>
            {ev.place ? (
              <p className="mt-0.5 text-xs text-ink-500">{ev.place}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function EventTitle({ ev }: { ev: LifeEvent }) {
  if (ev.kind === "child" && ev.personSlug) {
    return (
      <span className="text-ink-700">
        <Link
          href={`/people/${ev.personSlug}`}
          className="text-accent-700 hover:text-accent-800 underline decoration-1 underline-offset-2"
        >
          {ev.title.replace(" born", "")}
        </Link>{" "}
        <span className="text-ink-500">born</span>
      </span>
    );
  }
  if (ev.kind === "business" && ev.businessSlug) {
    return (
      <span className="text-ink-700">
        <Link
          href={`/businesses/${ev.businessSlug}`}
          className="text-accent-700 hover:text-accent-800 underline decoration-1 underline-offset-2"
        >
          {ev.title.replace(" opens", "")}
        </Link>{" "}
        <span className="text-ink-500">opens</span>
      </span>
    );
  }
  return <span className="text-ink-700">{ev.title}</span>;
}

function dotColor(kind: LifeEvent["kind"]): string {
  switch (kind) {
    case "birth":
      return "bg-newborn";
    case "death":
      return "bg-deceased";
    case "business":
      return "bg-gold";
    case "child":
      return "bg-accent-400";
    case "marriage":
      return "bg-accent-700";
  }
}
