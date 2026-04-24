# Roadmap

Deferred work, noted here so it's not lost. Not yet implemented.

## Tree page — what stuck vs. what didn't

Shipped:
- **`panzoom`** by @anvaka replaced our hand-rolled pan/zoom math.
- **View Transitions API** — each card and the PersonHero share
  `view-transition-name: person-<slug>`, so Chrome 111+ / Safari 18+
  smoothly morph card → hero on click.

Tried and reverted:
- ~~**d3-hierarchy tidy-tree layout**~~ — the algorithm assumes a strict
  tree (one parent per node). Real family trees are DAGs with cross-
  marriages (Richa's Agarwal parents on one side, Rohit's Goel line on
  the other, married to each other) — which meant the maternal and
  paternal sides rendered as disconnected islands under d3. Reverted to
  dagre, which handles multi-parent + spouse edges natively via rank
  anchors.

Still to do:
- **Lineage highlight on hover:** CSS Anchor Positioning API (Safari
  17.4+, Chrome 125+). Native tooltip/popover anchored to the card
  showing the lineage path back to the viewer.

## React 19.2 features to adopt

- **React Compiler** (stable in 19.2) — auto-memoises every component.
  Drop every manual `useMemo` / `useCallback` once enabled.
- **CSS `@starting-style` + `interpolate-size`** — smooth in-animations
  on focus/hover (person cards, search results, modals) without any JS
  animation library.
- **Popover API** (`popover` attribute, GA in all browsers) — native
  tooltips for card details on hover, replacing any JS-managed
  open-state.

## Other deferred ideas

See earlier discussion; these are the ones *not* in the initial ship
pass (2, 3, 11, 13 of the 14-item menu):

- **2. Memorial pages** — distinct layout for non-living ancestors with
  life-event timeline + embedded audio clips.
- **3. Oral history audio** — 2–5 min recordings from older relatives,
  embedded `<audio>` + transcript.
- **11. Printable tree PDF** — one-click high-res export of the current
  tree view.
- ~~**13. Dark mode**~~ — tried, reverted by user preference. The site is
  locked to the light parchment palette via `color-scheme: light only`.
