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
          הטענה עם מספרים חיים, וטרמינל אמיתי — המוצר עצמו, לא איור.
          שחור, לבן, קו אחד, אוויר. סטטי לחלוטין. */}
      <header className="border-b-2 border-action">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-t5 items-center">
          <div>
            <p className="text-small font-bold text-ink mb-4">האקדמיה של קלוד</p>
            <h1 className="text-hero font-bold text-ink mb-4">
              ללמוד לעבוד עם Claude Code בלי לנחש.
            </h1>
            <p className="text-body text-ink">
              {articleCount} מאמרים · הפקודות והדגלים בכולם אומתו מול התיעוד
              הרשמי · עודכן{" "}<span dir="ltr" className="whitespace-nowrap">{buildDate}</span>
            </p>
            <ViewCounter />
          </div>
          {/* סשן Claude Code אמיתי — לבן-על-שחור, מסגרת 1px, בלי צל,
              בלי עיגול, בלי אנימציה. HTML סמנטי, ניתן לבחירה והעתקה. */}
          <figure
            aria-label="דוגמת סשן Claude Code"
            className="border border-action bg-action text-white font-mono text-small leading-relaxed p-4 overflow-x-auto"
            dir="ltr"
          >
            <pre className="whitespace-pre-wrap">
{`~/my-app $ claude
Claude Code · Opus

`}<span dir="rtl">{`‏> תוסיף כפתור התנתקות לעמוד ההגדרות`}</span>{`

* קורא את app/settings/page.tsx
* עורך את app/settings/page.tsx
    + <LogoutButton />

`}<span dir="rtl">{`‏✓ הכפתור נוסף. להריץ את הבדיקות?`}</span>
            </pre>
          </figure>
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
        <p className="mt-2 text-small">
          <Link href="/m/advanced" className="text-accent hover:underline">
            כבר עובד עם Claude Code? קפוץ לחומר המתקדם ←
          </Link>
        </p>
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
