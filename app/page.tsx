import Link from "next/link";
import { getAllArticles } from "@/lib/knowledge";
import { BRAND_NAME, SITE_URL, GITHUB_URL } from "@/lib/seo";

/*
 * עמוד המותג — תכלס AI. שבעה בלוקים בסדר קבוע (החלטה מיתוגית):
 * hero → מה אני עושה → ההוכחה → האקדמיה → מי אני → פעולה אחת → ניוזלטר.
 * הנוסח מאושר מראש — לא משכתבים. המספרים נקראים מהמקור בזמן בנייה.
 */
export default function BrandHome() {
  const all = getAllArticles();
  const articleCount = all.length;
  const reviewedCount = all.filter((a) => a.lastReviewed).length;
  const unreviewedCount = articleCount - reviewedCount;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    founder: {
      "@type": "Person",
      name: "ארז אדם",
      url: `${SITE_URL}/about`,
    },
  };

  const services = [
    {
      title: "מיפוי התהליך",
      body: "איפה AI באמת מחזיר, ואיפה הוא בזבוז כסף. לפעמים התשובה היא “לא כאן”.",
    },
    {
      title: "ארכיטקטורה",
      body: "מבנה שמחזיק כשהעומס גדל, ושאפשר לתחזק גם בלעדיי.",
    },
    {
      title: "אבטחת מידע והרשאות",
      body: "מה הסוכן רואה, מה הוא לא רואה, מה נשמר ואיפה. לפני הבנייה, לא אחריה.",
    },
    {
      title: "בנייה והטמעה",
      body: "הסוכן רץ בסביבה שלכם ומול האנשים שלכם, לא בהדגמה.",
    },
  ];

  const corners = (
    <>
      <i className="corner tl" /><i className="corner tr" />
      <i className="corner bl" /><i className="corner br" />
    </>
  );

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. Hero */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px 40px 52px",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <p className="text-small font-mono-ds text-muted" style={{ marginBottom: 16 }}>
          tachlesai.co.il
        </p>
        <h1 style={{ fontSize: 62, margin: "0 0 18px", lineHeight: 1.05, maxWidth: "22ch" }}>
          אני מנתח את התהליך — ואני בונה את הסוכן.
        </h1>
        <p className="text-muted" style={{ fontSize: 20, maxWidth: "48ch", margin: 0 }}>
          בלי מסמך שנשאר על המדף, ובלי מסירה לגורם שלישי. מי שאיפיין הוא זה שמיישם.
        </p>
      </div>

      {/* 2. מה אני עושה — ארבע שורות */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "44px 40px",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 30 }}>מה אני עושה</h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 760 }}>
          {services.map((s) => (
            <li
              key={s.title}
              style={{
                borderTop: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                padding: "13px 0",
                fontSize: 17,
                lineHeight: 1.6,
              }}
            >
              <strong>{s.title}</strong> — {s.body}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. ההוכחה */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "44px 40px",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <div
          className="blueprint"
          style={{
            padding: 26,
            background: "var(--color-accent-100)",
            maxWidth: 860,
            position: "relative",
          }}
        >
          <h2 style={{ margin: "0 0 12px", fontSize: 28, color: "var(--color-accent-900)" }}>
            האתר שאתה קורא עכשיו הוא הדוגמה.
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: 16.5, lineHeight: 1.7, color: "var(--color-accent-900)" }}>
            האקדמיה כאן אינה בלוג. זו מערכת: {articleCount} מאמרים, שער אימות אוטומטי
            שרץ על כולם מול התיעוד הרשמי, ובדיקה שמפילה את הבילד כשמשהו לא מתאים.
            אני איפיינתי אותה ואני בניתי אותה.
          </p>
          <p style={{ margin: 0, fontSize: 16.5, color: "var(--color-accent-900)" }}>
            <strong>הקוד פתוח.</strong> אפשר לבדוק במקום להאמין לי —{" "}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <span dir="ltr">{GITHUB_URL.replace("https://", "")}</span> ←
            </a>
          </p>
          {corners}
        </div>
      </div>

      {/* 4. האקדמיה */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "44px 40px",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: 28 }}>
          {articleCount} מאמרים בעברית על Claude Code
        </h2>
        <p className="text-muted" style={{ margin: "0 0 18px", fontSize: 17, maxWidth: "60ch", lineHeight: 1.7 }}>
          לכל מאמר יש תאריך בדיקה — אם הוא מיושן, אתה רואה את זה לפני שאתה מריץ.
          {" "}{reviewedCount} מאמרים נסקרו גם אנושית; ב-{unreviewedCount} הנותרים
          כתוב את זה במפורש, במקום להעמיד פנים.
        </p>
        <Link href="/academy" className="btn btn-secondary" style={{ fontSize: 15, padding: "11px 20px" }}>
          לאקדמיה של קלוד ←
        </Link>
      </div>

      {/* 5. מי אני */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "44px 40px",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <h2 style={{ margin: "0 0 14px", fontSize: 28 }}>ארז אדם</h2>
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
          {/*
           * תאריך תחילת עבודה עם Claude Code הושמט בכוונה: לפי משימה 4,
           * ההיסטוריה בריפו מתחילה 2026-03-09 ואינה מאמתת "פברואר 2025".
           */}
          <p style={{ margin: 0 }}>
            עובד עם Claude Code — וגם עם Codex. אני לא מוכר לכם ספק; אני בוחר
            כלי לפי התהליך.
          </p>
        </div>
      </div>

      {/* 6. פעולה אחת */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "44px 40px",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <h2 style={{ margin: "0 0 10px", fontSize: 28 }}>שיחת אבחון, 30 דקות</h2>
        <p className="text-muted" style={{ margin: "0 0 18px", fontSize: 17, maxWidth: "56ch", lineHeight: 1.7 }}>
          נעבור על תהליך אחד אצלכם, ואגיד לכם תכלס אם יש שם משהו ל-AI או שאין.
          גם &quot;אין&quot; זו תשובה שאני נותן.
        </p>
        {/* TODO: לחבר את הכפתור ליעד אמיתי (קלנדלי / מייל / טופס) — אין יעד מאושר בריפו */}
        <a href="#" className="btn btn-primary blueprint" style={{ fontSize: 15, padding: "12px 22px" }}>
          לקבוע שיחת אבחון ←{corners}
        </a>
      </div>

      {/* 7. ניוזלטר — משני */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "30px 40px 56px" }}>
        {/* TODO: אין עדיין מנגנון הרשמה לניוזלטר — טקסט בלבד עד שיחובר */}
        <p className="text-muted" style={{ margin: 0, fontSize: 15 }}>
          ניוזלטר: מייל אחד כל כמה שבועות, על מה שבאמת עובד בהטמעת AI בארגונים.
        </p>
      </div>
    </main>
  );
}
