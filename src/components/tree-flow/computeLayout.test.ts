import assert from "node:assert/strict";
import { test } from "node:test";
import { people } from "../../data/people";
import type { Person } from "../../data/types";
import { computeLayout, CARD_WIDTH, CARD_HEIGHT } from "./computeLayout";

const person = (slug: string, extra: Partial<Person> = {}): Person => ({
  slug, name: slug, sex: "U", isLiving: true, bio: "", generation: 0, ...extra,
});

test("spouses occupy one rank, with their child below both parents", () => {
  const input = [
    person("a", { spouse: { slug: "b" } }),
    person("b", { spouse: { slug: "a" } }),
    person("c", { generation: 1, parents: { father: "a", mother: "b" } }),
  ];
  const { nodes: [a, b, c], edges } = computeLayout(input);
  assert.equal(a.y, b.y);
  assert.ok(Math.abs(a.x - b.x) >= CARD_WIDTH);
  assert.ok(c.y > a.y + CARD_HEIGHT);
  assert.equal(edges.filter((e) => e.kind === "spouse").length, 1);
  assert.equal(edges.filter((e) => e.kind === "parent-child").length, 2);
});

test("founding brothers remain adjacent on the same rank without an invented relationship", () => {
  const { nodes: [a, b], edges } = computeLayout([
    person("gondilal-goel"), person("ganesh-prasad-goel"),
  ]);
  assert.equal(a.y, b.y);
  assert.ok(Math.abs(a.x - b.x) >= CARD_WIDTH);
  assert.equal(edges.length, 0);
});

test("one-sided spouse references and disconnected people preserve every card", () => {
  const { nodes, edges } = computeLayout([
    person("a", { spouse: { slug: "b" } }), person("alone"), person("b"),
    person("unknown-spouse", { spouse: { slug: "absent" } }),
  ]);
  assert.deepEqual(nodes.map((n) => n.id), ["a", "alone", "b", "unknown-spouse"]);
  assert.equal(nodes[0].y, nodes[2].y);
  assert.equal(edges.length, 1);
});

test("the complete family retains finite non-overlapping cards and all relationship edges", () => {
  const { nodes, edges } = computeLayout(people);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  assert.equal(nodes.length, 74);
  assert.equal(edges.length, 109);
  assert.deepEqual(nodes.map((n) => n.id), people.map((p) => p.slug));
  for (const n of nodes) {
    assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y));
    assert.equal(n.width, CARD_WIDTH);
    assert.equal(n.height, CARD_HEIGHT);
  }
  for (const edge of edges) {
    const from = byId.get(edge.source)!;
    const to = byId.get(edge.target)!;
    if (edge.kind === "spouse") assert.equal(from.y, to.y);
    else assert.ok(from.y + CARD_HEIGHT < to.y);
  }
  assert.equal(byId.get("gondilal-goel")!.y, byId.get("ganesh-prasad-goel")!.y);
  for (let i = 0; i < nodes.length; i++) {
    for (const b of nodes.slice(i + 1)) {
      const a = nodes[i];
      assert.ok(Math.abs(a.x - b.x) >= CARD_WIDTH || Math.abs(a.y - b.y) >= CARD_HEIGHT);
    }
  }
});

test("empty input has no synthetic cards or relationships", () => {
  assert.deepEqual(computeLayout([]), { nodes: [], edges: [] });
});
