import { people } from "@/data/people";
import { businesses } from "@/data/businesses";

export type TimelineEvent = {
  year: number;
  yearApprox?: boolean;
  kind: "birth" | "death" | "business" | "milestone";
  title: string;
  place?: string;
  personSlug?: string;
  businessSlug?: string;
  description?: string;
};

const historicalAnchors: TimelineEvent[] = [
  {
    year: 1820,
    yearApprox: true,
    kind: "milestone",
    title: "Brothers Ganesh Prasad and Gondilal Goel settle in Banda",
    place: "Banda, Uttar Pradesh",
    description:
      "The founding generation of the Banda Goel family arrives in what is now Uttar Pradesh.",
  },
  {
    year: 1850,
    yearApprox: true,
    kind: "business",
    title: "‘Ganesh Prasad Gondilal Saraf’ opens",
    place: "Banda, Uttar Pradesh",
    businessSlug: "ganesh-prasad-gondilal-saraf",
    description:
      "Gondilal's son opens the ancestral jewellery firm, naming it after his father and his uncle.",
  },
  {
    year: 1970,
    yearApprox: true,
    kind: "business",
    title: "‘Gondilal Saraf’ opens in the heart of Banda",
    place: "Banda, Uttar Pradesh",
    businessSlug: "gondilal-saraf",
    description:
      "Radha Krishna Goel gives up his share of the ancestral firm to his three younger brothers and opens a separate jewellery shop.",
  },
];

export function buildTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = [...historicalAnchors];

  for (const p of people) {
    if (p.birth?.year) {
      events.push({
        year: p.birth.year,
        yearApprox: p.birth.yearApprox,
        kind: "birth",
        title: `${p.name} born`,
        place: p.birth.place,
        personSlug: p.slug,
      });
    }
    if (p.death?.year) {
      events.push({
        year: p.death.year,
        kind: "death",
        title: `${p.name} passed away`,
        place: p.death.place,
        personSlug: p.slug,
      });
    }
  }

  for (const b of businesses) {
    if (!b.established) continue;
    // Skip the ancestral one if we've already anchored it manually
    if (b.slug === "ganesh-prasad-gondilal-saraf") continue;
    events.push({
      year: b.established,
      kind: "business",
      title: `${b.name} founded`,
      place: b.city,
      businessSlug: b.slug,
    });
  }

  return events.sort((a, b) => a.year - b.year);
}

export function groupByDecade(
  events: TimelineEvent[],
): { decade: number; events: TimelineEvent[] }[] {
  const map = new Map<number, TimelineEvent[]>();
  for (const e of events) {
    const decade = Math.floor(e.year / 10) * 10;
    const list = map.get(decade) ?? [];
    list.push(e);
    map.set(decade, list);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([decade, events]) => ({ decade, events }));
}
