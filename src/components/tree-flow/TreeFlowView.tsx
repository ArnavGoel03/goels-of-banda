"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Person } from "@/data/types";
import { computeAge } from "@/lib/schema";
import { computeLayout } from "./computeLayout";
import { PersonCard, CARD_WIDTH, CARD_HEIGHT, type PersonCardData } from "./PersonCard";

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.2;
const INITIAL_PADDING = 60;

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
  const [fitted, setFitted] = useState(false);

  useEffect(() => {
    if (fitted) return;
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const contentW = bounds.maxX - bounds.minX + INITIAL_PADDING * 2;
    const contentH = bounds.maxY - bounds.minY + INITIAL_PADDING * 2;
    const z = Math.min(
      rect.width / contentW,
      rect.height / contentH,
      1,
    );
    const clampedZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
    const offsetX = (rect.width - contentW * clampedZ) / 2 - bounds.minX * clampedZ + INITIAL_PADDING * clampedZ;
    const offsetY = (rect.height - contentH * clampedZ) / 2 - bounds.minY * clampedZ + INITIAL_PADDING * clampedZ;
    setZoom(clampedZ);
    setOffset({ x: offsetX, y: offsetY });
    setFitted(true);
  }, [bounds, fitted]);

  const pan = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("a[href^='/people/']")) {
      return;
    }
    pan.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
    dragged.current = false;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pan.current) return;
    const dx = e.clientX - pan.current.startX;
    const dy = e.clientY - pan.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged.current = true;
    setOffset({ x: pan.current.origX + dx, y: pan.current.origY + dy });
  };

  const endPan = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pan.current) {
      pan.current = null;
      try {
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const factor = Math.exp(-e.deltaY * 0.0015);
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
    const worldX = (pointerX - offset.x) / zoom;
    const worldY = (pointerY - offset.y) / zoom;
    const nextOffsetX = pointerX - worldX * nextZoom;
    const nextOffsetY = pointerY - worldY * nextZoom;
    setZoom(nextZoom);
    setOffset({ x: nextOffsetX, y: nextOffsetY });
  };

  const adjustZoom = (delta: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
    const worldX = (cx - offset.x) / zoom;
    const worldY = (cy - offset.y) / zoom;
    setOffset({ x: cx - worldX * nextZoom, y: cy - worldY * nextZoom });
    setZoom(nextZoom);
  };

  const reset = () => {
    setFitted(false);
  };

  const worldWidth = bounds.maxX - bounds.minX + INITIAL_PADDING * 2;
  const worldHeight = bounds.maxY - bounds.minY + INITIAL_PADDING * 2;

  return (
    <div className="relative h-[85vh] rounded-lg border border-ink-100 bg-parchment-dark overflow-hidden select-none">
      <div
        ref={viewportRef}
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
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
          }}
        >
          <svg
            width={worldWidth}
            height={worldHeight}
            className="absolute inset-0 pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <g transform={`translate(${-bounds.minX + INITIAL_PADDING}, ${-bounds.minY + INITIAL_PADDING})`}>
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
                  strokeWidth={e.kind === "spouse" ? 1.2 : 1}
                  strokeDasharray={e.kind === "spouse" ? "4 3" : undefined}
                  opacity={e.kind === "spouse" ? 0.85 : 0.55}
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
          onClick={() => adjustZoom(-0.2)}
          className="px-3 py-1.5 text-sm text-ink-700 hover:text-accent-700 border-b border-ink-100"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ink-600 hover:text-accent-700"
          aria-label="Fit to view"
        >
          fit
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-parchment/95 border border-ink-100 px-3 py-2 text-xs text-ink-600 shadow-sm backdrop-blur-sm pointer-events-none max-w-xs">
        <span className="font-medium text-ink-800">Tap any card</span> to open that person&rsquo;s page ·{" "}
        <span className="font-medium text-ink-800">Drag</span> to pan ·{" "}
        <span className="font-medium text-ink-800">⌘/Ctrl + scroll</span> or the buttons to zoom
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
    const age = computeAge(p, now);
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
        sub: p.currentLocation ?? p.birth?.place,
        age: ageLabel,
        deceased: !p.isLiving,
        newborn: p.slug === "raghav-goel",
        self: isAditi,
        badge: isAditi ? "Future bride" : undefined,
      },
    };
  });

  const edges: EdgePath[] = [];
  for (const e of layout.edges) {
    const a = posById.get(e.source);
    const b = posById.get(e.target);
    if (!a || !b) continue;
    if (e.kind === "spouse") {
      const y = (a.y + b.y) / 2 + CARD_HEIGHT / 2;
      const x1 = a.x + CARD_WIDTH / 2;
      const x2 = b.x + CARD_WIDTH / 2;
      edges.push({
        id: e.id,
        kind: "spouse",
        d: `M ${x1} ${y} L ${x2} ${y}`,
      });
      continue;
    }
    const startX = a.x + CARD_WIDTH / 2;
    const startY = a.y + CARD_HEIGHT;
    const endX = b.x + CARD_WIDTH / 2;
    const endY = b.y;
    const midY = startY + (endY - startY) / 2;
    edges.push({
      id: e.id,
      kind: "parent-child",
      d: `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`,
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

  return {
    placed,
    edges,
    bounds: { minX, minY, maxX, maxY },
  };
}
