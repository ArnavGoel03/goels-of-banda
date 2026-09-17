# Stack upgrade candidate, 18 September 2026

Branch: `chore/stack-upgrade-20260918`. Isolated worktree; original main checkout
preserved. Candidate only, not merged or deployed.

## Versions

- `next`: `16.3.5`
- `react`: `19.3.0`
- `react-dom`: `19.3.0`
- `@typescript/native`: `npm:typescript@7.0.2`
- `typescript`: `npm:@typescript/typescript6@6.0.2`
- `@types/react`: `19.3.0`
- `@types/react-dom`: `19.3.0`
- `@types/node`: `26.6.1`
- `tailwindcss`: `4.3.3`
- `@tailwindcss/postcss`: `4.3.3`
- `@next/mdx`: `16.3.5`
- `@sentry/nextjs`: `10.75.0`
- `@playwright/test`: `^1.63.0`

Stable versions verified against the npm registry. TypeScript 7 is the explicit
native CLI; the real TS6 compatibility package remains for programmatic consumers.
No peer requirement, lint rule or build/type gate was suppressed. ESLint 9.39.5 is
retained where configured because Next current plugins do not support ESLint 10;
it has an upstream support deprecation, so installation is not warning-free.

## Changes and verification

Align @next/mdx16.3.5 and Sentry10.75.0; Playwright 1.63.0. Remove deprecated Edge runtime from the top-level image route, using supported Node/static rendering without changing its image content.

TypeScript 7 typecheck and optimized build pass (5.9s final compilation). No lint script is configured. Playwright 1.63.0 runs the five smoke scenarios on desktop and phone in hosted CI; overall acceptance fails on the dynamic family-tree crash detailed below.

Built home, people, family-tree return HTTP 200 HTML; opengraph-image returns HTTP 200 image/png. The generated 1200x630 image was opened and visually inspected, with content fitting the image.

Custom domain goelsofbanda.com did not resolve; the known Vercel alias remains 503 DEPLOYMENT_PAUSED. Authenticated contribution, moderation and uploads were not exercised.

## Publication and outstanding acceptance

Known production Vercel URL rechecked: HTTP 503 `DEPLOYMENT_PAUSED`.
No billing, plan or deployment settings were changed. Browser runtime setup and
its documented discovery returned no connected browser. HTTP/build checks do not
certify rendered layout, keyboard interaction, hydration or real-device behavior.
Complete that acceptance and the project-specific outstanding checks before
merging. Restore provider availability through the existing owner flow, then
verify the deployed upgrade. Draft PR and exact commit are indexed in Atlas
`docs/stack-upgrades-2026-09-18/sites-extra.md`.

## Hosted browser acceptance follow-up

Public GitHub Actions now runs the five existing smoke scenarios on desktop
Chromium and Pixel 7, captures screenshots, and asserts no uncaught page errors.
Frozen install, TS7 and optimized build passed in both hosted runs.
Run [35272341613](https://github.com/ArnavGoel03/goels-of-banda/actions/runs/35272341613)
returned six passes and four stale title/story assertion failures. The expected
strings were corrected against unchanged main source; no public copy changed.
Run [35272667990](https://github.com/ArnavGoel03/goels-of-banda/actions/runs/35272667990)
then returned nine passes and one tree page-error failure. Both tree screenshots
show the global error boundary, revealing that the old heading-only assertion
could pass before the dynamic tree crashed. The tree check now also waits for
its application region and exercises Fit to view, so that race cannot pass.

The remaining error is `Cannot read properties of undefined (reading 'forEach')`
in Dagre translateGraph, where an edge lacks points. It reproduces without a
browser by calling computeLayout with the existing people data. Main has the same
layout source/data and Dagre 3.0.0 lock. A registry-verified Dagre 3.1.1 experiment
reproduced the identical error and was reverted; the candidate retains 3.0.0.
No suppression, fallback or family-rank redesign was introduced. Reproduce with:

```sh
pnpm exec tsx -e 'import {computeLayout} from "./src/components/tree-flow/computeLayout"; import {people} from "./src/data/people"; computeLayout(people)'
```

Desktop and phone screenshots of home, people, person, stories and tree were
opened. Public content renders; the tree fails after hydration, so overall browser
acceptance fails and this remains a draft. The desktop header compresses its
brand onto multiple lines; no visual polish pass is claimed. Resolve the layout
failure while preserving family relationships, rerun these checks, and verify
contribution/moderation/uploads before merge. Production remains paused and the
custom domain does not resolve. No deployed upgrade is claimed.
