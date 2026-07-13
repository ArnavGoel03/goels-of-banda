# Memory merge: recipes, traditions and memories move here from Kin

Decided 2026-07-13.

## Why

Kin is the private vault: passports, Aadhaar, medical records. Recipes, festival
customs and the stories old people tell are not private documents. They are the
family's shared history, and they belong on the family history site, next to the
people they came from.

Kin's memory layer (recipes / traditions / stories / a second family tree) was
built but never used: every one of those tables held zero rows. So this is a
capability move, not a data migration. Nothing is lost.

## What moves

From Kin, this repo gains the capture layer that made those features worth
having:

- **Voice notes.** A recipe in a grandmother's own voice, recorded on a phone in
  the kitchen, is the whole point. `MediaCapture` (in-browser `MediaRecorder`)
  comes across.
- **Photos** on every entry.
- **Contributor attribution** linked to a real person, not a free-text name.
- **Phone-first add sheets** so anyone in the family can submit in two minutes.

Kin keeps documents, people, key dates, the emergency card, health reminders and
chat archives. Its `/recipes`, `/traditions`, `/stories` and `/tree` routes and
their four tables are deleted. Kin's tree was empty and duplicated the real
dagre tree that already lives here.

## Shape here

The site stays static and public for readers. Contribution is the only
authenticated surface, and nothing a contributor submits is public until it is
approved.

| Route | Source | Access |
| --- | --- | --- |
| `/recipes`, `/recipes/[slug]` | DB, published only | public, statically cached |
| `/traditions`, `/traditions/[slug]` | DB, published only | public, statically cached |
| `/memories`, `/memories/[slug]` | DB, published only | public, statically cached |
| `/stories`, `/stories/[slug]` | `src/data/stories.ts`, unchanged | public, static |
| `/contribute/new` | writes DB as `pending` | any signed-in family member |
| `/admin/review` | approve / reject | admin email allowlist, fail-closed |

`stories` stays hand-authored: those are the sourced, long-form history pieces,
and they should keep their citation discipline. Contributed anecdotes are a
different thing and live at `/memories` ("in their own words"), with fuzzy dates
("sometime in the 60s") because forcing a real date just gets it left blank.

Entries link to people by the existing `people.ts` slug, so a person's page
shows their recipes, their customs and their voice.

## Rules this merge follows

- Media goes to Cloudflare R2, never Vercel Blob. The existing
  `admin/upload` Blob path is replaced in the same pass.
- Public pages do no per-request auth or DB reads: they prerender and are
  revalidated on publish, so reading the site stays edge-fast.
- Admin allowlist is env-only and fails closed when unset.
- Uploads are authenticated, size-capped, type-sniffed and rate-limited.
