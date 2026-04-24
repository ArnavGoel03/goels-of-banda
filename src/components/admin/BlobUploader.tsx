"use client";

import { useMemo, useRef, useState } from "react";
import { uploadBlob, type UploadResult } from "@/app/admin/upload/actions";

type Kind = "photos" | "audio" | "documents";

const KINDS: { value: Kind; label: string; accept: string; hint: string }[] = [
  { value: "photos", label: "Photo", accept: "image/*", hint: "JPG or PNG, compress under 3 MB." },
  { value: "audio", label: "Audio clip", accept: "audio/*", hint: "MP3 or M4A, aim under 4 MB (~3 min)." },
  { value: "documents", label: "Document", accept: ".pdf,image/*", hint: "PDF scan or photo of the original." },
];

function snippetFor(r: Extract<UploadResult, { ok: true }>): string {
  if (r.kind === "photos") {
    const lines = [
      `{`,
      `  src: ${JSON.stringify(r.url)},`,
      r.caption ? `  caption: ${JSON.stringify(r.caption)},` : null,
      r.year ? `  year: ${Number(r.year) || `"${r.year}"`},` : null,
      `}`,
    ].filter(Boolean);
    return lines.join("\n");
  }
  if (r.kind === "audio") {
    const lines = [
      `{`,
      `  src: ${JSON.stringify(r.url)},`,
      `  title: ${JSON.stringify(r.caption || "Clip title")},`,
      `}`,
    ];
    return lines.join("\n");
  }
  if (r.kind === "documents") {
    const lines = [
      `{`,
      `  slug: ${JSON.stringify(r.slug ?? "new-document")},`,
      `  title: ${JSON.stringify(r.caption || "Document title")},`,
      `  kind: "photo",`,
      `  imageUrl: ${JSON.stringify(r.url)},`,
      `  description: ""`,
      `}`,
    ];
    return lines.join("\n");
  }
  return `"${r.url}"`;
}

export function BlobUploader() {
  const [kind, setKind] = useState<Kind>("photos");
  const [file, setFile] = useState<File | null>(null);
  const [personSlug, setPersonSlug] = useState("");
  const [caption, setCaption] = useState("");
  const [year, setYear] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = useMemo(() => KINDS.find((k) => k.value === kind)!, [kind]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || submitting) return;
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", kind);
    fd.set("token", token);
    if (personSlug) fd.set("personSlug", personSlug);
    if (caption) fd.set("caption", caption);
    if (year) fd.set("year", year);
    setSubmitting(true);
    setResult(null);
    try {
      const r = await uploadBlob(fd);
      setResult(r);
      if (r.ok) setFile(null);
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => setKind(k.value)}
            className={
              k.value === kind
                ? "rounded-full bg-accent-700 px-3 py-1 text-sm text-parchment"
                : "rounded-full border border-ink-200 px-3 py-1 text-sm text-ink-700 hover:border-accent-700"
            }
          >
            {k.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-500">{current.hint}</p>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) setFile(f);
        }}
        className={
          "flex items-center justify-center rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors " +
          (dragOver
            ? "border-accent-700 bg-accent-700/5"
            : "border-ink-200 bg-parchment hover:border-accent-400")
        }
      >
        {file ? (
          <div>
            <p className="font-medium text-ink-900">{file.name}</p>
            <p className="mt-1 text-xs text-ink-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "unknown type"}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="mt-2 text-xs text-accent-700 underline"
            >
              Choose a different file
            </button>
          </div>
        ) : (
          <div>
            <p className="font-serif text-lg text-ink-800">
              Drop a {current.label.toLowerCase()} here
            </p>
            <p className="mt-1 text-xs text-ink-500">or click to browse</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={current.accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
          className="hidden"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Person slug (for organising)"
          value={personSlug}
          onChange={setPersonSlug}
          placeholder="e.g. radha-krishna-goel"
        />
        <Field
          label={kind === "photos" ? "Caption" : kind === "audio" ? "Clip title" : "Title"}
          value={caption}
          onChange={setCaption}
        />
      </div>
      {kind === "photos" ? (
        <Field label="Year" value={year} onChange={setYear} placeholder="e.g. 1998" />
      ) : null}

      <Field
        label="Admin upload token"
        value={token}
        onChange={setToken}
        type="password"
        placeholder="Set ADMIN_UPLOAD_TOKEN in Vercel env vars"
      />

      <button
        type="submit"
        disabled={!file || !token || submitting}
        className="rounded-md bg-accent-700 px-4 py-2 text-sm font-medium text-parchment hover:bg-accent-800 disabled:bg-ink-200 disabled:text-ink-500"
      >
        {submitting ? "Uploading…" : "Upload"}
      </button>

      {result && !result.ok ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {result.error}
        </p>
      ) : null}

      {result && result.ok ? (
        <div className="space-y-3 rounded-md border border-green-300 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-900">
            Uploaded. Copy this into{" "}
            {result.kind === "photos"
              ? "the person's photos[] in people.ts"
              : result.kind === "audio"
                ? "the person's oralHistories[] in people.ts"
                : "documents.ts"}
            .
          </p>
          <Snippet text={snippetFor(result)} />
          <p className="text-xs text-ink-600 break-all">
            Direct URL:{" "}
            <a
              href={result.url}
              rel="noopener"
              className="text-accent-700 underline"
            >
              {result.url}
            </a>
          </p>
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-ink-500 font-medium">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-ink-200 bg-parchment px-3 py-1.5 text-sm text-ink-900 focus:border-accent-700 focus:outline-none"
      />
    </label>
  );
}

function Snippet({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md border border-ink-200 bg-parchment/80 px-2 py-0.5 text-xs text-ink-700 hover:border-accent-700"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre className="overflow-auto rounded-md border border-ink-100 bg-ink-900 px-3 py-3 text-xs leading-relaxed text-parchment">
        <code>{text}</code>
      </pre>
    </div>
  );
}
