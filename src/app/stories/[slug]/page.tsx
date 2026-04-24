import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStory, stories } from "@/data/stories";
import { getPerson } from "@/data/people";
import { getBusiness } from "@/data/businesses";
import { placesBySlug } from "@/data/places";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, absoluteUrl } from "@/lib/schema";
import { site } from "@/data/config";
import { linkify } from "@/lib/linkify";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Not found" };
  return {
    title: story.title,
    description: story.summary,
    alternates: { canonical: `/stories/${slug}` },
    openGraph: {
      title: `${story.title} — ${site.shortName}`,
      description: story.summary,
      url: absoluteUrl(`/stories/${slug}`),
      type: "article",
    },
  };
}

export default async function StoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return notFound();

  const people = (story.personSlugs ?? [])
    .map((s) => getPerson(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const businesses = (story.businessSlugs ?? [])
    .map((s) => getBusiness(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  const places = (story.placeSlugs ?? [])
    .map((s) => placesBySlug[s])
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: story.title,
          description: story.summary,
          url: absoluteUrl(`/stories/${slug}`),
          datePublished: story.date?.date ?? story.date?.year,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Stories", url: `${site.baseUrl}/stories` },
          { name: story.title, url: absoluteUrl(`/stories/${slug}`) },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16">
        <Link
          href="/stories"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium"
        >
          ← All stories
        </Link>
        <header className="mt-4 border-b border-ink-100 pb-6">
          {story.era ? (
            <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
              {story.era}
            </p>
          ) : null}
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.05]">
            {story.title}
          </h1>
          <p className="mt-3 font-serif text-xl italic text-ink-600">
            {story.summary}
          </p>
        </header>

        <section className="prose-family mt-8">
          {story.body.map((para, i) => (
            <p key={i} className={i === 0 ? "lead" : undefined}>
              {linkify(para)}
            </p>
          ))}
        </section>

        {(people.length > 0 || businesses.length > 0 || places.length > 0) && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
              Mentioned
            </h2>
            <div className="mt-4 space-y-4">
              {people.length > 0 ? (
                <Row label="People">
                  {people.map((p) => (
                    <Chip
                      key={p.slug}
                      href={`/people/${p.slug}`}
                      label={p.name}
                    />
                  ))}
                </Row>
              ) : null}
              {businesses.length > 0 ? (
                <Row label="Businesses">
                  {businesses.map((b) => (
                    <Chip
                      key={b.slug}
                      href={`/businesses/${b.slug}`}
                      label={b.name}
                    />
                  ))}
                </Row>
              ) : null}
              {places.length > 0 ? (
                <Row label="Places">
                  {places.map((pl) => (
                    <Chip
                      key={pl.slug}
                      href={`/places#${pl.slug}`}
                      label={pl.name}
                    />
                  ))}
                </Row>
              ) : null}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-medium">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-md border border-ink-100 bg-parchment px-3 py-1.5 text-sm text-ink-700 hover:border-accent-400 hover:text-accent-700"
    >
      {label}
    </Link>
  );
}
