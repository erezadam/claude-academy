import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MISSION_META,
  MISSION_ORDER,
  getMissionArticles,
  type Mission,
} from "@/lib/knowledge";
import MissionArticleList from "./MissionArticleList";

// עמוד משימה — מימוש isModule מ-"Claude Academy - Site.dc.html".
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

export default async function MissionPage({
  params,
}: {
  params: Promise<{ mission: string }>;
}) {
  const { mission } = await params;
  const meta = MISSION_META[mission as Mission];
  if (!meta) notFound();

  const articles = getMissionArticles(mission as Mission);
  const num = String(MISSION_ORDER.indexOf(mission as Mission) + 1).padStart(2, "0");
  const items = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    desc: a.whatItDoes,
    level: a.level,
    time: a.timeMinutes,
    date: a.lastVerified,
  }));

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ padding: "40px 40px 26px", borderBottom: "1px solid var(--color-divider)" }}>
        <div style={{ fontSize: 13, display: "flex", gap: 6, marginBottom: 14 }}>
          <Link href="/">האקדמיה</Link>
          <span className="text-muted">/</span>
          <span className="text-muted">{meta.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span className="font-mono-ds" style={{ fontSize: 32, color: "var(--color-accent)" }}>{num}</span>
          <h1 style={{ margin: 0, fontSize: 50 }}>{meta.name}</h1>
        </div>
        <p className="text-muted" style={{ fontSize: 18, margin: "10px 0 0" }}>{meta.description}</p>
      </div>
      {articles.length === 0 ? (
        <p style={{ padding: "30px 40px" }}>המאמרים למשימה הזו נכתבים עכשיו.</p>
      ) : (
        <MissionArticleList items={items} total={articles.length} />
      )}
    </main>
  );
}
