import type { MetadataRoute } from "next";
import { site } from "@/data/config";
import { people } from "@/data/people";
import { businesses } from "@/data/businesses";
import { stories } from "@/data/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.baseUrl;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/story`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/family-tree`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/timeline`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/relationship`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/people`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/businesses`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/places`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/stories`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contribute`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const peoplePages: MetadataRoute.Sitemap = people
    .filter((p) => p.publicity !== "minimal")
    .map((p) => ({
      url: `${base}/people/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: p.publicity === "full" ? 0.8 : 0.5,
    }));

  const businessPages: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${base}/businesses/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const storyPages: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${base}/stories/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...peoplePages, ...businessPages, ...storyPages];
}
