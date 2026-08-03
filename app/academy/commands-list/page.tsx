import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, getLatestCommandUpdates } from "@/lib/knowledge";
import CommandsTable from "@/components/CommandsTable";

export const metadata: Metadata = {
  title: "רשימת כל פקודות Claude Code",
  description:
    "כל פקודות Claude Code בטבלה אחת — חיפוש, מיון וסינון, עם הסבר בעברית לכל פקודה.",
  alternates: { canonical: "/academy/commands-list" },
  openGraph: {
    type: "website",
    title: "רשימת כל פקודות Claude Code",
    description:
      "כל פקודות Claude Code בטבלה אחת — חיפוש, מיון וסינון, עם הסבר בעברית.",
    url: "/academy/commands-list",
    locale: "he_IL",
  },
};

export default async function CommandsListPage() {
  const articles = getCategoryBySlug("claude-code")?.articles ?? [];
  // Same single derivation as the homepage red badge — guarantees the filtered
  // view and the badge always agree (data integrity).
  const recentUpdates = getLatestCommandUpdates();

  return (
    <div className="min-h-screen font-sans bg-white">
      <nav className="border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-small">
          <Link
            href="/academy"
            className="text-accent hover:underline transition-colors"
          >
            &larr; חזרה לעמוד הבית
          </Link>
        </div>
      </nav>

      <header className="border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-h1">📋</span>
            <h1 className="text-h2 font-bold text-ink">
              רשימת פקודות — Claude Code
            </h1>
          </div>
          <p className="text-ink">
            {articles.length} פקודות בטבלה אחת. חיפוש, מיון וסינון.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <CommandsTable articles={articles} recentUpdates={recentUpdates} />
      </main>
    </div>
  );
}
