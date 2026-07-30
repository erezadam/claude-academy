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
    },
    {
      url: `${SITE_URL}/commands-list`,
    },
    {
      url: `${SITE_URL}/design-gallery/`,
    },
    {
      url: `${SITE_URL}/wizard`,
    },
  ];

  const missions: MetadataRoute.Sitemap = MISSION_ORDER.map((m) => ({
    url: `${SITE_URL}/m/${m}`,
  }));
  const hubs: MetadataRoute.Sitemap = ["/start", "/guides", "/tools", "/feedback"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
    })
  );

  const articles: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE_URL}/a/${a.slug}`,
    lastModified: a.lastVerified ? new Date(a.lastVerified) : undefined,
  }));

  return [...staticPages, ...missions, ...hubs, ...articles];
}
