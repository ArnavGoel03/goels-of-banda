import type { TimelineEvent } from "@/lib/timeline-events";
import { TimelineEntry } from "./TimelineEntry";

export function TimelineEra({
  decade,
  events,
}: {
  decade: number;
  events: TimelineEvent[];
}) {
  return (
    <section className="mt-10 first:mt-0">
      <header className="sticky top-16 z-10 mb-4 flex items-baseline gap-3 bg-parchment/95 py-1 backdrop-blur-sm">
        <h2 className="font-serif text-3xl font-semibold text-ink-900 tabular-nums">
          {decade}s
        </h2>
        <span className="text-xs uppercase tracking-[0.18em] text-ink-400">
          {events.length} event{events.length === 1 ? "" : "s"}
        </span>
      </header>
      <ol>
        {events.map((ev, i) => (
          <TimelineEntry key={`${ev.year}-${i}`} event={ev} />
        ))}
      </ol>
    </section>
  );
}
