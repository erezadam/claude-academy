import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MISSION_META,
  MISSION_ORDER,
  getMissionArticles,
  type Mission,
  type Level,
  type Article,
} from "@/lib/knowledge";

export function generateStaticParams() {
  return MISSION_ORDER.map((mission) => ({ mission }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mission: string }>;
}): Promise<Metadata> {
  const { mission } = await params;
  const meta = MISSION_META[mission as Mission];
  if (!meta) return {};
  return { title: meta.name, description: meta.description };
}

// קיבוץ לפי רמה קיים כדי לקצר רשימה ארוכה — לא כטקסונומיה לשמה. משימות
// קצרות (עד ~8 מאמרים) מוצגות שטוח; level ממשיך לשרת חיפוש וסינון.
const GROUPED_MISSIONS = new Set<Mission>(["daily", "advanced"]);

const LEVEL_ORDER: Level[] = ["beginner", "intermediate", "advanced"];
const LEVEL_NAMES: Record<Level, string> = {
  beginner: "למתחילים",
  intermediate: "בהמשך הדרך",
  advanced: "מתקדם",
};

function ArticleRow({ article }: { article: Article }) {
  return (
    <li className="py-3 border-b border-rule last:border-b-0">
      <Link href={`/a/${article.slug}`} className="group block">
        <span className="font-bold text-ink group-hover:text-accent">
          {article.title}
        </span>
        {article.timeMinutes && (
          <span className="text-small text-ink-soft mr-2">
            · {article.timeMinutes} דק׳
          </span>
        )}
        {article.whatItDoes && (
          <span className="block text-small text-ink-soft mt-0.5">
            {article.whatItDoes}
          </span>
        )}
      </Link>
    </li>
  );
}

export default async function MissionPage({
  params,
}: {
  params: Promise<{ mission: string }>;
}) {
  const { mission } = await params;
  const meta = MISSION_META[mission as Mission];
  if (!meta) notFound();

  const articles = getMissionArticles(mission as Mission);
  const byLevel = new Map<Level, Article[]>();
  for (const lvl of LEVEL_ORDER) {
    const list = articles.filter((a) => a.level === lvl);
    if (list.length > 0) byLevel.set(lvl, list);
  }

  return (
    <div className="min-h-screen font-sans bg-white">
      <header className="border-b border-rule">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-h1 font-bold text-ink mb-2">{meta.name}</h1>
          <p className="text-body text-ink">{meta.description}</p>
          <p className="text-small text-ink-soft mt-1">{articles.length} מאמרים</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {articles.length === 0 && (
          <p className="text-ink">המאמרים למשימה הזו נכתבים עכשיו.</p>
        )}
        {!GROUPED_MISSIONS.has(mission as Mission) && (
          <ul>
            {articles
              .sort((a, b) => (a.pathOrder ?? 99) - (b.pathOrder ?? 99))
              .map((a) => (
                <ArticleRow key={a.slug} article={a} />
              ))}
          </ul>
        )}
        {GROUPED_MISSIONS.has(mission as Mission) &&
        [...byLevel.entries()].map(([lvl, list]) =>
          lvl === "advanced" ? (
            // סקשן "מתקדם" מקופל כברירת מחדל.
            <details key={lvl} className="mb-8">
              <summary className="text-body font-bold text-ink cursor-pointer mb-2">
                {LEVEL_NAMES[lvl]} ({list.length})
              </summary>
              <ul>
                {list.map((a) => (
                  <ArticleRow key={a.slug} article={a} />
                ))}
              </ul>
            </details>
          ) : (
            <section key={lvl} className="mb-8">
              <h2 className="text-body font-bold text-ink mb-2">
                {LEVEL_NAMES[lvl]}
              </h2>
              <ul>
                {list.map((a) => (
                  <ArticleRow key={a.slug} article={a} />
                ))}
              </ul>
            </section>
          )
        )}
      </main>
    </div>
  );
}
