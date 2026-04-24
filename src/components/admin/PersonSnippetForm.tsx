"use client";

import { useMemo, useState } from "react";

type Fields = {
  slug: string;
  name: string;
  sex: "M" | "F" | "U";
  birthDate: string;
  birthYear: string;
  birthPlace: string;
  isLiving: boolean;
  familyRole: string;
  currentLocation: string;
  occupation: string;
  father: string;
  mother: string;
  spouse: string;
  generation: string;
  bio: string;
  publicity: "full" | "summary" | "minimal";
};

const EMPTY: Fields = {
  slug: "",
  name: "",
  sex: "M",
  birthDate: "",
  birthYear: "",
  birthPlace: "",
  isLiving: true,
  familyRole: "",
  currentLocation: "",
  occupation: "",
  father: "",
  mother: "",
  spouse: "",
  generation: "",
  bio: "",
  publicity: "full",
};

function indent(s: string): string {
  return s
    .split("\n")
    .map((l) => (l ? `    ${l}` : l))
    .join("\n");
}

function generate(f: Fields): string {
  const lines: string[] = [];
  lines.push(`  {`);
  lines.push(`    slug: "${f.slug}",`);
  lines.push(`    name: ${JSON.stringify(f.name)},`);
  lines.push(`    sex: "${f.sex}",`);
  const birthParts: string[] = [];
  if (f.birthDate) birthParts.push(`date: ${JSON.stringify(f.birthDate)}`);
  if (f.birthYear) birthParts.push(`year: ${f.birthYear}`);
  if (f.birthPlace) birthParts.push(`place: ${JSON.stringify(f.birthPlace)}`);
  if (birthParts.length) lines.push(`    birth: { ${birthParts.join(", ")} },`);
  lines.push(`    isLiving: ${f.isLiving ? "true" : "false"},`);
  if (f.generation) lines.push(`    generation: ${f.generation},`);
  if (f.familyRole) lines.push(`    familyRole: ${JSON.stringify(f.familyRole)},`);
  if (f.currentLocation)
    lines.push(`    currentLocation: ${JSON.stringify(f.currentLocation)},`);
  if (f.occupation) lines.push(`    occupation: ${JSON.stringify(f.occupation)},`);
  if (f.father || f.mother) {
    const parentParts: string[] = [];
    if (f.father) parentParts.push(`father: "${f.father}"`);
    if (f.mother) parentParts.push(`mother: "${f.mother}"`);
    lines.push(`    parents: { ${parentParts.join(", ")} },`);
  }
  if (f.spouse) lines.push(`    spouse: { slug: "${f.spouse}" },`);
  lines.push(`    publicity: "${f.publicity}",`);
  lines.push(`    bio:`);
  lines.push(indent(JSON.stringify(f.bio || "")) + ",");
  lines.push(`  },`);
  return lines.join("\n");
}

const FIELD_LABEL = "text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium";
const FIELD_INPUT =
  "mt-1 w-full rounded-md border border-ink-200 bg-parchment px-3 py-1.5 text-sm text-ink-900 focus:border-accent-700 focus:outline-none";

export function PersonSnippetForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(() => generate(fields), [fields]);

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setCopied(false);
  };

  const copy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <TextField label="Slug (kebab-case)" value={fields.slug} onChange={(v) => update("slug", v)} />
        <TextField label="Name" value={fields.name} onChange={(v) => update("name", v)} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={FIELD_LABEL}>Sex</span>
            <select
              value={fields.sex}
              onChange={(e) => update("sex", e.target.value as Fields["sex"])}
              className={FIELD_INPUT}
            >
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="U">U</option>
            </select>
          </label>
          <TextField
            label="Generation"
            value={fields.generation}
            onChange={(v) => update("generation", v)}
            placeholder="e.g. 4"
          />
        </div>
        <TextField
          label='Birth date (e.g. "13 August 1972")'
          value={fields.birthDate}
          onChange={(v) => update("birthDate", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Birth year"
            value={fields.birthYear}
            onChange={(v) => update("birthYear", v)}
          />
          <TextField
            label="Birth place"
            value={fields.birthPlace}
            onChange={(v) => update("birthPlace", v)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={fields.isLiving}
            onChange={(e) => update("isLiving", e.target.checked)}
          />
          Living
        </label>
        <TextField
          label="Family role"
          value={fields.familyRole}
          onChange={(v) => update("familyRole", v)}
          placeholder='e.g. "Cousin"'
        />
        <TextField
          label="Current location"
          value={fields.currentLocation}
          onChange={(v) => update("currentLocation", v)}
        />
        <TextField
          label="Occupation"
          value={fields.occupation}
          onChange={(v) => update("occupation", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Father slug"
            value={fields.father}
            onChange={(v) => update("father", v)}
          />
          <TextField
            label="Mother slug"
            value={fields.mother}
            onChange={(v) => update("mother", v)}
          />
        </div>
        <TextField label="Spouse slug" value={fields.spouse} onChange={(v) => update("spouse", v)} />
        <label className="block">
          <span className={FIELD_LABEL}>Publicity</span>
          <select
            value={fields.publicity}
            onChange={(e) => update("publicity", e.target.value as Fields["publicity"])}
            className={FIELD_INPUT}
          >
            <option value="full">full</option>
            <option value="summary">summary</option>
            <option value="minimal">minimal</option>
          </select>
        </label>
        <label className="block">
          <span className={FIELD_LABEL}>Bio</span>
          <textarea
            value={fields.bio}
            onChange={(e) => update("bio", e.target.value)}
            className={`${FIELD_INPUT} min-h-[140px] font-serif`}
          />
        </label>
      </form>

      <div>
        <div className="flex items-center justify-between">
          <p className={FIELD_LABEL}>TypeScript snippet</p>
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-accent-700/30 bg-accent-700/5 px-3 py-1 text-xs text-accent-700 hover:bg-accent-700/10"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <pre className="mt-2 max-h-[600px] overflow-auto rounded-md border border-ink-100 bg-ink-900 px-3 py-3 text-xs leading-relaxed text-parchment">
          <code>{snippet}</code>
        </pre>
        <p className="mt-3 text-xs text-ink-500">
          Paste inside the <code>people</code> array in{" "}
          <code>src/data/people.ts</code> at the right generation section.
        </p>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={FIELD_LABEL}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={FIELD_INPUT}
      />
    </label>
  );
}
