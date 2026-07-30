import type { Metadata } from "next";
import {
  Heebo,
  Assistant,
  Barlow,
  Barlow_Condensed,
  IBM_Plex_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getLastUpdated, getAllArticles } from "@/lib/knowledge";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});
// Barlow (לטינית) לכותרות ולגוף; Assistant/Heebo מכסים עברית — לפי ה-DS.
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700"],
});
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const TITLE = "האקדמיה של קלוד — מאגר ידע ל-Claude Code ו-Git";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
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
  authors: [{ name: "Erez Adam" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Claude Academy",
  url: SITE_URL,
  inLanguage: "he",
  description: SITE_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lastUpdated = getLastUpdated();
  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("he-IL")
    : null;

  return (
    <html lang="he" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // תוכן סטטי מקבועים מהימנים בלבד; escaping ל-< מונע יציאה מתגית script
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={`${heebo.variable} ${assistant.variable} ${barlow.variable} ${barlowCondensed.variable} ${plexMono.variable} antialiased`}>
        <SiteNav articleCount={getAllArticles().length} />
        {children}
        <Analytics />
        <footer
          style={{
            borderTop: "1px solid var(--color-divider)",
            padding: "26px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <span className="text-muted" style={{ fontSize: 13 }}>
            האקדמיה של קלוד · מאגר ידע ל-Claude Code ו-Git
            {lastUpdatedLabel ? ` · עודכן ${lastUpdatedLabel}` : ""}
          </span>
          <span style={{ display: "flex", gap: 18, fontSize: 13 }}>
            <a href="/start">התחלה</a>
            <a href="/commands-list">פקודות</a>
            <a href="/tools">כלים</a>
            <a href="/feedback">שפרו את האקדמיה</a>
          </span>
        </footer>
      </body>
    </html>
  );
}
