"use client";

import { useEffect, useState } from "react";
import { useSearch } from "./SearchProvider";

export function SearchTrigger() {
  const { setOpen } = useSearch();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search"
      className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-parchment px-2.5 py-1.5 text-xs text-ink-500 hover:border-accent-400 hover:text-ink-700"
    >
      <span className="text-ink-400" aria-hidden="true">⌕</span>
      <span className="hidden sm:inline">Search…</span>
      <kbd className="ml-1 hidden sm:inline-block rounded border border-ink-200 bg-parchment-dark px-1 py-0.5 text-[10px] font-medium text-ink-500">
        {isMac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
