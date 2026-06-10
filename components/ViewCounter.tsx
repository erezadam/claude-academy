"use client";

import { useEffect, useRef, useState } from "react";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    // guard נגד ספירה כפולה ב-React StrictMode (mount כפול בפיתוח)
    if (counted.current) return;
    counted.current = true;

    fetch("/api/views", { method: "POST" })
      .then((res) => res.json())
      .then((data: { views: number | null }) => {
        if (typeof data.views === "number") setViews(data.views);
      })
      .catch(() => {
        /* כשל ברשת — פשוט לא מציגים מונה */
      });
  }, []);

  // עד שיש מספר (או אם המונה לא מוגדר) — לא תופסים מקום
  if (views === null) return null;

  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
      <span aria-hidden="true">👁️</span>
      <span>
        <span className="font-semibold text-gray-900 tabular-nums">
          {views.toLocaleString("he-IL")}
        </span>{" "}
        מבקרים
      </span>
    </div>
  );
}
