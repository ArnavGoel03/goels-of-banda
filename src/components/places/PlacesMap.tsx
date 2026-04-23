"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { places } from "@/data/places";

export default function PlacesMap() {
  const geo = places.filter((p) => p.coords);

  return (
    <div className="relative h-[520px] overflow-hidden rounded-lg border border-ink-100">
      <MapContainer
        center={[22, 55]}
        zoom={2.5}
        minZoom={2}
        maxZoom={8}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: "#f3ede1" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />
        {geo.map((p) => (
          <CircleMarker
            key={p.slug}
            center={p.coords!}
            radius={7}
            pathOptions={{
              color: "#8a3324",
              fillColor: "#c97a5c",
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {p.name}
            </Tooltip>
            <Popup>
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
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
