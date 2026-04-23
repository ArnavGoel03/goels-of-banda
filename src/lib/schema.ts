import { site } from "@/data/config";
import type { Business, Person, Place } from "@/data/types";
import { getPerson } from "@/data/people";

export function absoluteUrl(path: string): string {
  const base = site.baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function personUrl(slug: string): string {
  return absoluteUrl(`/people/${slug}`);
}

export function businessUrl(slug: string): string {
  return absoluteUrl(`/businesses/${slug}`);
}

export function parseYear(person: Person): number | undefined {
  return person.birth?.year;
}

export function displayBirth(person: Person): string | undefined {
  if (!person.birth) return undefined;
  const { date, year, yearApprox, place } = person.birth;
  const datePart = date ?? (year ? (yearApprox ? `c. ${year}` : `${year}`) : undefined);
  if (datePart && place) return `${datePart}, ${place}`;
  return datePart ?? place;
}

export function displayDeath(person: Person): string | undefined {
  if (!person.death) return undefined;
  const { date, year, place } = person.death;
  const datePart = date ?? (year ? `${year}` : undefined);
  if (datePart && place) return `${datePart}, ${place}`;
  return datePart ?? place;
}

export function ageIfLiving(person: Person): number | undefined {
  if (!person.isLiving || !person.birth?.year) return undefined;
  const now = new Date().getFullYear();
  return now - person.birth.year;
}

export function personJsonLd(person: Person) {
  const name = person.name;
  const alternateNames = person.altNames;
  const birthDate = person.birth?.year ? `${person.birth.year}` : undefined;
  const birthPlace = person.birth?.place
    ? { "@type": "Place", name: person.birth.place }
    : undefined;
  const deathDate = person.death?.year ? `${person.death.year}` : undefined;

  const parents = [
    person.parents?.father ? getPerson(person.parents.father) : undefined,
    person.parents?.mother ? getPerson(person.parents.mother) : undefined,
  ]
    .filter((p): p is Person => Boolean(p))
    .map((p) => ({ "@type": "Person", name: p.name, url: personUrl(p.slug) }));

  const spouse = person.spouse
    ? (() => {
        const sp = getPerson(person.spouse.slug);
        if (!sp) return undefined;
        return { "@type": "Person", name: sp.name, url: personUrl(sp.slug) };
      })()
    : undefined;

  const children = (person.children ?? [])
    .map((slug) => getPerson(slug))
    .filter((p): p is Person => Boolean(p))
    .map((p) => ({ "@type": "Person", name: p.name, url: personUrl(p.slug) }));

  const familyName = "Goel";
  const honorificPrefix = undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personUrl(person.slug),
    name,
    url: personUrl(person.slug),
    familyName,
    description: person.bio?.slice(0, 300),
  };

  if (alternateNames && alternateNames.length > 0) {
    schema.alternateName = alternateNames;
  }
  if (birthDate) schema.birthDate = birthDate;
  if (birthPlace) schema.birthPlace = birthPlace;
  if (deathDate) schema.deathDate = deathDate;
  if (parents.length > 0) schema.parent = parents;
  if (spouse) schema.spouse = spouse;
  if (children.length > 0) schema.children = children;
  if (person.currentLocation)
    schema.homeLocation = { "@type": "Place", name: person.currentLocation };
  if (person.occupation) schema.jobTitle = person.occupation;
  if (honorificPrefix) schema.honorificPrefix = honorificPrefix;

  return schema;
}

export function organizationJsonLd(business: Business) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": businessUrl(business.slug),
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.state,
      addressCountry: business.country,
    },
  };
  if (business.website) schema.url = business.website;
  if (business.established) schema.foundingDate = `${business.established}`;
  return schema;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.baseUrl}#website`,
    name: site.name,
    alternateName: site.shortName,
    url: site.baseUrl,
    description: site.description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.baseUrl,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export function placeJsonLd(place: Place) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.name,
      addressCountry: place.country,
    },
    description: place.connection,
  };
}
