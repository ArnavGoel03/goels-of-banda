import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { VoiceNote } from "@/components/VoiceNote";
import { breadcrumbJsonLd } from "@/lib/schema";
import { getRecipe, listRecipes, mediaUrl } from "@/lib/contributions";
import { peopleBySlug } from "@/data/people";
import { site } from "@/data/config";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const recipes = await listRecipes();
  return recipes.map((r) => ({ slug: r.slug! }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return { title: "Not found" };
  return {
    title: recipe.title,
    description:
      recipe.summary?.slice(0, 170) ??
      `A recipe from the Goel family of Banda${recipe.toldBy ? `, from ${recipe.toldBy}` : ""}.`,
    alternates: { canonical: `/recipes/${slug}` },
  };
}

export default async function RecipePage({ params }: { params: Params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return notFound();

  const photo = mediaUrl(recipe.photoKey);
  const audio = mediaUrl(recipe.audioKey);
  const teller = recipe.toldBySlug ? peopleBySlug[recipe.toldBySlug] : undefined;
  const ingredients = recipe.ingredients.split("\n").filter(Boolean);
  const steps = recipe.steps.split("\n").filter(Boolean);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Recipes", url: `${site.baseUrl}/recipes` },
          { name: recipe.title, url: `${site.baseUrl}/recipes/${slug}` },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16 prose-family">
        <Link
          href="/recipes"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium no-underline"
        >
          Recipes
        </Link>

        {recipe.occasion ? (
          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-ink-500">
            {recipe.occasion}
          </p>
        ) : null}

        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink-900">{recipe.title}</h1>

        {recipe.toldBy ? (
          <p className="mt-2 text-sm text-ink-600 not-prose">
            From{" "}
            {teller ? (
              <Link href={`/people/${teller.slug}`} className="text-accent-700 underline">
                {recipe.toldBy}
              </Link>
            ) : (
              recipe.toldBy
            )}
          </p>
        ) : null}

        {recipe.summary ? <p className="lead mt-3">{recipe.summary}</p> : null}

        {audio ? (
          <VoiceNote src={audio} toldBy={recipe.toldBy} transcript={recipe.audioTranscript} />
        ) : null}

        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={recipe.title}
            className="my-8 w-full rounded-md border border-ink-100"
          />
        ) : null}

        <section>
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>How it is made</h2>
          <ol>
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>

        {recipe.tags && recipe.tags.length > 0 ? (
          <p className="not-prose mt-10 flex flex-wrap gap-2">
            {recipe.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600"
              >
                {t}
              </span>
            ))}
          </p>
        ) : null}
      </article>
    </>
  );
}
