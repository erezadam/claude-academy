import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getCategoryBySlug, getArticle } from "@/lib/knowledge";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import MarkdownContent from "@/components/MarkdownContent";

// מאמר שנבדק לפני יותר מ-90 יום מסומן "ייתכן שהתיישן". מחושב בזמן build —
// האתר נבנה מחדש לפחות אחת לשבוע (העדכון השבועי), כך שהחישוב לא נסחף.
const STALE_DAYS = 90;
function isStale(lastVerified: string): boolean {
  const age = Date.now() - new Date(lastVerified).getTime();
  return age > STALE_DAYS * 24 * 60 * 60 * 1000;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const description =
    article.whatItDoes || `${article.title} — הסבר ומדריך בעברית.`;
  const url = `/a/${slug}`;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "he_IL",
      modifiedTime: article.lastVerified,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const category = article ? getCategoryBySlug(article.category) : undefined;

  if (!category || !article) notFound();

  const articleUrl = `${SITE_URL}/a/${article.slug}`;
  const description =
    article.whatItDoes || `${article.title} — הסבר ומדריך בעברית.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: article.title,
        description,
        inLanguage: "he",
        url: articleUrl,
        ...(article.lastVerified
          ? { dateModified: article.lastVerified }
          : {}),
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: articleUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: category.name,
            item: `${SITE_URL}/category/${category.slug}`,
          },
          { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen font-sans bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
        {article.lastVerified && (
          <div className="mb-6 text-sm text-gray-700">
            {article.origin === "original" ? (
              <span>תוכן מקורי — מבוסס ניסיון, לא תיעוד</span>
            ) : (
              <span>
                הפקודות והדגלים בעמוד אומתו מול התיעוד הרשמי · נבדק ב-
                {article.lastVerified}
              </span>
            )}
            {article.origin !== "original" && isStale(article.lastVerified) && (
              <span className="block mt-1 text-amber-800">
                ייתכן שהתיישן — Claude Code מתעדכן מהר.
              </span>
            )}
          </div>
        )}
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
