export type School = {
  slug: string;
  name: string;
  aliases?: string[];
  website?: string;
  city?: string;
};

export const schools: School[] = [
  {
    slug: "iit-delhi",
    name: "Indian Institute of Technology, Delhi",
    aliases: ["IIT Delhi"],
    website: "https://home.iitd.ac.in/",
    city: "New Delhi",
  },
  {
    slug: "bits-pilani",
    name: "Birla Institute of Technology and Science, Pilani",
    aliases: ["BITS Pilani"],
    website: "https://www.bits-pilani.ac.in/",
    city: "Pilani, Rajasthan",
  },
  {
    slug: "scindia-school",
    name: "The Scindia School",
    aliases: ["Scindia School, Gwalior"],
    website: "https://www.scindia.edu/",
    city: "Gwalior, Madhya Pradesh",
  },
  {
    slug: "nmims-mumbai",
    name: "NMIMS Mumbai",
    aliases: [
      "Narsee Monjee Institute of Management Studies",
      "SVKM's Narsee Monjee Institute of Management Studies",
      "SVKM's NMIMS",
    ],
    website: "https://www.nmims.edu/",
    city: "Mumbai, Maharashtra",
  },
  {
    slug: "indraprastha-college",
    name: "Indraprastha College for Women",
    aliases: ["IP College", "IPCW"],
    website: "https://www.ipcollege.ac.in/",
    city: "University of Delhi",
  },
  {
    slug: "epfl",
    name: "EPFL",
    aliases: ["École polytechnique fédérale de Lausanne"],
    website: "https://www.epfl.ch/",
    city: "Lausanne, Switzerland",
  },
  {
    slug: "icai",
    name: "Institute of Chartered Accountants of India",
    aliases: ["ICAI"],
    website: "https://www.icai.org/",
    city: "New Delhi",
  },
  {
    slug: "kcnit-banda",
    name: "KCNIT Banda",
    city: "Banda, Uttar Pradesh",
  },
  {
    slug: "vit-vellore",
    name: "VIT Vellore",
    aliases: ["Vellore Institute of Technology"],
    website: "https://vit.ac.in/",
    city: "Vellore, Tamil Nadu",
  },
  {
    slug: "uc-san-diego",
    name: "UC San Diego",
    aliases: ["University of California, San Diego", "UCSD"],
    website: "https://ucsd.edu/",
    city: "La Jolla, California",
  },
];

export const schoolsBySlug: Record<string, School> = Object.fromEntries(
  schools.map((s) => [s.slug, s]),
);
