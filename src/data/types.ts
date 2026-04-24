export type Sex = "M" | "F" | "U";

export type EducationEntry = {
  schoolSlug?: string;
  schoolName?: string;
  degree?: string;
  field?: string;
  years?: [number, number];
  city?: string;
  notes?: string;
};

export type CareerEntry = {
  role: string;
  businessSlug?: string;
  businessName?: string;
  years?: [number, number?];
  current?: boolean;
  city?: string;
  notes?: string;
};

export type PersonPhoto = {
  src: string;
  caption?: string;
  year?: number;
  credit?: string;
};

export type OralHistoryClip = {
  src: string;
  title: string;
  transcript?: string;
  recordedOn?: string;
  recordedBy?: string;
  durationSeconds?: number;
};

export type Person = {
  slug: string;
  name: string;
  altNames?: string[];
  sex: Sex;
  birth?: {
    date?: string;
    year?: number;
    yearApprox?: boolean;
    place?: string;
  };
  death?: {
    year?: number;
    date?: string;
    place?: string;
    note?: string;
  };
  isLiving: boolean;
  familyRole?: string;
  currentLocation?: string;
  occupation?: string;
  businessSlugs?: string[];
  parents?: { father?: string; mother?: string };
  spouse?: { slug: string; marriage?: { date?: string; year?: number } };
  children?: string[];
  bio: string;
  education?: EducationEntry[];
  career?: CareerEntry[];
  publicity?: "full" | "summary" | "minimal";
  birthFamilySurname?: string;
  relationshipToViewer?: string;
  sources?: { label: string; url: string }[];
  notes?: string;
  generation?: number;
  photos?: PersonPhoto[];
  oralHistories?: OralHistoryClip[];
};

export type ArchiveDocument = {
  slug: string;
  title: string;
  kind: "letter" | "invitation" | "ledger" | "certificate" | "photo" | "clipping" | "other";
  date?: { year?: number; date?: string };
  personSlugs?: string[];
  placeSlugs?: string[];
  pdfUrl?: string;
  imageUrl?: string;
  description: string;
};

export type Tradition = {
  slug: string;
  title: string;
  kind: "recipe" | "festival" | "ritual" | "saying" | "other";
  personSlugs?: string[];
  placeSlugs?: string[];
  summary: string;
  body: string[];
  ingredients?: string[];
  steps?: string[];
  occasion?: string;
};

export type Business = {
  slug: string;
  name: string;
  kind: string;
  city: string;
  state?: string;
  country: string;
  established?: number;
  website?: string;
  description: string;
  runByPersonSlugs: string[];
  ownedByPersonSlugs?: string[];
  sources?: { label: string; url: string }[];
};

export type Story = {
  slug: string;
  title: string;
  kind: "founding" | "milestone" | "profile" | "intermarriage" | "memoir";
  summary: string;
  body: string[];
  era?: string;
  date?: { year?: number; date?: string };
  personSlugs?: string[];
  businessSlugs?: string[];
  placeSlugs?: string[];
};

export type Place = {
  slug: string;
  name: string;
  country: string;
  connection: string;
  personSlugs: string[];
  businessSlugs?: string[];
  coords?: [number, number];
};
