import type { MetadataRoute } from "next";
import { MISSION_ORDER, getAllArticles, getLastUpdated } from "@/lib/knowledge";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastUpdated = getLastUpdated();
  const homeModified = lastUpdated ? new Date(lastUpdated) : undefined;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: homeModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/commands-list`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/design-gallery/`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/wizard`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const missions: MetadataRoute.Sitemap = MISSION_ORDER.map((m) => ({
    url: `${SITE_URL}/m/${m}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const hubs: MetadataRoute.Sitemap = ["/start", "/guides", "/tools"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const articles: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE_URL}/a/${a.slug}`,
    lastModified: a.lastVerified ? new Date(a.lastVerified) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...missions, ...hubs, ...articles];
}
