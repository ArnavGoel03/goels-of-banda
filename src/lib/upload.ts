// Browser-side upload: ask the server for a signed URL, then PUT the bytes
// straight to R2. The file never passes through a function, so a 20MB voice note
// costs no compute and no egress.

export type UploadKind = "photo" | "audio";

export async function uploadToR2(file: File, kind: UploadKind): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind,
      contentType: file.type,
      contentLength: file.size,
    }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Upload could not be prepared.");
  }

  const { url, key } = (await res.json()) as { url: string; key: string };

  const put = await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "content-type": file.type },
  });
  if (!put.ok) throw new Error("The file could not be uploaded.");

  return key;
}
