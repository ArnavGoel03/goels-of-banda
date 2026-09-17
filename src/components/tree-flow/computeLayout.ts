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

// Contract same-rank relations before layout, then expand each group back into
// individual cards. Dagre minlen: 0 is only a lower bound, not rank equality,
// and its same-rank edge routing can fail before endpoints are assigned.
export function computeLayout(people: Person[]): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  const bySlug = new Map(people.map((p) => [p.slug, p]));
  if (people.length === 0) return { nodes: [], edges: [] };

  const representative = new Map(people.map((p) => [p.slug, p.slug]));
  const groupOf = (slug: string): string => {
    const parent = representative.get(slug)!;
    if (parent === slug) return slug;
    const root = groupOf(parent);
    representative.set(slug, root);
    return root;
  };
  const join = (a: string, b: string) => {
    if (bySlug.has(a) && bySlug.has(b)) {
      representative.set(groupOf(b), groupOf(a));
    }
  };
  for (const p of people) {
    if (p.spouse) join(p.slug, p.spouse.slug);
  }
  // The founding brothers have no recorded parent but share a generation.
  join("gondilal-goel", "ganesh-prasad-goel");

  const groups = new Map<string, Person[]>();
  for (const p of people) {
    const id = groupOf(p.slug);
    const members = groups.get(id) ?? [];
    members.push(p);
    groups.set(id, members);
  }

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    nodesep: NODE_SEP,
    ranksep: RANK_SEP,
    marginx: 24,
    marginy: 24,
  });
  g.setDefaultEdgeLabel(() => ({}));
  const addConstraint = (from: string, to: string, weight: number) => {
    // Parallel constraints can collapse onto one group edge; preserve their sum.
    g.setEdge(from, to, { weight: (g.edge(from, to)?.weight ?? 0) + weight });
  };

  // Retain the generation anchors and their vertical ordering.
  const rankAnchors = new Map<number, string>();
  const uniqueRanks = new Set(people.map(rankOf));
  uniqueRanks.forEach((r) => {
    const anchorId = `__rank-${r}__`;
    rankAnchors.set(r, anchorId);
    g.setNode(anchorId, { width: 1, height: 1 });
  });

  for (const [id, members] of groups) {
    g.setNode(id, {
      width: members.length * CARD_WIDTH + (members.length - 1) * NODE_SEP,
      height: CARD_HEIGHT,
    });
  }

  const sortedRanks = [...uniqueRanks].sort((a, b) => a - b);
  for (let i = 1; i < sortedRanks.length; i++) {
    g.setEdge(
      rankAnchors.get(sortedRanks[i - 1])!,
      rankAnchors.get(sortedRanks[i])!,
      { weight: 0.1 },
    );
  }

  // Attach each group to its existing generation anchor with a light edge.
  for (const p of people) {
    addConstraint(rankAnchors.get(rankOf(p))!, groupOf(p.slug), 0.5);
  }

  const edges: LayoutEdge[] = [];

  for (const p of people) {
    const father = p.parents?.father;
    const mother = p.parents?.mother;
    if (father && bySlug.has(father)) {
      addConstraint(groupOf(father), groupOf(p.slug), 5);
      edges.push({
        id: `e-${father}-${p.slug}-f`,
        source: father,
        target: p.slug,
        kind: "parent-child",
      });
    }
    if (mother && bySlug.has(mother)) {
      addConstraint(groupOf(mother), groupOf(p.slug), 5);
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
    edges.push({
      id: `spouse-${key}`,
      source: p.slug,
      target: p.spouse.slug,
      kind: "spouse",
    });
  }

  dagre.layout(g);

  const positions = new Map<string, LayoutNode>();
  for (const [id, members] of groups) {
    const n = g.node(id);
    members.forEach((p, index) => {
      positions.set(p.slug, {
        id: p.slug,
        x: n.x - n.width / 2 + index * (CARD_WIDTH + NODE_SEP),
        y: n.y - CARD_HEIGHT / 2,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      });
    });
  }
  const nodes = people.map((p) => positions.get(p.slug)!);

  return { nodes, edges };
}
