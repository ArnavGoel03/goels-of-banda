"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { places } from "@/data/places";

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

  return (
    <div className="relative h-[520px] overflow-hidden rounded-lg border border-ink-100">
      <Map
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
