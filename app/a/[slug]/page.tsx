import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getCategoryBySlug,
  getArticle,
  getNextArticle,
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
  // "הצעד הבא" מחושב מ-mission+pathOrder (next_override לחריגים); לאחרון
  // במשימה — קישור לעמוד המשימה.
  const stepNext = getNextArticle(article);
  // הכותרת מוצגת כ-h1 ע"י העמוד; שורת ה-## הראשונה בגוף כפולה לה ומוסרת.
  const bodyWithoutLeadingTitle = article.content.replace(/^\s*## .*\n+/, "");

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
      <nav className="border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-2 text-small">
          <Link
            href="/"
            className="text-accent hover:underline transition-colors"
          >
            האקדמיה של קלוד
          </Link>
          <span className="text-ink-soft">/</span>
          <Link
            href={missionHref}
            className="text-accent hover:underline transition-colors"
          >
            {missionName}
          </Link>
          <span className="text-ink-soft">/</span>
          <span className="text-ink font-bold">{article.title}</span>
        </div>
      </nav>

      {/* Article content */}
      <main className="max-w-[70ch] mx-auto px-6 py-8">
        <h1 className="text-h1 font-bold text-ink mb-4">{article.title}</h1>
        {/* תגי רמה וזמן + "לפני זה כדאי" */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-small">
          <span className="border border-rule px-2 py-0.5 text-ink">
            {LEVEL_NAMES[article.level]}
          </span>
          {article.timeMinutes && (
            <span className="text-ink-soft">~{article.timeMinutes} דקות קריאה</span>
          )}
        </div>
        {prerequisites.length > 0 && (
          <p className="mb-4 text-small text-ink">
            לפני זה כדאי:{" "}
            {prerequisites.map((pre, i) => (
              <span key={pre.slug}>
                {i > 0 && " · "}
                <Link href={`/a/${pre.slug}`} className="text-accent hover:underline">
                  {pre.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        {/* התקציר מוצג רק על reference — שם הוא כרטיס; ב-guide הוא הכפיל את הפתיחה. */}
        {isReference && article.whatItDoes && (
          <p className="mb-6 text-body text-ink border-r-2 border-action pr-3">
            {article.whatItDoes}
          </p>
        )}
        {article.lastVerified && (
          <div className="mb-6 text-small">
            {article.origin === "original" ? (
              <span className="text-ink-soft">תוכן מקורי — מבוסס ניסיון, לא תיעוד</span>
            ) : (
              <span className="text-verified">
                הפקודות והדגלים בעמוד אומתו מול התיעוד הרשמי · נבדק ב-
                {article.lastVerified}
              </span>
            )}
            {article.origin !== "original" && !article.lastReviewed && (
              <span className="block mt-1 text-ink-soft">
                נוצר אוטומטית — טרם נסקר.
              </span>
            )}
            {article.origin !== "original" &&
              article.tool === "claude-code" &&
              article.lastReviewed &&
              isStale(article.lastReviewed) && (
                <span className="block mt-1 text-stale bg-stale-bg px-2 py-1 w-fit">
                  ייתכן שהתיישן — Claude Code מתעדכן מהר.
                </span>
              )}
          </div>
        )}
        <MarkdownContent content={bodyWithoutLeadingTitle} />
      </main>

      {/* הצעד הבא */}
      <footer className="border-t border-rule">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {stepNext ? (
            <Link href={`/a/${stepNext.slug}`} className="group block bg-action text-white p-5">
              <span className="text-small text-white block">הצעד הבא</span>
              <span className="text-h2 font-bold text-white group-hover:underline">
                {stepNext.title} ←
              </span>
            </Link>
          ) : (
            <Link href={missionHref} className="group block bg-action text-white p-5">
              <span className="text-small text-white block">להמשך</span>
              <span className="text-h2 font-bold text-white group-hover:underline">
                {missionName} ←
              </span>
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
