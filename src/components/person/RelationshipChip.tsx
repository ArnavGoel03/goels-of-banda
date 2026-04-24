import Link from "next/link";
import type { Person } from "@/data/types";
import { findRelationshipPath } from "@/lib/relationship";

const VIEWER_SLUG = "aditi-goel";

export function RelationshipChip({ person }: { person: Person }) {
  if (person.slug === VIEWER_SLUG) return null;
  const path = findRelationshipPath(VIEWER_SLUG, person.slug);
  if (!path || path.length < 2) return null;
  const hops = path.length - 1;
  return (
    <Link
      href={`/relationship?from=${VIEWER_SLUG}&to=${person.slug}`}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-700/30 bg-accent-700/5 px-3 py-1 text-xs text-accent-800 hover:bg-accent-700/10 transition-colors"
    >
      <span className="font-medium">How you&rsquo;re related</span>
      <span className="text-accent-700/60">·</span>
      <span>
        {hops} step{hops === 1 ? "" : "s"} from Aditi
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
