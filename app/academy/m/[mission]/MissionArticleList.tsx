"use client";

import Link from "next/link";
import { useState } from "react";

export interface MissionArticleItem {
  slug: string;
  title: string;
  desc: string;
  level: "beginner" | "intermediate" | "advanced";
  time?: number;
  date?: string;
}

const LEVEL_LABEL: Record<MissionArticleItem["level"], string> = {
  beginner: "מתחילים",
  intermediate: "בהמשך הדרך",
  advanced: "מתקדמים",
};

// רשימת מאמרי משימה עם סינון רמה — לפי isModule ב-dc.html.
export default function MissionArticleList({ items, total }: { items: MissionArticleItem[]; total: number }) {
  const [level, setLevel] = useState<"all" | "beg" | "adv">("all");
  const filtered =
    level === "all"
      ? items
      : items.filter((a) => (level === "beg" ? a.level === "beginner" : a.level !== "beginner"));

  const corners = (
    <>
      <i className="corner tl" /><i className="corner tr" />
      <i className="corner bl" /><i className="corner br" />
    </>
  );

  return (
    <>
      <div
        style={{
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <span className="text-muted" style={{ fontSize: 13 }}>
          {filtered.length} מתוך {total} מאמרים
        </span>
        <div className="seg" style={{ marginInlineStart: "auto" }}>
          {([["all", "הכול"], ["beg", "מתחילים"], ["adv", "מתקדמים"]] as const).map(([val, label]) => (
            <label key={val} className="seg-opt">
              <input
                type="radio"
                name="lvl-mod"
                checked={level === val}
                onChange={() => setLevel(val)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "30px 40px 56px",
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 22,
        }}
      >
        {filtered.map((a) => (
          <Link key={a.slug} href={`/academy/a/${a.slug}`} className="card blueprint" style={{ padding: 18, gap: 8 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="tag tag-outline">{LEVEL_LABEL[a.level]}</span>
              {a.time && <span className="tag tag-neutral">{a.time} דק׳</span>}
            </div>
            <div className="card-title" style={{ fontSize: 21 }}>{a.title}</div>
            <p className="card-body">{a.desc}</p>
            {a.date && <div className="card-meta">אומת {a.date}</div>}
            {corners}
          </Link>
        ))}
      </div>
    </>
  );
}
