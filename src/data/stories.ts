import type { Story } from "./types";

// Stories are long-form pieces. Every factual claim in here should be
// traceable to data elsewhere in the repo (people.ts, businesses.ts,
// timeline-events.ts) or to a cited external source. Do not add
// interpretive commentary or anecdotes that are not directly
// confirmed by family records.
export const stories: Story[] = [
  {
    slug: "2000-split",
    title: "The 2000 split",
    kind: "milestone",
    summary:
      "In 2000, as the eldest of four brothers, Radha Krishna Goel gave up his share of the ancestral Ganesh Prasad Gondilal Saraf to his three younger brothers and opened Gondilal Saraf in the heart of Banda. A couple of years later, his father passed away.",
    era: "2000",
    date: { year: 2000 },
    body: [
      "By the late 1990s the ancestral firm had reached Radha Krishna Goel's generation, four brothers (Radha Krishna, Mahesh, Manmohan, and Sohan) and three sisters, whose father held shares in Ganesh Prasad Gondilal Saraf.",
      "In 2000, as the eldest, Radha Krishna stepped aside from his share and gave it to his three younger brothers. He opened a separate shop in the heart of Banda named simply Gondilal Saraf, preserving the founder's name and dropping 'Ganesh Prasad' from the title. That shop is run today by his sons Rohit and Vinod Goel.",
      "A couple of years later, their father passed away. The original Ganesh Prasad Gondilal Saraf heritage building in Banda today houses three independent jewellery shops run by the three remaining brothers' branches, one on the upper floor and two on the ground floor.",
    ],
    personSlugs: [
      "radha-krishna-goel",
      "mahesh-goel",
      "manmohan-goel",
      "sohan-goel",
      "rohit-goel",
      "vinod-goel",
    ],
    businessSlugs: ["gondilal-saraf", "ganesh-prasad-gondilal-saraf"],
    placeSlugs: ["banda"],
  },
  {
    slug: "clay-craft-group",
    title: "From one ceramics plant to the Clay Craft Group",
    kind: "profile",
    summary:
      "The Agarwal family Vijaya Goel married into built Clay Craft India, established in Jaipur in 1994, into a group that now includes Crown Craft (est. 2009), JCPL / Jaipur Ceramics (acquired 2014), Vacbott (launched 2022), and the Griha retail flagship.",
    era: "1994 to present",
    body: [
      "Clay Craft India is the flagship. Established in Jaipur in 1994 by the Agarwal family, it is an Indian manufacturer of fine bone china and ceramic tableware; reported FY25 revenue is approximately $148M.",
      "In 2009 the same family launched Crown Craft India as a sister concern in Jaipur, an ISO 9001-certified premium plastic homewares brand. In April 2014, Clay Craft India acquired Jaipur Ceramics Pvt. Ltd. (JCPL), a fine porcelain manufacturer; JCPL now operates under two sub-brands inside the group, JCPL Fine Porcelain for the HoReCa channel and JCPL Modern Living for retail. In September 2022 the group launched Vacbott, a Made-in-India line of double-wall vacuum-insulated stainless steel bottles and flasks. The Griha concept home store on Amrapali Marg in Vaishali Nagar, Jaipur, anchors the group's direct-to-consumer retail.",
      "Deepak Agarwal, Executive Director and Chief Financial Officer of Clay Craft India Limited, joined as a Director in September 2010 after completing his MBA in Finance at Cardiff University. He runs the company alongside his two brothers. His wife Vijaya Agarwal, daughter of Manmohan Goel of Banda, handles creative direction and designs new collections across the group's brands.",
    ],
    personSlugs: ["deepak-agarwal", "vijaya-agarwal", "manmohan-goel"],
    businessSlugs: [
      "clay-craft-india",
      "crown-craft-india",
      "jcpl-jaipur-ceramics",
      "vacbott",
      "griha-jaipur",
    ],
    placeSlugs: ["jaipur"],
  },
];

export const storiesBySlug: Record<string, Story> = Object.fromEntries(
  stories.map((s) => [s.slug, s]),
);

export function getStory(slug: string): Story | undefined {
  return storiesBySlug[slug];
}

export function getStoriesFor(options: {
  personSlug?: string;
  businessSlug?: string;
  placeSlug?: string;
}): Story[] {
  const { personSlug, businessSlug, placeSlug } = options;
  return stories.filter((s) => {
    if (personSlug && s.personSlugs?.includes(personSlug)) return true;
    if (businessSlug && s.businessSlugs?.includes(businessSlug)) return true;
    if (placeSlug && s.placeSlugs?.includes(placeSlug)) return true;
    return false;
  });
}
