import { people } from "@/data/people";
import type { Person } from "@/data/types";

export type Occasion = {
  kind: "birthday" | "anniversary";
  person: Person;
  otherPerson?: Person;
  month: number;
  day: number;
  monthDayLabel: string;
  daysAway: number;
  age?: number;
};

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function parseDayMonth(s?: string): { month: number; day: number; year?: number } | null {
  if (!s) return null;
  const m = s
    .toLowerCase()
    .match(/(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+(\d{4}))?/);
  if (!m) return null;
  return {
    day: parseInt(m[1], 10),
    month: MONTHS.indexOf(m[2]) + 1,
    year: m[3] ? parseInt(m[3], 10) : undefined,
  };
}

function daysUntil(now: Date, month: number, day: number): number {
  const thisYear = new Date(now.getFullYear(), month - 1, day);
  if (thisYear < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    const nextYear = new Date(now.getFullYear() + 1, month - 1, day);
    return Math.round((nextYear.getTime() - now.getTime()) / 86400000);
  }
  return Math.round((thisYear.getTime() - now.getTime()) / 86400000);
}

function monthDayLabel(month: number, day: number): string {
  const monthName = MONTHS[month - 1];
  return `${day} ${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}`;
}

export function upcomingOccasions(now: Date = new Date(), windowDays = 45): Occasion[] {
  const out: Occasion[] = [];
  const seenAnniversary = new Set<string>();
  for (const p of people) {
    if (p.isLiving) {
      const b = parseDayMonth(p.birth?.date);
      if (b) {
        const daysAway = daysUntil(now, b.month, b.day);
        if (daysAway <= windowDays) {
          const age =
            b.year != null ? now.getFullYear() - b.year + (daysAway > 0 ? 1 : 0) : undefined;
          out.push({
            kind: "birthday",
            person: p,
            month: b.month,
            day: b.day,
            monthDayLabel: monthDayLabel(b.month, b.day),
            daysAway,
            age,
          });
        }
      }
    }
    if (p.spouse && p.isLiving) {
      const key = [p.slug, p.spouse.slug].sort().join("::");
      if (seenAnniversary.has(key)) continue;
      seenAnniversary.add(key);
      const m = parseDayMonth(p.spouse.marriage?.date);
      if (!m) continue;
      const other = people.find((x) => x.slug === p.spouse!.slug);
      if (!other || !other.isLiving) continue;
      const daysAway = daysUntil(now, m.month, m.day);
      if (daysAway > windowDays) continue;
      const age =
        m.year != null ? now.getFullYear() - m.year + (daysAway > 0 ? 1 : 0) : undefined;
      out.push({
        kind: "anniversary",
        person: p,
        otherPerson: other,
        month: m.month,
        day: m.day,
        monthDayLabel: monthDayLabel(m.month, m.day),
        daysAway,
        age,
      });
    }
  }
  return out.sort((a, b) => a.daysAway - b.daysAway);
}
