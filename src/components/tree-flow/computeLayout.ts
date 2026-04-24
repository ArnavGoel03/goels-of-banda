import dagre from "@dagrejs/dagre";
import type { Person } from "@/data/types";

export const CARD_WIDTH = 170;
export const CARD_HEIGHT = 74;

const NODE_SEP = 22;
const RANK_SEP = 96;

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

function rankOf(p: Person): number {
  if (p.generation !== undefined) return p.generation;
  return 3;
}

// Dagre-based layout. Family trees aren't strict trees — every person
// has up to two parents, and cross-marriages link otherwise-separate
// lineages (e.g. Richa's Agarwal parents → Richa ↔ Rohit ← RK's Goel
// line). Dagre handles this natively: we declare rank anchors per
// generation so everyone lines up horizontally, then add parent-child
// and spouse edges with weights that pull the graph into shape.
export function computeLayout(people: Person[]): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  const bySlug = new Map(people.map((p) => [p.slug, p]));
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    nodesep: NODE_SEP,
    ranksep: RANK_SEP,
    marginx: 24,
    marginy: 24,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // One zero-width anchor per generation, chained vertically, so dagre
  // never promotes a childless node out of its rank.
  const rankAnchors = new Map<number, string>();
  const uniqueRanks = new Set(people.map(rankOf));
  uniqueRanks.forEach((r) => {
    const anchorId = `__rank-${r}__`;
    rankAnchors.set(r, anchorId);
    g.setNode(anchorId, { width: 1, height: 1 });
  });

  for (const p of people) {
    g.setNode(p.slug, { width: CARD_WIDTH, height: CARD_HEIGHT });
  }

  const sortedRanks = [...uniqueRanks].sort((a, b) => a - b);
  for (let i = 1; i < sortedRanks.length; i++) {
    g.setEdge(
      rankAnchors.get(sortedRanks[i - 1])!,
      rankAnchors.get(sortedRanks[i])!,
      { weight: 0.1 },
    );
  }

  // Pin each person to their rank anchor with a weightless edge so
  // they sit in their generation without polluting x-ordering much.
  for (const p of people) {
    g.setEdge(rankAnchors.get(rankOf(p))!, p.slug, { weight: 0.5 });
  }

  const edges: LayoutEdge[] = [];

  for (const p of people) {
    const father = p.parents?.father;
    const mother = p.parents?.mother;
    if (father && bySlug.has(father)) {
      g.setEdge(father, p.slug, { weight: 5 });
      edges.push({
        id: `e-${father}-${p.slug}-f`,
        source: father,
        target: p.slug,
        kind: "parent-child",
      });
    }
    if (mother && bySlug.has(mother)) {
      g.setEdge(mother, p.slug, { weight: 5 });
      edges.push({
        id: `e-${mother}-${p.slug}-m`,
        source: mother,
        target: p.slug,
        kind: "parent-child",
      });
    }
  }

  const seenSpousePairs = new Set<string>();
  for (const p of people) {
    if (!p.spouse) continue;
    if (!bySlug.has(p.spouse.slug)) continue;
    const key = [p.slug, p.spouse.slug].sort().join("::");
    if (seenSpousePairs.has(key)) continue;
    seenSpousePairs.add(key);
    g.setEdge(p.slug, p.spouse.slug, { weight: 2, minlen: 0 });
    edges.push({
      id: `spouse-${key}`,
      source: p.slug,
      target: p.spouse.slug,
      kind: "spouse",
    });
  }

  // Known-siblings hint: Gondilal and Ganesh Prasad were brothers but
  // we don't have their father recorded. A zero-length edge between
  // them keeps them adjacent at the top of the graph. Not rendered.
  if (bySlug.has("gondilal-goel") && bySlug.has("ganesh-prasad-goel")) {
    g.setEdge("gondilal-goel", "ganesh-prasad-goel", { weight: 3, minlen: 0 });
  }

  dagre.layout(g);

  const nodes: LayoutNode[] = [];
  for (const p of people) {
    const n = g.node(p.slug);
    if (!n) continue;
    nodes.push({
      id: p.slug,
      x: n.x - CARD_WIDTH / 2,
      y: n.y - CARD_HEIGHT / 2,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    });
  }

  return { nodes, edges };
}
