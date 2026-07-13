"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MediaCapture, type MediaCaptureHandle } from "./MediaCapture";
import { submitContribution } from "@/lib/actions";
import type { ContributionKind } from "@/lib/contributions";

export type PersonOption = { slug: string; name: string; hint?: string };

const KINDS: { key: ContributionKind; label: string; blurb: string }[] = [
  {
    key: "recipe",
    label: "Recipe",
    blurb: "A dish somebody in this family makes, in the way they actually make it.",
  },
  {
    key: "tradition",
    label: "Tradition",
    blurb: "A festival custom, a ritual, a superstition, a phrase only they say.",
  },
  {
    key: "memory",
    label: "Memory",
    blurb: "Something that happened. How two people met, what Banda looked like then.",
  },
];

const TRADITION_KINDS = [
  { value: "festival", label: "Festival custom" },
  { value: "ritual", label: "Ritual" },
  { value: "saying", label: "Saying" },
  { value: "custom", label: "Something else" },
];

export function ContributeSheets({ people }: { people: PersonOption[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<ContributionKind>("recipe");
  const [pending, startTransition] = useTransition();
  const media = useRef<MediaCaptureHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [toldByName, setToldByName] = useState("");
  const [tagged, setTagged] = useState<string[]>([]);

  const byName = new Map(people.map((p) => [p.name.toLowerCase(), p]));

  function toggleTagged(slug: string) {
    setTagged((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (title.length < 2) {
      toast.error("Give it a name first.");
      return;
    }

    startTransition(async () => {
      let photoKey: string | null = null;
      let audioKey: string | null = null;
      try {
        const resolved = await media.current?.resolve();
        photoKey = resolved?.photoKey ?? null;
        audioKey = resolved?.audioKey ?? null;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "The upload failed.");
        return;
      }

      // A typed name that matches somebody on the site becomes a real link, so
      // the entry shows up on their page. A name that matches nobody is still
      // kept, as text: an aunt who is not on the site yet still gets the credit.
      const matched = byName.get(toldByName.trim().toLowerCase());

      const base = {
        title,
        toldBy: toldByName.trim() || undefined,
        toldBySlug: matched?.slug,
        personSlugs: tagged,
        tags: String(form.get("tags") ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        photoKey,
        audioKey,
        audioTranscript: String(form.get("audioTranscript") ?? "").trim() || undefined,
        notes: String(form.get("notes") ?? "").trim() || undefined,
      };

      const payload =
        kind === "recipe"
          ? {
              ...base,
              summary: String(form.get("summary") ?? "").trim() || undefined,
              ingredients: String(form.get("ingredients") ?? ""),
              steps: String(form.get("steps") ?? ""),
              occasion: String(form.get("occasion") ?? "").trim() || undefined,
            }
          : kind === "tradition"
            ? {
                ...base,
                kind: String(form.get("traditionKind") ?? "custom"),
                summary: String(form.get("summary") ?? "").trim() || undefined,
                body: String(form.get("body") ?? ""),
                occasion: String(form.get("occasion") ?? "").trim() || undefined,
              }
            : {
                ...base,
                body: String(form.get("body") ?? ""),
                occurredOn: String(form.get("occurredOn") ?? "").trim() || undefined,
              };

      const res = await submitContribution(kind, payload);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      toast.success("Sent. It goes up once it has been read through.");
      formRef.current?.reset();
      setTagged([]);
      setToldByName("");
      router.refresh();
    });
  }

  const field =
    "mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-ink-900 outline-none focus:border-accent-700";
  const label = "text-xs uppercase tracking-[0.14em] text-ink-500";

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            role="tab"
            aria-selected={kind === k.key}
            onClick={() => setKind(k.key)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              kind === k.key
                ? "border-accent-700 bg-accent-700 text-white"
                : "border-ink-200 text-ink-700 hover:border-ink-300"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-600">{KINDS.find((k) => k.key === kind)?.blurb}</p>

      <form ref={formRef} onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label className={label} htmlFor="title">
            {kind === "recipe" ? "Dish" : kind === "tradition" ? "What it is" : "What happened"}
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder={
              kind === "recipe"
                ? "Aloo ki sabzi, the way Dadi makes it"
                : kind === "tradition"
                  ? "Touching elders' feet on Diwali morning"
                  : "How Radha Krishna opened the shop in 2000"
            }
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="toldBy">
            Who it came from
          </label>
          <input
            id="toldBy"
            name="toldBy"
            list="people-list"
            value={toldByName}
            onChange={(e) => setToldByName(e.target.value)}
            placeholder="Start typing a name"
            maxLength={80}
            className={field}
          />
          <datalist id="people-list">
            {people.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.hint}
              </option>
            ))}
          </datalist>
          <p className="mt-1.5 text-xs text-ink-500">
            {byName.get(toldByName.trim().toLowerCase())
              ? "Linked. This will show up on their page."
              : "If they are not on the site yet, type the name anyway. The credit is kept."}
          </p>
        </div>

        {kind === "recipe" ? (
          <>
            <div>
              <label className={label} htmlFor="ingredients">
                Ingredients, one per line
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                required
                rows={6}
                placeholder={"4 potatoes\n1 tsp cumin\nasafoetida, a pinch"}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="steps">
                How it is made, one step per line
              </label>
              <textarea
                id="steps"
                name="steps"
                required
                rows={7}
                placeholder={"Boil the potatoes and peel them by hand, still warm.\nHeat mustard oil until it stops smoking."}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="occasion">
                When it is made
              </label>
              <input
                id="occasion"
                name="occasion"
                maxLength={80}
                defaultValue=""
                placeholder="Every Diwali, or when someone is ill"
                className={field}
              />
            </div>
          </>
        ) : kind === "tradition" ? (
          <>
            <div>
              <label className={label} htmlFor="traditionKind">
                Kind
              </label>
              <select id="traditionKind" name="traditionKind" defaultValue="custom" className={field}>
                {TRADITION_KINDS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="body">
                How it goes
              </label>
              <textarea
                id="body"
                name="body"
                required
                rows={8}
                placeholder="Describe it the way it is actually done, not the way it is supposed to be done."
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="occasion">
                When
              </label>
              <input
                id="occasion"
                name="occasion"
                maxLength={80}
                placeholder="Karwa Chauth, every year"
                className={field}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={label} htmlFor="body">
                Tell it
              </label>
              <textarea
                id="body"
                name="body"
                required
                rows={10}
                placeholder="Write it as it was told to you. Names, places, what was said."
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="occurredOn">
                When it happened
              </label>
              <input
                id="occurredOn"
                name="occurredOn"
                maxLength={60}
                placeholder="1975, or sometime in the 60s, or before I was born"
                className={field}
              />
              <p className="mt-1.5 text-xs text-ink-500">
                A rough answer is fine. &quot;Sometime in the 60s&quot; is worth more than a blank.
              </p>
            </div>
          </>
        )}

        {kind !== "memory" ? (
          <div>
            <label className={label} htmlFor="summary">
              One line about it
            </label>
            <input
              id="summary"
              name="summary"
              maxLength={300}
              placeholder="What someone should know before they read it"
              className={field}
            />
          </div>
        ) : null}

        <div>
          <span className={label}>Who else is in this</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {people.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => toggleTagged(p.slug)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  tagged.includes(p.slug)
                    ? "border-accent-700 bg-accent-700 text-white"
                    : "border-ink-200 text-ink-600 hover:border-ink-300"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-ink-100 bg-parchment-dark p-5">
          <MediaCapture ref={media} />
          <div className="mt-5">
            <label className={label} htmlFor="audioTranscript">
              What they said, written down (optional)
            </label>
            <textarea
              id="audioTranscript"
              name="audioTranscript"
              rows={3}
              placeholder="A transcript makes the recording searchable and readable for anyone who cannot play it."
              className={field}
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="tags">
            Tags, comma separated
          </label>
          <input
            id="tags"
            name="tags"
            placeholder="diwali, sweets, banda"
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="notes">
            Anything else we should know
          </label>
          <textarea id="notes" name="notes" rows={2} className={field} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-ink-900 px-6 py-3.5 text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Sending..." : "Send it in"}
        </button>
        <p className="text-xs text-ink-500">
          Nothing appears on the site until it has been read through.
        </p>
      </form>
    </div>
  );
}
