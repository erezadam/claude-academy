"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

// דף ניהול אישי: מחריג/מחזיר את הדפדפן הנוכחי ממונה הכניסות.
// הדגל נשמר ב-localStorage — צריך לבקר כאן פעם אחת בכל מכשיר/דפדפן.

const KEY = "academy_no_count";
const listeners = new Set<() => void>();

const optOutStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener("storage", cb);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", cb);
    };
  },
  get() {
    return typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
  },
  getServer() {
    return false;
  },
  set(value: boolean) {
    if (value) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
    listeners.forEach((l) => l());
  },
};

export default function OptOut() {
  const optedOut = useSyncExternalStore(
    optOutStore.subscribe,
    optOutStore.get,
    optOutStore.getServer,
  );

  return (
    <div className="min-h-screen font-sans bg-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-h2 font-bold text-ink mb-2">
          הגדרת מונה הכניסות
        </h1>
        <p className="text-small text-ink-soft mb-8">
          ההגדרה חלה על הדפדפן הנוכחי בלבד. כדי להחריג את עצמך מכל המכשירים שלך,
          בקר כאן פעם אחת מכל אחד מהם.
        </p>

        {optedOut ? (
          <div className="border border-green-200 bg-green-50 p-5">
            <p className="text-body font-bold text-green-900 mb-1">
              ✓ אתה מוחרג מהספירה
            </p>
            <p className="text-small text-green-800 mb-4">
              הכניסות שלך מהדפדפן הזה לא נספרות. אתה עדיין רואה את המונה.
            </p>
            <button
              onClick={() => optOutStore.set(false)}
              className="text-small font-bold text-green-800 underline hover:no-underline"
            >
              בטל החרגה — תחזור להיספר
            </button>
          </div>
        ) : (
          <div className="border border-rule bg-gray-50 p-5">
            <p className="text-body font-bold text-ink mb-1">
              הכניסות שלך כרגע נספרות
            </p>
            <p className="text-small text-ink-soft mb-4">
              לחץ כדי שהכניסות שלך מהדפדפן הזה יפסיקו להיכלל במונה.
            </p>
            <button
              onClick={() => optOutStore.set(true)}
              className="rounded-md bg-gray-900 px-4 py-2 text-small font-bold text-white transition-colors hover:bg-gray-700"
            >
              אל תספור אותי
            </button>
          </div>
        )}

        <div className="mt-10">
          <Link href="/" className="text-small text-accent hover:underline">
            &rarr; חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
