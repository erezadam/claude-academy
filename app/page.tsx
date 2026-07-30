import Link from "next/link";
import {
  getAllArticles,
  getRecentlyVerified,
  getMissionArticles,
  MISSION_META,
  MISSION_ORDER,
} from "@/lib/knowledge";

// עמוד הבית — מימוש "Claude Academy - Site.dc.html" (isHome) מ-Claude Design.
export default function Home() {
  const articleCount = getAllArticles().length;
  const buildDate = new Date().toISOString().slice(0, 10);
  const recent = getRecentlyVerified(5);

  const corners = (
    <>
      <i className="corner tl" /><i className="corner tr" />
      <i className="corner bl" /><i className="corner br" />
    </>
  );

  return (
    <main>
      {/* Hero */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "60px 40px 44px",
          display: "grid",
          gridTemplateColumns: "1.15fr .85fr",
          gap: 48,
          alignItems: "start",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <div>
          <div
            className="font-mono-ds"
            style={{
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--color-accent-700)",
              marginBottom: 16,
            }}
          >
            {articleCount} מאמרים · עודכן <span dir="ltr">{buildDate}</span>
          </div>
          <h1 style={{ fontSize: 68, margin: "0 0 16px", lineHeight: 1.03 }}>
            ללמוד לעבוד עם Claude Code בלי לנחש.
          </h1>
          <p className="text-muted" style={{ fontSize: 19, maxWidth: "46ch", margin: "0 0 22px" }}>
            כל פקודה, דגל ותהליך עבודה — מאומתים מול התיעוד הרשמי, בעברית.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/start" className="btn btn-primary blueprint" style={{ fontSize: 15, padding: "11px 20px" }}>
              מסלול המתחיל ←{corners}
            </Link>
            <Link href="/commands-list" className="btn btn-secondary" style={{ fontSize: 15, padding: "11px 20px" }}>
              טבלת כל הפקודות
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Link
            href="/start"
            className="card blueprint"
            style={{
              padding: 20,
              gap: 6,
              background: "var(--color-accent-900)",
              borderColor: "var(--color-accent-900)",
              color: "#eef3f8",
            }}
          >
            <div className="font-mono-ds" style={{ fontSize: 11, letterSpacing: ".1em", opacity: 0.7 }}>
              מעולם לא עבדת עם Claude Code?
            </div>
            <div className="card-title" style={{ fontSize: 26, color: "#fff" }}>התחל כאן ←</div>
            <p className="card-body" style={{ opacity: 0.75 }}>
              מסלול המתחיל — צעד אחרי צעד, מהתקנה ועד עבודה בטוחה.
            </p>
            {corners}
          </Link>
          <Link href="/m/advanced" className="card blueprint" style={{ padding: 20, gap: 6 }}>
            <div className="font-mono-ds" style={{ fontSize: 11, letterSpacing: ".1em", color: "var(--color-accent-700)" }}>
              כבר עובד איתו?
            </div>
            <div className="card-title" style={{ fontSize: 26 }}>קפוץ לחומר המתקדם ←</div>
            <p className="card-body">סוכנים, MCP, ‏skills, אוטומציה.</p>
            {corners}
          </Link>
        </div>
      </div>

      {/* שש דרכים להיכנס */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 40px 56px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 30 }}>שש דרכים להיכנס</h2>
          <Link href="/commands-list" className="btn btn-ghost">טבלת כל הפקודות ←</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {MISSION_ORDER.map((mission, i) => {
            const meta = MISSION_META[mission];
            const count = getMissionArticles(mission).length;
            const href = mission === "start" ? "/start" : `/m/${mission}`;
            return (
              <Link key={mission} href={href} className="card blueprint" style={{ padding: 18, gap: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span className="font-mono-ds" style={{ fontSize: 26, color: "var(--color-accent)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted" style={{ fontSize: 12 }}>{count} מאמרים</span>
                </div>
                <div className="card-title" style={{ fontSize: 21 }}>{meta.name}</div>
                <p className="card-body">{meta.description}</p>
                {corners}
              </Link>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 26,
            borderTop: "1px solid var(--color-divider)",
            paddingTop: 28,
          }}
        >
          <div>
            <h6 className="text-muted" style={{ margin: "0 0 12px" }}>אומתו לאחרונה</h6>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recent.map((r) => (
                <Link
                  key={r.slug}
                  href={`/a/${r.slug}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 0",
                    borderBottom: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                    fontSize: 17,
                    color: "var(--color-text)",
                  }}
                >
                  <span>{r.title}</span>
                  <span className="text-muted font-mono-ds" style={{ fontSize: 12 }}>{r.lastVerified}</span>
                </Link>
              ))}
            </div>
          </div>
          <div
            className="blueprint"
            style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8, background: "var(--color-accent-100)" }}
          >
            <div className="card-kicker">למה לסמוך על זה</div>
            <div style={{ fontSize: 14.5, color: "var(--color-accent-900)", lineHeight: 1.65 }}>
              הפקודות והדגלים בכל {articleCount} המאמרים אומתו מול התיעוד הרשמי של
              Anthropic. לכל מאמר יש תאריך בדיקה — אם הוא מיושן, אתה רואה את זה
              לפני שאתה מריץ.
            </div>
            {corners}
          </div>
        </div>
      </div>
    </main>
  );
}
