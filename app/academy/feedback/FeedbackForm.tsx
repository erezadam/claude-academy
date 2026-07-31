"use client";

import { useState } from "react";

const KINDS = ["רעיון", "מאמר חסר", "טעות במאמר", "אחר"] as const;

// טופס "שפרו את האקדמיה" — הודעה + מייל אופציונלי. honeypot נסתר נגד בוטים.
export default function FeedbackForm() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("רעיון");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    const honeypot =
      (new FormData(e.currentTarget).get("website") as string) ?? "";
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, message, email, website: honeypot }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="blueprint" style={{ padding: 30, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 23, marginBottom: 6 }}>
          תודה — ההודעה התקבלה.
        </div>
        <div className="text-muted" style={{ fontSize: 15 }}>
          כל הודעה נקראת. אם השארת מייל ונצטרך פרטים — נחזור אליך.
        </div>
        <i className="corner tl" /><i className="corner tr" />
        <i className="corner bl" /><i className="corner br" />
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 620 }}>
      <div>
        <div className="field"><label>מה זה?</label></div>
        <div className="seg">
          {KINDS.map((k) => (
            <label key={k} className="seg-opt">
              <input
                type="radio"
                name="kind"
                checked={kind === k}
                onChange={() => setKind(k)}
              />
              <span>{k}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="fb-message">ההודעה (חובה)</label>
        <textarea
          id="fb-message"
          className="input"
          required
          minLength={5}
          maxLength={2000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="מה חסר, מה שבור, או מה היה עוזר לך…"
        />
      </div>

      <div className="field">
        <label htmlFor="fb-email">מייל למענה (אופציונלי — נשמר אצלנו בלבד, לא מפורסם)</label>
        <input
          id="fb-email"
          className="input"
          type="email"
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          dir="ltr"
        />
      </div>

      {/* honeypot — מוסתר מבני אדם */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
      />

      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <button
          type="submit"
          disabled={state === "sending"}
          className="btn btn-primary blueprint"
          style={{ fontSize: 15, padding: "11px 20px" }}
        >
          {state === "sending" ? "שולח…" : "שלח ←"}
          <i className="corner tl" /><i className="corner tr" />
          <i className="corner bl" /><i className="corner br" />
        </button>
        {state === "error" && (
          <span style={{ color: "var(--color-stale)", fontSize: 14 }}>
            השליחה נכשלה — נסה שוב, או כתוב לנו במייל.
          </span>
        )}
      </div>
    </form>
  );
}
