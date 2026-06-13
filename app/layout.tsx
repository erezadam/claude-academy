import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getLastUpdated } from "@/lib/knowledge";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "האקדמיה של קלוד — מאגר ידע ל-Claude Code ו-Git",
  description:
    "מאגר ידע מקיף בעברית לפקודות Claude Code, פקודות Git, ותהליכי עבודה מומלצים",
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
