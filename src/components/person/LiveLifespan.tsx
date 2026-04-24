"use client";

import { useEffect, useState } from "react";
import type { Person } from "@/data/types";
import { computeAge } from "@/lib/schema";

export function LiveLifespan({
  person,
  fallback,
}: {
  person: Person;
  fallback?: string;
}) {
  const [label, setLabel] = useState<string | undefined>(fallback);

  useEffect(() => {
    setLabel(buildLifespanFresh(person));
    const interval = setInterval(() => {
      setLabel(buildLifespanFresh(person));
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [person]);

  if (!label) return null;
  return <p className="mt-5 font-serif text-lg text-ink-700">{label}</p>;
}

function buildLifespanFresh(person: Person): string | undefined {
  const b = person.birth?.year;
  const d = person.death?.year;
  const approx = person.birth?.yearApprox ? "c. " : "";
  const age = computeAge(person, new Date());
  if (b && d) {
    const suffix = age ? ` (aged ${age.years})` : "";
    return `${approx}${b} – ${d}${suffix}`;
  }
  if (b && person.isLiving) {
    const suffix = age ? ` (age ${age.years})` : "";
    return `b. ${approx}${b}${suffix}`;
  }
  if (b) return `b. ${approx}${b}`;
  return undefined;
}
