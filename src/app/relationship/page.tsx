import { Suspense } from "react";
import type { Metadata } from "next";
import { RelationshipFinder } from "@/components/relationship/RelationshipFinder";

export const metadata: Metadata = {
  title: "Relationship finder",
  description:
    "Pick any two members of the Goel family of Banda and see the shortest chain of parent, child, sibling, and marriage links between them.",
  alternates: { canonical: "/relationship" },
};

export default function RelationshipPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 pt-12 pb-16">
          <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
            Relationship finder
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
            How are they related?
          </h1>
          <p className="mt-6 text-ink-500">Loading…</p>
        </div>
      }
    >
      <RelationshipFinder />
    </Suspense>
  );
}
