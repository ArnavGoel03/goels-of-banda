import { NextResponse } from "next/server";
import { hasStorage } from "@/lib/config";
import { isPublishedMediaKey } from "@/lib/contributions";
import { getObject } from "@/lib/r2";

export const runtime = "nodejs";

/**
 * Serves a published photo or voice note. The bucket stays private, so this is
 * the only way in, and it only opens for a key that belongs to an entry an admin
 * has actually published: a pending submission's photo cannot be pulled up by
 * anyone who knows its key.
 *
 * Keys are immutable (a new upload gets a new UUID), so a hit is cached for a
 * year and the CDN, not this function, answers essentially every request.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  if (!hasStorage) return new NextResponse("Not found", { status: 404 });

  const { key: segments } = await params;
  const key = segments.join("/");
  if (key.includes("..")) return new NextResponse("Not found", { status: 404 });

  // Contributed media: only readable once an admin has published the entry it
  // belongs to. Site media: uploaded by an admin for the hand-authored content
  // in src/data, and public from the moment it lands.
  const isContribution = /^(photo|audio)\/[A-Za-z0-9._-]+$/.test(key);
  const isSiteMedia = /^site\/[A-Za-z0-9._\-/]+$/.test(key);

  if (!isContribution && !isSiteMedia) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (isContribution && !(await isPublishedMediaKey(key))) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const object = await getObject(key);
    if (!object.body) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(object.body as unknown as BodyInit, {
      headers: {
        "content-type": object.contentType,
        ...(object.contentLength ? { "content-length": String(object.contentLength) } : {}),
        "cache-control": "public, max-age=31536000, immutable",
        "content-disposition": "inline",
        "x-content-type-options": "nosniff",
        // The site's global policy is same-origin; media is public by design.
        "cross-origin-resource-policy": "cross-origin",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
