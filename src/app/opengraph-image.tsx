import { ImageResponse } from "next/og";
import { site } from "@/data/config";

export const runtime = "edge";
export const alt = `${site.name}, Goels of Banda family history`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          Banda, Uttar Pradesh · Since the 1820s
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 120,
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: -2,
            }}
          >
            The Goels of Banda
          </div>
          <div
            style={{
              fontSize: 40,
              fontStyle: "italic",
              color: "#504a3f",
              maxWidth: 1040,
              lineHeight: 1.2,
            }}
          >
            {site.tagline}
          </div>
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
            Six generations
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
