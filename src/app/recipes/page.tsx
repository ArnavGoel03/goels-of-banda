import type { Metadata } from "next";
import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { listRecipes, mediaUrl } from "@/lib/contributions";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "The dishes the Goel family of Banda actually cooks, written down in the words of the people who make them, and where possible recorded in their own voice.",
  alternates: { canonical: "/recipes" },
};

export default async function RecipesPage() {
  const recipes = await listRecipes();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Recipes", url: `${site.baseUrl}/recipes` },
        ])}
      />

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
          Recipes
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Not cookbook recipes. These are the versions actually cooked in this
          family, with the shortcuts and the wrong-by-the-book steps left in,
          attributed to the person who cooks them that way.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {recipes.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink-200 bg-parchment-dark p-8 text-center">
            <p className="font-serif text-xl text-ink-800">Nothing written down yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
              Every family loses its recipes the same way: everyone assumes
              someone else wrote them down. Sit with whoever cooks, press record,
              and let them talk through one dish.
            </p>
            <Link
              href="/contribute/new"
              className="mt-6 inline-block rounded-md bg-ink-900 px-6 py-3 text-white hover:opacity-90"
            >
              Add the first one
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4">
            {recipes.map((r) => (
              <EntryCard
                key={r.id}
                href={`/recipes/${r.slug}`}
                title={r.title}
                meta={r.occasion}
                summary={r.summary}
                toldBy={r.toldBy}
                hasAudio={Boolean(r.audioKey)}
                photoUrl={mediaUrl(r.photoKey)}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
