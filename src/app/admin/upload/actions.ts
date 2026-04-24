"use server";

import { put } from "@vercel/blob";

export type UploadResult =
  | { ok: true; url: string; pathname: string; kind: string; slug?: string; caption?: string; year?: string }
  | { ok: false; error: string };

const ALLOWED_KINDS = new Set(["photos", "audio", "documents", "misc"]);

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function uploadBlob(formData: FormData): Promise<UploadResult> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "BLOB_READ_WRITE_TOKEN is not set on this deployment." };
  }
  const expected = process.env.ADMIN_UPLOAD_TOKEN;
  if (!expected) {
    return {
      ok: false,
      error:
        "ADMIN_UPLOAD_TOKEN is not set. Add it in Vercel → Project → Environment Variables before uploading.",
    };
  }

  const token = (formData.get("token") as string | null) ?? "";
  if (token !== expected) return { ok: false, error: "Wrong admin token." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file attached." };

  const rawKind = ((formData.get("kind") as string) ?? "misc").toLowerCase();
  const kind = ALLOWED_KINDS.has(rawKind) ? rawKind : "misc";
  const personSlug = slugify((formData.get("personSlug") as string) ?? "");
  const caption = ((formData.get("caption") as string) ?? "").trim();
  const year = ((formData.get("year") as string) ?? "").trim();

  const safeName = file.name.replace(/[^\w.\-]+/g, "-");
  const pathname = [kind, personSlug, `${Date.now()}-${safeName}`]
    .filter(Boolean)
    .join("/");

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });

  return {
    ok: true,
    url: blob.url,
    pathname: blob.pathname,
    kind,
    slug: personSlug || undefined,
    caption: caption || undefined,
    year: year || undefined,
  };
}
