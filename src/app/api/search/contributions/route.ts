import { NextResponse } from "next/server";
import { listMemories, listRecipes, listTraditions } from "@/lib/contributions";
import type { SearchItem } from "@/lib/search-index";

// The static half of the search index (people, businesses, places) ships in the
// client bundle. Contributed entries live in the database, so the palette pulls
// them from here the first time it opens. That keeps every public page static
// and CDN-cacheable: nothing on the render path touches Postgres.
export const revalidate = 300;

export async function GET() {
  const [recipes, traditions, memories] = await Promise.all([
    listRecipes(),
    listTraditions(),
    listMemories(),
  ]);

  const items: SearchItem[] = [
    ...recipes.map((r) => ({
      kind: "recipe" as const,
      slug: r.slug!,
      name: r.title,
      subtitle: r.toldBy ? `Told by ${r.toldBy}` : undefined,
      href: `/recipes/${r.slug}`,
      haystack: [r.title, r.summary, r.occasion, r.toldBy, r.ingredients, r.steps]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    })),
    ...traditions.map((t) => ({
      kind: "tradition" as const,
      slug: t.slug!,
      name: t.title,
      subtitle: t.occasion ?? (t.toldBy ? `Told by ${t.toldBy}` : undefined),
      href: `/traditions/${t.slug}`,
      haystack: [t.title, t.summary, t.body, t.occasion, t.toldBy]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    })),
    ...memories.map((m) => ({
      kind: "memory" as const,
      slug: m.slug!,
      name: m.title,
      subtitle:
        [m.occurredOn, m.toldBy && `remembered by ${m.toldBy}`]
          .filter(Boolean)
          .join(" · ") || undefined,
      href: `/memories/${m.slug}`,
      haystack: [m.title, m.body, m.occurredOn, m.toldBy]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    })),
  ];

  return NextResponse.json(items, {
    headers: {
      "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
