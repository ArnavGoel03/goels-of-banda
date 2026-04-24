import Link from "next/link";
import { site } from "@/data/config";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-ink-100 bg-parchment/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="font-serif text-lg font-semibold tracking-tight text-ink-900 group-hover:text-accent-700 transition-colors">
            {site.shortName}
          </span>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-ink-500 sm:inline">
            since 1820s · Banda
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 text-sm">
            <NavLink href="/story">Story</NavLink>
            <NavLink href="/family-tree">Tree</NavLink>
            <NavLink href="/timeline">Timeline</NavLink>
            <NavLink href="/stories">Stories</NavLink>
            <NavLink href="/people">People</NavLink>
            <NavLink href="/businesses">Businesses</NavLink>
            <NavLink href="/places">Places</NavLink>
            <NavLink href="/traditions">Traditions</NavLink>
            <NavLink href="/archive">Archive</NavLink>
            <NavLink href="/faq">FAQ</NavLink>
          </nav>
          <SearchTrigger />
          <ThemeToggle />
          <Link
            href="/contribute"
            className="rounded-md bg-accent-700 px-3 py-1.5 text-sm text-parchment hover:bg-accent-800 transition-colors"
          >
            Contribute
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  highlight,
}: {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        highlight
          ? "rounded-md bg-accent-700 px-3 py-1.5 text-parchment hover:bg-accent-800 transition-colors"
          : "rounded-md px-3 py-1.5 text-ink-700 hover:bg-ink-100 hover:text-ink-900 transition-colors"
      }
    >
      {children}
    </Link>
  );
}
