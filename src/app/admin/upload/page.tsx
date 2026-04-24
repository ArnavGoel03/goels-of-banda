import type { Metadata } from "next";
import Link from "next/link";
import { BlobUploader } from "@/components/admin/BlobUploader";

export const metadata: Metadata = {
  title: "Upload media",
  description: "Internal utility for uploading photos, audio clips, and scanned documents to Vercel Blob.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminUploadPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-12 pb-16">
      <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
        Internal utility
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">
        Upload media to Blob
      </h1>
      <p className="mt-3 text-ink-600">
        Drop a photo, audio clip, or scanned document. It goes straight to the{" "}
        <code className="rounded bg-ink-100 px-1 text-sm">family-media</code> Blob
        store and you get a TypeScript snippet to paste into the relevant data
        file. Needs an <code className="rounded bg-ink-100 px-1 text-sm">ADMIN_UPLOAD_TOKEN</code>{" "}
        set in the Vercel env vars — pick any long random string and enter the
        same one below.
      </p>
      <p className="mt-2 text-sm text-ink-500">
        Also see{" "}
        <Link href="/admin" className="text-accent-700 underline">
          /admin
        </Link>{" "}
        for generating a new person record.
      </p>
      <BlobUploader />
    </section>
  );
}
