"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  PanOnScrollMode,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Person } from "@/data/types";
import { computeLayout } from "./computeLayout";
import { PersonNode, type PersonNodeData } from "./PersonNode";

const nodeTypes = { person: PersonNode };

export function TreeFlowView({ peopleList }: { peopleList: Person[] }) {
  const { nodes, edges } = useMemo(() => {
    const layout = computeLayout(peopleList);
    const bySlug = new Map(peopleList.map((p) => [p.slug, p]));

    const flowNodes: Node<PersonNodeData>[] = layout.nodes.map((ln) => {
      const p = bySlug.get(ln.id)!;
      const isAditi = p.slug === "aditi-goel";
      return {
        id: ln.id,
        type: "person",
        position: { x: ln.x, y: ln.y },
        data: {
          slug: p.slug,
          name: p.name,
          alias: p.altNames?.[0],
          sub: p.currentLocation ?? p.birth?.place,
          deceased: !p.isLiving,
          newborn: p.slug === "raghav-goel",
          self: isAditi,
          badge: isAditi ? "Future bride" : undefined,
        },
        draggable: false,
        selectable: true,
      };
    });

    const flowEdges: Edge[] = layout.edges.map((le) => {
      if (le.kind === "spouse") {
        return {
          id: le.id,
          source: le.source,
          target: le.target,
          type: "straight",
          animated: false,
          style: { stroke: "var(--color-accent-700)", strokeWidth: 1.2, strokeDasharray: "4 3" },
        };
      }
      return {
        id: le.id,
        source: le.source,
        target: le.target,
        type: "smoothstep",
        animated: false,
        style: { stroke: "var(--color-ink-400)", strokeWidth: 1, opacity: 0.55 },
      };
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [peopleList]);

  return (
    <div className="relative h-[85vh] rounded-lg border border-ink-100 bg-parchment-dark overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.08}
        maxZoom={2.5}
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Free}
        zoomOnScroll={false}
        zoomOnPinch
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background gap={32} size={1} color="var(--color-ink-200)" />
        <Controls position="top-right" showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(0,0,0,0.08)"
          nodeColor={() => "var(--color-ink-300)"}
          position="bottom-right"
        />
      </ReactFlow>
      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-parchment/95 border border-ink-100 px-3 py-2 text-xs text-ink-600 shadow-sm backdrop-blur-sm pointer-events-none max-w-xs">
        <span className="font-medium text-ink-800">Tap any card</span> to open that person&rsquo;s page ·{" "}
        <span className="font-medium text-ink-800">Drag</span> to pan ·{" "}
        <span className="font-medium text-ink-800">Pinch</span> or use the controls to zoom
      </div>
    </div>
  );
}
