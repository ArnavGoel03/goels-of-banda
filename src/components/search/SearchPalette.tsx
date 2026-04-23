"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildSearchIndex,
  searchItems,
  type SearchItem,
} from "@/lib/search-index";

const ICON: Record<SearchItem["kind"], string> = {
  person: "◆",
  business: "◇",
  place: "◉",
};

const KIND_LABEL: Record<SearchItem["kind"], string> = {
  person: "Person",
  business: "Business",
  place: "Place",
};

export function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const index = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(
    () => searchItems(index, query, 30),
    [index, query],
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const hit = results[active];
        if (hit) {
          onClose();
          router.push(hit.href);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, router]);

  useEffect(() => {
    const el = listRef.current?.querySelector(
      `[data-idx="${active}"]`,
    ) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-900/40 backdrop-blur-sm px-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg border border-ink-200 bg-parchment shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-ink-100 px-4">
          <span className="text-ink-400">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, businesses, places…"
            className="flex-1 bg-transparent py-4 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
            aria-label="Search"
          />
          <kbd className="hidden sm:inline-block rounded border border-ink-200 bg-parchment-dark px-1.5 py-0.5 text-[10px] text-ink-500">
            Esc
          </kbd>
        </div>

        <ul ref={listRef} className="max-h-[55vh] overflow-y-auto">
          {query.trim() === "" ? (
            <li className="px-4 py-8 text-center text-sm text-ink-500">
              Type to search across people, businesses, and places.
              <div className="mt-2 text-[11px] text-ink-400">
                ↑ ↓ to navigate · Enter to open · Esc to close
              </div>
            </li>
          ) : results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-ink-500">
              No matches for &ldquo;{query}&rdquo;.
            </li>
          ) : (
            results.map((r, idx) => (
              <li
                key={`${r.kind}-${r.slug}`}
                data-idx={idx}
                className={
                  "flex cursor-pointer items-start gap-3 px-4 py-2.5 border-b border-ink-100 last:border-b-0 " +
                  (idx === active
                    ? "bg-parchment-dark"
                    : "hover:bg-parchment-dark/50")
                }
                onMouseEnter={() => setActive(idx)}
                onClick={() => {
                  onClose();
                  router.push(r.href);
                }}
              >
                <span className="mt-1 text-ink-300" aria-hidden="true">
                  {ICON[r.kind]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-base font-semibold text-ink-900 truncate">
                    {r.name}
                  </div>
                  {r.subtitle ? (
                    <div className="text-xs text-ink-500 truncate">
                      {r.subtitle}
                    </div>
                  ) : null}
                </div>
                <span className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-400">
                  {KIND_LABEL[r.kind]}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
