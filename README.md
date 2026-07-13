# goels-of-banda

**A living family history of the Goel family of Banda, Uttar Pradesh.**

Six generations. Four continents. Six active family jewellery shops in one Indian town. All rooted in Banda, Uttar Pradesh since the 1820s.

[Live site](https://goelsofbanda.com) · [Contribute](https://goelsofbanda.com/contribute)

---

## What this is

A statically-rendered Next.js site that renders a structured JSON representation of the Goel family into:

- individual pages for each person (with full JSON-LD `Person` schema for Google knowledge-panel candidacy)
- pages for each family-connected business (`Organization` schema)
- a zoomable/pannable visual family tree
- `/faq` with `FAQPage` schema (for AI answer-engine citation)
- `sitemap.xml`, `robots.txt`, `llms.txt`, and `/.well-known/security.txt`

All family data lives in `src/data/` as typed TypeScript constants. Every change is a git commit; every deployment is preserved in the hosting platform's deployment history.

## How to contribute

See [`/contribute`](https://goelsofbanda.com/contribute) on the live site. In short:

1. **Easiest** - Open an issue with the correction or addition
2. **Direct** - Email the family
3. **Technical** - Fork this repo, edit `src/data/people.ts` (or `businesses.ts`, `places.ts`, `faq.ts`), open a pull request

The canonical data model is in `src/data/types.ts`.

## The memory layer

Facts about people are hand-authored in `src/data/`. What people *pass down* is
not: recipes, customs and remembered anecdotes are submitted by the family and
live in Postgres.

| Route | Source | Access |
| --- | --- | --- |
| `/recipes`, `/traditions`, `/memories` | database, published rows only | public, prerendered |
| `/contribute/new` | writes a `pending` row | any signed-in family member |
| `/admin/review` | publish or reject | admin email allowlist, fails closed |

Nothing a contributor submits is visible anywhere until it is published, photos
and voice notes included: the media route refuses a key whose entry is still
pending. Reading the site touches neither the database nor auth, so public pages
stay static and CDN-served; publishing revalidates the pages an entry belongs to,
including the people it credits.

The point of the whole thing is the voice notes. A recipe in a grandmother's own
voice, recorded on a phone in the kitchen, is worth more than one typed from
memory after she is gone. See [`docs/MEMORY_MERGE.md`](docs/MEMORY_MERGE.md).

## Running locally

```bash
pnpm install
vercel env pull            # DATABASE_URL and friends
pnpm dev                   # visit http://localhost:3000
```

The site builds and serves with no services configured at all: without
`DATABASE_URL` the contributed sections are simply empty, and without Clerk or R2
the contribute flow says it is not set up rather than crashing. Only the
contribution half needs services.

### Services

| Service | What for | How it is provisioned |
| --- | --- | --- |
| Neon Postgres | contributed entries | Vercel marketplace, already wired |
| Cloudflare R2 (bucket `goels-of-banda`) | photos, voice notes | bucket exists; S3 token is dashboard-only |
| Clerk | who may submit and who may publish | dashboard-only |

R2 and Clerk have no CLI to mint credentials, so fill in `.env.services` (copy
`.env.services.example`) and run `./scripts/set-vercel-env.sh` to push them to
all three Vercel environments.

The R2 token must be scoped to the `goels-of-banda` bucket alone. A wider token
would let this public site's credentials read the private document vault, which
is exactly the thing this split exists to prevent.

Database changes:

```bash
pnpm db:generate           # write a migration from src/db/schema.ts
pnpm db:migrate            # apply it
```

## Deploy

Push to `main`. Vercel builds and deploys on every push.

## License

Family history is not property. Everything on this site - facts, structured data, text - is freely usable with attribution. The code is MIT-licensed.
