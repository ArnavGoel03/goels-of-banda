import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { VoiceNote } from "@/components/VoiceNote";
import { breadcrumbJsonLd } from "@/lib/schema";
import { getTradition, listTraditions, mediaUrl } from "@/lib/contributions";
import { peopleBySlug } from "@/data/people";
import { site } from "@/data/config";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const traditions = await listTraditions();
  return traditions.map((t) => ({ slug: t.slug! }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const tradition = await getTradition(slug);
  if (!tradition) return { title: "Not found" };
  return {
    title: tradition.title,
    description: (tradition.summary ?? tradition.body).slice(0, 170),
    alternates: { canonical: `/traditions/${slug}` },
  };
}

const KIND_LABEL: Record<string, string> = {
  festival: "Festival custom",
  ritual: "Ritual",
  saying: "Saying",
  custom: "Custom",
};

export default async function TraditionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const tradition = await getTradition(slug);
  if (!tradition) return notFound();

  const photo = mediaUrl(tradition.photoKey);
  const audio = mediaUrl(tradition.audioKey);
  const teller = tradition.toldBySlug ? peopleBySlug[tradition.toldBySlug] : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Traditions", url: `${site.baseUrl}/traditions` },
          { name: tradition.title, url: `${site.baseUrl}/traditions/${slug}` },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-10 pb-16 prose-family">
        <Link
          href="/traditions"
          className="text-xs uppercase tracking-[0.18em] text-accent-700 hover:text-accent-800 font-medium no-underline"
        >
          Traditions
        </Link>

        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-ink-500">
          {[KIND_LABEL[tradition.kind] ?? tradition.kind, tradition.occasion]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink-900">{tradition.title}</h1>

        {tradition.toldBy ? (
          <p className="mt-2 text-sm text-ink-600 not-prose">
            Kept by{" "}
            {teller ? (
              <Link href={`/people/${teller.slug}`} className="text-accent-700 underline">
                {tradition.toldBy}
              </Link>
            ) : (
              tradition.toldBy
            )}
          </p>
        ) : null}

        {tradition.summary ? <p className="lead mt-3">{tradition.summary}</p> : null}

        {audio ? (
          <VoiceNote
            src={audio}
            toldBy={tradition.toldBy}
            transcript={tradition.audioTranscript}
          />
        ) : null}

        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={tradition.title}
            className="my-8 w-full rounded-md border border-ink-100"
          />
        ) : null}

        {tradition.body
          .split("\n")
          .filter(Boolean)
          .map((p, i) => (
            <p key={i}>{p}</p>
          ))}
      </article>
    </>
  );
}
