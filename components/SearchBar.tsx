"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchItem {
  slug: string;
  title: string;
  category: string;
  whatItDoes: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  git: "Git",
  "claude-code": "Claude Code",
  workflows: "תהליכי עבודה",
};

export default function SearchBar({ items }: { items: SearchItem[] }) {
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
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
          placeholder="חפש פקודה, מדריך או תהליך..."
          className="w-full rounded-lg border border-gray-200 bg-white px-5 pr-11 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
        />
      </div>
      {filtered.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10 max-h-80 overflow-y-auto">
          {filtered.map((item) => (
            <Link
              key={`${item.category}/${item.slug}`}
              href={`/article/${item.category}/${item.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900 text-sm">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {CATEGORY_NAMES[item.category]}
                {item.whatItDoes && ` · ${item.whatItDoes}`}
              </div>
            </Link>
          ))}
        </div>
      )}
      {query.length >= 2 && filtered.length === 0 && (
        <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10 px-4 py-3 text-center text-gray-900 text-sm">
          לא נמצאו תוצאות
        </div>
      )}
    </div>
  );
}
