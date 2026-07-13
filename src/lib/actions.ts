"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin, requireContributor } from "./auth";
import { requireDb } from "@/db";
import { memories, recipes, traditions } from "@/db/schema";
import { peopleBySlug } from "@/data/people";
import { placesBySlug } from "@/data/places";
import { parseFuzzyDate } from "./fuzzydate";
import { deleteObject } from "./r2";
import { KIND_PATH, TABLES, uniqueSlug, type ContributionKind } from "./contributions";
import { rateLimit } from "./ratelimit";

// A submitted person link must name someone who actually exists in the repo's
// genealogy. Anything else is dropped rather than stored, so a person page can
// never end up linking to a person who is not there.
const knownPeople = (slugs: string[] | undefined) =>
  (slugs ?? []).filter((s) => Boolean(peopleBySlug[s]));
const knownPlaces = (slugs: string[] | undefined) =>
  (slugs ?? []).filter((s) => Boolean(placesBySlug[s]));

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");

const baseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  toldBy: z.string().trim().max(80).optional(),
  toldBySlug: z.string().trim().max(80).optional(),
  personSlugs: z.array(z.string()).max(20).optional(),
  placeSlugs: z.array(z.string()).max(10).optional(),
  tags: z.array(z.string().trim().max(30)).max(10).optional(),
  photoKey: z.string().max(200).nullable().optional(),
  audioKey: z.string().max(200).nullable().optional(),
  audioTranscript: z.string().trim().max(8000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const recipeSchema = baseSchema.extend({
  summary: z.string().trim().max(300).optional(),
  ingredients: z.string().trim().min(1).max(4000),
  steps: z.string().trim().min(1).max(8000),
  occasion: z.string().trim().max(80).optional(),
});

const traditionSchema = baseSchema.extend({
  kind: z.enum(["festival", "ritual", "saying", "custom"]).default("custom"),
  summary: z.string().trim().max(300).optional(),
  body: z.string().trim().min(1).max(8000),
  occasion: z.string().trim().max(80).optional(),
});

const memorySchema = baseSchema.extend({
  body: z.string().trim().min(1).max(20000),
  occurredOn: z.string().trim().max(60).optional(),
});

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Anyone signed in may submit; nothing they submit is public. The entry lands as
 * `pending` and waits for a human. Rate-limited so an open sign-up page cannot
 * be turned into a flood of moderation work.
 */
export async function submitContribution(
  kind: ContributionKind,
  input: unknown,
): Promise<SubmitResult> {
  let contributor;
  try {
    contributor = await requireContributor();
  } catch {
    return { ok: false, error: "Sign in to contribute." };
  }

  const allowed = await rateLimit(`submit:${contributor.userId}`, 20, 60 * 60 * 1000);
  if (!allowed) {
    return { ok: false, error: "That is a lot of contributions at once. Try again in an hour." };
  }

  const schema =
    kind === "recipe" ? recipeSchema : kind === "tradition" ? traditionSchema : memorySchema;
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  const v = parsed.data;

  // Credit survives the link being dropped later: store the display name too.
  const toldBySlug = v.toldBySlug && peopleBySlug[v.toldBySlug] ? v.toldBySlug : null;
  const toldBy =
    v.toldBy?.trim() ||
    (toldBySlug ? peopleBySlug[toldBySlug].name : null) ||
    contributor.name;

  const common = {
    title: v.title,
    status: "pending" as const,
    personSlugs: knownPeople(v.personSlugs),
    placeSlugs: knownPlaces(v.placeSlugs),
    toldBy,
    toldBySlug,
    tags: v.tags ?? [],
    photoKey: v.photoKey ?? null,
    audioKey: v.audioKey ?? null,
    audioTranscript: v.audioTranscript || null,
    notes: v.notes || null,
    submittedBy: contributor.userId,
    submittedByEmail: contributor.email,
  };

  const client = requireDb();
  if (kind === "recipe") {
    const r = parsed.data as z.infer<typeof recipeSchema>;
    await client.insert(recipes).values({
      ...common,
      summary: r.summary || null,
      ingredients: lines(r.ingredients),
      steps: lines(r.steps),
      occasion: r.occasion || null,
    });
  } else if (kind === "tradition") {
    const t = parsed.data as z.infer<typeof traditionSchema>;
    await client.insert(traditions).values({
      ...common,
      kind: t.kind,
      summary: t.summary || null,
      body: t.body,
      occasion: t.occasion || null,
    });
  } else {
    const m = parsed.data as z.infer<typeof memorySchema>;
    const fuzzy = parseFuzzyDate(m.occurredOn);
    await client.insert(memories).values({
      ...common,
      body: m.body,
      occurredOn: m.occurredOn || null,
      occurredYear: fuzzy?.year ?? null,
      occurredMonth: fuzzy?.month ?? null,
      occurredDay: fuzzy?.day ?? null,
      occurredCirca: fuzzy?.circa ?? false,
    });
  }

  revalidatePath("/admin/review");
  return { ok: true };
}

/** Everywhere a published entry can appear, so a publish shows up immediately. */
async function revalidateFor(
  kind: ContributionKind,
  slug: string | null,
  personSlugs: string[] | null,
  toldBySlug: string | null,
) {
  const base = KIND_PATH[kind];
  revalidatePath(base);
  if (slug) revalidatePath(`${base}/${slug}`);
  revalidatePath("/admin/review");
  revalidatePath("/");
  for (const p of new Set([...(personSlugs ?? []), ...(toldBySlug ? [toldBySlug] : [])])) {
    revalidatePath(`/people/${p}`);
  }
}

/** Admin only: make it public, and give it its permanent URL. */
export async function publishContribution(
  kind: ContributionKind,
  id: string,
): Promise<SubmitResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Not allowed." };
  }

  const client = requireDb();
  const table = TABLES[kind];
  const [row] = await client.select().from(table).where(eq(table.id, id)).limit(1);
  if (!row) return { ok: false, error: "That entry is gone." };

  // Keep the slug it was published under before, so a URL that has been shared
  // never breaks if an entry is unpublished and published again.
  const slug = row.slug ?? (await uniqueSlug(kind, row.title));

  await client
    .update(table)
    .set({
      slug,
      status: "published",
      reviewedBy: admin.userId,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(table.id, id));

  await revalidateFor(kind, slug, row.personSlugs, row.toldBySlug);
  return { ok: true };
}

