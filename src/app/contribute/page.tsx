import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/config";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Help complete the Goel family of Banda's living history, add names, correct details, share stories or photos.",
  alternates: { canonical: "/contribute" },
};

const newIssueTemplate = encodeURIComponent(
  `### Who / what does this concern?\n_(name or page, e.g. "Rohit Goel" or "/places/banda")_\n\n### What should be added, changed, or corrected?\n\n### Source or how you know this\n_(optional, dadaji told you, a document, a photo, etc.)_\n\n### Anything else\n`,
);

const issueUrl = `${site.repoUrl}/issues/new?labels=contribution&title=Family%20tree%20addition&body=${newIssueTemplate}`;

export default function ContributePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "Contribute", url: `${site.baseUrl}/contribute` },
        ])}
      />

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 prose-family">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          Help us complete it
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.05]">
          Add a name, a date, a story
        </h1>

        <p className="lead mt-4">
          This tree is a living record of the family, not a finished book. Every page
          still has gaps. If you know something that should be added or corrected,
          please contribute.
        </p>

        <h2>Three ways to contribute</h2>

        <h3>1. Open an issue on GitHub</h3>
        <p>
          The fastest way. You&apos;ll need a GitHub account (free). Click the button
          below to open a pre-filled issue form.
        </p>
        <p>
          <a
            href={issueUrl}
            rel="noopener"
            className="inline-block rounded-md bg-accent-700 px-4 py-2 text-sm font-medium text-parchment no-underline hover:bg-accent-800 transition-colors"
          >
            Open a new issue on GitHub →
          </a>
        </p>

        <h3>2. Email the family</h3>
        <p>
          Not on GitHub? Send an email to{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with the
          addition or correction. Please include the person or page it concerns, what
          should change, and, if you&apos;re comfortable, how you know.
        </p>

        <h3>3. Submit a pull request (technical)</h3>
        <p>
          If you&apos;re comfortable with git, the family data lives in{" "}
          <code className="rounded bg-ink-100 px-1 py-0.5 text-sm">src/data/</code> in
          the public{" "}
          <a href={site.repoUrl} rel="noopener">
            GitHub repository
          </a>
          . Fork, edit, and open a pull request.
        </p>

        <h2>What&apos;s still missing</h2>
        <ul>
          <li>
            The name of Radha Krishna Goel&apos;s second brother, his wife, and his 3
            sons and 1 Australia-based daughter.
          </li>
          <li>
            The names of the three paternal grand-aunts (Radha Krishna&apos;s sisters), 
            the one in Banda, the one in Gurugram, and the one who passed (in Allahabad).
          </li>
          <li>
            The 12 siblings of Ramesh Chandra Agarwal (maternal grandfather), all of
            whom live in Jhansi.
          </li>
          <li>
            The three direct paternal ancestors between Gondilal Goel (c. 1820s) and
            Radha Krishna Goel (b. 1942).
          </li>
          <li>Exact birth years for most grandparents and older cousins.</li>
          <li>
            Photographs of the Ganesh Prasad Gondilal Saraf heritage building, exterior,
            the stairs to the upper-floor shop, and the ground-floor shopfronts.
          </li>
        </ul>

        <h2>A note on privacy</h2>
        <p>
          Profiles of minors are minimal by design and are not indexed by search
          engines. If you are in the family and would prefer a profile be removed or
          reduced, just ask, there is no argument required.{" "}
          <Link href="/faq">See the FAQ</Link> for more details.
        </p>

        <p className="mt-10 text-sm text-ink-500">
          Every contribution is preserved in the{" "}
          <a href={site.repoUrl} rel="noopener">
            public repository&apos;s git history
          </a>
          . You can see who added what, and when. The site is rebuilt from the same
          data every time anything changes, so previous versions are always accessible.
        </p>
      </section>
    </>
  );
}
