import type { MetadataRoute } from "next";
import { getCategories, getAllArticles, getLastUpdated } from "@/lib/knowledge";
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

  const categories: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articles: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE_URL}/article/${a.category}/${a.slug}`,
    lastModified: a.lastVerified ? new Date(a.lastVerified) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categories, ...articles];
}
