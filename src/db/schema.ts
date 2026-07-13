import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Everything a family member contributes lands here as "pending" and is invisible
// to the public site until an admin publishes it. `status` is the only thing
// standing between a stranger's sign-up and goelsofbanda.com, so every public
// read filters on it.
export const CONTRIBUTION_STATUSES = ["pending", "published", "rejected"] as const;
export type ContributionStatus = (typeof CONTRIBUTION_STATUSES)[number];

// Columns every contributed entry shares: who sent it, who it came from, what it
// looks and sounds like, and whether it is public yet.
const contributionColumns = {
  id: uuid("id").defaultRandom().primaryKey(),
  // URL slug, unique per table. Assigned at publish time from the title, so a
  // pending entry can be retitled without burning a slug.
  slug: text("slug"),
  title: text("title").notNull(),
  status: text("status").notNull().default("pending"),

  // The people this entry belongs to, as slugs from src/data/people.ts. Text
  // rather than a foreign key: people are hand-authored in the repo, not rows.
  personSlugs: text("person_slugs").array(),
  placeSlugs: text("place_slugs").array(),

  // Attribution. `toldBy` is a display-name snapshot so credit survives even if
  // the person is later renamed or the slug link is dropped; `toldBySlug` is the
  // live link, set when the source is someone already on the site.
  toldBy: text("told_by"),
  toldBySlug: text("told_by_slug"),

  tags: text("tags").array(),
  photoKey: text("photo_key"), // R2 object key
  audioKey: text("audio_key"), // R2 object key: the entry in the teller's own voice
  audioTranscript: text("audio_transcript"),
  notes: text("notes"),

  // Clerk identity of the contributor, kept for moderation, never shown publicly.
  submittedBy: text("submitted_by").notNull(),
  submittedByEmail: text("submitted_by_email"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// A dish, in the words of whoever cooks it. Ingredients and steps are one per
// line rather than arrays: a phone keyboard should never have to fight a
// repeater UI while an 80-year-old is talking.
export const recipes = pgTable(
  "recipes",
  {
    ...contributionColumns,
    summary: text("summary"),
    ingredients: text("ingredients").notNull(),
    steps: text("steps").notNull(),
    occasion: text("occasion"), // "Diwali", "every winter", "when someone is ill"
  },
  (t) => [
    index("recipes_status_idx").on(t.status),
    uniqueIndex("recipes_slug_idx").on(t.slug),
  ],
);

// A custom, ritual, festival practice or saying: "no nail cutting on Tuesdays",
// "touch elders' feet on Diwali morning", a phrase only one grandmother uses.
export const traditions = pgTable(
  "traditions",
  {
    ...contributionColumns,
    kind: text("kind").notNull().default("custom"), // festival | ritual | saying | custom
    summary: text("summary"),
    body: text("body").notNull(),
    occasion: text("occasion"),
  },
  (t) => [
    index("traditions_status_idx").on(t.status),
    uniqueIndex("traditions_slug_idx").on(t.slug),
  ],
);

// An anecdote: how two people met, a house that is gone now, what Banda looked
// like in 1962. Distinct from src/data/stories.ts, which holds the sourced,
// hand-authored history essays; these are told, not researched.
export const memories = pgTable(
  "memories",
  {
    ...contributionColumns,
    body: text("body").notNull(),
    // Free text, because most family history has no exact date ("sometime in the
    // 60s", "before I was born"). Forcing a date column just gets it left blank.
    occurredOn: text("occurred_on"),
    // Parsed from occurredOn at write time, so memories can sort chronologically
    // and surface on their anniversary without re-parsing on every read.
    occurredYear: integer("occurred_year"),
    occurredMonth: integer("occurred_month"),
    occurredDay: integer("occurred_day"),
    occurredCirca: boolean("occurred_circa").notNull().default(false),
  },
  (t) => [
    index("memories_status_idx").on(t.status),
    index("memories_year_idx").on(t.occurredYear),
    uniqueIndex("memories_slug_idx").on(t.slug),
  ],
);

export type Recipe = typeof recipes.$inferSelect;
export type Tradition = typeof traditions.$inferSelect;
export type Memory = typeof memories.$inferSelect;
