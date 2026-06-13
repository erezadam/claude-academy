import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getArticle,
} from "@/lib/knowledge";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const article = getArticle(categorySlug, slug);
  if (!article) return {};

  const description =
    article.whatItDoes || `${article.title} — הסבר ומדריך בעברית.`;
  const url = `/article/${categorySlug}/${slug}`;

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
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const article = getArticle(categorySlug, slug);

  if (!category || !article) notFound();

  const articleUrl = `${SITE_URL}/article/${category.slug}/${article.slug}`;
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
