import Link from "next/link";
import {
  getAllArticles,
  getChangelog,
  getCategoryNameMap,
  MISSION_META,
  MISSION_ORDER,
  getMissionArticles,
} from "@/lib/knowledge";
import SearchBar from "@/components/SearchBar";
import WhatsNew from "@/components/WhatsNew";
import ViewCounter from "@/components/ViewCounter";

export default function Home() {
  const allArticles = getAllArticles();
  const changelog = getChangelog();
  const categoryNames = getCategoryNameMap();

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            האקדמיה של קלוד
          </h1>
          <p className="text-base text-gray-900">
            Claude Code ו-Git בעברית — כל מאמר מאומת מול המקור שלו.
          </p>
          <ViewCounter />
        </div>
      </header>

      {/* פיצול הדרכים: בלוק ראשי דומיננטי אחד */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link
          href="/start"
          className="block border-2 border-gray-900 p-8 hover:bg-gray-50"
        >
          <span className="text-2xl font-bold text-gray-900 block mb-1">
            לא עבדת עם Claude Code מעולם? התחל כאן
          </span>
          <span className="text-base text-gray-900">
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
                className="py-4 border-b border-gray-100 last:border-b-0"
              >
                <Link href={`/m/${mission}`} className="group block">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                    {meta.name}
                  </span>
                  <span className="text-sm text-gray-700 mr-2">
                    · {count} מאמרים
                  </span>
                  <span className="block text-sm text-gray-700 mt-0.5">
                    {meta.description}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="py-4">
            <Link href="/commands-list" className="group block">
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                טבלת כל הפקודות
              </span>
              <span className="block text-sm text-gray-700 mt-0.5">
                כל פקודות Claude Code ו-Git במקום אחד — חיפוש, מיון, סינון.
              </span>
            </Link>
          </li>
        </ul>
      </main>

      {/* What's New */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <WhatsNew entries={changelog} categoryNames={categoryNames} />
      </div>
    </div>
  );
}
