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

export function scoreItem(item: SearchItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const name = item.name.toLowerCase();
  if (name === q) return 1000;
  if (name.startsWith(q)) return 500;
  if (name.includes(q)) return 250;
  // word-boundary in name
  if (new RegExp(`\\b${escapeRegex(q)}`, "i").test(item.name)) return 150;
  if (item.haystack.includes(q)) return 50;
  return 0;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function searchItems(
  index: SearchItem[],
  query: string,
  limit = 20,
): SearchItem[] {
  if (!query.trim()) return [];
  return index
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
