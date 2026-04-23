import { people, getPerson } from "@/data/people";
import type { Person } from "@/data/types";
import { getSiblings } from "@/lib/person-derivations";

export type RelationEdge = "parent" | "child" | "spouse" | "sibling";

type AdjEntry = { to: string; kind: RelationEdge };

function buildAdjacency(): Map<string, AdjEntry[]> {
  const adj = new Map<string, AdjEntry[]>();
  const add = (from: string, to: string, kind: RelationEdge) => {
    const list = adj.get(from) ?? [];
    if (!list.some((e) => e.to === to && e.kind === kind)) {
      list.push({ to, kind });
      adj.set(from, list);
    }
  };
  for (const p of people) {
    if (p.parents?.father) {
      add(p.slug, p.parents.father, "parent");
      add(p.parents.father, p.slug, "child");
    }
    if (p.parents?.mother) {
      add(p.slug, p.parents.mother, "parent");
      add(p.parents.mother, p.slug, "child");
    }
    if (p.spouse) {
      add(p.slug, p.spouse.slug, "spouse");
      add(p.spouse.slug, p.slug, "spouse");
    }
    for (const sib of getSiblings(p)) {
      add(p.slug, sib.slug, "sibling");
    }
  }
  return adj;
}

let adjacency: Map<string, AdjEntry[]> | null = null;
function adj() {
  if (!adjacency) adjacency = buildAdjacency();
  return adjacency;
}

export type PathStep = {
  person: Person;
  edgeFromPrev?: RelationEdge;
};

export function findRelationshipPath(
  fromSlug: string,
  toSlug: string,
): PathStep[] | null {
  if (fromSlug === toSlug) {
    const p = getPerson(fromSlug);
    return p ? [{ person: p }] : null;
  }
  const graph = adj();
  const prev = new Map<string, { from: string; kind: RelationEdge }>();
  const queue: string[] = [fromSlug];
  const visited = new Set<string>([fromSlug]);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === toSlug) break;
    for (const edge of graph.get(cur) ?? []) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      prev.set(edge.to, { from: cur, kind: edge.kind });
      queue.push(edge.to);
    }
  }
  if (!prev.has(toSlug)) return null;
  const chain: { slug: string; kind?: RelationEdge }[] = [];
  let curSlug = toSlug;
  while (curSlug !== fromSlug) {
    const step = prev.get(curSlug);
    if (!step) return null;
    chain.push({ slug: curSlug, kind: step.kind });
    curSlug = step.from;
  }
  chain.push({ slug: fromSlug });
  chain.reverse();
  const steps: PathStep[] = [];
  for (const c of chain) {
    const person = getPerson(c.slug);
    if (!person) continue;
    const step: PathStep = { person };
    if (c.kind) step.edgeFromPrev = c.kind;
    steps.push(step);
  }
  return steps;
}

export function describeStep(
  from: Person,
  edge: RelationEdge,
  to: Person,
  firstPerson: boolean,
): string {
  const subject = firstPerson ? "your" : `${from.name.split(" ")[0]}'s`;
  const role = roleLabel(edge, to.sex);
  return `${subject} ${role} ${to.name}`;
}

function roleLabel(edge: RelationEdge, sex: Person["sex"]): string {
  switch (edge) {
    case "parent":
      return sex === "F" ? "mother" : sex === "M" ? "father" : "parent";
    case "child":
      return sex === "F" ? "daughter" : sex === "M" ? "son" : "child";
    case "spouse":
      return sex === "F" ? "wife" : sex === "M" ? "husband" : "spouse";
    case "sibling":
      return sex === "F" ? "sister" : sex === "M" ? "brother" : "sibling";
  }
}

export function summarizeRelation(
  path: PathStep[],
  viewerIsFirst: boolean,
): string {
  if (path.length <= 1) return "The same person.";
  const parts: string[] = [];
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1].person;
    const cur = path[i];
    if (!cur.edgeFromPrev) continue;
    parts.push(
      describeStep(prev, cur.edgeFromPrev, cur.person, viewerIsFirst && i === 1),
    );
  }
  return parts.join(" → ");
}
