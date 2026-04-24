"use client";

import { useMemo, useState } from "react";
import { site } from "@/data/config";

export function ContributeForm() {
  const [concerns, setConcerns] = useState("");
  const [change, setChange] = useState("");
  const [source, setSource] = useState("");
  const [other, setOther] = useState("");
  const [relation, setRelation] = useState("");

  const url = useMemo(() => {
    const body = [
      `### Who / what does this concern?`,
      concerns || "_(name or page, e.g. \"Rohit Goel\" or \"/places/banda\")_",
      ``,
      `### What should be added, changed, or corrected?`,
      change,
      ``,
      `### Source or how you know this`,
      source,
      ``,
      `### Your relation to the family (optional)`,
      relation,
      ``,
      `### Anything else`,
      other,
    ].join("\n");
    return `${site.repoUrl}/issues/new?labels=contribution&title=${encodeURIComponent("Family tree addition")}&body=${encodeURIComponent(body)}`;
  }, [concerns, change, source, relation, other]);

  const hasContent = concerns.trim() || change.trim();

  return (
    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Field label="Who or what does this concern?" value={concerns} onChange={setConcerns} placeholder='e.g. "Rohit Goel" or "/places/banda"' />
      <Field
        label="What should be added, changed, or corrected?"
        value={change}
        onChange={setChange}
        multiline
        required
      />
      <Field
        label="How do you know? (optional — dadaji told me, a letter, a photo…)"
        value={source}
        onChange={setSource}
        multiline
      />
      <Field
        label="Your relation to the family (optional)"
        value={relation}
        onChange={setRelation}
      />
      <Field label="Anything else (optional)" value={other} onChange={setOther} multiline />

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <a
          href={hasContent ? url : undefined}
          rel="noopener"
          aria-disabled={!hasContent}
          className={
            hasContent
              ? "inline-block rounded-md bg-accent-700 px-4 py-2 text-sm font-medium text-parchment no-underline hover:bg-accent-800 transition-colors"
              : "inline-block rounded-md bg-ink-200 px-4 py-2 text-sm font-medium text-ink-500 no-underline pointer-events-none"
          }
        >
          Open this on GitHub →
        </a>
        <a
          href={`mailto:${site.contactEmail}?subject=${encodeURIComponent("Goels of Banda — contribution")}&body=${encodeURIComponent([concerns, change, source, relation, other].filter(Boolean).join("\n\n"))}`}
          className="text-sm text-accent-700 underline"
        >
          Or send by email
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const common =
    "mt-1 w-full rounded-md border border-ink-200 bg-parchment px-3 py-2 text-sm text-ink-900 focus:border-accent-700 focus:outline-none";
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium">
        {label}
        {required ? <span className="text-accent-700"> *</span> : null}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${common} min-h-[92px]`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={common}
        />
      )}
    </label>
  );
}
