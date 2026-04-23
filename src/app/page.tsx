import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/data/config";
import { businesses } from "@/data/businesses";
import { people } from "@/data/people";
import { places } from "@/data/places";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: `${site.name} — 200 years of jewellers in Banda, Uttar Pradesh`,
  description: site.description,
  alternates: { canonical: "/" },
};

const livingCount = people.filter((p) => p.isLiving).length;
const bandaBusinesses = businesses.filter((b) => b.city === "Banda").length;

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: site.baseUrl }])} />

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          Banda, Uttar Pradesh · Since the 1820s
        </p>
        <h1 className="mt-4 font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] text-ink-900">
          The Goel Family of Banda
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl sm:text-2xl italic text-ink-600 leading-snug">
          {site.tagline}
        </p>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 max-w-3xl">
          <Stat value="200+" label="years in Banda" />
          <Stat value="6" label="generations" />
          <Stat value={`${livingCount}+`} label="living family members" />
          <Stat value={`${bandaBusinesses}`} label="family shops in Banda" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 prose-family">
        <h2>The founding story</h2>
        <p className="lead">
          In the 1820s, two brothers — <strong>Ganesh Prasad Goel</strong> and{" "}
          <strong>Gondilal Goel</strong> — settled in Banda, a small town in what is now
          Uttar Pradesh. A generation later, Gondilal&apos;s son opened a jewellery shop
          and named it after both his father and his uncle:{" "}
          <em>&ldquo;Ganesh Prasad Gondilal Saraf&rdquo;</em> — the Hindi word{" "}
          <em>saraf</em> meaning goldsmith and silver-dealer.
        </p>
        <p>
          The shop has passed down within the family ever since. Today, the original
          heritage building in the heart of Banda still stands — and still houses three
          separate jewellery shops, one upstairs and two on the ground floor, each run
          by a different branch of the family. Around it, the Goels now operate at
          least six jewellery businesses, all descending from the same 1820s founding.
        </p>
        <p>
          This site tells that story — and traces the six generations that followed,
          from Banda outward to Jhansi, Kanpur, Agra, Jaipur, Chandigarh, Dubai,
          California, Ohio, and beyond.
        </p>
        <p className="mt-6">
          <Link href="/story" className="font-medium">
            Read the full founding story →
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="font-serif text-2xl font-semibold text-ink-900 border-b border-ink-100 pb-2">
          Explore the family
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExploreCard
            href="/family-tree"
            title="Family tree"
            copy="The full visual tree, six generations deep."
          />
          <ExploreCard
            href="/people"
            title="All people"
            copy={`${people.length} family members with individual profiles.`}
          />
          <ExploreCard
            href="/businesses"
            title="Family businesses"
            copy={`${businesses.length} enterprises — from heritage jewellery to modern manufacturing.`}
          />
          <ExploreCard
            href="/places"
            title="Places"
            copy={`${places.length} cities on three continents where the family lives and works.`}
          />
          <ExploreCard
            href="/faq"
            title="Frequently asked"
            copy="Short answers to questions about the family and the firms."
          />
          <ExploreCard
            href="/contribute"
            title="Add a memory"
            copy="Names, dates, stories, photos — help fill in what's missing."
          />
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-gold pl-4 py-1">
      <p className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 leading-none">
        {value}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-500">
        {label}
      </p>
    </div>
  );
}

function ExploreCard({
  href,
  title,
  copy,
}: {
  href: string;
  title: string;
  copy: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-md border border-ink-100 bg-parchment p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-sm"
    >
      <p className="font-serif text-xl font-semibold text-ink-900 group-hover:text-accent-700">
        {title}
      </p>
      <p className="mt-1 text-sm text-ink-600">{copy}</p>
      <p className="mt-3 text-xs text-accent-700 opacity-0 group-hover:opacity-100 transition-opacity">
        Open →
      </p>
    </Link>
  );
}
