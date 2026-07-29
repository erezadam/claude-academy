"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface StartStep {
  slug?: string; // בלי slug = מאמר שעדיין נכתב
  title: string;
  summary: string;
  timeMinutes?: number;
}

const STORAGE_KEY = "start-path-completed";

// סימון "הושלם" ב-localStorage בלבד — בלי התחברות ובלי DB.
export default function StartChecklist({ steps }: { steps: StartStep[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
    } catch {
      /* localStorage לא זמין — המסלול עדיין קריא */
    }
  }, []);

  const toggle = (key: string) => {
    const next = { ...done, [key]: !done[key] };
    setDone(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* אין אחסון — הסימון לא ישרוד רענון, וזה בסדר */
    }
  };

  return (
    <ol>
      {steps.map((step, i) => {
        const key = step.slug ?? step.title;
        return (
          <li
            key={key}
            className="flex items-start gap-4 py-5 border-b border-rule last:border-b-0"
          >
            <span className="text-h1 font-bold text-ink leading-none w-10 shrink-0 text-center">
              {i + 1}
            </span>
            <div className="flex-1">
              {step.slug ? (
                <Link
                  href={`/a/${step.slug}`}
                  className="font-bold text-ink hover:text-accent"
                >
                  {step.title}
                </Link>
              ) : (
                <span className="font-bold text-ink-soft">
                  {step.title} <span className="text-small">(נכתב עכשיו)</span>
                </span>
              )}
              <p className="text-small text-ink-soft mt-0.5">{step.summary}</p>
              {step.timeMinutes && (
                <p className="text-small text-ink-soft mt-0.5">
                  ~{step.timeMinutes} דקות
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              aria-pressed={Boolean(done[key])}
              className={`text-small border px-3 py-1 shrink-0 ${
                done[key]
                  ? "border-green-700 text-green-800"
                  : "border-rule text-ink-soft"
              }`}
            >
              {done[key] ? "הושלם ✓" : "סמן שהושלם"}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
