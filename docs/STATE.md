# Stack upgrade candidate, 18 September 2026

The isolated `chore/stack-upgrade-20260918` branch upgrades Next to 16.3.5,
React/DOM to 19.3.0 and the explicit compiler CLI to stable TypeScript 7.0.2,
retaining the real TS6 compatibility API. It is not merged or deployed.

TypeScript 7 typecheck and optimized build pass (5.9s final compilation). No lint script is configured. Playwright 1.63.0 discovers all 5 existing smoke tests; browser execution is blocked by unavailable browser access.

Built home, people, family-tree return HTTP 200 HTML; opengraph-image returns HTTP 200 image/png. The generated 1200x630 image was opened and visually inspected, with content fitting the image.

Production is currently 503 DEPLOYMENT_PAUSED. Rendered/browser acceptance and
provider availability remain outstanding; no successful live upgrade is claimed.
See [STACK_UPGRADE_2026-09-18.md](STACK_UPGRADE_2026-09-18.md) for exact versions,
changes, limits and required follow-up.

