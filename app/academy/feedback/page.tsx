import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "שפרו את האקדמיה",
  description: "רעיון, מאמר חסר או טעות שמצאת — ספרו לנו. כל הודעה נקראת.",
};

export default function FeedbackPage() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ padding: "40px 40px 24px", borderBottom: "1px solid var(--color-divider)" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 48 }}>שפרו את האקדמיה</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: 17, maxWidth: "62ch" }}>
          האתר הזה נבנה בשביל הקהילה. רעיון לשיפור, מאמר שחסר לך, או טעות
          שמצאת — כתוב כאן. כל הודעה נקראת, והצעות טובות הופכות למאמרים.
        </p>
      </div>
      <div style={{ padding: "32px 40px 56px" }}>
        <FeedbackForm />
      </div>
    </main>
  );
}
