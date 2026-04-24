import { ImageResponse } from "next/og";
import { getBusiness } from "@/data/businesses";
import { site } from "@/data/config";

export const alt = "Goels of Banda, family business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BusinessOg({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBusiness(slug);
  const name = b?.name ?? "A family business";
  const kind = b?.kind ?? "";
  const city = b?.city ?? "";
  const state = b?.state ?? "";
  const established = b?.established ? `Established ${b.established}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#faf7f2",
          color: "#14120e",
          fontFamily:
            '"Cormorant Garamond", Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8a3324",
            fontWeight: 500,
          }}
        >
          {kind || "Family business"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: clampFont(name, 130, 60, 24),
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: -2,
            }}
          >
            {name}
          </div>
          {city ? (
            <div style={{ fontSize: 32, color: "#504a3f", marginTop: 6 }}>
              {city}
              {state ? `, ${state}` : ""}
            </div>
          ) : null}
          {established ? (
            <div style={{ fontSize: 28, color: "#6b6659" }}>{established}</div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid #d6d0c1",
            paddingTop: 28,
            fontSize: 22,
            color: "#6b6659",
          }}
        >
          <span style={{ letterSpacing: 4, textTransform: "uppercase" }}>
            {site.shortName}
          </span>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            goelsofbanda.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

function clampFont(
  text: string,
  max: number,
  min: number,
  breakpoint: number,
): number {
  if (text.length > breakpoint) {
    const scale = Math.max(min, max - (text.length - breakpoint) * 2.2);
    return Math.round(scale);
  }
  return max;
}
