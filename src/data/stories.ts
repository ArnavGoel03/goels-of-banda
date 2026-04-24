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
