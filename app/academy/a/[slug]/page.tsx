import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getCategoryBySlug,
  getArticle,
  getNextArticle,
  getContentModifiedDate,
  MISSION_META,
  type Level,
} from "@/lib/knowledge";
import { SITE_URL, BRAND_NAME } from "@/lib/seo";
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
  const url = `/academy/a/${slug}`;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      siteName: BRAND_NAME,
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

  const articleUrl = `${SITE_URL}/academy/a/${article.slug}`;
  const description =
    article.whatItDoes || `${article.title} — הסבר ומדריך בעברית.`;

  // reference שייך לטבלת הפקודות; מאמר לימוד — לעמוד המשימה שלו.
  const isReference = article.type === "reference";
  const missionHref = isReference ? "/academy/commands-list" : `/academy/m/${article.mission}`;
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
  // TOC — כותרות ה-h2 של הגוף, מקושרות לעוגנים ש-MarkdownContent מייצר.
  const toc = [...bodyWithoutLeadingTitle.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());

  // ‏dateModified: ‏body_changed_at או קומיט אחרון — לא last_verified שמתרענן
  // בכל ריצת שער. ‏author: ‏Person רק כשיש סקירה אנושית חתומה (last_reviewed);
  // אחרת המותג כארגון. ‏datePublished: מהשדה published (קומיט ראשון) בלבד.
  const modified = getContentModifiedDate(article);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: article.title,
        description,
        inLanguage: "he",
        url: articleUrl,
        ...(article.published ? { datePublished: article.published } : {}),
        ...(modified ? { dateModified: modified } : {}),
        author: article.lastReviewed
          ? { "@type": "Person", name: "Erez Adam" }
          : { "@type": "Organization", name: BRAND_NAME },
        publisher: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
        mainEntityOfPage: articleUrl,
      },
      {
        // השרשרת מהתוכן, לא ממבנה התיקיות: מותג ← מדור ← משימה ← מאמר.
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: BRAND_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "האקדמיה של קלוד", item: `${SITE_URL}/academy` },
          {
            "@type": "ListItem",
            position: 3,
            name: missionName,
            item: `${SITE_URL}${missionHref}`,
          },
          { "@type": "ListItem", position: 4, name: article.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 250px",
        }}
      >
        <aside
          style={{
            borderInlineStart: "1px solid var(--color-divider)",
            padding: "36px 26px",
            order: 2,
            alignSelf: "start",
            position: "sticky",
            top: 70,
          }}
        >
          <h6 className="text-muted" style={{ margin: "0 0 12px" }}>בעמוד הזה</h6>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {toc.map((t) => (
              <a
                key={t}
                href={`#s-${encodeURIComponent(t)}`}
                style={{
                  fontSize: 13.5,
                  padding: "7px 10px",
                  borderInlineStart: "2px solid var(--color-divider)",
                  color: "inherit",
                }}
              >
                {t}
              </a>
            ))}
          </div>
          {(prerequisites.length > 0 || stepNext) && (
            <div className="blueprint" style={{ marginTop: 26, padding: 14, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 15, marginBottom: 5 }}>קשור</div>
              {prerequisites.map((pre) => (
                <Link key={pre.slug} href={`/academy/a/${pre.slug}`} style={{ display: "block" }}>
                  {pre.title}
                </Link>
              ))}
              {stepNext && (
                <Link href={`/academy/a/${stepNext.slug}`} style={{ display: "block" }}>
                  {stepNext.title}
                </Link>
              )}
              <i className="corner tl" /><i className="corner tr" />
              <i className="corner bl" /><i className="corner br" />
            </div>
          )}
        </aside>

        <article style={{ padding: "40px 44px 60px", maxWidth: 780 }}>
          <div style={{ fontSize: 13, display: "flex", gap: 6, marginBottom: 18 }}>
            <Link href="/">האקדמיה</Link>
            <span className="text-muted">/</span>
            <Link href={missionHref}>{missionName}</Link>
            <span className="text-muted">/</span>
            <span className="text-muted">{article.title}</span>
          </div>
          <h1 style={{ fontSize: 52, margin: "0 0 12px" }}>{article.title}</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18 }}>
            <span className="tag tag-outline">{LEVEL_NAMES[article.level]}</span>
            {article.timeMinutes && (
              <span className="tag tag-neutral">~{article.timeMinutes} דקות קריאה</span>
            )}
          </div>
          {article.lastVerified && (
            <div
              className="blueprint"
              style={{
                padding: "10px 13px",
                display: "flex",
                gap: 10,
                alignItems: "center",
                fontSize: 12.5,
                marginBottom: 28,
                flexWrap: "wrap",
              }}
            >
              <span className="font-mono-ds" style={{ color: "var(--color-accent)" }}>✓</span>
              {article.origin === "original" ? (
                <span>תוכן מקורי — מבוסס ניסיון, לא תיעוד</span>
              ) : article.lastReviewed ? (
                <span>
                  נסקר ידנית ב-{article.lastReviewed} · הפקודות והדגלים בעמוד
                  אומתו מול התיעוד הרשמי ב-{article.lastVerified}
                  {article.bodyChangedAt && article.bodyChangedAt > article.lastReviewed && (
                    <span className="text-muted"> · עודכן לאחר מכן</span>
                  )}
                </span>
              ) : (
                <span>
                  הפקודות והדגלים בעמוד אומתו אוטומטית מול התיעוד הרשמי
                  ב-{article.lastVerified} · <span className="text-muted">הפרוזה טרם נסקרה ידנית</span>
                </span>
              )}
              {article.origin !== "original" &&
                article.tool === "claude-code" &&
                article.lastReviewed &&
                isStale(article.lastReviewed) && (
                  <span style={{ color: "var(--color-stale)", background: "var(--color-stale-bg)", padding: "1px 6px" }}>
                    ייתכן שהתיישן — Claude Code מתעדכן מהר
                  </span>
                )}
            </div>
          )}
          {isReference && article.whatItDoes && (
            <p style={{ fontSize: 20, lineHeight: 1.62, margin: "0 0 30px" }}>{article.whatItDoes}</p>
          )}
          <MarkdownContent content={bodyWithoutLeadingTitle} />

          <Link
            href={stepNext ? `/academy/a/${stepNext.slug}` : missionHref}
            className="card blueprint"
            style={{ padding: "15px 17px", gap: 2, maxWidth: 360, marginTop: 12 }}
          >
            <div className="card-kicker">{stepNext ? "הצעד הבא" : "להמשך"}</div>
            <div className="card-title" style={{ fontSize: 19 }}>
              {stepNext ? stepNext.title : missionName} ←
            </div>
            <i className="corner tl" /><i className="corner tr" />
            <i className="corner bl" /><i className="corner br" />
          </Link>
        </article>
      </main>
    </div>
  );
}
