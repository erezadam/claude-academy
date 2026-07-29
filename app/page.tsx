import {
  getAllArticles,
  getChangelog,
  getCategoryNameMap,
  getRecentlyVerified,
  MISSION_META,
  MISSION_ORDER,
  getMissionArticles,
} from "@/lib/knowledge";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import WhatsNew from "@/components/WhatsNew";
import ViewCounter from "@/components/ViewCounter";

export default function Home() {
  const allArticles = getAllArticles();
  const changelog = getChangelog();
  const categoryNames = getCategoryNameMap();
  const articleCount = getAllArticles().length;
  const buildDate = new Date().toISOString().slice(0, 10);
  const recentlyVerified = getRecentlyVerified(5);

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* שער פתיח: wordmark, כותרת hero (החריג המאושר היחיד לסקאלה),
          והטענה עם מספרים חיים מה-build. שחור, לבן, קו אחד, אוויר. */}
      <header className="border-b-2 border-action">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-small font-bold text-ink mb-4">האקדמיה של קלוד</p>
          <h1 className="text-hero font-bold text-ink mb-4">
            ללמוד לעבוד עם Claude Code בלי לנחש.
          </h1>
          <p className="text-body text-ink">
            {articleCount} מאמרים · הפקודות והדגלים בכולם אומתו מול התיעוד
            הרשמי · עודכן {buildDate}
          </p>
          <ViewCounter />
        </div>
      </header>

      {/* פיצול הדרכים: בלוק ראשי דומיננטי אחד */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link
          href="/start"
          className="block bg-action text-white p-8"
        >
          <span className="text-h2 font-bold text-white block mb-1">
            לא עבדת עם Claude Code מעולם? התחל כאן
          </span>
          <span className="text-body text-white">
            מסלול המתחיל — צעד אחרי צעד, מהתקנה ועד עבודה בטוחה ←
          </span>
        </Link>
      </div>

      {/* חיפוש רחב */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        <SearchBar items={allArticles} categoryNames={categoryNames} />
      </div>

      {/* רשימה טיפוגרפית של שש המשימות */}
      <main className="max-w-3xl mx-auto px-6 pb-8">
        <ul>
          {MISSION_ORDER.map((mission) => {
            const count = getMissionArticles(mission).length;
            const meta = MISSION_META[mission];
            return (
              <li
                key={mission}
                className="py-4 border-b border-rule last:border-b-0"
              >
                <Link href={mission === "start" ? "/start" : `/m/${mission}`} className="group block">
                  <span className="text-h2 font-bold text-ink group-hover:text-accent">
                    {meta.name}
                  </span>
                  <span className="text-small text-ink-soft mr-2">
                    · {count} מאמרים
                  </span>
                  <span className="block text-small text-ink-soft mt-0.5">
                    {meta.description}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="py-4">
            <Link href="/commands-list" className="group block">
              <span className="text-h2 font-bold text-ink group-hover:text-accent">
                טבלת כל הפקודות
              </span>
              <span className="block text-small text-ink-soft mt-0.5">
                כל פקודות Claude Code ו-Git במקום אחד — חיפוש, מיון, סינון.
              </span>
            </Link>
          </li>
        </ul>
      </main>

      {/* What's New */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <WhatsNew entries={changelog} categoryNames={categoryNames} />
      </div>

      {/* רצועת "עודכן לאחרונה" — האתר חי */}
      <div className="max-w-3xl mx-auto px-6 pb-20 border-t border-rule pt-6">
        <p className="text-small font-bold text-ink mb-2">אומתו לאחרונה</p>
        <ul>
          {recentlyVerified.map((a) => (
            <li key={a.slug} className="py-1 text-small">
              <Link href={`/a/${a.slug}`} className="text-accent hover:underline">
                {a.title}
              </Link>
              <span className="text-ink-soft"> · {a.lastVerified}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
