# Roadmap

Deferred work, noted here so it's not lost. Not yet implemented.

## Tree page — bleeding-edge rebuild

Rebuild the `/family-tree` renderer with a 2026-native stack. Estimated ~6
hours; drops ~300 lines of current hand-rolled math.

- **Layout:** `d3-hierarchy` Reingold–Tilford tidy-tree (better sibling
  alignment for family trees than dagre's general-DAG layout). 5 kB.
- **Render:** keep plain SVG — no framework rendering layer.
- **Interaction:** replace hand-rolled pan/zoom with **`panzoom`** by
  @anvaka (4 kB, handles pinch + inertia + boundaries).
- **Card → person-page transition:** wrap with React 19.2's
  `<ViewTransition>` so the tree smoothly morphs into the person page
  on click. No animation code needed.
- **Lineage highlight on hover:** **CSS Anchor Positioning API** (Safari
  17.4+, Chrome 125+). Native tooltip/popover anchored to the card
  showing the lineage path back to the viewer. Replaces any Floating-UI
  dependency.

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
- **13. Dark mode** — parchment palette has an obvious dark variant.
