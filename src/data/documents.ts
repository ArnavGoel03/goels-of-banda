import type { ArchiveDocument } from "./types";

// The family archive: letters, invitation cards, shop ledgers, old
// certificates, photographs of heritage buildings, newspaper clippings.
// Add entries here as they are scanned. Each entry should point to an
// image or PDF in /public/archive/ and describe the document + anyone
// named on it.
export const documents: ArchiveDocument[] = [];

export const documentsBySlug: Record<string, ArchiveDocument> =
  Object.fromEntries(documents.map((d) => [d.slug, d]));

export function getDocument(slug: string): ArchiveDocument | undefined {
  return documentsBySlug[slug];
}

export function getDocumentsFor(personSlug: string): ArchiveDocument[] {
  return documents.filter((d) => d.personSlugs?.includes(personSlug));
}
