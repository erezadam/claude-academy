"use client";

import { useState } from "react";
import Link from "next/link";
// Type-only import: erased at compile time, so it does NOT pull lib/knowledge's
// `fs` usage into the client bundle.
import type { ChangelogEntry } from "@/lib/knowledge";

const CATEGORY_NAMES: Record<string, string> = {
  git: "Git",
  "claude-code": "Claude Code",
  scheduling: "תזמון ולולאות",
  guides: "מדריכים",
  workflows: "תהליכי עבודה",
  "project-docs": "תיעוד פרויקט",
};

export default function WhatsNew({ entries }: { entries: ChangelogEntry[] }) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  const latestCount = entries[0].items.length;

  return (
    <div className="rounded-lg border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 p-5 text-right"
      >
        <span className="flex items-center gap-2">
          <span className="text-2xl">🆕</span>
          <span className="text-lg font-bold text-gray-900">
            מה התעדכן?{" "}
            <span className="text-blue-700">({latestCount})</span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="space-y-6 border-t border-gray-100 px-5 pb-5 pt-4">
          {entries.map((entry) => (
            <section key={entry.date}>
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-bold text-gray-900">
                  {entry.date}
                </span>
                <span className="text-sm text-gray-500">{entry.summary}</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {entry.items.map((item) => (
                  <li key={`${item.category}/${item.slug}`}>
                    <Link
                      href={`/article/${item.category}/${item.slug}`}
                      className="group flex items-center justify-between gap-3 py-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-medium text-gray-900 transition-colors group-hover:text-blue-700">
                          {item.title}
                        </span>
                        <span className="flex-shrink-0 text-xs text-gray-500">
                          {CATEGORY_NAMES[item.category] ?? item.category}
                        </span>
                      </span>
                      <span
                        className={
                          "flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium " +
                          (item.type === "new"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800")
                        }
                      >
                        {item.type === "new" ? "חדש" : "עודכן"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
