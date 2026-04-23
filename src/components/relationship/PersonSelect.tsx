"use client";

import { useMemo } from "react";
import { people } from "@/data/people";

export function PersonSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
}) {
  const groups = useMemo(() => groupByGeneration(), []);

  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-medium">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-ink-200 bg-parchment px-3 py-2 text-sm text-ink-900 focus:border-accent-400 focus:outline-none"
      >
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.people.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
                {p.altNames?.[0] ? ` (${p.altNames[0]})` : ""}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function groupByGeneration() {
  const byGen = new Map<number, typeof people>();
  const ungrouped: typeof people = [];
  for (const p of people) {
    if (p.generation == null) ungrouped.push(p);
    else {
      const list = byGen.get(p.generation) ?? [];
      list.push(p);
      byGen.set(p.generation, list);
    }
  }
  const generations = Array.from(byGen.keys()).sort((a, b) => a - b);
  const groups = generations.map((g) => ({
    label: `Generation ${g}`,
    people: (byGen.get(g) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
  }));
  if (ungrouped.length > 0) {
    groups.push({
      label: "Other",
      people: ungrouped.sort((a, b) => a.name.localeCompare(b.name)),
    });
  }
  return groups;
}
