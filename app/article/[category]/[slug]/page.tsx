import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getArticle,
} from "@/lib/knowledge";
import MarkdownContent from "@/components/MarkdownContent";

export function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; slug: string }[] = [];
  for (const cat of categories) {
    for (const article of cat.articles) {
      params.push({ category: cat.slug, slug: article.slug });
    }
  }
  return params;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const article = getArticle(categorySlug, slug);

  if (!category || !article) notFound();

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Top nav breadcrumbs */}
      <nav className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-blue-700 hover:underline transition-colors"
          >
            האקדמיה של קלוד
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={`/category/${category.slug}`}
            className="text-blue-700 hover:underline transition-colors"
          >
            {category.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{article.title}</span>
        </div>
      </nav>

      {/* Article content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <MarkdownContent content={article.content} />
      </main>

      {/* Footer nav */}
      <footer className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href={`/category/${category.slug}`}
            className="text-sm text-blue-700 hover:underline"
          >
            → חזרה ל{category.name}
          </Link>
        </div>
      </footer>
    </div>
  );
}
