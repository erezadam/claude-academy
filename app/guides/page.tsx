import type { Metadata } from "next";
import Link from "next/link";
import {
  MISSION_META,
  MISSION_ORDER,
  getMissionArticles,
} from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "מדריכים",
  description: "שש משימות — כל מדריכי הלימוד של האקדמיה לפי מה שאתה מנסה לעשות.",
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">מדריכים</h1>
          <p className="text-base text-gray-900">
            לפי מה שאתה מנסה לעשות — לא לפי שם הכלי.
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <ul>
          {MISSION_ORDER.map((mission) => {
            const count = getMissionArticles(mission).length;
            const meta = MISSION_META[mission];
            return (
              <li key={mission} className="py-4 border-b border-gray-100 last:border-b-0">
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
        </ul>
      </main>
    </div>
  );
}
