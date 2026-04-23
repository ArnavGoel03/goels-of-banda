import Link from "next/link";
import { site } from "@/data/config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-parchment-dark">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-serif text-base font-semibold text-ink-900">{site.shortName}</p>
            <p className="mt-2 leading-relaxed">
              A living record of the Goel family of Banda, Uttar Pradesh, maintained collaboratively by the family.
            </p>
          </div>
          <div>
            <p className="font-serif text-base font-semibold text-ink-900">Explore</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/story" className="hover:text-accent-700">Founding story</Link></li>
              <li><Link href="/family-tree" className="hover:text-accent-700">Family tree</Link></li>
              <li><Link href="/people" className="hover:text-accent-700">All people</Link></li>
              <li><Link href="/businesses" className="hover:text-accent-700">Family businesses</Link></li>
              <li><Link href="/places" className="hover:text-accent-700">Places</Link></li>
              <li><Link href="/faq" className="hover:text-accent-700">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-serif text-base font-semibold text-ink-900">Contribute</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/contribute" className="hover:text-accent-700">
                  Add names, dates, or stories
                </Link>
              </li>
              <li>
                <a href={site.repoUrl} className="hover:text-accent-700" rel="noopener">
                  View source on GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contactEmail}`} className="hover:text-accent-700">
                  Email the family
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-ink-100 pt-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {site.copyrightStart}–{new Date().getFullYear()} The Goel Family of Banda. All rights respected.
          </p>
          <p className="text-ink-500">
            Version history is preserved in the{" "}
            <a href={site.repoUrl} className="underline hover:text-accent-700">public repository</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
