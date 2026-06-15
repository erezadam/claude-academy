import Link from "next/link";
import {
  getRelatedArticles,
  getCategoryNameMap,
  type Article,
} from "@/lib/knowledge";

// Renders a "נושאים קשורים" block from the article's `related` frontmatter.
// Server component: resolves slugs to real articles (dropping any that don't
// exist) and links across categories. Renders nothing when none resolve.
export default function RelatedTopics({ article }: { article: Article }) {
  const related = getRelatedArticles(article);
  if (related.length === 0) return null;

  const categoryNames = getCategoryNameMap();

  return (
    <section className="mt-12 border-t border-gray-200 pt-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">נושאים קשורים</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {related.map((a) => (
          <li key={`${a.category}/${a.slug}`}>
            <Link
              href={`/article/${a.category}/${a.slug}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="min-w-0 truncate font-medium text-gray-900 transition-colors group-hover:text-blue-700">
                {a.title}
              </span>
              <span className="flex-shrink-0 text-xs text-gray-500">
                {categoryNames[a.category] ?? a.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
