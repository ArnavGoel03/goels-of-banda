import Link from "next/link";

export type PersonCardData = {
  slug: string;
  name: string;
  alias?: string;
  sub?: string;
  age?: string;
  badge?: string;
  deceased?: boolean;
  newborn?: boolean;
  self?: boolean;
  placeholder?: boolean;
};

export const CARD_WIDTH = 170;
export const CARD_HEIGHT = 74;

export function PersonCard({ data }: { data: PersonCardData }) {
  const { slug, name, alias, sub, age, badge, deceased, newborn, self, placeholder } = data;
  const isClickable = !placeholder && slug !== "#" && !slug.startsWith("__");

  const inner = (
    <div
      className={[
        "group relative w-[170px] min-h-[74px] rounded-md border px-2.5 py-1.5 text-left transition-all",
        self
          ? "border-accent-700 border-2 bg-accent-400/10 shadow-sm"
          : deceased
            ? "border-ink-200 bg-parchment opacity-85"
            : newborn
              ? "border-newborn bg-parchment"
              : placeholder
                ? "border-ink-200 bg-parchment/60 border-dashed"
                : "border-ink-100 bg-parchment hover:border-accent-700 hover:shadow-md",
      ].join(" ")}
    >
      {isClickable ? (
        <span
          className="absolute right-1.5 top-1 text-[10px] text-ink-300 group-hover:text-accent-700 transition-colors"
          aria-hidden
        >
          ↗
        </span>
      ) : null}
      <p className="font-serif text-[14px] font-semibold text-ink-900 leading-tight pr-3">
        {name}
        {deceased ? <span className="ml-1 text-ink-400">✝</span> : null}
        {newborn ? <span className="ml-1 text-newborn">★</span> : null}
        {self ? <span className="ml-1 text-accent-700">★</span> : null}
      </p>
      {alias ? (
        <p className="text-[10px] italic text-ink-500 leading-tight mt-0.5">
          &ldquo;{alias}&rdquo;
        </p>
      ) : null}
      {badge ? (
        <span className="inline-block mt-1 rounded-sm bg-accent-700 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-parchment font-semibold">
          {badge}
        </span>
      ) : null}
      {age ? (
        <p className="text-[10px] text-ink-600 leading-tight mt-1 font-medium">{age}</p>
      ) : null}
      {sub ? <p className="text-[9px] text-ink-500 leading-tight mt-1">{sub}</p> : null}
    </div>
  );

  if (!isClickable) return inner;
  return (
    <Link
      href={`/people/${slug}`}
      className="no-underline cursor-pointer block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-700 focus-visible:outline-offset-2"
      title={`Open ${name}'s page`}
    >
      {inner}
    </Link>
  );
}
