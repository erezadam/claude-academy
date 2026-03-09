import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/knowledge";
import CopyButton from "@/components/CopyButton";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Top nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-blue-700 hover:underline transition-colors"
          >
            האקדמיה של קלוד
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900">
              {category.name}
            </h1>
          </div>
          <p className="text-gray-900">{category.description}</p>
          <p className="text-sm text-gray-900 mt-2">
            {category.articles.length} פקודות
          </p>
        </div>
      </header>

      {/* Articles list */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="divide-y divide-gray-100">
          {category.articles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.category}/${article.slug}`}
              className="block py-5 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h3>
                  {article.whatItDoes && (
                    <p className="text-sm text-gray-900 mt-1">
                      {article.whatItDoes}
                    </p>
                  )}
                </div>
                <span className="text-gray-400 group-hover:text-blue-700 transition-colors mt-1 flex-shrink-0">
                  &larr;
                </span>
              </div>
              {article.firstCodeBlock && (
                <div className="relative mt-3">
                  <pre
                    dir="ltr"
                    className="bg-gray-900 text-gray-100 rounded-lg p-3 text-sm leading-relaxed overflow-x-auto"
                  >
                    <code>{article.firstCodeBlock}</code>
                  </pre>
                  <CopyButton text={article.firstCodeBlock} />
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
