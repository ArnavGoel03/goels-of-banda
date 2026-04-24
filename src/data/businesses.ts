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
      "The ancestral Goel family jewellery firm, founded in the mid-1800s by a son of Gondilal Goel who named the shop after his father (Gondilal) and his uncle (Ganesh Prasad). The original premises, a multi-floor heritage building in Banda, still stands and houses three independent jewellery shops, each run by a different branch of the family: Radha Krishna Goel's second brother runs the upper-floor shop (accessed via stairs), and his younger brothers Manmohan and Sohan run the two ground-floor shops (each selling both gold and silver today).",
    runByPersonSlugs: ["manmohan-goel", "sohan-goel"],
  },
  {
    slug: "gondilal-saraf",
    name: "Gondilal Saraf",
    kind: "Jewellery",
    city: "Banda",
    state: "Uttar Pradesh",
    country: "India",
    established: 2000,
    website: "https://gondilalsaraf.com/",
    description:
      "A jewellery shop in the heart of Banda opened by Radha Krishna Goel in 2000, a couple of years before his father passed away. As the eldest of four brothers, Radha Krishna stepped aside from his share of the ancestral Ganesh Prasad Gondilal Saraf and gave it to his three younger brothers, opening this shop on his own and naming it 'Gondilal Saraf', preserving the founder's name forward while dropping 'Ganesh Prasad' from the title. Run today by Rohit and Vinod Goel, Radha Krishna's sons.",
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
      "A modernised gold and diamond jewellery showroom in Gular Naka, Banda, established in 2016 by Avijit 'Honey' Goel, one of the third active Gondilal-branded jewellery businesses in Banda operated by the extended Goel family. Has an online catalogue at gondilal.com.",
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
    website: "https://www.agssl.in",
    description:
      "A stock-brokering firm registered in Agra, Uttar Pradesh, and an NSDL-registered Depository Participant (DP code IN301006). Owned by the husband of Seema Agarwal (née Goel), and operates a Dubai branch run by their son Aditya Agarwal. The firm runs its own equity trading platform, similar in scope to consumer-facing brokers like Zerodha, that clients use to place trades and manage their portfolios. Shobhit Goel works as a sub-broker under the firm's broking licence in Satna, Madhya Pradesh.",
    runByPersonSlugs: ["aditya-agarwal"],
    sources: [
      { label: "Official website", url: "https://www.agssl.in" },
      { label: "NSDL Depository Participant listing", url: "https://nsdl.co.in/dps-detail-display.php?dpname=IN301006" },
      { label: "AG Shares on LinkedIn", url: "https://www.linkedin.com/company/a-g-shares-and-securities-limited/" },
    ],
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
      "A major Indian ceramic tableware manufacturer headquartered in Jaipur, Rajasthan, and the flagship company of the Clay Craft Group. Established in 1994 by the Agarwal family; FY25 revenue approximately $148M. Deepak Agarwal, husband of Vijaya Agarwal (née Goel, daughter of Manmohan Goel of Banda), is Executive Director and Chief Financial Officer; his two brothers jointly run the company alongside him. Vijaya Agarwal handles creative direction for the brand and designs new tableware collections. The wider Clay Craft Group also operates Crown Craft (premium plastic homewares, established 2009), JCPL / Jaipur Ceramics (acquired in 2014), and Vacbott (double-wall stainless steel insulated bottles and flasks, launched in 2022). Company CIN: U26933RJ1988PTC004677.",
    runByPersonSlugs: ["deepak-agarwal", "vijaya-agarwal"],
    sources: [
      { label: "Corporate Leadership page", url: "https://corporate.claycraftindia.com/leadership-management/" },
      { label: "ZaubaCorp filing", url: "https://www.zaubacorp.com/company/CLAY-CRAFT-INDIA-PVT-LTD/U26933RJ1988PTC004677" },
      { label: "Clay Craft India on LinkedIn", url: "https://www.linkedin.com/company/clay-craft-india-private-limited/" },
    ],
  },
  {
    slug: "crown-craft-india",
    name: "Crown Craft India",
    kind: "Premium plastic homewares and tableware",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    established: 2009,
    website: "https://www.crowncraftindia.com/",
    description:
      "Crown Craft India Pvt. Ltd. is an ISO 9001:2008-certified premium plastic homewares manufacturer in Jaipur, established in 2009 by the Agarwal family as the sister concern of Clay Craft India. Its product range covers plastic dinner sets, microwave-safe dining plates and bowls, bathroom sets, water jugs, buckets, tiffin, casseroles, dustbins, and insulated thermoware, manufactured and exported from Jaipur as part of the Clay Craft Group. Deepak Agarwal has been a Director of Crown Craft since its founding, alongside his Clay Craft role.",
    runByPersonSlugs: ["deepak-agarwal"],
  },
  {
    slug: "jcpl-jaipur-ceramics",
    name: "JCPL (Jaipur Ceramics)",
    kind: "Fine porcelain, HoReCa tableware, and modern living",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    website: "https://jaipurceramics.co.in/",
    description:
      "JCPL, also known as Jaipur Ceramics Pvt. Ltd., is one of Asia's largest bone china manufacturers and India's leading fine porcelain tableware brand, acquired in 2014 by Clay Craft India. After the acquisition, Clay Craft India became India's leading manufacturer and retailer of fine bone china and ceramic tableware, with reports that the combined group holds roughly half of the ~1,000 crore segment. JCPL now operates as part of the Clay Craft Group under two sub-brands: JCPL Fine Porcelain, focused on the hospitality (HoReCa) channel with hotels, restaurants, cafes, and catering customers, and JCPL Modern Living for retail. Deepak Agarwal has been a Director of JCPL since Clay Craft's acquisition in April 2014.",
    runByPersonSlugs: ["deepak-agarwal"],
  },
  {
    slug: "vacbott",
    name: "Vacbott",
    kind: "Stainless steel double-wall vacuum bottles and flasks",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    established: 2022,
    website: "https://www.claycraftindia.com/pages/double-wall-vacuum-bottles",
    description:
      "Vacbott is the Clay Craft Group's Made-in-India line of double-wall vacuum-insulated stainless steel bottles, flasks, and tumblers, launched in September 2022. Product lines include the Phantom, Stark, Bolt, Kitkat, Caferoma, and Maghydro 3-in-1; bottles are built from food-grade SS304 stainless steel (inside and outside), BIS certified, scratch-resistant, and rated to keep beverages hot up to 18 hours and cold up to 24 hours. The brand is positioned around reducing single-use plastic through durable reusable drinkware. Deepak Agarwal oversees the project as part of his responsibilities for modern retail, online retail, and brand development across the Clay Craft Group.",
    runByPersonSlugs: ["deepak-agarwal"],
  },
  {
    slug: "griha-jaipur",
    name: "Griha",
    kind: "Concept home store (Clay Craft Group retail flagship)",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    website: "https://griha.in/",
    description:
      "Griha is a concept home store by the Clay Craft Group, located at 153 Amrapali Marg, Rathore Nagar, Vaishali Nagar (Heerapura), Jaipur. It showcases Clay Craft's fine tableware across bone china, fine porcelain, and stoneware, alongside the wider group's dinnerware, tea and coffee serveware, mugs, and tabletop gifting collections. Deepak Agarwal oversees the retail presence as part of his modern-retail remit across the Clay Craft Group.",
    runByPersonSlugs: ["deepak-agarwal"],
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
      "A paper manufacturing plant in Chandigarh, owned by Shanu Agarwal, husband of Anu Agarwal (daughter of Seema Agarwal, née Goel).",
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
      "A family-run construction business in Allahabad, Uttar Pradesh, run by Harsh Agarwal, son of one of Radha Krishna Goel's three sisters (the one who passed away).",
    runByPersonSlugs: ["harsh-agarwal"],
  },
];

export const businessesBySlug: Record<string, Business> = Object.fromEntries(
  businesses.map((b) => [b.slug, b]),
);

export function getBusiness(slug: string): Business | undefined {
  return businessesBySlug[slug];
}
