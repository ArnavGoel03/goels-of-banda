import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerson, people } from "@/data/people";
import { getBusiness } from "@/data/businesses";
import { JsonLd } from "@/components/JsonLd";
import {
  personJsonLd,
  displayBirth,
  displayDeath,
  breadcrumbJsonLd,
  personUrl,
  businessUrl,
} from "@/lib/schema";
import { site } from "@/data/config";

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
  const title = `${person.name}${person.altNames?.[0] ? ` ("${person.altNames[0]}")` : ""}`;
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
      title: `${title} — ${site.shortName}`,
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

  const father = person.parents?.father ? getPerson(person.parents.father) : undefined;
  const mother = person.parents?.mother ? getPerson(person.parents.mother) : undefined;
  const spouse = person.spouse ? getPerson(person.spouse.slug) : undefined;
  const children = (person.children ?? [])
    .map((s) => getPerson(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const businessList = (person.businessSlugs ?? [])
    .map((s) => getBusiness(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

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

      <article className="mx-auto max-w-3xl px-6 pt-12 pb-16">
        <Link
          href="/people"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium"
        >
          ← All people
        </Link>

        <header className="mt-4 border-b border-ink-100 pb-6">
          {person.familyRole ? (
            <p className="text-xs uppercase tracking-[0.22em] text-ink-500 font-medium">
              {person.familyRole}
            </p>
          ) : null}
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.05]">
            {person.name}
            {!person.isLiving ? <span className="ml-2 text-ink-400">✝</span> : null}
          </h1>
          {person.altNames && person.altNames.length > 0 ? (
            <p className="mt-2 font-serif text-xl italic text-ink-600">
              also known as {person.altNames.map((n) => `"${n}"`).join(", ")}
            </p>
          ) : null}

          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {displayBirth(person) ? (
              <Fact label="Born">{displayBirth(person)}</Fact>
            ) : null}
            {displayDeath(person) ? (
              <Fact label="Died">{displayDeath(person)}</Fact>
            ) : null}
            {person.currentLocation && person.isLiving ? (
              <Fact label="Lives in">{person.currentLocation}</Fact>
            ) : null}
            {person.occupation ? (
              <Fact label="Work">{person.occupation}</Fact>
            ) : null}
            {person.birthFamilySurname ? (
              <Fact label="Birth family">{person.birthFamilySurname}</Fact>
            ) : null}
          </dl>
        </header>

        {person.bio ? (
          <section className="prose-family mt-8">
            <p className="lead">{person.bio}</p>
          </section>
        ) : null}

        {(father || mother || spouse || children.length > 0) && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
              Family
            </h2>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
              {father || mother ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.15em] text-ink-500">
                    Parents
                  </dt>
                  <dd className="mt-1 space-x-2">
                    {father ? (
                      <PersonLink slug={father.slug} name={father.name} />
                    ) : null}
                    {father && mother ? (
                      <span className="text-ink-400">·</span>
                    ) : null}
                    {mother ? (
                      <PersonLink slug={mother.slug} name={mother.name} />
                    ) : null}
                  </dd>
                </div>
              ) : null}
              {spouse ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.15em] text-ink-500">
                    Spouse
                  </dt>
                  <dd className="mt-1">
                    <PersonLink slug={spouse.slug} name={spouse.name} />
                  </dd>
                </div>
              ) : null}
              {children.length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-[0.15em] text-ink-500">
                    Children
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {children.map((c) => (
                      <PersonLink key={c.slug} slug={c.slug} name={c.name} />
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        )}

        {businessList.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
              Connected businesses
            </h2>
            <ul className="mt-4 space-y-3">
              {businessList.map((b) => (
                <li
                  key={b.slug}
                  className="border-l-2 border-gold pl-4 py-1"
                >
                  <Link
                    href={`/businesses/${b.slug}`}
                    className="font-serif text-lg font-semibold text-ink-900 hover:text-accent-700"
                  >
                    {b.name}
                  </Link>
                  <p className="text-sm text-ink-600">
                    {b.kind} · {b.city}
                    {b.state ? `, ${b.state}` : ""}
                    {b.established ? ` · est. ${b.established}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {person.sources && person.sources.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-ink-900 border-b border-ink-100 pb-1">
              Sources
            </h2>
            <ul className="mt-4 space-y-1 text-sm">
              {person.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    className="text-accent-700 hover:text-accent-800 underline"
                    rel="noopener"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {person.notes ? (
          <section className="mt-10 text-xs text-ink-500 italic">
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
      </article>
    </>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <dt className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
        {label}
      </dt>
      <dd className="text-ink-900">{children}</dd>
    </div>
  );
}

function PersonLink({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={`/people/${slug}`}
      className="inline-block font-medium text-accent-700 hover:text-accent-800 underline decoration-1 underline-offset-2"
    >
      {name}
    </Link>
  );
}
