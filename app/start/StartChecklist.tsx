"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface StartStep {
  slug?: string;
  title: string;
  summary: string;
  timeMinutes?: number;
}

const STORAGE_KEY = "start-path-completed";

// מסלול המתחיל — מימוש isStart מ-"Claude Academy - Site.dc.html".
// סימון "הושלם" ב-localStorage בלבד — בלי התחברות ובלי DB.
export default function StartChecklist({
  steps,
  header,
}: {
  steps: StartStep[];
  header: React.ReactNode;
}) {
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
      /* אין אחסון — הסימון לא ישרוד רענון */
    }
  };

  const doneCount = steps.filter((s) => done[s.slug ?? s.title]).length;
  const firstOpen = steps.find((s) => !done[s.slug ?? s.title] && s.slug);

  return (
    <>
      <div
        style={{
          padding: "40px 40px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
          borderBottom: "1px solid var(--color-divider)",
          flexWrap: "wrap",
        }}
      >
        {header}
        <div className="blueprint" style={{ padding: "16px 20px", textAlign: "center", minWidth: 158 }}>
        <div className="font-mono-ds" style={{ fontSize: 34, color: "var(--color-accent)" }}>
          {doneCount}/{steps.length}
        </div>
        <div className="text-muted" style={{ fontSize: 12 }}>שלבים שהושלמו</div>
          <i className="corner tl" /><i className="corner tr" />
          <i className="corner bl" /><i className="corner br" />
        </div>
      </div>

      <div style={{ padding: "34px 40px 56px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((step, i) => {
            const key = step.slug ?? step.title;
            const isDone = Boolean(done[key]);
            return (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: 20,
                  alignItems: "center",
                  padding: "20px 0",
                  borderBottom: "1px solid var(--color-divider)",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-pressed={isDone}
                  aria-label={isDone ? `בטל סימון: ${step.title}` : `סמן שהושלם: ${step.title}`}
                  className="blueprint font-mono-ds"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    cursor: "pointer",
                    background: isDone ? "var(--color-accent)" : "transparent",
                    color: isDone ? "var(--color-bg)" : "var(--color-text)",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </button>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 24 }}>
                    {step.title}
                    {!step.slug && (
                      <span className="text-muted" style={{ fontSize: 14 }}> (נכתב עכשיו)</span>
                    )}
                  </div>
                  <div className="text-muted" style={{ fontSize: 14.5, marginTop: 2 }}>
                    {step.summary}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {step.timeMinutes && <span className="tag tag-neutral">{step.timeMinutes} דק׳</span>}
                  {step.slug && (
                    <Link href={`/a/${step.slug}`} className="btn btn-secondary" style={{ fontSize: 13 }}>
                      פתח ←
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 32, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          {firstOpen && (
            <Link
              href={`/a/${firstOpen.slug}`}
              className="btn btn-primary blueprint"
              style={{ fontSize: 15, padding: "11px 20px" }}
            >
              השלב הבא ←
              <i className="corner tl" /><i className="corner tr" />
              <i className="corner bl" /><i className="corner br" />
            </Link>
          )}
          <span className="text-muted" style={{ fontSize: 14 }}>
            סיימת את המסלול? <Link href="/m/code">קפוץ לעבודה עם Git</Link>
          </span>
        </div>
      </div>
    </>
  );
}
