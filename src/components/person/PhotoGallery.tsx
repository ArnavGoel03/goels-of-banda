"use client";

import Image from "next/image";
import { useState } from "react";
import type { PersonPhoto } from "@/data/types";

export function PhotoGallery({ photos, personName }: { photos: PersonPhoto[]; personName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  const close = () => setOpenIndex(null);
  const open = openIndex !== null ? photos[openIndex] : null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-2">
        Photos
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group block overflow-hidden rounded-md border border-ink-100 bg-parchment text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="relative aspect-[4/3] bg-ink-100">
              <Image
                src={photo.src}
                alt={photo.caption ?? `${personName}, photo ${i + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-[1.02]"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            {photo.caption || photo.year ? (
              <div className="px-3 py-2">
                {photo.caption ? (
                  <p className="text-sm text-ink-800 leading-snug">{photo.caption}</p>
                ) : null}
                {photo.year ? (
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-ink-500">
                    {photo.year}
                  </p>
                ) : null}
              </div>
            ) : null}
          </button>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute -top-10 right-0 text-parchment hover:text-accent-400 text-sm"
              aria-label="Close photo"
            >
              Close ✕
            </button>
            <div className="relative">
              <Image
                src={open.src}
                alt={open.caption ?? personName}
                width={1600}
                height={1200}
                className="max-h-[85vh] w-auto rounded-md object-contain"
              />
            </div>
            {open.caption || open.year || open.credit ? (
              <div className="mt-3 text-parchment">
                {open.caption ? <p className="text-sm">{open.caption}</p> : null}
                <p className="mt-1 text-xs text-parchment/60">
                  {[open.year, open.credit].filter(Boolean).join(" · ")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
