"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    // guard נגד ספירה כפולה ב-React StrictMode (mount כפול בפיתוח)
    if (counted.current) return;
    counted.current = true;

    // opt-out: בעלי האתר (שביקרו ב-/optout) קוראים את המספר בלי להגדיל אותו
    const optedOut = localStorage.getItem("academy_no_count") === "1";
    const method = optedOut ? "GET" : "POST";

    fetch("/api/views", { method })
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
    <Link
      href="/admin"
      aria-label="כניסה לאזור האישי"
      className="mt-4 inline-flex items-center gap-2 border border-rule bg-gray-50 px-3 py-1 text-small text-ink-soft transition-colors hover:border-ink hover:bg-gray-100"
    >
      <span aria-hidden="true">👁️</span>
      <span>
        <span className="font-bold text-ink tabular-nums">
          {views.toLocaleString("he-IL")}
        </span>{" "}
        כניסות
      </span>
    </Link>
  );
}
