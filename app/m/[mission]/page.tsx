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

const LEVEL_ORDER: Level[] = ["beginner", "intermediate", "advanced"];
const LEVEL_NAMES: Record<Level, string> = {
  beginner: "למתחילים",
  intermediate: "בהמשך הדרך",
  advanced: "מתקדם",
};

function ArticleRow({ article }: { article: Article }) {
  return (
    <li className="py-3 border-b border-gray-100 last:border-b-0">
      <Link href={`/a/${article.slug}`} className="group block">
        <span className="font-bold text-gray-900 group-hover:text-blue-700">
          {article.title}
        </span>
        {article.timeMinutes && (
          <span className="text-sm text-gray-700 mr-2">
            · {article.timeMinutes} דק׳
          </span>
        )}
        {article.whatItDoes && (
          <span className="block text-sm text-gray-700 mt-0.5">
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
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.name}</h1>
          <p className="text-base text-gray-900">{meta.description}</p>
          <p className="text-sm text-gray-700 mt-1">{articles.length} מאמרים</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {articles.length === 0 && (
          <p className="text-gray-900">המאמרים למשימה הזו נכתבים עכשיו.</p>
        )}
        {[...byLevel.entries()].map(([lvl, list]) =>
          lvl === "advanced" ? (
            // סקשן "מתקדם" מקופל כברירת מחדל.
            <details key={lvl} className="mb-8">
              <summary className="text-lg font-bold text-gray-900 cursor-pointer mb-2">
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
              <h2 className="text-lg font-bold text-gray-900 mb-2">
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
