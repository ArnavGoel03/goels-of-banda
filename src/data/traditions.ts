import type { Tradition } from "./types";

// Recipes, festivals, rituals, and family sayings that get passed down.
// Add entries here whenever an older relative dictates one. Attribute
// each tradition to the specific person who carries it so the site
// stays as much a record of *people* as of culture.
export const traditions: Tradition[] = [];

export const traditionsBySlug: Record<string, Tradition> = Object.fromEntries(
  traditions.map((t) => [t.slug, t]),
);

export function getTradition(slug: string): Tradition | undefined {
  return traditionsBySlug[slug];
}

export function getTraditionsFor(personSlug: string): Tradition[] {
  return traditions.filter((t) => t.personSlugs?.includes(personSlug));
}
