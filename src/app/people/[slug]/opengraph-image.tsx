import { ImageResponse } from "next/og";
import { getPerson } from "@/data/people";
import { site } from "@/data/config";

export const alt = "Goels of Banda, family member";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PersonOg({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getPerson(slug);
  const name = person?.name ?? "A family member";
  const alias = person?.altNames?.[0];
  const role = person?.familyRole ?? "";
  const location = person?.currentLocation ?? person?.birth?.place ?? "";
  const occupation = person?.occupation ?? "";
  const years = buildYears(person);

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
          {role || "The Goels of Banda"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: clampFont(name, 140, 70, 24),
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: -2,
            }}
          >
            {name}
          </div>
          {alias ? (
            <div
              style={{
                fontSize: 40,
                fontStyle: "italic",
                color: "#504a3f",
              }}
            >
              &ldquo;{alias}&rdquo;
            </div>
          ) : null}
          {years ? (
            <div style={{ fontSize: 34, color: "#3a352c", marginTop: 6 }}>
              {years}
            </div>
          ) : null}
          {occupation ? (
            <div style={{ fontSize: 28, color: "#504a3f", marginTop: 4 }}>
              {occupation}
            </div>
          ) : null}
          {location ? (
            <div style={{ fontSize: 24, color: "#6b6659" }}>{location}</div>
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

function buildYears(person: ReturnType<typeof getPerson>): string | undefined {
  if (!person) return undefined;
  const b = person.birth?.year;
  const d = person.death?.year;
  const approx = person.birth?.yearApprox ? "c. " : "";
  if (b && d) return `${approx}${b} – ${d}`;
  if (b && person.isLiving) return `born ${approx}${b}`;
  if (b) return `born ${approx}${b}`;
  if (person.birth?.place) return `born in ${person.birth.place}`;
  return undefined;
}

function clampFont(
  text: string,
  max: number,
  min: number,
  breakpoint: number,
): number {
  if (text.length > breakpoint) {
    const scale = Math.max(min, max - (text.length - breakpoint) * 2.4);
    return Math.round(scale);
  }
  return max;
}
