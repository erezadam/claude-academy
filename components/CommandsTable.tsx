"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/knowledge";

type SortBy = "title" | "whatItDoes" | "layer";
type SortDir = "asc" | "desc";
type LevelFilter = "all" | "basic" | "intermediate" | "advanced";

const LAYER_RANK: Record<string, number> = {
  basic: 0,
  intermediate: 1,
  advanced: 2,
};

const LAYER_BADGE: Record<string, string> = {
  basic: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

const LEVEL_LABELS: Record<LevelFilter, string> = {
  all: "הכל",
  basic: "basic",
  intermediate: "intermediate",
  advanced: "advanced",
};

const LEVELS: LevelFilter[] = ["all", "basic", "intermediate", "advanced"];

function rankLayer(layer: Article["layer"]): number {
  if (!layer) return Number.POSITIVE_INFINITY;
  return LAYER_RANK[layer] ?? Number.POSITIVE_INFINITY;
}

export default function CommandsTable({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("layer");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const filtered = useMemo(() => {
    let list = articles;

    if (levelFilter !== "all") {
      list = list.filter((a) => a.layer === levelFilter);
    }

    if (query.length >= 2) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.whatItDoes.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q)
      );
    }

    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "layer") {
        cmp = rankLayer(a.layer) - rankLayer(b.layer);
      } else {
        const av = (a[sortBy] || "").toString();
        const bv = (b[sortBy] || "").toString();
        cmp = av.localeCompare(bv, "he");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [articles, query, levelFilter, sortBy, sortDir]);

  function handleSort(col: SortBy) {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  function clearFilters() {
    setQuery("");
    setLevelFilter("all");
  }

  function sortIndicator(col: SortBy) {
    if (sortBy !== col) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">אין פקודות להצגה</div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפש פקודה..."
          className="flex-1 min-w-[200px] max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((l) => {
            const active = levelFilter === l;
            return (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={
                  "rounded-full border px-3 py-1 text-base transition-colors " +
                  (active
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                }
              >
                {LEVEL_LABELS[l]}
              </button>
            );
          })}
        </div>
        <button
          onClick={clearFilters}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-base text-gray-700 hover:bg-gray-50 transition-colors"
        >
          נקה
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          לא נמצאו תוצאות. נסה לנקות את החיפוש.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("title")}
                  className="text-right p-4 text-lg border-b-2 border-gray-300 cursor-pointer hover:bg-gray-50 font-bold text-gray-900"
                >
                  פקודה{" "}
                  <span className="text-gray-400 ml-1">
                    {sortIndicator("title")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("whatItDoes")}
                  className="text-right p-4 text-lg border-b-2 border-gray-300 cursor-pointer hover:bg-gray-50 font-bold text-gray-900"
                >
                  מה עושה{" "}
                  <span className="text-gray-400 ml-1">
                    {sortIndicator("whatItDoes")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("layer")}
                  className="text-right p-4 text-lg border-b-2 border-gray-300 cursor-pointer hover:bg-gray-50 font-bold text-gray-900"
                >
                  רמה{" "}
                  <span className="text-gray-400 ml-1">
                    {sortIndicator("layer")}
                  </span>
                </th>
                <th className="text-right p-4 text-lg border-b-2 border-gray-300 font-bold text-gray-900">
                  פתח
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr
                  key={`${article.category}/${article.slug}`}
                  className="hover:bg-gray-50"
                >
                  <td className="p-4 text-lg border-b border-gray-200 font-medium text-gray-900">
                    {article.title}
                  </td>
                  <td className="p-4 text-lg border-b border-gray-200 text-gray-700">
                    {article.whatItDoes}
                  </td>
                  <td className="p-4 text-lg border-b border-gray-200">
                    {article.layer ? (
                      <span
                        className={
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
                          LAYER_BADGE[article.layer]
                        }
                      >
                        {article.layer}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-lg border-b border-gray-200">
                    <Link
                      href={`/article/${article.category}/${article.slug}`}
                      className="text-blue-700 hover:underline text-xl"
                    >
                      &larr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
