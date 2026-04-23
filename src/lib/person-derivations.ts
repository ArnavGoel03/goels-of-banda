import { getPerson, people } from "@/data/people";
import { getBusiness } from "@/data/businesses";
import { places } from "@/data/places";
import type { Person, Place } from "@/data/types";

export function getSiblings(person: Person): Person[] {
  const { father, mother } = person.parents ?? {};
  if (!father && !mother) return [];
  return people.filter((p) => {
    if (p.slug === person.slug) return false;
    const pf = p.parents?.father;
    const pm = p.parents?.mother;
    if (father && pf === father) return true;
    if (mother && pm === mother) return true;
    return false;
  });
}

export function getInLaws(person: Person): {
  parents: Person[];
  siblings: Person[];
} {
  if (!person.spouse) return { parents: [], siblings: [] };
  const spouse = getPerson(person.spouse.slug);
  if (!spouse) return { parents: [], siblings: [] };
  const parents = [spouse.parents?.father, spouse.parents?.mother]
    .filter((s): s is string => Boolean(s))
    .map((s) => getPerson(s))
    .filter((p): p is Person => Boolean(p));
  const siblings = getSiblings(spouse);
  return { parents, siblings };
}

export type LifeEvent = {
  year: number;
  yearApprox?: boolean;
  title: string;
  kind: "birth" | "death" | "child" | "business";
  personSlug?: string;
  businessSlug?: string;
  place?: string;
};

export function getLifeEvents(person: Person): LifeEvent[] {
  const events: LifeEvent[] = [];
  if (person.birth?.year) {
    events.push({
      year: person.birth.year,
      yearApprox: person.birth.yearApprox,
      title: "Born",
      kind: "birth",
      place: person.birth.place,
    });
  }
  (person.children ?? []).forEach((slug) => {
    const c = getPerson(slug);
    if (c?.birth?.year) {
      events.push({
        year: c.birth.year,
        yearApprox: c.birth.yearApprox,
        title: `${c.name} born`,
        kind: "child",
        personSlug: c.slug,
        place: c.birth.place,
      });
    }
  });
  (person.businessSlugs ?? []).forEach((slug) => {
    const b = getBusiness(slug);
    if (b?.established) {
      events.push({
        year: b.established,
        title: `${b.name} opens`,
        kind: "business",
        businessSlug: b.slug,
        place: b.city,
      });
    }
  });
  if (person.death?.year) {
    events.push({
      year: person.death.year,
      title: "Passed away",
      kind: "death",
      place: person.death.place,
    });
  }
  events.sort((a, b) => a.year - b.year);
  return events;
}

export function getPlacesForPerson(person: Person): Place[] {
  return places.filter((pl) => pl.personSlugs.includes(person.slug));
}

export function getAdjacentInGeneration(person: Person): {
  prev?: Person;
  next?: Person;
} {
  if (person.generation == null) return {};
  const cohort = people
    .filter((p) => p.generation === person.generation)
    .sort((a, b) => a.name.localeCompare(b.name));
  const idx = cohort.findIndex((p) => p.slug === person.slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? cohort[idx - 1] : undefined,
    next: idx < cohort.length - 1 ? cohort[idx + 1] : undefined,
  };
}
