"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Person } from "@/data/types";
import { computeAge } from "@/lib/schema";
import { computeLayout } from "./computeLayout";
import { PersonCard, CARD_WIDTH, CARD_HEIGHT, type PersonCardData } from "./PersonCard";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.4;
const INITIAL_PADDING = 80;

type Placed = {
  id: string;
  x: number;
  y: number;
  data: PersonCardData;
};

type EdgePath = {
  id: string;
  d: string;
  kind: "parent-child" | "spouse";
};

export function TreeFlowView({ peopleList }: { peopleList: Person[] }) {
  const { placed, edges, bounds } = useMemo(
    () => buildTree(peopleList),
    [peopleList],
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const fitVersionRef = useRef(0);

  const worldWidth = bounds.maxX - bounds.minX + INITIAL_PADDING * 2;
  const worldHeight = bounds.maxY - bounds.minY + INITIAL_PADDING * 2;

  const fitToView = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const zX = rect.width / worldWidth;
    const zY = rect.height / worldHeight;
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(zX, zY, 1)));
    const offsetX = (rect.width - worldWidth * z) / 2;
    const offsetY = (rect.height - worldHeight * z) / 2;
    setZoom(z);
    setOffset({ x: offsetX, y: offsetY });
  }, [worldWidth, worldHeight]);

  useEffect(() => {
    fitVersionRef.current += 1;
    fitToView();
  }, [fitToView]);

  useEffect(() => {
    const onResize = () => fitToView();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [fitToView]);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pan = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const pinch = useRef<{ startDistance: number; startZoom: number } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pointerCount = pointers.current.size;

    if (pointerCount === 1) {
      pan.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: offset.x,
        origY: offset.y,
      };
      pinch.current = null;
      dragged.current = false;
    } else if (pointerCount === 2) {
      const pts = [...pointers.current.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinch.current = {
        startDistance: Math.hypot(dx, dy),
        startZoom: zoom,
      };
      pan.current = null;
    }
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pointerCount = pointers.current.size;

    if (pointerCount === 2 && pinch.current) {
      const el = viewportRef.current;
      if (!el) return;
      const pts = [...pointers.current.values()];
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (dist === 0) return;
      const ratio = dist / pinch.current.startDistance;
      const nextZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, pinch.current.startZoom * ratio),
      );
      const rect = el.getBoundingClientRect();
      const localX = midX - rect.left;
      const localY = midY - rect.top;
      const worldX = (localX - offset.x) / zoom;
      const worldY = (localY - offset.y) / zoom;
      setOffset({
        x: localX - worldX * nextZoom,
        y: localY - worldY * nextZoom,
      });
      setZoom(nextZoom);
      dragged.current = true;
      return;
    }

    if (!pan.current) return;
    const dx = e.clientX - pan.current.startX;
    const dy = e.clientY - pan.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragged.current = true;
    setOffset({ x: pan.current.origX + dx, y: pan.current.origY + dy });
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) pan.current = null;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragged.current) {
      e.preventDefault();
      e.stopPropagation();
      dragged.current = false;
    }
  };

  const zoomAroundPoint = useCallback(
    (factor: number, pointerX: number, pointerY: number) => {
      const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
      if (nextZoom === zoom) return;
      const worldX = (pointerX - offset.x) / zoom;
      const worldY = (pointerY - offset.y) / zoom;
      setOffset({
        x: pointerX - worldX * nextZoom,
        y: pointerY - worldY * nextZoom,
      });
      setZoom(nextZoom);
    },
    [zoom, offset.x, offset.y],
  );

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // Mac trackpad pinch arrives as wheel + ctrlKey. Regular scroll without
    // ⌘/Ctrl is allowed to bubble so the page scroll keeps working.
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAroundPoint(factor, pointerX, pointerY);
    }
  };

  const adjustZoom = (delta: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAroundPoint(1 + delta, rect.width / 2, rect.height / 2);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 80 / zoom;
    switch (e.key) {
      case "+":
      case "=":
        e.preventDefault();
        adjustZoom(0.2);
        break;
      case "-":
      case "_":
        e.preventDefault();
        adjustZoom(-0.16);
        break;
      case "0":
        e.preventDefault();
        fitToView();
        break;
      case "ArrowUp":
        e.preventDefault();
        setOffset((o) => ({ x: o.x, y: o.y + step }));
        break;
      case "ArrowDown":
        e.preventDefault();
        setOffset((o) => ({ x: o.x, y: o.y - step }));
        break;
      case "ArrowLeft":
        e.preventDefault();
        setOffset((o) => ({ x: o.x + step, y: o.y }));
        break;
      case "ArrowRight":
        e.preventDefault();
        setOffset((o) => ({ x: o.x - step, y: o.y }));
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[85vh] rounded-lg border border-ink-100 bg-parchment-dark overflow-hidden select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-700/60"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Family tree. Drag to pan, pinch or Ctrl+scroll to zoom, arrow keys to pan, plus and minus keys to zoom, zero to fit."
      role="application"
    >
      <div
        ref={viewportRef}
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={endPointer}
        onWheel={onWheel}
        onClickCapture={onClickCapture}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
            width: worldWidth,
            height: worldHeight,
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
          }}
        >
          <svg
            width={worldWidth}
            height={worldHeight}
            className="absolute inset-0 pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <g
              transform={`translate(${-bounds.minX + INITIAL_PADDING}, ${-bounds.minY + INITIAL_PADDING})`}
            >
              {edges.map((e) => (
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
              key={n.id}
              style={{
                position: "absolute",
                left: n.x - bounds.minX + INITIAL_PADDING,
                top: n.y - bounds.minY + INITIAL_PADDING,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }}
            >
              <PersonCard data={n.data} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 rounded-md bg-parchment/95 border border-ink-100 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          onClick={() => adjustZoom(0.2)}
          className="px-3 py-1.5 text-sm text-ink-700 hover:text-accent-700 border-b border-ink-100"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => adjustZoom(-0.16)}
          className="px-3 py-1.5 text-sm text-ink-700 hover:text-accent-700 border-b border-ink-100"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={fitToView}
          className="px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ink-600 hover:text-accent-700"
          aria-label="Fit to view"
        >
          fit
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-parchment/95 border border-ink-100 px-3 py-2 text-xs text-ink-600 shadow-sm backdrop-blur-sm pointer-events-none max-w-xs">
        <span className="font-medium text-ink-800">Tap</span> a card to open ·{" "}
        <span className="font-medium text-ink-800">Drag</span> to pan ·{" "}
        <span className="font-medium text-ink-800">Pinch</span> or{" "}
        <span className="font-medium text-ink-800">⌘/Ctrl + scroll</span> to zoom ·{" "}
        <span className="font-medium text-ink-800">0</span> to fit
      </div>
    </div>
  );
}

