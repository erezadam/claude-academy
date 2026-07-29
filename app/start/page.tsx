import type { Metadata } from "next";
import { getMissionArticles } from "@/lib/knowledge";
import StartChecklist, { type StartStep } from "./StartChecklist";

export const metadata: Metadata = {
  title: "מסלול המתחיל",
  description:
    "לא עבדת עם Claude Code מעולם? המסלול הלינארי מהתקנה ועד עבודה בטוחה.",
};

// חמשת מאמרי המסלול נכתבים לפי הגדרות Erez; עד אז — שלד עם כותרות עבודה.
// כשהמאמרים ייכתבו הם יקבלו mission: start + pathOrder ויחליפו את ה-placeholders.
const PLANNED: StartStep[] = [
  { title: "מה זה Claude Code, ומתי הוא לא הכלי הנכון", summary: "לפני שמתקינים — להבין מה זה ומה זה לא.", timeMinutes: 4 },
  { title: "התקנה והרצה ראשונה", summary: "עד ה-prompt הראשון שעובד.", timeMinutes: 8 },
  { title: "איך מדברים אליו", summary: "prompt טוב מול prompt שמייצר בלגן.", timeMinutes: 6 },
  { title: "CLAUDE.md — למה זה הדבר הראשון שכותבים", summary: "הידע הקבוע של הפרויקט שלך.", timeMinutes: 6 },
  { title: "מתי לסמוך ומתי לבדוק", summary: "ואיך חוזרים אחורה כשטעה.", timeMinutes: 6 },
];

export default function StartPage() {
  const written = getMissionArticles("start")
    .sort((a, b) => (a.pathOrder ?? 99) - (b.pathOrder ?? 99))
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      summary: a.whatItDoes,
      timeMinutes: a.timeMinutes,
    }));

  // כל עוד מאמרי המסלול לא נכתבו — מציגים את התכנון; מאמרים אמיתיים עם
  // mission: start מחליפים placeholders לפי הסדר, והשאר מצטרפים אחריהם.
  const steps: StartStep[] = written.length >= PLANNED.length ? written : [...written, ...PLANNED.slice(written.length)];
  const totalMinutes = steps.reduce((sum, s) => sum + (s.timeMinutes ?? 0), 0);

  return (
    <div className="min-h-screen font-sans bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">מסלול המתחיל</h1>
          <p className="text-base text-gray-900">
            לא עבדת עם Claude Code מעולם? זה המסלול — צעד אחרי צעד, בלי לדלג.
          </p>
          <p className="text-sm text-gray-700 mt-1">
            סך הכול ~{totalMinutes} דקות · ההתקדמות נשמרת בדפדפן שלך בלבד
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <StartChecklist steps={steps} />
      </main>
    </div>
  );
}
