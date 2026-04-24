import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/config";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The founding story",
  description:
    "How the Goel family of Banda was founded by the brothers Ganesh Prasad and Gondilal Goel in the 1820s, the rise of the family firm Ganesh Prasad Gondilal Saraf, and its continuation across six generations.",
  alternates: { canonical: "/story" },
};

const storyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The founding story of the Goel family of Banda",
  author: { "@type": "Organization", name: site.name, url: site.baseUrl },
  publisher: { "@type": "Organization", name: site.name, url: site.baseUrl },
  description:
    "How the Goel family of Banda was founded by the brothers Ganesh Prasad and Gondilal Goel in the 1820s, and the continuous thread of their saraf (jewellery) firm across six generations.",
  mainEntityOfPage: { "@type": "WebPage", "@id": `${site.baseUrl}/story` },
};

export default function StoryPage() {
  return (
    <>
      <JsonLd data={storyJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Story", url: `${site.baseUrl}/story` },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pt-14 pb-10 prose-family">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          The founding story
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.05]">
          Six generations of Banda sarafs
        </h1>
        <p className="mt-6 font-serif text-xl italic text-ink-600 leading-snug">
          Two brothers, one heritage building, and a family trade that has carried the
          founder&apos;s name forward for nearly two hundred years.
        </p>

        <h2>The namesakes, 1820s, Banda</h2>
        <p>
          The Goel family&apos;s presence in Banda begins in the 1820s with two brothers:{" "}
          <strong>Ganesh Prasad Goel</strong> and <strong>Gondilal Goel</strong>. They are
          the earliest named ancestors in the family&apos;s oral record. Of the two,{" "}
          Gondilal is on the direct paternal line of the current generation; Ganesh
          Prasad is his brother, the great-granduncle of their great-grandsons and
          onward.
        </p>

        <h2>The founding of the firm, next generation</h2>
        <p>
          Gondilal&apos;s son opened a jewellery shop in Banda and gave it a compound name
          that honored both older brothers:{" "}
          <strong>&ldquo;Ganesh Prasad Gondilal Saraf&rdquo;</strong>, literally,{" "}
          <em>the firm of Ganesh Prasad, son-of-Gondilal, jewellers</em>. It is a classic
          North Indian naming convention; in a single business title the founder&apos;s
          name, his father&apos;s name, and the trade are all preserved. That firm has
          run continuously in Banda for around 150 years.
        </p>

        <h2>Three unnamed generations, 1850s to 1910s</h2>
        <p>
          Between the namesake generation and the current family&apos;s grandfather
          (Radha Krishna Goel, born 1942), there are three intermediate ancestors whose
          names have yet to be recovered, Gondilal&apos;s son (the shop founder, c. 1850s),
          his grandson (c. 1880s), and his great-grandson (c. 1910s, the father of Radha
          Krishna and his six siblings).
        </p>

        <h2>The split, 2000, Banda</h2>
        <p>
          In 2000, when the ancestral firm reached <strong>Radha Krishna Goel</strong>,
          the eldest of four brothers, he stepped aside and gave up his share to his
          three younger brothers. He opened a separate jewellery shop in the heart of
          Banda and named it simply <strong>&ldquo;Gondilal Saraf&rdquo;</strong>,
          dropping &ldquo;Ganesh Prasad&rdquo; from the title and keeping only his
          direct ancestor&apos;s name. A couple of years later, his father passed away.
          That new shop is run today by his sons Rohit and Vinod Goel.
        </p>

        <h2>Three shops inside one heritage building</h2>
        <p>
          The original &ldquo;Ganesh Prasad Gondilal Saraf&rdquo; building still stands
          in Banda. Its three younger brothers&apos; lines each run a jewellery shop
          inside it today:
        </p>
        <ul>
          <li>
            <strong>Upper floor (via stairs):</strong> the second brother&apos;s shop, 
            originally gold-only, now selling both gold and silver.
          </li>
          <li>
            <strong>Ground floor (one half):</strong> Manmohan Goel&apos;s shop, gold and
            silver.
          </li>
          <li>
            <strong>Ground floor (other half):</strong> Sohan Goel&apos;s shop, gold and
            silver, co-run with his youngest son.
          </li>
        </ul>

        <h2>Six active family jewellery businesses, one ancestor</h2>
        <p>
          Counting Radha Krishna&apos;s standalone shop (Gondilal Saraf), the modernised
          offshoot run by Manmohan&apos;s son Avijit &ldquo;Honey&rdquo; Goel (Gondilal
          Kiva, Gular Naka, Banda, est. 2016), and a new shop opened by two of
          Sohan&apos;s elder sons, the family today operates at least{" "}
          <strong>six active jewellery shops in Banda</strong>, all tracing to a single
          ancestor named Gondilal.
        </p>

        <h2>And beyond Banda</h2>
        <p>
          The family&apos;s branches outside the ancestral trade are equally specific: a
          stockbroking firm (AG Shares &amp; Securities) registered in Agra with a Dubai
          branch, and a wire-manufacturing business (MP Wire India, est. 1989) in Kanpur
          run by a daughter-in-law&apos;s husband.
        </p>

        <p className="mt-10">
          <Link href="/family-tree" className="font-medium">
            See the full family tree →
          </Link>
        </p>
      </article>
    </>
  );
}
