"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { findRelationshipPath } from "@/lib/relationship";
import { getPerson } from "@/data/people";
import { PersonSelect } from "@/components/relationship/PersonSelect";
import { RelationshipPath } from "@/components/relationship/RelationshipPath";

export default function RelationshipPage() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(
    searchParams.get("from") ?? "arnav-goel",
  );
  const [to, setTo] = useState(
    searchParams.get("to") ?? "radha-krishna-goel",
  );

  useEffect(() => {
    const qFrom = searchParams.get("from");
    const qTo = searchParams.get("to");
    if (qFrom && qFrom !== from) setFrom(qFrom);
    if (qTo && qTo !== to) setTo(qTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const path = useMemo(() => findRelationshipPath(from, to), [from, to]);
  const fromPerson = getPerson(from);
  const toPerson = getPerson(to);
  const viewerIsFirst = from === "arnav-goel";

  return (
    <article className="mx-auto max-w-3xl px-6 pt-12 pb-16">
      <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
        Relationship finder
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900">
        How are they related?
      </h1>
      <p className="mt-3 max-w-2xl text-ink-600">
        Pick any two people in the family and see the shortest chain of
        parent–child, sibling, and marriage links between them.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <PersonSelect label="From" value={from} onChange={setFrom} />
        <PersonSelect label="To" value={to} onChange={setTo} />
      </div>

      <section className="mt-10 rounded-lg border border-ink-100 bg-parchment p-6">
        {path && path.length > 1 && fromPerson && toPerson ? (
          <>
            <p className="text-sm text-ink-500">
              <Link
                href={`/people/${fromPerson.slug}`}
                className="font-medium text-ink-900 hover:text-accent-700"
              >
                {fromPerson.name}
              </Link>{" "}
              to{" "}
              <Link
                href={`/people/${toPerson.slug}`}
                className="font-medium text-ink-900 hover:text-accent-700"
              >
                {toPerson.name}
              </Link>{" "}
              · {path.length - 1} step{path.length - 1 === 1 ? "" : "s"}
            </p>
            <div className="mt-5">
              <RelationshipPath path={path} viewerIsFirst={viewerIsFirst} />
            </div>
          </>
        ) : path && path.length === 1 ? (
          <p className="text-ink-600">That is the same person.</p>
        ) : (
          <p className="text-ink-600">
            No connection found in the family graph.
          </p>
        )}
      </section>
    </article>
  );
}
