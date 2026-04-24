import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { traditions, getTradition } from "@/data/traditions";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export function generateStaticParams() {
  return traditions.map((t) => ({ slug: t.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTradition(slug);
  if (!t) return { title: "Not found" };
  return {
    title: t.title,
    description: t.summary.slice(0, 170),
    alternates: { canonical: `/traditions/${slug}` },
  };
}

export default async function TraditionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const t = getTradition(slug);
  if (!t) return notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Traditions", url: `${site.baseUrl}/traditions` },
          { name: t.title, url: `${site.baseUrl}/traditions/${slug}` },
        ])}
      />
      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16 prose-family">
        <Link
          href="/traditions"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium no-underline"
        >
          ← Traditions
        </Link>
        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-ink-500">
          {t.kind}
          {t.occasion ? ` · ${t.occasion}` : ""}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink-900">
          {t.title}
        </h1>
        <p className="lead mt-3">{t.summary}</p>

        {t.ingredients && t.ingredients.length > 0 ? (
          <section>
            <h2>Ingredients</h2>
            <ul>
              {t.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {t.steps && t.steps.length > 0 ? (
          <section>
            <h2>Steps</h2>
            <ol>
              {t.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {t.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>
    </>
  );
}
