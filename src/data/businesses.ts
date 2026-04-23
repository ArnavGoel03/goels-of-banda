import type { Business } from "./types";

export const businesses: Business[] = [
  {
    slug: "ganesh-prasad-gondilal-saraf",
    name: "Ganesh Prasad Gondilal Saraf",
    kind: "Jewellery (gold & silver, heritage family firm)",
    city: "Banda",
    state: "Uttar Pradesh",
    country: "India",
    established: 1850,
    description:
      "The ancestral Goel family jewellery firm, founded in the mid-1800s by a son of Gondilal Goel who named the shop after his father (Gondilal) and his uncle (Ganesh Prasad). The original premises — a multi-floor heritage building in Banda — still stands and houses three independent jewellery shops, each run by a different branch of the family: Radha Krishna Goel's second brother runs the upper-floor shop (accessed via stairs), and his younger brothers Manmohan and Sohan run the two ground-floor shops (each selling both gold and silver today).",
    runByPersonSlugs: ["manmohan-goel", "sohan-goel"],
  },
  {
    slug: "gondilal-saraf",
    name: "Gondilal Saraf",
    kind: "Jewellery",
    city: "Banda",
    state: "Uttar Pradesh",
    country: "India",
    website: "https://gondilalsaraf.com/",
    description:
      "A jewellery shop in the heart of Banda opened by Radha Krishna Goel after he stepped aside from his share of the ancestral firm and gave it to his three younger brothers. He named his new shop 'Gondilal Saraf' — preserving the founder's name forward while dropping 'Ganesh Prasad' from the title. Run today by Rohit and Vinod Goel, Radha Krishna's sons.",
    runByPersonSlugs: ["rohit-goel", "vinod-goel"],
  },
  {
    slug: "gondilal-kiva",
    name: "Gondilal Kiva",
    kind: "Gold & diamond jewellery showroom",
    city: "Banda",
    state: "Uttar Pradesh",
    country: "India",
    established: 2016,
    website: "https://www.gondilal.com/",
    description:
      "A modernised gold and diamond jewellery showroom in Gular Naka, Banda, established in 2016 by Avijit 'Honey' Goel — one of the third active Gondilal-branded jewellery businesses in Banda operated by the extended Goel family. Has an online catalogue at gondilal.com.",
    runByPersonSlugs: ["avijit-goel"],
    ownedByPersonSlugs: ["avijit-goel"],
    sources: [
      { label: "Official website", url: "https://www.gondilal.com/" },
      { label: "Facebook", url: "https://www.facebook.com/gondilalkiva/" },
    ],
  },
  {
    slug: "ag-shares-securities",
    name: "AG Shares & Securities",
    kind: "Stock-brokering firm",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    description:
      "A stock-brokering firm registered in Agra, Uttar Pradesh. Owned by the husband of Seema Agarwal (née Goel), and operates a Dubai branch run by their son Aditya Agarwal. Shobhit Goel works as a sub-broker under the firm's broking licence in Satna, Madhya Pradesh.",
    runByPersonSlugs: ["aditya-agarwal"],
  },
  {
    slug: "clay-craft-india",
    name: "Clay Craft India Pvt Ltd",
    kind: "Ceramic tableware manufacturer (bone china, porcelain)",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    established: 1994,
    website: "https://www.claycraftindia.com/",
    description:
      "A major Indian ceramic tableware manufacturer headquartered in Jaipur, Rajasthan. Established in 1994 by the Agarwal family; FY25 revenue approximately $148M. Deepak Agarwal — husband of Vijaya Agarwal (née Goel, daughter of Manmohan Goel of Banda) — is a named co-founder and current director; his two brothers jointly run the company alongside him. Vijaya Agarwal handles creative direction for the brand and designs new tableware collections. Company CIN: U26933RJ1988PTC004677.",
    runByPersonSlugs: ["deepak-agarwal", "vijaya-agarwal"],
    sources: [
      { label: "Corporate Leadership page", url: "https://corporate.claycraftindia.com/leadership-management/" },
      { label: "ZaubaCorp filing", url: "https://www.zaubacorp.com/company/CLAY-CRAFT-INDIA-PVT-LTD/U26933RJ1988PTC004677" },
      { label: "Clay Craft India on LinkedIn", url: "https://in.linkedin.com/company/clay-craft-india-private-limited" },
    ],
  },
  {
    slug: "mp-wire-india",
    name: "M. P. Wire Industries (MP Wire India)",
    kind: "Wire & fencing products manufacturer",
    city: "Kanpur",
    state: "Uttar Pradesh",
    country: "India",
    established: 1989,
    website: "https://www.mpwireindia.com",
    description:
      "A wire and fencing products manufacturer based at 123/43, Saresh Bagh, Kanpur, Uttar Pradesh. Established in 1989. Products include concertina coil (security fencing), G.P. (galvanised plain) sheets, G.P. and Zincro tasla, metal ghamela, chain-link fencing, welded wire mesh, rivet bolts, and chicken wire mesh. Owned by Manmohan Agrawal, husband of Palak Goel. The 'M.P.' in the company name predates the current generation; its origin is not definitively known within the family.",
    runByPersonSlugs: ["manmohan-agrawal-kanpur"],
    ownedByPersonSlugs: ["manmohan-agrawal-kanpur"],
  },
  {
    slug: "shanu-paper-plant",
    name: "Shanu Agarwal Paper Manufacturing Plant",
    kind: "Paper manufacturing",
    city: "Chandigarh",
    country: "India",
    description:
      "A paper manufacturing plant in Chandigarh, owned by Shanu Agarwal — husband of Anu Agarwal (daughter of Seema Agarwal, née Goel).",
    runByPersonSlugs: ["shanu-agarwal"],
    ownedByPersonSlugs: ["shanu-agarwal"],
  },
  {
    slug: "harsh-construction",
    name: "Harsh Agarwal Construction",
    kind: "Construction",
    city: "Allahabad (Prayagraj)",
    state: "Uttar Pradesh",
    country: "India",
    description:
      "A family-run construction business in Allahabad, Uttar Pradesh, run by Harsh Agarwal — son of one of Radha Krishna Goel's three sisters (the one who passed away).",
    runByPersonSlugs: ["harsh-agarwal"],
  },
];

export const businessesBySlug: Record<string, Business> = Object.fromEntries(
  businesses.map((b) => [b.slug, b]),
);

export function getBusiness(slug: string): Business | undefined {
  return businessesBySlug[slug];
}
