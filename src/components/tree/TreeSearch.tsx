"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { people } from "@/data/people";

export function TreeSearch({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const set = new Set<string>();
    for (const p of people) {
      const hay = [p.name, ...(p.altNames ?? [])]
        .join(" ")
        .toLowerCase();
      if (hay.includes(q)) set.add(p.slug);
    }
    return set;
  }, [query]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>("[data-slug]");
    cards.forEach((card) => {
      const slug = card.dataset.slug ?? "";
      if (!matches) {
        card.style.opacity = "";
        card.style.outline = "";
        card.style.outlineOffset = "";
      } else if (matches.has(slug)) {
        card.style.opacity = "1";
        card.style.outline = "2px solid var(--color-accent-700)";
        card.style.outlineOffset = "3px";
      } else {
        card.style.opacity = "0.2";
        card.style.outline = "";
        card.style.outlineOffset = "";
      }
    });
  }, [matches, containerRef]);

  return (
    <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-md border border-ink-100 bg-parchment/95 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="text-ink-400 text-sm" aria-hidden="true">
        ⌕
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find in tree…"
        className="w-40 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        aria-label="Search family tree"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="text-ink-400 hover:text-ink-700 text-sm"
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
      {matches ? (
        <span className="text-[10px] uppercase tracking-[0.12em] text-ink-500 pl-1 border-l border-ink-100 ml-1">
          {matches.size} match{matches.size === 1 ? "" : "es"}
        </span>
      ) : null}
    </div>
  );
}
