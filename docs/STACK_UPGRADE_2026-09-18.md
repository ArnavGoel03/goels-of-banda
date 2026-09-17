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

TypeScript 7 typecheck and optimized build pass (5.9s final compilation). No lint script is configured. Playwright 1.63.0 discovers all 5 existing smoke tests; browser execution is blocked by unavailable browser access.

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
