"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { people } from "@/data/people";

type Box = {
  cx: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Edge = {
  kind: "parent-child" | "spouse";
  path: string;
  bridge: boolean;
  endX: number;
  endY: number;
};

export function ConnectorsLayer({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const scale = cRect.width / container.offsetWidth || 1;

      const cards = container.querySelectorAll<HTMLElement>("[data-slug]");
      const pos = new Map<string, Box>();
      cards.forEach((el) => {
        const slug = el.dataset.slug;
        if (!slug || slug === "#") return;
        const r = el.getBoundingClientRect();
        pos.set(slug, {
          cx: (r.left + r.width / 2 - cRect.left) / scale,
          top: (r.top - cRect.top) / scale,
          bottom: (r.bottom - cRect.top) / scale,
          left: (r.left - cRect.left) / scale,
          right: (r.right - cRect.left) / scale,
        });
      });

      const result: Edge[] = [];
      for (const p of people) {
        const kid = pos.get(p.slug);
        if (!kid) continue;
        const f = p.parents?.father ? pos.get(p.parents.father) : undefined;
        const m = p.parents?.mother ? pos.get(p.parents.mother) : undefined;
        let fromCx: number | undefined;
        let fromY: number | undefined;
        if (f && m) {
          fromCx = (f.cx + m.cx) / 2;
          fromY = Math.max(f.bottom, m.bottom);
        } else if (f) {
          fromCx = f.cx;
          fromY = f.bottom;
        } else if (m) {
          fromCx = m.cx;
          fromY = m.bottom;
        }
        if (fromCx == null || fromY == null) continue;
        const toCx = kid.cx;
        const toY = kid.top;
        const midY = (fromY + toY) / 2;
        const d = `M ${fromCx} ${fromY} C ${fromCx} ${midY}, ${toCx} ${midY}, ${toCx} ${toY}`;
        const containerWidth = container.offsetWidth;
        const bridge = Math.abs(fromCx - toCx) > containerWidth * 0.35;
        result.push({
          kind: "parent-child",
          path: d,
          bridge,
          endX: toCx,
          endY: toY,
        });
      }

      setEdges(result);
      setSize({
        w: container.offsetWidth,
        h: container.offsetHeight,
      });
    };

    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", schedule);
    const t = window.setTimeout(schedule, 250);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  return (
    <svg
      width={size.w}
      height={size.h}
      className="absolute left-0 top-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <g>
        {edges.map((e, i) => (
          <g key={i}>
            <path
              d={e.path}
              fill="none"
              stroke={e.bridge ? "var(--color-accent-700)" : "var(--color-ink-300)"}
              strokeWidth={e.bridge ? 1.6 : 1.25}
              strokeLinecap="round"
              strokeDasharray={e.bridge ? "4 3" : undefined}
            />
            <circle
              cx={e.endX}
              cy={e.endY}
              r={e.bridge ? 3.5 : 0}
              fill="var(--color-accent-700)"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
