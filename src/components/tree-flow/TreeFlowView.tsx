"use client";

import { useEffect, useMemo, useRef } from "react";
import panzoom, { type PanZoom } from "panzoom";
import type { Person } from "@/data/types";
import { computeAge } from "@/lib/schema";
import {
  computeLayout,
  CARD_WIDTH,
  CARD_HEIGHT,
  type LayoutNode,
  type LayoutEdge,
} from "./computeLayout";
import { PersonCard, type PersonCardData } from "./PersonCard";

const PADDING = 80;

type Placed = {
  node: LayoutNode;
  data: PersonCardData;
};

type EdgePath = {
  id: string;
  d: string;
  kind: "parent-child" | "spouse";
};

export function TreeFlowView({ peopleList }: { peopleList: Person[] }) {
  const { placed, edgePaths, bounds } = useMemo(
    () => buildRenderModel(peopleList),
    [peopleList],
  );

  const worldW = bounds.w + PADDING * 2;
  const worldH = bounds.h + PADDING * 2;

  const sceneRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pzRef = useRef<PanZoom | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const vp = viewportRef.current;
    if (!scene || !vp) return;

    const rect = vp.getBoundingClientRect();
    const zX = rect.width / worldW;
    const zY = rect.height / worldH;
    const initialZoom = Math.max(0.2, Math.min(1, Math.min(zX, zY)));
    const initialX = (rect.width - worldW * initialZoom) / 2;
    const initialY = (rect.height - worldH * initialZoom) / 2;

    const pz = panzoom(scene, {
      maxZoom: 2.4,
      minZoom: 0.15,
      initialX,
      initialY,
      initialZoom,
      smoothScroll: false,
      beforeMouseDown(e) {
        // Don't start a pan if the pointer is on a control or a card
        // link — those handle their own events.
        const t = e.target as HTMLElement | null;
        return Boolean(t?.closest("[data-draggable-skip]"));
      },
      filterKey() {
        return true;
      },
    });
    pzRef.current = pz;

    const onResize = () => {
      const r = vp.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const s = Math.max(
        0.2,
        Math.min(1, Math.min(r.width / worldW, r.height / worldH)),
      );
      pz.zoomAbs(0, 0, s);
      pz.moveTo((r.width - worldW * s) / 2, (r.height - worldH * s) / 2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      pz.dispose();
      pzRef.current = null;
    };
  }, [worldW, worldH]);

  const adjust = (delta: number) => {
    const pz = pzRef.current;
    const vp = viewportRef.current;
    if (!pz || !vp) return;
    const r = vp.getBoundingClientRect();
    pz.smoothZoom(r.width / 2, r.height / 2, 1 + delta);
  };

  const fit = () => {
    const pz = pzRef.current;
    const vp = viewportRef.current;
    if (!pz || !vp) return;
    const r = vp.getBoundingClientRect();
    const s = Math.max(
      0.2,
      Math.min(1, Math.min(r.width / worldW, r.height / worldH)),
    );
    pz.zoomAbs(0, 0, s);
    pz.moveTo((r.width - worldW * s) / 2, (r.height - worldH * s) / 2);
  };

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div
      ref={viewportRef}
      className="relative h-[85vh] rounded-lg border border-ink-100 bg-parchment-dark overflow-hidden select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-700/60"
      tabIndex={0}
      role="application"
      aria-label="Family tree. Drag to pan, pinch or Ctrl+scroll to zoom."
      data-tree-viewport
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(80,74,63,0.08) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div
        ref={sceneRef}
        style={{
          width: worldW,
          height: worldH,
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      >
        <svg
          width={worldW}
          height={worldH}
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <g transform={`translate(${-bounds.minX + PADDING}, ${-bounds.minY + PADDING})`}>
            {edgePaths.map((e) => (
              <path
                key={e.id}
                d={e.d}
                fill="none"
                stroke={
                  e.kind === "spouse"
                    ? "var(--color-accent-700)"
                    : "var(--color-ink-400)"
                }
                strokeWidth={e.kind === "spouse" ? 1.3 : 1.1}
                strokeDasharray={e.kind === "spouse" ? "4 3" : undefined}
                opacity={e.kind === "spouse" ? 0.85 : 0.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </svg>
        {placed.map((n) => (
          <div
            key={n.node.id}
            data-draggable-skip
            style={{
              position: "absolute",
              left: n.node.x - bounds.minX + PADDING,
              top: n.node.y - bounds.minY + PADDING,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              viewTransitionName: `person-${n.node.id}`,
            }}
          >
            <PersonCard data={n.data} />
          </div>
        ))}
      </div>

      <div
        data-draggable-skip
        className="absolute top-3 right-3 z-20 flex flex-col gap-1 rounded-md bg-parchment/95 border border-ink-100 shadow-sm backdrop-blur-sm print:hidden"
      >
        <button
          type="button"
          onClick={() => adjust(0.25)}
          className="px-3 py-1.5 text-sm text-ink-700 hover:text-accent-700 border-b border-ink-100"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => adjust(-0.2)}
          className="px-3 py-1.5 text-sm text-ink-700 hover:text-accent-700 border-b border-ink-100"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={fit}
          className="px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ink-600 hover:text-accent-700 border-b border-ink-100"
          aria-label="Fit to view"
        >
          fit
        </button>
        <button
          type="button"
          onClick={print}
          className="px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ink-600 hover:text-accent-700"
          aria-label="Print / save as PDF"
        >
          print
        </button>
      </div>

      <div
        data-draggable-skip
        className="absolute bottom-3 left-3 z-20 rounded-md bg-parchment/95 border border-ink-100 px-3 py-2 text-xs text-ink-600 shadow-sm backdrop-blur-sm pointer-events-none max-w-xs print:hidden"
      >
        <span className="font-medium text-ink-800">Tap</span> a card to open ·{" "}
        <span className="font-medium text-ink-800">Drag</span> to pan ·{" "}
        <span className="font-medium text-ink-800">Pinch</span> or{" "}
        <span className="font-medium text-ink-800">⌘/Ctrl + scroll</span> to zoom
      </div>
    </div>
  );
}

function buildRenderModel(peopleList: Person[]) {
  const layout = computeLayout(peopleList);
  const bySlug = new Map(peopleList.map((p) => [p.slug, p]));
  const posById = new Map(layout.nodes.map((n) => [n.id, n]));
  const now = new Date();

  const placed: Placed[] = layout.nodes.map((ln) => {
    const p = bySlug.get(ln.id)!;
    const isAditi = p.slug === "aditi-goel";
    const isPlaceholder = isPlaceholderPerson(p);
    const age = isPlaceholder ? undefined : computeAge(p, now);
    const ageLabel = age
      ? age.atDeath
        ? `aged ${age.years}`
        : `age ${age.years}`
      : undefined;
    return {
      node: ln,
      data: {
        slug: p.slug,
        name: p.name,
        alias: p.altNames?.[0],
        sub: isPlaceholder ? undefined : p.currentLocation ?? p.birth?.place,
        age: ageLabel,
        deceased: !p.isLiving && !isPlaceholder,
        newborn: p.slug === "raghav-goel",
        self: isAditi,
        placeholder: isPlaceholder,
        badge: isAditi ? "Future bride" : undefined,
      },
    };
  });

  const edgePaths = buildEdgePaths(layout.edges, posById);

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const n of placed) {
    if (n.node.x < minX) minX = n.node.x;
    if (n.node.y < minY) minY = n.node.y;
    if (n.node.x + CARD_WIDTH > maxX) maxX = n.node.x + CARD_WIDTH;
    if (n.node.y + CARD_HEIGHT > maxY) maxY = n.node.y + CARD_HEIGHT;
  }
  if (!isFinite(minX)) {
    minX = minY = 0;
    maxX = maxY = 0;
  }

  return {
    placed,
    edgePaths,
    bounds: { minX, minY, w: maxX - minX, h: maxY - minY },
  };
}

function buildEdgePaths(
  edges: LayoutEdge[],
  posById: Map<string, LayoutNode>,
): EdgePath[] {
  const out: EdgePath[] = [];
  const childrenByParent = new Map<string, string[]>();
  const spouse: LayoutEdge[] = [];
  for (const e of edges) {
    if (e.kind === "spouse") spouse.push(e);
    else {
      const arr = childrenByParent.get(e.source) ?? [];
      arr.push(e.target);
      childrenByParent.set(e.source, arr);
    }
  }

  for (const [parentSlug, childSlugs] of childrenByParent) {
    const parent = posById.get(parentSlug);
    if (!parent) continue;
    const kids = childSlugs
      .map((s) => posById.get(s))
      .filter((n): n is LayoutNode => Boolean(n));
    if (kids.length === 0) continue;
    const parentCx = parent.x + CARD_WIDTH / 2;
    const parentBottom = parent.y + CARD_HEIGHT;
    const busY = parentBottom + (kids[0].y - parentBottom) / 2;

    kids.sort((a, b) => a.x - b.x);
    const cxs = kids.map((k) => k.x + CARD_WIDTH / 2);
    const minCx = Math.min(...cxs, parentCx);
    const maxCx = Math.max(...cxs, parentCx);

    out.push({
      id: `stem-${parentSlug}`,
      kind: "parent-child",
      d: `M ${parentCx} ${parentBottom} L ${parentCx} ${busY}`,
    });
    if (kids.length > 1 || minCx !== parentCx) {
      out.push({
        id: `bus-${parentSlug}`,
        kind: "parent-child",
        d: `M ${minCx} ${busY} L ${maxCx} ${busY}`,
      });
    }
    for (const k of kids) {
      const cx = k.x + CARD_WIDTH / 2;
      out.push({
        id: `drop-${parentSlug}-${k.id}`,
        kind: "parent-child",
        d: `M ${cx} ${busY} L ${cx} ${k.y}`,
      });
    }
  }

  for (const e of spouse) {
    const a = posById.get(e.source);
    const b = posById.get(e.target);
    if (!a || !b) continue;
    const y = (a.y + b.y) / 2 + CARD_HEIGHT / 2;
    const ax = a.x + (a.x < b.x ? CARD_WIDTH : 0);
    const bx = b.x + (b.x < a.x ? CARD_WIDTH : 0);
    out.push({
      id: e.id,
      kind: "spouse",
      d: `M ${ax} ${y} L ${bx} ${y}`,
    });
  }

  return out;
}

function isPlaceholderPerson(p: Person): boolean {
  return p.publicity === "minimal" && !p.birth?.year && !p.death?.year;
}
