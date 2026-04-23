import Link from "next/link";
import type { TimelineEvent } from "@/lib/timeline-events";

export function TimelineEntry({ event }: { event: TimelineEvent }) {
  const label = event.yearApprox ? `c. ${event.year}` : `${event.year}`;
  return (
    <li className="relative pb-6 last:pb-0 pl-6 border-l border-ink-100">
      <span
        className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border border-parchment ${dotColor(event.kind)}`}
        aria-hidden="true"
      />
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-base font-semibold text-ink-900 tabular-nums">
          {label}
        </span>
        <Title event={event} />
      </div>
      {event.place ? (
        <p className="mt-0.5 text-xs text-ink-500">{event.place}</p>
      ) : null}
      {event.description ? (
        <p className="mt-1 text-sm text-ink-600 max-w-prose">
          {event.description}
        </p>
      ) : null}
    </li>
  );
}

function Title({ event }: { event: TimelineEvent }) {
  if (event.personSlug) {
    return (
      <Link
        href={`/people/${event.personSlug}`}
        className="text-ink-700 hover:text-accent-700 underline decoration-1 underline-offset-2"
      >
        {event.title}
      </Link>
    );
  }
  if (event.businessSlug) {
    return (
      <Link
        href={`/businesses/${event.businessSlug}`}
        className="text-ink-700 hover:text-accent-700 underline decoration-1 underline-offset-2"
      >
        {event.title}
      </Link>
    );
  }
  return <span className="text-ink-700">{event.title}</span>;
}

function dotColor(kind: TimelineEvent["kind"]): string {
  switch (kind) {
    case "birth":
      return "bg-newborn";
    case "death":
      return "bg-deceased";
    case "business":
      return "bg-gold";
    case "milestone":
      return "bg-accent-700";
  }
}
