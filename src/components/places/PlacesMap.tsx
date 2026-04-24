"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { places } from "@/data/places";

function prefersReducedData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as unknown as {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

// Protomaps Basemaps — community-hosted, no API key required.
// Raster 256 tiles, OSM-based. Swap to vector once Protomaps PMTiles
// are self-hosted.
const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      paint: { "raster-saturation": -0.9, "raster-brightness-min": 0.35, "raster-brightness-max": 1 },
    },
  ],
};

export default function PlacesMap() {
  const geo = useMemo(() => places.filter((p) => p.coords), []);
  const [selected, setSelected] = useState<string | null>(null);
  const [tilesReady, setTilesReady] = useState(false);
  const [lowData, setLowData] = useState(false);

  useEffect(() => {
    setLowData(prefersReducedData());
  }, []);

  if (lowData) {
    return (
      <div className="rounded-lg border border-ink-100 bg-parchment-dark p-6">
        <p className="text-sm text-ink-700">
          <span className="font-medium text-ink-900">Data-saver mode detected.</span>{" "}
          Showing the places as a list to save bandwidth. The interactive map is skipped.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {geo.map((p) => (
            <li
              key={p.slug}
              className="rounded-md border border-ink-100 bg-parchment px-3 py-2 text-sm"
            >
              <p className="font-serif text-ink-900">{p.name}</p>
              <p className="mt-0.5 text-xs text-ink-600">{p.connection}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative h-[520px] overflow-hidden rounded-lg border border-ink-100">
      {!tilesReady ? (
        <div
          aria-hidden
          className="absolute inset-0 z-10 flex items-center justify-center bg-parchment-dark"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 45%, rgba(201,122,92,0.08) 0%, transparent 55%)",
          }}
        >
          <div className="text-center">
            <div className="mx-auto h-6 w-6 rounded-full border-2 border-accent-700 border-t-transparent animate-spin" />
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-500">
              Loading map
            </p>
          </div>
        </div>
      ) : null}
      <Map
        onLoad={() => setTilesReady(true)}
        initialViewState={{ longitude: 55, latitude: 22, zoom: 2.3 }}
        minZoom={2}
        maxZoom={8}
        mapStyle={MAP_STYLE}
        style={{ background: "#f3ede1" }}
        attributionControl={{ compact: true }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {geo.map((p) => {
          const [lat, lng] = p.coords!;
          const isOpen = selected === p.slug;
          return (
            <div key={p.slug}>
              <Marker
                longitude={lng}
                latitude={lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelected(p.slug);
                }}
              >
                <button
                  type="button"
                  aria-label={p.name}
                  className="h-3.5 w-3.5 rounded-full border-2 border-accent-800 bg-accent-400 shadow-sm hover:scale-125 transition-transform"
                />
              </Marker>
              {isOpen ? (
                <Popup
                  longitude={lng}
                  latitude={lat}
                  anchor="top"
                  onClose={() => setSelected(null)}
                  closeOnClick={false}
                  offset={16}
                >
                  <div className="min-w-[180px]">
                    <p className="font-serif text-base font-semibold text-ink-900">
                      {p.name}
                    </p>
                    <p className="mt-1 text-xs text-ink-600">{p.connection}</p>
                    {p.personSlugs.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-xs">
                        {p.personSlugs.slice(0, 4).map((s) => (
                          <Link
                            key={s}
                            href={`/people/${s}`}
                            className="text-accent-700 underline"
                          >
                            {s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Link>
                        ))}
                        {p.personSlugs.length > 4 ? (
                          <span className="text-ink-400">
                            +{p.personSlugs.length - 4}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </Popup>
              ) : null}
            </div>
          );
        })}
      </Map>
    </div>
  );
}
