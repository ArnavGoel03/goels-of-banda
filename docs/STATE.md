# Web stack verified, production paused, 18 September 2026

[PR 1](https://github.com/ArnavGoel03/goels-of-banda/pull/1) upgrades Next/MDX to
16.3.5, React/DOM to 19.3.0, Tailwind/PostCSS to 4.3.3, native TypeScript to
7.0.2 (with the real TS6 API package), Sentry to 10.75.0 and Dagre to 3.1.1.

The inherited dynamic family-tree crash is fixed by contracting same-rank spouse
and founding-sibling groups before layout, then restoring individual cards and
relationship lines. All 74 people and 109 relationships remain; spouses and the
founding brothers share rows, parents remain above children, and cards do not
overlap. Generation anchors and summed constraint weights are preserved. No
public copy, family data, auth behavior, rank offsets or suppression was added.

Certified source `bc33363a01a9ba466402c2915f1c41226076ed1a` passes frozen install,
5 layout regressions, native TS7, optimized build and all 10 hosted desktop/phone
browser checks, including Zoom, Fit restoration and actual tree-card navigation:
[final CI 35284464677](https://github.com/ArnavGoel03/goels-of-banda/actions/runs/35284464677).
The regression suite rejects the old source in 4 of 5 cases. Fitted tree and
navigation screenshots from the identical app source in run 35284163900 were
opened and retained under `docs/quality/stack-upgrade-2026-09-18/`.

Production remains HTTP 503 `DEPLOYMENT_PAUSED`; goelsofbanda.com still fails DNS.
No budget, hosting pause, billing, database or deployment setting changed.
A successful live upgrade is not claimed. Restore existing provider/domain
availability, then verify the deployed source. Authenticated contribution,
moderation, uploads and physical-device acceptance remain separate obligations;
this repair touches none of those flows. No lint script is configured.

See [STACK_UPGRADE_2026-09-18.md](STACK_UPGRADE_2026-09-18.md) for the original
failure, exact fix, version compatibility and retained evidence.
