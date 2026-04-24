import type { Metadata } from "next";
import Link from "next/link";
import { PersonSnippetForm } from "@/components/admin/PersonSnippetForm";

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal editor. Generates copy-pasteable TypeScript snippets for src/data/.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-12 pb-16">
      <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
        Internal utility
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">
        Add a person
      </h1>
      <p className="mt-3 text-ink-600">
        Fill this in to generate a TypeScript record you can paste into{" "}
        <code className="rounded bg-ink-100 px-1 text-sm">src/data/people.ts</code>.
        The site itself is built from that file, so nothing is written until
        you commit the change.
      </p>
      <p className="mt-2 text-sm text-ink-500">
        Upload photos / audio / documents to the Blob store:{" "}
        <Link href="/admin/upload" className="text-accent-700 underline">
          /admin/upload
        </Link>
        .
      </p>
      <PersonSnippetForm />
    </section>
  );
}
