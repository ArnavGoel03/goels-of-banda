"use client";

import dynamic from "next/dynamic";

const PlacesMap = dynamic(() => import("./PlacesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center rounded-lg border border-ink-100 bg-parchment-dark text-sm text-ink-500">
      Loading map…
    </div>
  ),
});

export function PlacesMapLoader() {
  return <PlacesMap />;
}
