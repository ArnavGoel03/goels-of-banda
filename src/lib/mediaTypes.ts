// What the media route is allowed to hand back, and under which type.
//
// The Content-Type an object is STORED with is not trustworthy. The S3
// presigner leaves Content-Type off the signature (it is on the SDK's
// unsignable-headers list), so a contributor holding a presigned PUT can write
// bytes under any type they like, text/html included, no matter what the upload
// route approved. Content-Length is genuinely signed; Content-Type is not.
//
// So the media route never echoes the stored type back. It forces every
// response through this allowlist, and anything not on it is served as an
// opaque download instead of inline. Without that, a published photo could run
// the contributor's script on our origin.

export const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export const AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/aac",
  "audio/ogg",
  "audio/wav",
  "audio/x-m4a",
  "audio/m4a",
]);

// Site media is uploaded by an admin (scanned letters, clips), so it may also
// be a PDF or a video. Never SVG: it is a script container dressed as an image.
const SITE_TYPES = new Set(["application/pdf", "video/mp4", "video/webm"]);

/**
 * The type this object may be served as inline, or null if it may not be.
 * Contributed keys are held to their area: a `photo/` key is an image or it is
 * nothing.
 */
export function inlineContentType(key: string, stored: string): string | null {
  const type = stored.split(";")[0].trim().toLowerCase();
  if (key.startsWith("photo/")) return IMAGE_TYPES.has(type) ? type : null;
  if (key.startsWith("audio/")) return AUDIO_TYPES.has(type) ? type : null;
  if (IMAGE_TYPES.has(type) || AUDIO_TYPES.has(type) || SITE_TYPES.has(type)) return type;
  return null;
}
