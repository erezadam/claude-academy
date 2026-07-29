"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Article, RecentCommandUpdate } from "@/lib/knowledge";

type SortBy = "title" | "whatItDoes" | "layer";
type SortDir = "asc" | "desc";
type LevelFilter = "all" | "basic" | "intermediate" | "advanced";

const LAYER_RANK: Record<string, number> = {
  basic: 0,
  intermediate: 1,
  advanced: 2,
};

const LAYER_BADGE: Record<string, string> = {
  basic: "border border-rule text-ink-soft",
  intermediate: "border border-rule text-ink-soft",
  advanced: "border border-ink text-ink",
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

export default function CommandsTable({
  articles,
  recentUpdates = [],
}: {
  articles: Article[];
  recentUpdates?: RecentCommandUpdate[];
}) {
  // slug -> "new" | "changed" for commands updated in the latest weekly batch.
  const recentMap = useMemo(
    () => new Map(recentUpdates.map((u) => [u.slug, u.type])),
    [recentUpdates]
  );

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("layer");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  // Starts off so the FULL table is server-rendered into the static HTML (SEO);
  // the "?updated=week" deep-link from the homepage red badge is applied after
  // hydration via the effect below. Reading the param in an effect (not
  // useSearchParams) avoids a Suspense bailout that would drop the table from
  // the prerendered HTML.
  const [recentOnly, setRecentOnly] = useState(false);

  useEffect(() => {
    const updated = new URLSearchParams(window.location.search).get("updated");
    // Intentional post-hydration sync: SSR renders the full table (recentOnly
    // false) so it stays in the static HTML; only after mount do we apply the
    // client-only URL filter. Reading it during render would cause a hydration
    // mismatch, so setState-in-effect is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (updated === "week" && recentUpdates.length > 0) setRecentOnly(true);
  }, [recentUpdates.length]);

  const filtered = useMemo(() => {
    let list = articles;

    if (recentOnly) {
      list = list.filter((a) => recentMap.has(a.slug));
    }

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
  }, [articles, query, levelFilter, sortBy, sortDir, recentOnly, recentMap]);

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
    setRecentOnly(false);
  }

  function sortIndicator(col: SortBy) {
    if (sortBy !== col) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  }

  function ariaSort(col: SortBy): "ascending" | "descending" | "none" {
    if (sortBy !== col) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center text-ink-soft">אין פקודות להצגה</div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b border-rule flex flex-wrap items-center gap-3 py-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="סינון פקודות"
          placeholder="חפש פקודה..."
          className="flex-1 min-w-[200px] max-w-xs border border-rule bg-white px-4 py-2 text-body text-ink placeholder:text-ink-soft outline-none focus:border-ink transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((l) => {
            const active = levelFilter === l;
            return (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={
                  "rounded-token border px-3 py-1 text-body transition-colors " +
                  (active
                    ? "bg-stale-bg text-accent border-rule"
                    : "bg-white text-ink-soft border-rule hover:bg-gray-50")
                }
              >
                {LEVEL_LABELS[l]}
              </button>
            );
          })}
        </div>
        {recentUpdates.length > 0 && (
          <button
            onClick={() => setRecentOnly((v) => !v)}
            className={
              "rounded-token border px-3 py-1 text-body transition-colors " +
              (recentOnly
                ? "bg-action text-white border-action"
                : "bg-white text-accent border-rule")
            }
          >
            עודכנו השבוע ({recentUpdates.length})
          </button>
        )}
        <button
          onClick={clearFilters}
          className="border border-rule bg-white px-3 py-1 text-body text-ink-soft transition-colors"
        >
          נקה
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-ink-soft">
          לא נמצאו תוצאות. נסה לנקות את החיפוש.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono" dir="rtl">
            <thead>
              <tr>
                <th
                  aria-sort={ariaSort("title")}
                  className="text-right border-b-2 border-rule font-bold text-ink"
                >
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="w-full text-right py-2 px-3 text-small font-bold text-ink cursor-pointer"
                  >
                    פקודה{" "}
                    <span className="text-ink-soft ml-1" aria-hidden="true">
                      {sortIndicator("title")}
                    </span>
                  </button>
                </th>
                <th
                  aria-sort={ariaSort("whatItDoes")}
                  className="text-right border-b-2 border-rule font-bold text-ink"
                >
                  <button
                    type="button"
                    onClick={() => handleSort("whatItDoes")}
                    className="w-full text-right py-2 px-3 text-small font-bold text-ink cursor-pointer"
                  >
                    מה עושה{" "}
                    <span className="text-ink-soft ml-1" aria-hidden="true">
                      {sortIndicator("whatItDoes")}
                    </span>
                  </button>
                </th>
                <th
                  aria-sort={ariaSort("layer")}
                  className="text-right border-b-2 border-rule font-bold text-ink"
                >
                  <button
                    type="button"
                    onClick={() => handleSort("layer")}
                    className="w-full text-right py-2 px-3 text-small font-bold text-ink cursor-pointer"
                  >
                    רמה{" "}
                    <span className="text-ink-soft ml-1" aria-hidden="true">
                      {sortIndicator("layer")}
                    </span>
                  </button>
                </th>
                <th className="text-right py-2 px-3 text-small border-b-2 border-rule font-bold text-ink">
                  פתח
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr
                  key={`${article.category}/${article.slug}`}
                  className=""
                >
                  <td className="py-2 px-3 text-small border-b border-rule font-bold text-ink">
                    <span className="flex flex-wrap items-center gap-2">
                      {article.title}
                      {recentMap.has(article.slug) && (
                        <span
                          className={
                            "inline-block flex-shrink-0 rounded-token px-2 py-0.5 text-small font-bold " +
                            (recentMap.get(article.slug) === "new"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800")
                          }
                        >
                          {recentMap.get(article.slug) === "new"
                            ? "חדש"
                            : "עודכן"}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-small border-b border-rule text-ink-soft">
                    {article.whatItDoes}
                  </td>
                  <td className="py-2 px-3 text-small border-b border-rule">
                    {article.layer ? (
                      <span
                        className={
                          "inline-block rounded-token px-2 py-0.5 text-small font-bold " +
                          LAYER_BADGE[article.layer]
                        }
                      >
                        {article.layer}
                      </span>
                    ) : (
                      <span className="text-ink-soft">—</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-small border-b border-rule">
                    <Link
                      href={`/a/${article.slug}`}
                      aria-label={`פתח את ${article.title}`}
                      className="text-accent hover:underline text-small"
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
