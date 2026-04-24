"use client";

import dynamic from "next/dynamic";
import type { Person } from "@/data/types";

const TreeFlowView = dynamic(
  () => import("./TreeFlowView").then((m) => m.TreeFlowView),
  {
    ssr: false,
    loading: () => (
      <div className="h-[85vh] flex items-center justify-center rounded-lg border border-ink-100 bg-parchment-dark text-sm text-ink-500">
        Loading tree…
      </div>
    ),
  },
);

export function TreeFlowLoader({ peopleList }: { peopleList: Person[] }) {
  return <TreeFlowView peopleList={peopleList} />;
}
