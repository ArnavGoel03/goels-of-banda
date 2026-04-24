"use client";

import { useEffect, useState, type RefObject } from "react";
import { people } from "@/data/people";

const GENS = [
  { value: "all", label: "All generations" },
  { value: "1", label: "Gen 1 · founders (~1820s)" },
  { value: "2", label: "Gen 5 · grandparents" },
  { value: "3", label: "Gen 6 · parents" },
  { value: "4", label: "Gen 7 · cousins" },
  { value: "5", label: "Gen 8 · newborn" },
] as const;

export function TreeFilters({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [gen, setGen] = useState<string>("all");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>("[data-slug]");
    if (gen === "all") {
      cards.forEach((card) => {
        card.style.opacity = "";
      });
      return;
    }
    const target = Number(gen);
    const genBySlug = new Map<string, number | undefined>(
      people.map((p) => [p.slug, visibleGen(p.generation)]),
    );
    cards.forEach((card) => {
      const slug = card.dataset.slug ?? "";
      const personGen = genBySlug.get(slug);
      card.style.opacity = personGen === target ? "1" : "0.15";
    });
  }, [gen, containerRef]);

  return (
    <div className="absolute left-3 top-14 z-10 flex items-center gap-2 rounded-md border border-ink-100 bg-parchment/95 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500">Gen</span>
      <select
        value={gen}
        onChange={(e) => setGen(e.target.value)}
        className="bg-transparent text-sm text-ink-900 focus:outline-none"
        aria-label="Filter tree by generation"
      >
        {GENS.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Collapse the internal generation numbers (1..8, with gaps) to the
// five visible tiers the tree renders.
function visibleGen(g?: number): number | undefined {
  if (g === undefined) return undefined;
  if (g === 1) return 1;
  if (g === 2) return 2;
  if (g === 3) return 3;
  if (g === 4) return 4;
  if (g >= 5) return 5;
  return undefined;
}
