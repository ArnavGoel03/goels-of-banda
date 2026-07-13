import type { Metadata } from "next";
import Link from "next/link";
import { BlobUploader } from "@/components/admin/BlobUploader";

export const metadata: Metadata = {
  title: "Upload media",
  description: "Internal utility for uploading photos, audio clips, and scanned documents.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminUploadPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-12 pb-16">
      <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
        Internal utility
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">
        Upload media
      </h1>
      <p className="mt-3 text-ink-600">
        Drop a photo, audio clip, or scanned document. It goes to the R2 bucket
        under <code className="rounded bg-ink-100 px-1 text-sm">site/</code>, and
        you get a TypeScript snippet to paste into the relevant data file. Your
        admin sign-in is the authorisation; there is no separate upload token.
      </p>
      <p className="mt-2 text-sm text-ink-500">
        For what the family submits, use{" "}
        <Link href="/admin/review" className="text-accent-700 underline">
          the review queue
        </Link>
        . See also{" "}
        <Link href="/admin" className="text-accent-700 underline">
          /admin
        </Link>{" "}
        for generating a new person record.
      </p>
      <BlobUploader />
    </section>
  );
}
