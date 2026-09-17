# Tree repair acceptance in progress, 18 September 2026

The stack candidate now uses stable unpatched Dagre 3.1.1 and contracts explicit
spouse/founding-sibling same-rank relations before layout. Individual cards,
relationship edges, generation anchors and summed constraint weights are retained.
Five calibrated layout regression cases and native TS7 pass; hosted desktop/phone
Zoom, Fit and card-navigation acceptance is pending. No merge or deployment yet.

# Stack upgrade candidate, 18 September 2026

The isolated `chore/stack-upgrade-20260918` branch upgrades Next to 16.3.5,
React/DOM to 19.3.0 and the explicit compiler CLI to stable TypeScript 7.0.2,
retaining the real TS6 compatibility API. It is not merged or deployed.

TypeScript 7 typecheck and optimized build pass (5.9s final compilation). No lint script is configured. Playwright 1.63.0 runs the five smoke scenarios on desktop and phone in hosted CI; overall acceptance fails on the dynamic family-tree crash detailed below.

Built home, people, family-tree return HTTP 200 HTML; opengraph-image returns HTTP 200 image/png. The generated 1200x630 image was opened and visually inspected, with content fitting the image.

Production is currently 503 DEPLOYMENT_PAUSED. Rendered/browser acceptance and
provider availability remain outstanding; no successful live upgrade is claimed.
See [STACK_UPGRADE_2026-09-18.md](STACK_UPGRADE_2026-09-18.md) for exact versions,
changes, limits and required follow-up.


## Hosted browser acceptance follow-up

Public GitHub Actions now runs the five existing smoke scenarios on desktop
Chromium and Pixel 7, captures screenshots, and asserts no uncaught page errors.
Frozen install, TS7 and optimized build passed in all three hosted runs.
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

Final run [35273153555](https://github.com/ArnavGoel03/goels-of-banda/actions/runs/35273153555)
completed on tested source `05fb2d9761b32e453b150334b9615b539555073e`:
frozen install, native TS7 and optimized build passed; browser checks returned
8 passed and 2 failed in 19.0s. Both desktop and Pixel 7 tree tests failed while
waiting 5s for the dynamic application region, with the same uncaught Dagre
`forEach` error. The Fit to view click is not reached. The other four routes
pass on both viewports. This final result replaces the earlier timing-dependent
9/10 result and confirms that the strengthened test detects both broken views.

Source evidence: baseline `a33aca9c167190a5930b1b8b5353568a3eced60a` has no diff
in `src/components/tree-flow/computeLayout.ts` or `src/data/people.ts` versus
the tested candidate, and both lock Dagre 3.0.0. The direct layout reproducer
above fails independently of Next/React rendering. The upgrade remains a draft;
fixing this baseline defect and the stated live/authenticated acceptance remain
outstanding. This receipt update changes documentation only; the tested source
and failed acceptance have not changed.
