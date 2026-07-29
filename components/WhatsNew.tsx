"use client";

import { useState } from "react";
import Link from "next/link";
// Type-only import: erased at compile time, so it does NOT pull lib/knowledge's
// `fs` usage into the client bundle.
import type { ChangelogEntry } from "@/lib/knowledge";

export default function WhatsNew({
  entries,
  categoryNames,
}: {
  entries: ChangelogEntry[];
  categoryNames: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  const latestCount = entries[0].items.length;

  return (
    <div className="border border-rule bg-white transition-all hover:border-ink ">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 p-5 text-right"
      >
        <span className="flex items-center gap-2">
          <span className="text-h2">🆕</span>
          <span className="text-body font-bold text-ink">
            מה התעדכן?{" "}
            <span className="text-accent">({latestCount})</span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`text-ink-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="space-y-6 border-t border-rule px-5 pb-5 pt-4">
          {entries.map((entry) => (
            <section key={entry.date}>
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                <span className="text-small font-bold text-ink">
                  {entry.date}
                </span>
                <span className="text-small text-ink-soft">{entry.summary}</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {entry.items.map((item) => (
                  <li key={`${item.category}/${item.slug}`}>
                    <Link
                      href={`/a/${item.slug}`}
                      className="group flex items-center justify-between gap-3 py-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-bold text-ink transition-colors group-hover:text-accent">
                          {item.title}
                        </span>
                        <span className="flex-shrink-0 text-small text-ink-soft">
                          {categoryNames[item.category] ?? item.category}
                        </span>
                      </span>
                      <span
                        className={
                          "flex-shrink-0 rounded-full px-2 py-0.5 text-small font-bold " +
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
