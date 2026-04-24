import { hierarchy, tree, type HierarchyPointNode } from "d3-hierarchy";
import type { Person } from "@/data/types";

export const CARD_WIDTH = 170;
export const CARD_HEIGHT = 74;

const H_SEP = CARD_WIDTH + 34;
const V_SEP = CARD_HEIGHT + 86;
const SPOUSE_GAP = 44;

export type LayoutNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutEdge = {
  id: string;
  source: string;
  target: string;
  kind: "parent-child" | "spouse";
};

type UnitNode = {
  primarySlug: string;
  spouseSlug?: string;
  children: UnitNode[];
};

// Find roots: people with no in-dataset father. Order by generation so
// the oldest family in the dataset lays out first.
function findRoots(people: Person[]): Person[] {
  const bySlug = new Map(people.map((p) => [p.slug, p]));
  const roots: Person[] = [];
  for (const p of people) {
    const father = p.parents?.father;
    if (!father || !bySlug.has(father)) roots.push(p);
  }
  return roots.sort(
    (a, b) => (a.generation ?? 0) - (b.generation ?? 0) || a.slug.localeCompare(b.slug),
  );
}

// Build a unit (person + spouse) tree rooted at `slug`, skipping anyone
// already placed in an earlier tree.
function buildUnitTree(
  slug: string,
  bySlug: Map<string, Person>,
  placed: Set<string>,
): UnitNode | null {
  if (placed.has(slug)) return null;
  const p = bySlug.get(slug);
  if (!p) return null;
  placed.add(slug);

  const spouseSlug =
    p.spouse?.slug && bySlug.has(p.spouse.slug) && !placed.has(p.spouse.slug)
      ? p.spouse.slug
      : undefined;
  if (spouseSlug) placed.add(spouseSlug);

  const kidSlugs = new Set<string>();
  for (const c of p.children ?? []) if (bySlug.has(c) && !placed.has(c)) kidSlugs.add(c);
  if (spouseSlug) {
    const sp = bySlug.get(spouseSlug);
    for (const c of sp?.children ?? []) if (bySlug.has(c) && !placed.has(c)) kidSlugs.add(c);
  }

  const children: UnitNode[] = [];
  for (const cSlug of kidSlugs) {
    const child = buildUnitTree(cSlug, bySlug, placed);
    if (child) children.push(child);
  }
  return { primarySlug: slug, spouseSlug, children };
}

function layoutUnit(unit: UnitNode, baseDepth: number): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  minX: number;
  maxX: number;
} {
  const rootHier = hierarchy<UnitNode>(unit, (d) => d.children);
  const layoutFn = tree<UnitNode>()
    .nodeSize([H_SEP * 2 + SPOUSE_GAP, V_SEP])
    .separation((a, b) => {
      const aWide = Boolean(a.data.spouseSlug);
      const bWide = Boolean(b.data.spouseSlug);
      return a.parent === b.parent ? (aWide || bWide ? 1.05 : 0.78) : 1.3;
    });
  const laid: HierarchyPointNode<UnitNode> = layoutFn(rootHier);

  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const seen = new Set<string>();
  let minX = Infinity;
  let maxX = -Infinity;

  function emit(slug: string, x: number, y: number) {
    if (seen.has(slug)) return;
    seen.add(slug);
    nodes.push({ id: slug, x, y, width: CARD_WIDTH, height: CARD_HEIGHT });
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + CARD_WIDTH);
  }

  laid.each((n) => {
    const cx = n.x;
    const cy = (baseDepth + n.depth) * V_SEP;
    const { primarySlug, spouseSlug } = n.data;
    if (spouseSlug) {
      emit(primarySlug, cx - CARD_WIDTH - SPOUSE_GAP / 2, cy);
      emit(spouseSlug, cx + SPOUSE_GAP / 2, cy);
      edges.push({
        id: `spouse-${[primarySlug, spouseSlug].sort().join("::")}`,
        source: primarySlug,
        target: spouseSlug,
        kind: "spouse",
      });
    } else {
      emit(primarySlug, cx - CARD_WIDTH / 2, cy);
    }

    for (const child of n.children ?? []) {
      const childPrimary = child.data.primarySlug;
      edges.push({
        id: `e-${primarySlug}-${childPrimary}`,
        source: primarySlug,
        target: childPrimary,
        kind: "parent-child",
      });
    }
  });

  if (!isFinite(minX)) {
    minX = 0;
    maxX = 0;
  }
  return { nodes, edges, minX, maxX };
}

export function computeLayout(people: Person[]): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  const bySlug = new Map(people.map((p) => [p.slug, p]));
  const placed = new Set<string>();
  const roots = findRoots(people);

  // Primary root is the deepest-into-the-past Goel direct line.
  const primaryRoot = roots.find((r) => r.slug === "gondilal-goel") ?? roots[0];
  if (!primaryRoot) return { nodes: [], edges: [] };

  const minGen = Math.min(...people.map((p) => p.generation ?? 0));

  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  let runningOffsetX = 0;
  const GUTTER = 120;

  function placeTree(root: Person) {
    const unit = buildUnitTree(root.slug, bySlug, placed);
    if (!unit) return;
    const baseDepth = (root.generation ?? 0) - minGen;
    const laid = layoutUnit(unit, baseDepth);
    const shift = runningOffsetX - laid.minX;
    for (const n of laid.nodes) nodes.push({ ...n, x: n.x + shift });
    for (const e of laid.edges) edges.push(e);
    runningOffsetX += (laid.maxX - laid.minX) + GUTTER;
  }

  placeTree(primaryRoot);
  for (const r of roots) {
    if (r === primaryRoot) continue;
    if (placed.has(r.slug)) continue;
    placeTree(r);
  }

  // Any stragglers placed as a final column on the right.
  const stragglers = people.filter((p) => !placed.has(p.slug));
  for (const p of stragglers) {
    const depth = (p.generation ?? 0) - minGen;
    nodes.push({
      id: p.slug,
      x: runningOffsetX,
      y: depth * V_SEP,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    });
    placed.add(p.slug);
    runningOffsetX += CARD_WIDTH + 24;
  }

  return { nodes, edges };
}
