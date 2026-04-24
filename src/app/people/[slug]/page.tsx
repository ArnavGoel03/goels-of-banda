import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerson, people } from "@/data/people";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd, breadcrumbJsonLd, personUrl } from "@/lib/schema";
import { site } from "@/data/config";
import { PersonHero } from "@/components/person/PersonHero";
import { FamilyPanel } from "@/components/person/FamilyPanel";
import { LifeTimeline } from "@/components/person/LifeTimeline";
import { BusinessesPanel } from "@/components/person/BusinessesPanel";
import { PlacesForPerson } from "@/components/person/PlacesForPerson";
import { SourcesPanel } from "@/components/person/SourcesPanel";
import { AdjacentNav } from "@/components/person/AdjacentNav";
import { RelatedStories } from "@/components/person/RelatedStories";
import { linkify } from "@/lib/linkify";

export function generateStaticParams() {
  return people.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return { title: "Not found" };
  const title = `${person.name}${
    person.altNames?.[0] ? ` ("${person.altNames[0]}")` : ""
  }`;
  const desc = person.bio?.slice(0, 170);
  const shouldIndex = person.publicity !== "minimal";
  return {
    title,
    description: desc,
    alternates: { canonical: `/people/${slug}` },
    robots: shouldIndex
      ? undefined
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title: `${title}, ${site.shortName}`,
      description: desc,
      url: `${site.baseUrl}/people/${slug}`,
      type: "profile",
    },
  };
}

export default async function PersonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return notFound();

  return (
    <>
      <JsonLd data={personJsonLd(person)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "People", url: `${site.baseUrl}/people` },
          { name: person.name, url: personUrl(person.slug) },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16">
        <Link
          href="/people"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium"
        >
          ← All people
        </Link>

        <PersonHero person={person} />

        {person.bio ? (
          <section className="prose-family mt-8">
            <p className="lead">
              {linkify(person.bio, [`/people/${person.slug}`])}
            </p>
          </section>
        ) : null}

        <FamilyPanel person={person} />
        <LifeTimeline person={person} />
        <BusinessesPanel person={person} />
        <PlacesForPerson person={person} />
        <RelatedStories personSlug={person.slug} />
        <SourcesPanel person={person} />

        {person.notes ? (
          <section className="mt-12 text-xs text-ink-500 italic border-t border-ink-100 pt-4">
            {person.notes}
          </section>
        ) : null}

        <div className="mt-12 rounded-md border border-dashed border-ink-200 bg-parchment-dark px-5 py-4 text-sm text-ink-600">
          Something wrong or missing about {person.name}?{" "}
          <Link href="/contribute" className="text-accent-700 underline">
            Suggest an edit
          </Link>
          .
        </div>

        <AdjacentNav person={person} />
      </article>
    </>
  );
}
