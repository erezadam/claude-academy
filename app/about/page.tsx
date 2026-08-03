import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/knowledge";
import { BRAND_NAME, SITE_URL, GITHUB_URL } from "@/lib/seo";

/*
 * דף המחבר — עוגן הישות של ארז אדם. הביוגרפיה כאן זהה מילה-במילה
 * לבלוק "מי אני" בעמוד השורש (החלטה מפורשת: אותו טקסט, לא ניסוח דומה).
 */
export const metadata: Metadata = {
  title: "אודות — ארז אדם",
  description:
    "מי כותב את התוכן כאן, איך הוא נבדק, ומה חלקו של סוכן AI בהפקה.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "אודות — ארז אדם",
    description:
      "מי כותב את התוכן כאן, איך הוא נבדק, ומה חלקו של סוכן AI בהפקה.",
    url: "/about",
    locale: "he_IL",
  },
};

// TODO: להוסיף כתובת לינקדאין ל-sameAs — הכתובת אינה קיימת בריפו
const SAME_AS = [GITHUB_URL];

export default function AboutPage() {
  const all = getAllArticles();
  const articleCount = all.length;
  const reviewedCount = all.filter((a) => a.lastReviewed).length;
  const unreviewedCount = articleCount - reviewedCount;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "ארז אדם",
    url: `${SITE_URL}/about`,
    sameAs: SAME_AS,
    worksFor: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
  };

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 40px 72px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <h1 style={{ fontSize: 52, margin: "0 0 26px", lineHeight: 1.06 }}>ארז אדם</h1>

      {/* 1. מי ארז — זהה לבלוק 5 בעמוד השורש */}
      <div style={{ maxWidth: "62ch", fontSize: 17, lineHeight: 1.75 }}>
        <p style={{ margin: "0 0 14px" }}>
          לפני שבניתי סוכנים, ניהלתי ארגונים. מנכ&quot;ל פרומדיקו — 200 עובדים
          ושרשרת האספקה של קבוצת ניאופרם. עשר שנים כ-CIO, כולל הטמעת ERP
          בין-לאומית מול חברת בת בגרמניה. מהנדס תעשייה וניהול, תואר שני באבטחת
          איכות ואמינות מהטכניון.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          <strong>רגולציה ואבטחת מידע הן לא נספח אצלי.</strong> עבדתי תחת FDA
          ו-GMP בתעשיית התרופות, ואבטחת מידע בבנק לאומי. אני יודע מה קורה
          למערכת שנכשלת בביקורת.
        </p>
        <p style={{ margin: 0 }}>
          עובד עם Claude Code — וגם עם Codex. אני לא מוכר לכם ספק; אני בוחר
          כלי לפי התהליך.
        </p>
      </div>

      {/* 2. איך התוכן נבדק */}
      <h2 style={{ margin: "40px 0 12px", fontSize: 28 }}>איך התוכן כאן נבדק</h2>
      <div className="text-muted" style={{ maxWidth: "62ch", fontSize: 16.5, lineHeight: 1.75 }}>
        <p style={{ margin: "0 0 12px" }}>
          כל {articleCount} המאמרים באקדמיה עוברים שער אימות אוטומטי שמריץ את
          הפקודות והדגלים מול התיעוד הרשמי של Anthropic, ומפיל את הבילד כשמשהו
          לא מתאים. לכל מאמר יש תאריך בדיקה גלוי.
        </p>
        <p style={{ margin: 0 }}>
          בנוסף, {reviewedCount} מאמרים נסקרו גם סקירה אנושית מלאה. ב-{unreviewedCount} הנותרים
          זה כתוב במפורש בעמוד המאמר — מה שטרם נסקר אנושית לא מוצג כאילו נסקר.
        </p>
      </div>

      {/* 3. גילוי השתתפות סוכן AI */}
      <h2 style={{ margin: "40px 0 12px", fontSize: 28 }}>גילוי נאות: AI בהפקת התוכן</h2>
      <p className="text-muted" style={{ maxWidth: "62ch", fontSize: 16.5, lineHeight: 1.75, margin: 0 }}>
        התוכן באתר מופק בעבודה משותפת עם סוכן AI (Claude Code): הסוכן כותב
        טיוטות ומריץ את בדיקות האימות, ואני מגדיר את המבנה, מאשר את הנוסח
        ואחראי לתוצאה. סקירה אנושית מסומנת ככזו רק כשבוצעה בפועל.
      </p>

      {/* 4. ערוצים */}
      <h2 style={{ margin: "40px 0 12px", fontSize: 28 }}>איפה עוד</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 16.5 }}>
        <li style={{ padding: "6px 0" }}>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <span dir="ltr">{GITHUB_URL.replace("https://", "")}</span> — הקוד של האתר, פתוח
          </a>
        </li>
      </ul>

      <p style={{ marginTop: 44, fontSize: 16 }}>
        <Link href="/">→ חזרה לעמוד הראשי</Link>
        {" · "}
        <Link href="/academy">האקדמיה של קלוד</Link>
      </p>
    </main>
  );
}
