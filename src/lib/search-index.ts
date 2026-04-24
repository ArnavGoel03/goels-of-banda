import Fuse from "fuse.js";
import { people } from "@/data/people";
import { businesses } from "@/data/businesses";
import { places } from "@/data/places";

export type SearchItem = {
  kind: "person" | "business" | "place";
  slug: string;
  name: string;
  subtitle?: string;
  href: string;
  haystack: string;
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const p of people) {
    items.push({
      kind: "person",
      slug: p.slug,
      name: p.name,
      subtitle:
        p.familyRole ??
        p.currentLocation ??
        p.birth?.place ??
        (p.generation != null ? `Generation ${p.generation}` : undefined),
      href: `/people/${p.slug}`,
      haystack: [
        p.name,
        ...(p.altNames ?? []),
        p.familyRole,
        p.currentLocation,
        p.occupation,
        p.birth?.place,
        p.bio,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const b of businesses) {
    items.push({
      kind: "business",
      slug: b.slug,
      name: b.name,
      subtitle: `${b.kind} · ${b.city}`,
      href: `/businesses/${b.slug}`,
      haystack: [b.name, b.kind, b.city, b.state, b.country, b.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const pl of places) {
    items.push({
      kind: "place",
      slug: pl.slug,
      name: pl.name,
      subtitle: pl.connection.slice(0, 80),
      href: `/places#${pl.slug}`,
      haystack: [pl.name, pl.country, pl.connection].join(" ").toLowerCase(),
    });
  }

  return items;
}

let fuseCache: Fuse<SearchItem> | null = null;
let indexCache: SearchItem[] | null = null;

function getFuse(index: SearchItem[]): Fuse<SearchItem> {
  if (fuseCache && indexCache === index) return fuseCache;
  indexCache = index;
  fuseCache = new Fuse(index, {
    keys: [
      { name: "name", weight: 3 },
      { name: "subtitle", weight: 0.5 },
      { name: "haystack", weight: 1 },
    ],
    threshold: 0.34,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return fuseCache;
}

export function searchItems(
  index: SearchItem[],
  query: string,
  limit = 20,
): SearchItem[] {
  const q = query.trim();
  if (!q) return [];
  const fuse = getFuse(index);
  return fuse
    .search(q, { limit })
    .map((r) => r.item);
}
