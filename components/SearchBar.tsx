"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchItem {
  slug: string;
  title: string;
  category: string;
  whatItDoes: string;
}

export default function SearchBar({
  items,
  categoryNames,
}: {
  items: SearchItem[];
  categoryNames: Record<string, string>;
}) {
  const [query, setQuery] = useState("");

  const filtered =
    query.length >= 2
      ? items.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.whatItDoes.toLowerCase().includes(query.toLowerCase()) ||
            item.slug.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="חיפוש באתר"
          placeholder="חפש פקודה, מדריך או תהליך..."
          className="w-full border border-rule bg-white px-5 pr-11 py-3 text-ink placeholder:text-ink-soft outline-none focus:border-ink transition-all text-small"
        />
      </div>
      {filtered.length > 0 && (
        <div className="absolute top-full mt-1 w-full border border-rule bg-white z-10 max-h-80 overflow-y-auto">
          {filtered.map((item) => (
            <Link
              key={`${item.category}/${item.slug}`}
              href={`/a/${item.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-rule last:border-b-0"
            >
              <div className="font-bold text-ink text-small">
                {item.title}
              </div>
              <div className="text-small text-ink-soft mt-0.5">
                {categoryNames[item.category] ?? item.category}
                {item.whatItDoes && ` · ${item.whatItDoes}`}
              </div>
            </Link>
          ))}
        </div>
      )}
      {query.length >= 2 && filtered.length === 0 && (
        <div className="absolute top-full mt-1 w-full border border-rule bg-white z-10 px-4 py-3 text-center text-ink text-small">
          לא נמצאו תוצאות
        </div>
      )}
    </div>
  );
}
