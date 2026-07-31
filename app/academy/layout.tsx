import type { Metadata } from "next";
import { SITE_NAME, BRAND_NAME, SITE_DESCRIPTION } from "@/lib/seo";

// זהות המדור: כל תת-העץ /academy מקבל כאן את המטא-דאטה של האקדמיה,
// שדורסת את מטא-דאטת המותג הגלובלית מ-app/layout.tsx.
const ACADEMY_TITLE = "האקדמיה של קלוד — מאגר ידע ל-Claude Code ו-Git";

export const metadata: Metadata = {
  title: {
    default: ACADEMY_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Claude Code",
    "Claude Code בעברית",
    "פקודות Git",
    "Git בעברית",
    "מדריך Git",
    "מדריך Claude Code",
    "CLAUDE.md",
    "MCP",
    "Anthropic",
    "כלי פיתוח AI",
  ],
  alternates: {
    canonical: "/academy",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "/academy",
    siteName: BRAND_NAME,
    title: ACADEMY_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: ACADEMY_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function AcademyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
