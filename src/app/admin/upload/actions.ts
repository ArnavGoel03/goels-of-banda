"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { requireAdmin } from "@/lib/auth";
import { hasStorage } from "@/lib/config";

export type UploadResult =
  | { ok: true; url: string; pathname: string; kind: string; slug?: string; caption?: string; year?: string }
  | { ok: false; error: string };

const ALLOWED_KINDS = new Set(["photos", "audio", "documents", "misc"]);

// Media for the hand-authored content in src/data (person photos, oral history
// clips, scanned letters) lives under this prefix and is public the moment it is
// uploaded: an admin put it there on purpose. Contributed media (photo/, audio/)
// is the opposite, and stays unreachable until it is published.
const SITE_PREFIX = "site";

const MAX_BYTES = 64 * 1024 * 1024;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Uploads to R2, never Vercel Blob. The bytes come through the server action
 * (these are one-off admin uploads, not a hot path), and the returned URL is
 * the site's own /api/media path, so files are served from our origin and cached
 * by the CDN with no egress bill.
 */
export async function uploadBlob(formData: FormData): Promise<UploadResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Sign in as an admin to upload." };
  }

  if (!hasStorage) {
    return { ok: false, error: "R2 is not configured on this deployment. Set the R2_* env vars." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file attached." };
  if (file.size > MAX_BYTES) return { ok: false, error: "That file is too large." };

  const rawKind = ((formData.get("kind") as string) ?? "misc").toLowerCase();
  const kind = ALLOWED_KINDS.has(rawKind) ? rawKind : "misc";
  const personSlug = slugify((formData.get("personSlug") as string) ?? "");
  const caption = ((formData.get("caption") as string) ?? "").trim();
  const year = ((formData.get("year") as string) ?? "").trim();

  const safeName = file.name.replace(/[^\w.\-]+/g, "-");
  const key = [SITE_PREFIX, kind, personSlug, `${Date.now()}-${safeName}`]
    .filter(Boolean)
    .join("/");

  const client = new S3Client({
    region: "auto",
    endpoint:
      process.env.R2_ENDPOINT ||
      `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return {
    ok: true,
    url: `/api/media/${key}`,
    pathname: key,
    kind,
    slug: personSlug || undefined,
    caption: caption || undefined,
    year: year || undefined,
  };
}
