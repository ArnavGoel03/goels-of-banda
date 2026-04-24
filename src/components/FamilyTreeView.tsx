"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import type { Person } from "@/data/types";
import { ConnectorsLayer } from "@/components/tree/ConnectorsLayer";
import { TreeSearch } from "@/components/tree/TreeSearch";

type TreeNode = {
  slug: string;
  name: string;
  alias?: string;
  sub?: string;
  deceased?: boolean;
  newborn?: boolean;
  self?: boolean;
  placeholder?: boolean;
};

function node(p: Person, opts?: { self?: boolean }): TreeNode {
  return {
    slug: p.slug,
    name: p.name,
    alias: p.altNames?.[0],
    sub: p.currentLocation ?? p.birth?.place,
    deceased: !p.isLiving,
    newborn: p.slug === "raghav-goel",
    self: opts?.self,
  };
}

function Controls() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();
  return (
    <div className="absolute top-3 right-3 flex items-stretch gap-0 rounded-md bg-parchment/95 border border-ink-100 shadow-sm backdrop-blur-sm z-10 overflow-hidden">
      <button
        onClick={() => zoomIn(0.25, 200)}
        className="h-9 w-9 text-lg font-semibold text-ink-700 hover:bg-ink-100"
        aria-label="Zoom in"
        type="button"
      >
        +
      </button>
      <button
        onClick={() => zoomOut(0.25, 200)}
        className="h-9 w-9 text-lg font-semibold text-ink-700 hover:bg-ink-100 border-l border-ink-100"
        aria-label="Zoom out"
        type="button"
      >
        −
      </button>
      <button
        onClick={() => centerView(0.6, 300)}
        className="h-9 px-3 text-xs font-medium text-ink-700 hover:bg-ink-100 border-l border-ink-100"
        aria-label="Fit tree to view"
        type="button"
      >
        Fit
      </button>
      <button
        onClick={() => resetTransform(300)}
        className="h-9 px-3 text-xs font-medium text-ink-700 hover:bg-ink-100 border-l border-ink-100"
        aria-label="Reset view"
        type="button"
      >
        Reset
      </button>
    </div>
  );
}

