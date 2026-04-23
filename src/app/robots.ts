import type { MetadataRoute } from "next";
import { site } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines: explicit allow
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Slurp", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },
      // AI / answer-engine crawlers: explicit allow (for AEO)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "DiffBot", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      // Generic catch-all
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.baseUrl}/sitemap.xml`,
    host: site.baseUrl,
  };
}
