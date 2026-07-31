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
  alternates: { canonical: "/academy/guides" },
  openGraph: {
    type: "website",
    title: "מדריכים",
    description:
      "שש משימות — כל מדריכי הלימוד של האקדמיה לפי מה שאתה מנסה לעשות.",
    url: "/academy/guides",
    locale: "he_IL",
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <header className="border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-h1 font-bold text-ink mb-2">מדריכים</h1>
          <p className="text-body text-ink">
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
              <li key={mission} className="py-4 border-b border-rule last:border-b-0">
                <Link href={`/academy/m/${mission}`} className="group block">
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
        </ul>
      </main>
    </div>
  );
}