export function FamilyTreeView({ peopleList }: { peopleList: Person[] }) {
  const bySlug = Object.fromEntries(peopleList.map((p) => [p.slug, p]));
  const get = (slug: string) => bySlug[slug];
  const treeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-[85vh] rounded-lg border border-ink-100 bg-parchment-dark overflow-hidden">
      <TransformWrapper
        initialScale={0.6}
        minScale={0.2}
        maxScale={2.5}
        limitToBounds={false}
        centerOnInit
        smooth
        wheel={{ step: 0.08, activationKeys: ["Control", "Meta"] }}
        doubleClick={{ mode: "reset" }}
        pinch={{ step: 4 }}
        panning={{ velocityDisabled: true }}
      >
        <Controls />
        <TreeSearch containerRef={treeRef} />
        <div className="absolute bottom-3 left-3 z-10 rounded-md bg-parchment/95 border border-ink-100 px-3 py-2 text-xs text-ink-600 shadow-sm backdrop-blur-sm pointer-events-none max-w-xs">
          <span className="font-medium text-ink-800">Tap any card</span> to open that person&rsquo;s page ·{" "}
          <span className="font-medium text-ink-800">Drag</span> to pan ·{" "}
          <span className="font-medium text-ink-800">⌘/Ctrl + scroll</span> or{" "}
          <span className="font-medium text-ink-800">pinch</span> to zoom
        </div>
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minWidth: "100%",
          }}
        >
          <div ref={treeRef} className="relative p-12 flex flex-col items-center gap-0 min-w-[1500px]">
            <ConnectorsLayer containerRef={treeRef} />
            <GenLabel>Generation 1 · namesakes · ~1820s · Banda</GenLabel>
            <Row>
              <Card data={node(get("gondilal-goel"))} />
              <Card data={node(get("ganesh-prasad-goel"))} />
            </Row>
            <Connector />
            <Missing label="3 unnamed generations · Gondilal&rsquo;s son (shop founder, ~1850s) → ~1880s → ~1910s (Radha Krishna&rsquo;s father)" />
            <Connector />

            <GenLabel>Generation 5 · grandparents</GenLabel>
            <div className="flex items-end justify-center gap-16 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <BranchLabel>Paternal · Banda · Radha Krishna&rsquo;s 4 brothers + 3 sisters</BranchLabel>
                <Row gap="md">
                  <Card data={node(get("mahesh-goel"))} />
                  <Card data={node(get("manmohan-goel"))} />
                  <Couple>
                    <Card data={node(get("radha-krishna-goel"))} />
                    <Card data={node(get("rani-agarwal-dadiji"))} />
                  </Couple>
                  <Card data={node(get("sohan-goel"))} />
                  <Card data={{ slug: "#", name: "3 sisters", sub: "Banda · Gurugram · ✝", placeholder: true }} />
                </Row>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BranchLabel>Maternal · Jhansi</BranchLabel>
                <Row gap="md">
                  <Couple>
                    <Card data={node(get("ramesh-chandra-agarwal"))} />
                    <Card data={node(get("prem-kumari"))} />
                  </Couple>
                </Row>
              </div>
            </div>
            <Connector />

            <GenLabel>Generation 6 · parents&rsquo; generation</GenLabel>
            <div className="flex items-start justify-center gap-24 flex-wrap">
              <Branch label="Radha Krishna&rsquo;s children · Banda">
                <Row>
                  <Couple>
                    <Card data={node(get("vinod-goel"))} />
                    <Card data={node(get("neelam-agarwal-vinod"))} />
                  </Couple>
                  <Couple>
                    <Card data={node(get("shobhit-goel"))} />
                    <Card data={node(get("roli"))} />
                  </Couple>
                  <Card data={node(get("seema-agarwal"))} />
                  <Couple>
                    <Card data={node(get("rohit-goel"))} />
                    <Card data={node(get("richa-goel"))} />
                  </Couple>
                </Row>
              </Branch>
              <Branch label="Manmohan&rsquo;s children · Banda">
                <Row>
                  <Couple>
                    <Card data={node(get("avijit-goel"))} />
                    <Card data={node(get("shayana-goyal"))} />
                  </Couple>
                  <Couple>
                    <Card data={node(get("vijaya-agarwal"))} />
                    <Card data={node(get("deepak-agarwal"))} />
                  </Couple>
                </Row>
              </Branch>
              <Branch label="Nanaji&rsquo;s children · Jhansi">
                <Row>
                  <Couple>
                    <Card data={node(get("vivek-agarwal"))} />
                    <Card data={node(get("rashi-agarwal"))} />
                  </Couple>
                  <Couple>
                    <Card data={node(get("nitin-agarwal"))} />
                    <Card data={node(get("manjari-garg"))} />
                  </Couple>
                  <Couple>
                    <Card data={node(get("kapil-agarwal"))} />
                    <Card data={node(get("nidhi-modi"))} />
                  </Couple>
                </Row>
              </Branch>
            </div>
            <Connector />

            <GenLabel>Generation 7 · cousins</GenLabel>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-start justify-center gap-16 flex-wrap">
                <BranchSectionLabel>Paternal · Radha Krishna&rsquo;s grandchildren</BranchSectionLabel>
              </div>
              <div className="flex items-start justify-center gap-6 flex-wrap">
                <ClusterGroup title="Vinod&rsquo;s">
                  <Couple>
                    <Card data={node(get("palash-goel"))} />
                    <Card data={node(get("preksha-agarwal"))} />
                  </Couple>
                  <Couple>
                    <Card data={node(get("palak-goel"))} />
                    <Card data={node(get("manmohan-agrawal-kanpur"))} />
                  </Couple>
                </ClusterGroup>
                <ClusterGroup title="Shobhit&rsquo;s">
                  <Card data={node(get("shally-goel"))} />
                  <Card data={node(get("esha-goel"))} />
                  <Card data={node(get("rhitik-goel"))} />
                </ClusterGroup>
                <ClusterGroup title="Seema&rsquo;s">
                  <Card data={node(get("aditya-agarwal"))} />
                  <Couple>
                    <Card data={node(get("anu-agarwal"))} />
                    <Card data={node(get("shanu-agarwal"))} />
                  </Couple>
                </ClusterGroup>
                <ClusterGroup title="Rohit&rsquo;s">
                  <Card data={node(get("arnav-goel"), { self: true })} />
                  <Card data={node(get("aditi-goel"))} />
                </ClusterGroup>
              </div>
              <div className="flex items-start justify-center gap-16 flex-wrap mt-2">
                <BranchSectionLabel>Paternal · Manmohan&rsquo;s grandchildren</BranchSectionLabel>
              </div>
              <div className="flex items-start justify-center gap-6 flex-wrap">
                <ClusterGroup title="Honey&rsquo;s">
                  <Card data={node(get("vashundhara-goel"))} />
                </ClusterGroup>
              </div>
              <div className="flex items-start justify-center gap-16 flex-wrap mt-2">
                <BranchSectionLabel>Maternal · Nanaji&rsquo;s grandchildren</BranchSectionLabel>
              </div>
              <div className="flex items-start justify-center gap-6 flex-wrap">
                <ClusterGroup title="Vivek&rsquo;s">
                  <Card data={node(get("anayra-agarwal"))} />
                  <Card data={node(get("rhidhaan-agarwal"))} />
                </ClusterGroup>
                <ClusterGroup title="Nitin&rsquo;s">
                  <Card data={node(get("nayonika-agarwal"))} />
                  <Card data={node(get("rayaan-agarwal"))} />
                </ClusterGroup>
                <ClusterGroup title="Kapil&rsquo;s">
                  <Card data={node(get("atharva-agarwal"))} />
                  <Card data={node(get("lovnika-agarwal"))} />
                </ClusterGroup>
              </div>
            </div>
            <Connector />

            <GenLabel>Generation 8 · newborn</GenLabel>
            <Row>
              <Card data={node(get("raghav-goel"))} />
            </Row>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

function GenLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 mb-3 text-xs uppercase tracking-[0.2em] text-accent-700 font-medium text-center">
      {children}
    </p>
  );
}

function BranchLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500 font-medium border-b border-ink-200 pb-1 w-full text-center max-w-[900px]">
      {children}
    </p>
  );
}

function Branch({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-3">
      <p
        className="text-[10px] uppercase tracking-[0.18em] text-ink-500 font-medium"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {children}
    </div>
  );
}

function BranchSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-accent-700 font-semibold w-full text-center border-b border-ink-100 pb-1.5 max-w-[900px]">
      {children}
    </p>
  );
}

function Row({
  children,
  gap = "sm",
}: {
  children: React.ReactNode;
  gap?: "sm" | "md";
}) {
  const g = gap === "md" ? "gap-4" : "gap-2";
  return <div className={`flex items-start justify-center flex-wrap ${g}`}>{children}</div>;
}

function Couple({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded-md px-2 py-1">
      <div className="flex gap-1 items-center">
        {Array.isArray(children) ? children[0] : children}
        <span className="text-accent-700 font-serif text-xl">⚭</span>
        {Array.isArray(children) ? children[1] : null}
      </div>
    </div>
  );
}

function ClusterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed border-ink-200 bg-parchment/60 p-3 flex flex-col gap-2 items-center">
      <p
        className="text-[10px] uppercase tracking-[0.15em] text-accent-700 font-semibold"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="flex flex-col gap-2 items-stretch">{children}</div>
    </div>
  );
}

function Connector({ small }: { small?: boolean } = {}) {
  return (
    <div
      className={`w-px bg-ink-200 ${small ? "h-4" : "h-6"}`}
      aria-hidden
    />
  );
}

function Missing({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-ink-300 bg-parchment px-4 py-3 text-xs text-ink-500 italic max-w-md text-center">
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
}

function Card({ data }: { data: TreeNode }) {
  const { slug, name, alias, sub, deceased, newborn, self, placeholder } = data;
  const isClickable = !placeholder && slug !== "#";
  const content = (
    <div
      data-slug={slug}
      className={[
        "group relative z-[1] w-[160px] min-h-[64px] rounded-md border px-2.5 py-1.5 text-left transition-all",
        self
          ? "border-accent-700 border-2 bg-accent-400/10 shadow-sm"
          : deceased
            ? "border-ink-200 bg-parchment opacity-85"
            : newborn
              ? "border-newborn bg-parchment"
              : placeholder
                ? "border-ink-200 bg-parchment/60 border-dashed"
                : "border-ink-100 bg-parchment hover:border-accent-700 hover:shadow-md hover:-translate-y-0.5",
      ].join(" ")}
    >
      {isClickable ? (
        <span
          className="absolute right-1.5 top-1 text-[10px] text-ink-300 group-hover:text-accent-700 transition-colors"
          aria-hidden="true"
        >
          ↗
        </span>
      ) : null}
      <p className="font-serif text-[15px] font-semibold text-ink-900 leading-tight pr-3">
        {name}
        {deceased ? <span className="ml-1 text-ink-400">✝</span> : null}
        {newborn ? <span className="ml-1 text-newborn">★</span> : null}
        {self ? <span className="ml-1 text-accent-700">★</span> : null}
      </p>
      {alias ? (
        <p className="text-[11px] italic text-ink-500 leading-tight mt-0.5">
          &ldquo;{alias}&rdquo;
        </p>
      ) : null}
      {sub ? <p className="text-[10px] text-ink-500 leading-tight mt-1">{sub}</p> : null}
    </div>
  );
  if (!isClickable) return content;
  return (
    <Link
      href={`/people/${slug}`}
      className="no-underline cursor-pointer"
      title={`Open ${name}'s page`}
    >
      {content}
    </Link>
  );
}
