# Stack upgrade and tree repair, 18 September 2026

Source acceptance passes; production is paused. PR:
https://github.com/ArnavGoel03/goels-of-banda/pull/1
Certified source: `bc33363a01a9ba466402c2915f1c41226076ed1a`.

## Versions and migration

Next and @next/mdx 16.3.5; React/DOM/types 19.3.0; native TypeScript 7.0.2 via
`@typescript/native`, real API compatibility via `typescript` alias to
`@typescript/typescript6@6.0.2`; Node types 26.6.1; Tailwind/PostCSS 4.3.3;
Sentry 10.75.0; Playwright 1.63.0; unpatched Dagre 3.1.1. Registry versions
and compatibility were checked. pnpm and its lockfile remain canonical.
The deprecated Edge runtime on opengraph-image was replaced with supported
Node/static rendering; the resulting 1200x630 image was inspected.

CI uses verified stable checkout 7.0.1, setup-node 7.0.0, upload-artifact 7.0.1
and pnpm/action-setup 6.1.0 to remove obsolete Node 20 action-runtime warnings.
Application tooling runs on Node 24 with pnpm 12.4.2.

## Reproduced defect and repair

Old source `a33aca9` and the initial upgraded source both crashed in Dagre's
translateGraph with `Cannot read properties of undefined (reading 'forEach')`.
The five smoke scenarios initially checked only the server-rendered tree heading
and could pass before hydration failed. Run 35273153555 strengthened that check
and confirmed 8 passes, 2 failures: both desktop and phone tree views crashed.

Unpatched Dagre 3.1.1 alone reproduces the same fault. A narrow intermediate-point
translation patch removes the crash but does not enforce shared ranks: minlen 0
is only a lower bound, so the founding brothers can still occupy different rows.
That experimental dependency patch was discarded. No dependency patch ships.

The repair contracts connected spouse pairs and the already-recorded founding
brothers into layout groups sized for their original cards. Dagre lays out these
groups using the existing generation anchors and parent constraints; collapsed
parallel constraints retain the sum of their weights. The output expands each
group into adjacent individual cards on the same row. Original relationship
edges, person order, card dimensions and family data are retained. No relation is
invented or removed, and no arbitrary rank offsets or fallback hides an error.

## Verification

- Five layout regression cases pass: spouse/child ranks, founding brothers,
  one-sided spouse references and disconnected people, complete family layout,
  and empty input. The unchanged old implementation fails four of these cases,
  calibrating the regression. Full data: 74 finite, non-overlapping cards,
  109 relationship edges; every parent above child, every spouse pair and the
  founding brothers on the same row.
- Native TS7, frozen install and optimized build pass. No project lint script
  exists. Upstream install deprecations are not suppressed.
- [Run 35284163900](https://github.com/ArnavGoel03/goels-of-banda/actions/runs/35284163900)
  passed all 10 browser cases in 8.5s, plus five layout cases and production build.
- [Final run 35284464677](https://github.com/ArnavGoel03/goels-of-banda/actions/runs/35284464677)
  passes all 10 browser cases in 8.0s and compiles the production build in 13.5s
  after the CI action-runtime update. No application
  source changed between these two runs.
- Desktop Chromium and Pixel 7 tests wait for the dynamic application, reject
  uncaught page errors, verify Zoom and Fit scale restoration, click a visible
  tree card and assert its destination. Home, people, person and stories also pass.
- Four opened screenshots are retained: `quality/stack-upgrade-2026-09-18/`
  contains `chromium-tree.png`, `mobile-chromium-tree.png` and corresponding
  `*-card-navigation.png`. The fitted tree retains the existing wide canvas;
  phone users can pan/zoom or use the existing people-list alternative. The
  existing desktop header wraps its brand; no unrelated layout rewrite occurred.

## Publication limits

Live recheck: goels-of-banda.vercel.app returns 503 `DEPLOYMENT_PAUSED`;
goelsofbanda.com does not resolve. No billing, pause, budget, database or hosting
settings were changed. Source verification does not establish a deployed release.
Restore provider/domain availability, then verify the deployed upgrade.
Authenticated contribution/moderation/uploads and physical-device checks remain
separate obligations; auth and persisted data behavior were not changed here.
