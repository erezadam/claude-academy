import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getLastUpdated } from "@/lib/knowledge";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
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
      <body className={`${heebo.variable} antialiased`}>
        {children}
        <Analytics />
        {lastUpdatedLabel && (
          <footer className="border-t border-gray-200 mt-12">
            <div className="max-w-5xl mx-auto px-6 py-4 text-sm text-gray-500">
              עודכן לאחרונה: {lastUpdatedLabel}
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}
