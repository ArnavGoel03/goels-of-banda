"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Person } from "@/data/types";
import { findRelationshipPath } from "@/lib/relationship";

const VIEWER_OPTIONS = [
  { slug: "aditi-goel", label: "Aditi" },
  { slug: "arnav-goel", label: "Arnav" },
  { slug: "rohit-goel", label: "Rohit" },
  { slug: "richa-goel", label: "Richa" },
];

const STORAGE_KEY = "gob:viewer-slug";

export function LiveRelationship({
  person,
  allPeople,
}: {
  person: Person;
  allPeople: Person[];
}) {
  const availableViewers = useMemo(() => {
    const bySlug = new Set(allPeople.map((p) => p.slug));
    return VIEWER_OPTIONS.filter((v) => bySlug.has(v.slug));
  }, [allPeople]);

  const [viewerSlug, setViewerSlug] = useState<string>(() => {
    return availableViewers[0]?.slug ?? "aditi-goel";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && availableViewers.some((v) => v.slug === stored)) {
      setViewerSlug(stored);
    }
  }, [availableViewers]);

  const onChange = (slug: string) => {
    setViewerSlug(slug);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, slug);
    }
  };

  const label = useMemo(() => {
    if (person.slug === viewerSlug) return "This is you.";
    const path = findRelationshipPath(viewerSlug, person.slug);
    if (!path || path.length < 2) return null;
    const hops = path.length - 1;
    return `${hops} step${hops === 1 ? "" : "s"} away`;
  }, [viewerSlug, person.slug]);

  if (!label) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-accent-700/20 bg-accent-700/5 px-3 py-2 text-xs text-accent-800">
      <span className="font-medium uppercase tracking-[0.12em] text-[10px]">Viewing as</span>
      <div className="flex flex-wrap gap-1">
        {availableViewers.map((v) => (
          <button
            key={v.slug}
            type="button"
            onClick={() => onChange(v.slug)}
            className={
              v.slug === viewerSlug
                ? "rounded-full bg-accent-700 px-2.5 py-0.5 text-parchment"
                : "rounded-full px-2.5 py-0.5 hover:bg-accent-700/10"
            }
            aria-pressed={v.slug === viewerSlug}
          >
            {v.label}
          </button>
        ))}
      </div>
      <span className="text-accent-700/60">·</span>
      {person.slug === viewerSlug ? (
        <span>{label}</span>
      ) : (
        <Link
          href={`/relationship?from=${viewerSlug}&to=${person.slug}`}
          className="underline hover:text-accent-700 transition-colors"
        >
          {label} — show the path →
        </Link>
      )}
    </div>
  );
}
