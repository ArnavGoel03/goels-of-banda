import type { Metadata } from "next";
import { buildTimeline, groupByDecade } from "@/lib/timeline-events";
import { TimelineEra } from "@/components/timeline/TimelineEra";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Two centuries of the Goel family of Banda, from the 1820s founding generation to the sixth generation born in 2026. Every dated birth, death, and business opening in one continuous spine.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  const events = buildTimeline();
  const eras = groupByDecade(events);
  const firstYear = events[0]?.year;
  const lastYear = events[events.length - 1]?.year;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Timeline", url: `${site.baseUrl}/timeline` },
        ])}
      />
      <article className="mx-auto max-w-3xl px-6 pt-12 pb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {firstYear && lastYear
            ? `${firstYear} to ${lastYear}`
            : "Two centuries"}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          The spine
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Every dated moment in the Goel family record, on one continuous
          timeline. Births, deaths, shops opening their doors. Click a year to
          jump into that person or business.
        </p>

        <div className="mt-10">
          {eras.map(({ decade, events }) => (
            <TimelineEra key={decade} decade={decade} events={events} />
          ))}
        </div>
      </article>
    </>
  );
}
