import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getCategoryBySlug,
  getArticle,
  getMissionArticles,
  MISSION_META,
  type Level,
} from "@/lib/knowledge";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import MarkdownContent from "@/components/MarkdownContent";

// באנר ההתיישנות נגזר מ-last_reviewed (ביקורת אנושית, ידני) — לא מ-
// last_verified שמתרענן אוטומטית ע"י השער. מוצג רק על tool: claude-code:
// תיעוד Git לא זז באותו קצב. מחושב בזמן build (האתר נבנה לפחות שבועית).
const STALE_DAYS = 90;
function isStale(lastReviewed: string): boolean {
  const age = Date.now() - new Date(lastReviewed).getTime();
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

  // reference שייך לטבלת הפקודות; מאמר לימוד — לעמוד המשימה שלו.
  const isReference = article.type === "reference";
  const missionHref = isReference ? "/commands-list" : `/m/${article.mission}`;
  const missionName = isReference
    ? "טבלת הפקודות"
    : MISSION_META[article.mission].name;

  const LEVEL_NAMES: Record<Level, string> = {
    beginner: "למתחילים",
    intermediate: "בהמשך הדרך",
    advanced: "מתקדם",
  };
  const prerequisites = (article.prerequisites ?? [])
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const nextArticle = article.next ? getArticle(article.next) : undefined;
  // "הצעד הבא": next מפורש, אחרת המאמר הבא באותה משימה, אחרת עמוד המשימה.
  const missionSiblings = isReference ? [] : getMissionArticles(article.mission);
  const fallbackNext =
    !nextArticle && missionSiblings.length > 1
      ? missionSiblings[(missionSiblings.findIndex((a) => a.slug === article.slug) + 1) % missionSiblings.length]
      : undefined;
  const stepNext = nextArticle ?? fallbackNext;

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
          <span className="text-gray-500">/</span>
          <Link
            href={missionHref}
            className="text-blue-700 hover:underline transition-colors"
          >
            {missionName}
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-900 font-medium">{article.title}</span>
        </div>
      </nav>

      {/* Article content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* תגי רמה וזמן + "לפני זה כדאי" */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="border border-gray-300 px-2 py-0.5 text-gray-900">
            {LEVEL_NAMES[article.level]}
          </span>
          {article.timeMinutes && (
            <span className="text-gray-700">~{article.timeMinutes} דקות קריאה</span>
          )}
        </div>
        {prerequisites.length > 0 && (
          <p className="mb-4 text-sm text-gray-900">
            לפני זה כדאי:{" "}
            {prerequisites.map((pre, i) => (
              <span key={pre.slug}>
                {i > 0 && " · "}
                <Link href={`/a/${pre.slug}`} className="text-blue-700 hover:underline">
                  {pre.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        {article.whatItDoes && (
          <p className="mb-6 text-base text-gray-900 border-r-2 border-gray-900 pr-3">
            {article.whatItDoes}
          </p>
        )}
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
            {article.origin !== "original" &&
              article.tool === "claude-code" &&
              article.lastReviewed &&
              isStale(article.lastReviewed) && (
                <span className="block mt-1 text-amber-800">
                  ייתכן שהתיישן — Claude Code מתעדכן מהר.
                </span>
              )}
          </div>
        )}
        <MarkdownContent content={article.content} />
      </main>

      {/* הצעד הבא */}
      <footer className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {stepNext ? (
            <Link href={`/a/${stepNext.slug}`} className="group block border-2 border-gray-900 p-5 hover:bg-gray-50">
              <span className="text-sm text-gray-700 block">הצעד הבא</span>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                {stepNext.title} ←
              </span>
            </Link>
          ) : (
            <Link href={missionHref} className="group block border-2 border-gray-900 p-5 hover:bg-gray-50">
              <span className="text-sm text-gray-700 block">להמשך</span>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                {missionName} ←
              </span>
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