function buildTree(peopleList: Person[]) {
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
      id: ln.id,
      x: ln.x,
      y: ln.y,
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

  // Group parent-child edges by parent so we can draw one comb per parent.
  const childrenByParent = new Map<string, string[]>();
  const spouseEdgeList: { id: string; source: string; target: string }[] = [];
  for (const e of layout.edges) {
    if (e.kind === "spouse") {
      spouseEdgeList.push(e);
    } else {
      const list = childrenByParent.get(e.source) ?? [];
      list.push(e.target);
      childrenByParent.set(e.source, list);
    }
  }

  const edges: EdgePath[] = [];

  for (const [parentSlug, childSlugs] of childrenByParent) {
    const parent = posById.get(parentSlug);
    if (!parent) continue;
    const kids = childSlugs
      .map((s) => posById.get(s))
      .filter((n): n is NonNullable<typeof n> => Boolean(n));
    if (kids.length === 0) continue;
    const parentCx = parent.x + CARD_WIDTH / 2;
    const parentBottom = parent.y + CARD_HEIGHT;
    const kidTop = kids[0].y;
    const busY = parentBottom + (kidTop - parentBottom) / 2;

    // Sort by x so the bus line spans min to max cleanly.
    kids.sort((a, b) => a.x - b.x);
    const kidCenters = kids.map((k) => k.x + CARD_WIDTH / 2);
    const minKidX = Math.min(...kidCenters, parentCx);
    const maxKidX = Math.max(...kidCenters, parentCx);

    // Stem from parent down to the bus.
    edges.push({
      id: `stem-${parentSlug}`,
      kind: "parent-child",
      d: `M ${parentCx} ${parentBottom} L ${parentCx} ${busY}`,
    });

    // Horizontal bus across all children + the parent's column.
    if (kids.length > 1 || minKidX !== parentCx) {
      edges.push({
        id: `bus-${parentSlug}`,
        kind: "parent-child",
        d: `M ${minKidX} ${busY} L ${maxKidX} ${busY}`,
      });
    }

    // Drop from the bus into each child's top.
    for (const k of kids) {
      const cx = k.x + CARD_WIDTH / 2;
      edges.push({
        id: `drop-${parentSlug}-${k.id}`,
        kind: "parent-child",
        d: `M ${cx} ${busY} L ${cx} ${k.y}`,
      });
    }
  }

  for (const e of spouseEdgeList) {
    const a = posById.get(e.source);
    const b = posById.get(e.target);
    if (!a || !b) continue;
    const y = (a.y + b.y) / 2 + CARD_HEIGHT / 2;
    const ax = a.x + (a.x < b.x ? CARD_WIDTH : 0);
    const bx = b.x + (b.x < a.x ? CARD_WIDTH : 0);
    edges.push({
      id: e.id,
      kind: "spouse",
      d: `M ${ax} ${y} L ${bx} ${y}`,
    });
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of placed) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + CARD_WIDTH > maxX) maxX = n.x + CARD_WIDTH;
    if (n.y + CARD_HEIGHT > maxY) maxY = n.y + CARD_HEIGHT;
  }
  if (!isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
  }

  return {
    placed,
    edges,
    bounds: { minX, minY, maxX, maxY },
  };
}

function isPlaceholderPerson(p: Person): boolean {
  return p.publicity === "minimal" && !p.birth?.year && !p.death?.year;
}
