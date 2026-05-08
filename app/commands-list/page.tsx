import Link from "next/link";
import { getCategoryBySlug } from "@/lib/knowledge";
import CommandsTable from "@/components/CommandsTable";

export default async function CommandsListPage() {
  const articles = getCategoryBySlug("claude-code")?.articles ?? [];

  return (
    <div className="min-h-screen font-sans bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-blue-700 hover:underline transition-colors"
          >
            &larr; חזרה לעמוד הבית
          </Link>
        </div>
      </nav>

      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📋</span>
            <h1 className="text-2xl font-bold text-gray-900">
              רשימת פקודות — Claude Code
            </h1>
          </div>
          <p className="text-gray-900">
            {articles.length} פקודות בטבלה אחת. חיפוש, מיון וסינון.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <CommandsTable articles={articles} />
      </main>
    </div>
  );
}
