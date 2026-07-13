import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { hasStorage } from "./config";

// Cloudflare R2 via the S3-compatible API: zero egress, and never Vercel Blob.
// The bucket itself stays private. Published photos and voice notes reach
// readers through /api/media/[key], which checks the entry is published and
// then streams the bytes with a long cache, so the CDN answers almost every
// request and an unapproved submission is never fetchable by guessing a key.

let _client: S3Client | null = null;

function client() {
  if (!hasStorage) {
    throw new Error("R2 storage is not configured. Set the R2_* env vars.");
  }
  if (!_client) {
    const endpoint =
      process.env.R2_ENDPOINT ||
      `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    _client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      // Newer AWS SDKs bake a CRC32 checksum into PutObject's signed headers.
      // A browser PUT never sends that header, so R2 rejects the upload with a
      // signature mismatch that surfaces as an opaque CORS error. R2 does not
      // require the checksum, so turn it off for presigned traffic.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }
  return _client;
}

const bucket = () => process.env.R2_BUCKET!;

/**
 * Signed URL the browser PUTs bytes to directly, keeping uploads off our
 * functions. ContentType and the exact ContentLength are signed, so a client
 * cannot PUT something bigger or of a different type than the server approved.
 */
export async function presignUpload(
  key: string,
  contentType: string,
  contentLength: number,
) {
  const cmd = new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  });
  return getSignedUrl(client(), cmd, { expiresIn: 60 * 5 });
}

/** Streams an object's bytes back to the caller (used by the media route). */
export async function getObject(key: string) {
  const res = await client().send(
    new GetObjectCommand({ Bucket: bucket(), Key: key }),
  );
  return {
    body: res.Body as ReadableStream | undefined,
    contentType: res.ContentType ?? "application/octet-stream",
    contentLength: res.ContentLength,
  };
}

export async function deleteObject(key: string) {
  await client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
