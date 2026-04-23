import type { Metadata } from "next";
import { people } from "@/data/people";
import { FamilyTreeView } from "@/components/FamilyTreeView";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Family tree",
  description:
    "Interactive family tree of the Goel family of Banda, Uttar Pradesh — six generations from the 1820s to 2026, zoomable and pannable.",
  alternates: { canonical: "/family-tree" },
};

export default function FamilyTreePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Family tree", url: `${site.baseUrl}/family-tree` },
        ])}
      />
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-4">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          Six generations
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          The tree
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Zoom and pan the tree below. Click any name to open that person&rsquo;s page. On
          desktop hold ⌘ (or Ctrl) while scrolling — or use the zoom buttons — so regular
          page scrolling still works. On a phone, pinch to zoom and drag with one finger.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <FamilyTreeView peopleList={people} />
      </section>
    </>
  );
}
