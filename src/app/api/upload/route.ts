import { NextResponse } from "next/server";
import { getContributor } from "@/lib/auth";
import { canContribute } from "@/lib/config";
import { AUDIO_TYPES, IMAGE_TYPES } from "@/lib/mediaTypes";
import { presignUpload } from "@/lib/r2";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

// A photo of a handwritten recipe card, or three minutes of someone talking.
const MAX_IMAGE_BYTES = 24 * 1024 * 1024;
const MAX_AUDIO_BYTES = 32 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/m4a": "m4a",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};

/**
 * Mints a short-lived signed URL the browser PUTs the file straight to R2 with.
 * The type and the exact byte length are signed into that URL, so the caller
 * cannot swap in a bigger file or a different kind after we approve it.
 */
export async function POST(req: Request) {
  if (!canContribute) {
    return NextResponse.json({ error: "Contributions are not set up on this deployment." }, { status: 503 });
  }

  const contributor = await getContributor();
  if (!contributor) {
    return NextResponse.json({ error: "Sign in to contribute." }, { status: 401 });
  }

  // Same-origin only: a signed-in relative's session should not be usable as an
  // upload credential by a page they happen to be visiting elsewhere.
  const origin = req.headers.get("origin");
  if (origin && new URL(req.url).origin !== origin) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }

  if (!(await rateLimit(`upload:${contributor.userId}`, 40, 60 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as {
    kind?: string;
    contentType?: string;
    contentLength?: number;
  } | null;

  const area = body?.kind === "audio" ? "audio" : body?.kind === "photo" ? "photo" : null;
  const contentType = body?.contentType ?? "";
  const contentLength = Number(body?.contentLength ?? 0);

  if (!area) return NextResponse.json({ error: "Unknown upload kind." }, { status: 400 });
  if (!Number.isFinite(contentLength) || contentLength <= 0) {
    return NextResponse.json({ error: "Missing file size." }, { status: 400 });
  }

  const allowed = area === "photo" ? IMAGE_TYPES : AUDIO_TYPES;
  const max = area === "photo" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  const type = contentType.split(";")[0].trim().toLowerCase();

  if (!allowed.has(type)) {
    return NextResponse.json({ error: `That file type is not supported (${type || "unknown"}).` }, { status: 415 });
  }
  if (contentLength > max) {
    return NextResponse.json({ error: "That file is too large." }, { status: 413 });
  }

  // Random key: nothing about the contributor or the entry is guessable from it,
  // and two people uploading "recipe.jpg" never collide.
  const key = `${area}/${crypto.randomUUID()}.${EXT[type] ?? "bin"}`;
  const url = await presignUpload(key, type, contentLength);

  return NextResponse.json({ url, key }, { headers: { "cache-control": "no-store" } });
}
