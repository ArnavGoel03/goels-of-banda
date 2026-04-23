import type { Place } from "./types";

export const places: Place[] = [
  {
    slug: "banda",
    name: "Banda, Uttar Pradesh",
    country: "India",
    coords: [25.4768, 80.3358],
    connection:
      "Ancestral home of the Goel family, 200+ years. Six active family jewellery shops.",
    personSlugs: [
      "gondilal-goel",
      "ganesh-prasad-goel",
      "radha-krishna-goel",
      "rani-agarwal-dadiji",
      "manmohan-goel",
      "nandita-goel",
      "sohan-goel",
      "vinod-goel",
      "neelam-agarwal-vinod",
      "rohit-goel",
      "richa-goel",
      "avijit-goel",
      "shayana-goyal",
      "arnav-goel",
    ],
    businessSlugs: ["ganesh-prasad-gondilal-saraf", "gondilal-saraf", "gondilal-kiva"],
  },
  {
    slug: "jhansi",
    name: "Jhansi, Uttar Pradesh",
    country: "India",
    coords: [25.4484, 78.5685],
    connection:
      "Maternal hometown. Ramesh Chandra Agarwal and all twelve of his siblings live here. The Banda Goels have intermarried with the Jhansi Agarwals for multiple generations.",
    personSlugs: [
      "ramesh-chandra-agarwal",
      "kapil-agarwal",
      "nidhi-modi",
      "atharva-agarwal",
      "lovnika-agarwal",
    ],
  },
  {
    slug: "kanpur",
    name: "Kanpur, Uttar Pradesh",
    country: "India",
    coords: [26.4499, 80.3319],
    connection:
      "Aditi Goel's birthplace. Home of Palak Goel and her husband Manmohan Agrawal (MP Wire India).",
    personSlugs: ["palak-goel", "manmohan-agrawal-kanpur", "aditi-goel"],
    businessSlugs: ["mp-wire-india"],
  },
  {
    slug: "satna",
    name: "Satna, Madhya Pradesh",
    country: "India",
    coords: [24.5854, 80.8322],
    connection: "Shobhit Goel's base for his overseas stock-brokering work.",
    personSlugs: ["shobhit-goel", "roli"],
  },
  {
    slug: "agra",
    name: "Agra, Uttar Pradesh",
    country: "India",
    coords: [27.1767, 78.0081],
    connection: "AG Shares & Securities (Seema's husband's firm) is registered here.",
    personSlugs: [],
    businessSlugs: ["ag-shares-securities"],
  },
  {
    slug: "allahabad",
    name: "Allahabad (Prayagraj), Uttar Pradesh",
    country: "India",
    coords: [25.4358, 81.8463],
    connection:
      "Harsh Agarwal and his family, descendants of one of Radha Krishna Goel's three sisters.",
    personSlugs: ["harsh-agarwal"],
    businessSlugs: ["harsh-construction"],
  },
  {
    slug: "gurugram",
    name: "Gurugram, NCR",
    country: "India",
    coords: [28.4595, 77.0266],
    connection: "One of Radha Krishna Goel's three sisters lives here.",
    personSlugs: [],
  },
  {
    slug: "hathras",
    name: "Hathras, Uttar Pradesh",
    country: "India",
    coords: [27.5952, 78.0518],
    connection: "Nidhi Modi's family, Kapil Agarwal's in-laws.",
    personSlugs: [],
  },
  {
    slug: "delhi",
    name: "Delhi",
    country: "India",
    coords: [28.6139, 77.209],
    connection: "Rashi Agarwal's family, Vivek Agarwal's in-laws.",
    personSlugs: [],
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    country: "India",
    coords: [30.7333, 76.7794],
    connection:
      "Anu and Shanu Agarwal; Shanu runs a paper manufacturing plant here.",
    personSlugs: ["anu-agarwal", "shanu-agarwal"],
    businessSlugs: ["shanu-paper-plant"],
  },
  {
    slug: "jaipur",
    name: "Jaipur, Rajasthan",
    country: "India",
    coords: [26.9124, 75.7873],
    connection:
      "Vijaya Agarwal (née Goel) and her husband Deepak Agarwal; Clay Craft India is headquartered here.",
    personSlugs: ["vijaya-agarwal", "deepak-agarwal"],
    businessSlugs: ["clay-craft-india"],
  },
  {
    slug: "dehradun",
    name: "Dehradun, Uttarakhand",
    country: "India",
    coords: [30.3165, 78.0322],
    connection:
      "Vashundhara 'Shivi' Goel studies here; Shayana Goyal's brother lives here.",
    personSlugs: ["vashundhara-goel"],
  },
  {
    slug: "bhagalpur",
    name: "Bhagalpur, Bihar",
    country: "India",
    coords: [25.2425, 86.9842],
    connection:
      "Shourya (Shally) Goel and her husband live here; they own rental properties and mills across Bihar.",
    personSlugs: ["shally-goel", "shally-husband"],
  },
  {
    slug: "gujarat",
    name: "Gujarat",
    country: "India",
    coords: [22.6708, 71.5724],
    connection:
      "Aditi Goel is currently based here as Area Field Marketing Manager with Pidilite Industries.",
    personSlugs: [],
  },
  {
    slug: "bengaluru",
    name: "Bengaluru, Karnataka",
    country: "India",
    coords: [12.9716, 77.5946],
    connection:
      "Palash Goel, Staff Software Engineer at Intuit and a 5-year Zomato alum, lives here.",
    personSlugs: ["palash-goel"],
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    coords: [25.2048, 55.2708],
    connection:
      "Aditya Agarwal runs the Dubai branch of AG Shares & Securities; lives here with his wife Sugandha.",
    personSlugs: ["aditya-agarwal", "sugandha-agarwal"],
  },
  {
    slug: "foster-city",
    name: "Foster City, California",
    country: "USA",
    coords: [37.5585, -122.2711],
    connection:
      "Vivek and Rashi Agarwal live here with their children Anayra and Rhidhaan, the family's California branch.",
    personSlugs: ["vivek-agarwal", "rashi-agarwal", "anayra-agarwal", "rhidhaan-agarwal"],
  },
  {
    slug: "la-jolla",
    name: "La Jolla, California",
    country: "USA",
    coords: [32.8328, -117.2713],
    connection:
      "Arnav (Yash) Goel is based here as an undergraduate at UC San Diego.",
    personSlugs: ["arnav-goel"],
  },
  {
    slug: "mason-ohio",
    name: "Mason, Ohio",
    country: "USA",
    coords: [39.3601, -84.3094],
    connection:
      "Nitin and Manjari Agarwal live here with their children Nayonika and Rayaan, the family's Ohio branch.",
    personSlugs: ["nitin-agarwal", "manjari-garg", "nayonika-agarwal", "rayaan-agarwal"],
  },
];

export const placesBySlug: Record<string, Place> = Object.fromEntries(
  places.map((p) => [p.slug, p]),
);
