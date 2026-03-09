import Link from "next/link";
import { getCategories, getAllArticles } from "@/lib/knowledge";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const categories = getCategories();
  const allArticles = getAllArticles();

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            האקדמיה של קלוד
          </h1>
          <p className="text-base text-gray-900">
            מאגר ידע מקיף ל-Claude Code ו-Git — הכל בעברית, הכל במקום אחד
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <SearchBar items={allArticles} />
      </div>

      {/* Wizard CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <Link
          href="/wizard"
          className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">&#10024;</span>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
              אשף פרויקט חדש
            </h2>
          </div>
          <p className="text-sm text-gray-900 leading-relaxed">
            ענה על כמה שאלות וקבל את כל הפקודות מוכנות להרצה — Git, CLAUDE.md,
            ו-GitHub
          </p>
        </Link>
      </div>

      {/* Category Cards */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cat.name}
                </h2>
              </div>
              <p className="text-sm text-gray-900 mb-3 leading-relaxed">
                {cat.description}
              </p>
              <span className="text-sm font-medium text-blue-700">
                {cat.articles.length} פקודות &larr;
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
