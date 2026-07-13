import Link from "next/link";

/**
 * One contributed entry in a list, in the same card idiom as the rest of the
 * site. The voice marker is the one addition: a recipe you can hear is worth
 * more than one you can only read, and the list should say which ones have that.
 */
export function EntryCard({
  href,
  title,
  meta,
  summary,
  toldBy,
  hasAudio,
  photoUrl,
}: {
  href: string;
  title: string;
  meta?: string | null;
  summary?: string | null;
  toldBy?: string | null;
  hasAudio?: boolean;
  photoUrl?: string | null;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex h-full gap-4 rounded-lg border border-ink-100 bg-parchment p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400"
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-md object-cover"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          {meta ? (
            <p className="text-[10px] uppercase tracking-[0.15em] text-accent-700 font-medium">
              {meta}
            </p>
          ) : null}
          <p className="mt-2 font-serif text-xl text-ink-900 group-hover:text-accent-700">
            {title}
          </p>
          {summary ? (
            <p className="mt-1 line-clamp-3 text-sm text-ink-600">{summary}</p>
          ) : null}
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-ink-500">
            {toldBy ? <span>From {toldBy}</span> : null}
            {toldBy && hasAudio ? <span aria-hidden>·</span> : null}
            {hasAudio ? <span className="text-accent-700">In their own voice</span> : null}
          </p>
        </div>
      </Link>
    </li>
  );
}
