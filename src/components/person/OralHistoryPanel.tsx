"use client";

import { useState } from "react";
import type { OralHistoryClip } from "@/data/types";

export function OralHistoryPanel({
  clips,
  personName,
}: {
  clips: OralHistoryClip[];
  personName: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  if (clips.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-2">
        In their own voice
      </h2>
      <ul className="mt-6 space-y-5">
        {clips.map((c) => (
          <li
            key={c.src}
            className="rounded-md border border-ink-100 bg-parchment p-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-serif text-lg text-ink-900">{c.title}</p>
              {c.recordedOn || c.recordedBy ? (
                <p className="text-[10px] uppercase tracking-[0.12em] text-ink-500">
                  {[c.recordedOn, c.recordedBy].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
            <audio
              controls
              preload="none"
              src={c.src}
              aria-label={`${personName}: ${c.title}`}
              className="mt-3 w-full"
            />
            {c.transcript ? (
              <details
                className="mt-3"
                onToggle={(e) =>
                  setOpen((e.target as HTMLDetailsElement).open ? c.src : null)
                }
                open={open === c.src}
              >
                <summary className="cursor-pointer text-xs uppercase tracking-[0.12em] text-accent-700">
                  Transcript
                </summary>
                <p className="mt-2 text-sm text-ink-700 whitespace-pre-wrap">
                  {c.transcript}
                </p>
              </details>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
