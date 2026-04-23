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

1. **Easiest** — Open an issue with the correction or addition
2. **Direct** — Email the family
3. **Technical** — Fork this repo, edit `src/data/people.ts` (or `businesses.ts`, `places.ts`, `faq.ts`), open a pull request

The canonical data model is in `src/data/types.ts`.

## Running locally

```bash
npm install
npm run dev
# visit http://localhost:3000
```

## Deploy

Push to `main`. Vercel (or any static-capable host) builds and deploys on every push.

## License

Family history is not property. Everything on this site — facts, structured data, text — is freely usable with attribution. The code is MIT-licensed.