/** Admin only: keep the row (so the contributor is not re-prompted) but hide it. */
export async function rejectContribution(
  kind: ContributionKind,
  id: string,
): Promise<SubmitResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Not allowed." };
  }

  const client = requireDb();
  const table = TABLES[kind];
  const [row] = await client.select().from(table).where(eq(table.id, id)).limit(1);
  if (!row) return { ok: false, error: "That entry is gone." };

  await client
    .update(table)
    .set({
      status: "rejected",
      reviewedBy: admin.userId,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(table.id, id));

  await revalidateFor(kind, row.slug, row.personSlugs, row.toldBySlug);
  return { ok: true };
}

/** Admin only: remove the entry and its media for good. */
export async function deleteContribution(
  kind: ContributionKind,
  id: string,
): Promise<SubmitResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not allowed." };
  }

  const client = requireDb();
  const table = TABLES[kind];
  const [row] = await client.select().from(table).where(eq(table.id, id)).limit(1);
  if (!row) return { ok: true };

  await client.delete(table).where(eq(table.id, id));
  // Best effort: a stranded object costs a fraction of a cent, a failed delete
  // that blocks the admin costs them the will to moderate.
  for (const key of [row.photoKey, row.audioKey]) {
    if (!key) continue;
    try {
      await deleteObject(key);
    } catch {
      // ignore
    }
  }

  await revalidateFor(kind, row.slug, row.personSlugs, row.toldBySlug);
  return { ok: true };
}
