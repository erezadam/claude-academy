import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "כלים",
  description: "כלים אינטראקטיביים של האקדמיה — אשף פרויקט חדש וגלריית עיצוב.",
};

const TOOLS = [
  {
    href: "/wizard",
    title: "אשף פרויקט חדש",
    description:
      "ענה על כמה שאלות וקבל את כל הפקודות מוכנות להרצה — Git, ‏CLAUDE.md ו-GitHub.",
  },
  {
    href: "/design-gallery/",
    title: "Design Gallery",
    description:
      "12 מערכות עיצוב מוכנות לשימוש — דמו חי, קוד CSS ו-Skill Prompt להפעלת Claude.",
    external: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <header className="border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-h1 font-bold text-ink mb-2">כלים</h1>
          <p className="text-body text-ink">
            לא מאמרים — כלים שעובדים בשבילך.
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <ul>
          {TOOLS.map((tool) => (
            <li key={tool.href} className="py-4 border-b border-rule last:border-b-0">
              {tool.external ? (
                <a href={tool.href} className="group block">
                  <span className="text-h2 font-bold text-ink group-hover:text-accent">
                    {tool.title}
                  </span>
                  <span className="block text-small text-ink-soft mt-0.5">
                    {tool.description}
                  </span>
                </a>
              ) : (
                <Link href={tool.href} className="group block">
                  <span className="text-h2 font-bold text-ink group-hover:text-accent">
                    {tool.title}
                  </span>
                  <span className="block text-small text-ink-soft mt-0.5">
                    {tool.description}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
