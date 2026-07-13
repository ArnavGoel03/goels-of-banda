import { and, arrayContains, desc, eq, isNotNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { memories, recipes, traditions } from "@/db/schema";
import { fuzzySortKey } from "./fuzzydate";

export type ContributionKind = "recipe" | "tradition" | "memory";

export const TABLES = { recipe: recipes, tradition: traditions, memory: memories } as const;

/** Where a contribution of each kind is read on the public site. */
export const KIND_PATH: Record<ContributionKind, string> = {
  recipe: "/recipes",
  tradition: "/traditions",
  memory: "/memories",
};

export const KIND_LABEL: Record<ContributionKind, string> = {
  recipe: "Recipe",
  tradition: "Tradition",
  memory: "Memory",
};

/** Public URL for a photo or voice note. Served by us, cached by the CDN. */
export function mediaUrl(key: string | null | undefined): string | null {
  return key ? `/api/media/${key}` : null;
}

// Published rows only. Every public read goes through one of these, so a pending
// or rejected submission can never leak onto the site by being linked directly.
const published = (table: (typeof TABLES)[ContributionKind]) =>
  and(eq(table.status, "published"), isNotNull(table.slug));

export async function listRecipes() {
  const client = db();
  if (!client) return [];
  return client
    .select()
    .from(recipes)
    .where(published(recipes))
    .orderBy(desc(recipes.reviewedAt));
}

export async function listTraditions() {
  const client = db();
  if (!client) return [];
  return client
    .select()
    .from(traditions)
    .where(published(traditions))
    .orderBy(desc(traditions.reviewedAt));
}

/** Memories read best oldest-first: they are a family's chronology, not a feed. */
export async function listMemories() {
  const client = db();
  if (!client) return [];
  const rows = await client.select().from(memories).where(published(memories));
  return rows.sort(
    (a, b) =>
      fuzzySortKey(
        a.occurredYear
          ? { year: a.occurredYear, month: a.occurredMonth, day: a.occurredDay }
          : null,
      ) -
      fuzzySortKey(
        b.occurredYear
          ? { year: b.occurredYear, month: b.occurredMonth, day: b.occurredDay }
          : null,
      ),
  );
}

export async function getRecipe(slug: string) {
  const client = db();
  if (!client) return null;
  const [row] = await client
    .select()
    .from(recipes)
    .where(and(eq(recipes.slug, slug), eq(recipes.status, "published")))
    .limit(1);
  return row ?? null;
}

export async function getTradition(slug: string) {
  const client = db();
  if (!client) return null;
  const [row] = await client
    .select()
    .from(traditions)
    .where(and(eq(traditions.slug, slug), eq(traditions.status, "published")))
    .limit(1);
  return row ?? null;
}

export async function getMemory(slug: string) {
  const client = db();
  if (!client) return null;
  const [row] = await client
    .select()
    .from(memories)
    .where(and(eq(memories.slug, slug), eq(memories.status, "published")))
    .limit(1);
  return row ?? null;
}

/**
 * Everything a person carries: what they cook, what they keep, what they
 * remember. This is the payoff of linking contributions to people.ts slugs,
 * a person's page becomes the sum of what they passed down.
 */
export async function contributionsForPerson(personSlug: string) {
  const client = db();
  if (!client) return { recipes: [], traditions: [], memories: [] };

  // Either the person is credited as the teller, or they are tagged in it.
  const belongsTo = (table: (typeof TABLES)[ContributionKind]) =>
    and(
      published(table),
      or(
        eq(table.toldBySlug, personSlug),
        arrayContains(table.personSlugs, [personSlug]),
      ),
    );

  const [r, t, m] = await Promise.all([
    client.select().from(recipes).where(belongsTo(recipes)),
    client.select().from(traditions).where(belongsTo(traditions)),
    client.select().from(memories).where(belongsTo(memories)),
  ]);
  return { recipes: r, traditions: t, memories: m };
}

/** The moderation queue: what is waiting on a decision, oldest first. */
export async function listPending() {
  const client = db();
  if (!client) return { recipes: [], traditions: [], memories: [] };
  const [r, t, m] = await Promise.all([
    client.select().from(recipes).where(eq(recipes.status, "pending")).orderBy(recipes.submittedAt),
    client.select().from(traditions).where(eq(traditions.status, "pending")).orderBy(traditions.submittedAt),
    client.select().from(memories).where(eq(memories.status, "pending")).orderBy(memories.submittedAt),
  ]);
  return { recipes: r, traditions: t, memories: m };
}

/**
 * True only if the key belongs to an entry that is actually published. The media
 * route calls this before streaming bytes, so an unapproved photo cannot be
 * fetched by anyone who knows (or guesses) its key.
 */
export async function isPublishedMediaKey(key: string): Promise<boolean> {
  const client = db();
  if (!client) return false;
  const match = (table: (typeof TABLES)[ContributionKind]) =>
    client
      .select({ one: sql<number>`1` })
      .from(table)
      .where(
        and(
          eq(table.status, "published"),
          or(eq(table.photoKey, key), eq(table.audioKey, key)),
        ),
      )
      .limit(1);

  const [r, t, m] = await Promise.all([match(recipes), match(traditions), match(memories)]);
  return r.length > 0 || t.length > 0 || m.length > 0;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    // strip combining accents left behind by NFKD (Devanagari-transliterated names)
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

/**
 * A slug nobody else in the table holds. Two grandmothers may each contribute a
 * "Besan Ladoo"; the second becomes besan-ladoo-2 rather than silently failing
 * the unique index or, worse, overwriting the first.
 */
export async function uniqueSlug(kind: ContributionKind, title: string): Promise<string> {
  const client = db();
  const table = TABLES[kind];
  const base = slugify(title) || kind;
  if (!client) return base;

  const taken = new Set(
    (
      await client
        .select({ slug: table.slug })
        .from(table)
        .where(sql`${table.slug} like ${base + "%"}`)
    )
      .map((r) => r.slug)
      .filter((s): s is string => Boolean(s)),
  );
  if (!taken.has(base)) return base;
  for (let i = 2; i < 500; i++) {
    if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}
