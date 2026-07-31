import type { Metadata } from "next";
import { getMissionArticles } from "@/lib/knowledge";
import StartChecklist, { type StartStep } from "./StartChecklist";

export const metadata: Metadata = {
  title: "להתחיל מאפס",
  description:
    "לא עבדת עם Claude Code מעולם? המסלול הלינארי מהתקנה ועד עבודה בטוחה.",
  alternates: { canonical: "/academy/start" },
  openGraph: {
    type: "website",
    title: "להתחיל מאפס",
    description:
      "לא עבדת עם Claude Code מעולם? המסלול הלינארי מהתקנה ועד עבודה בטוחה.",
    url: "/academy/start",
    locale: "he_IL",
  },
};

export default function StartPage() {
  const steps: StartStep[] = getMissionArticles("start").map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: a.whatItDoes,
    timeMinutes: a.timeMinutes,
  }));
  const totalMinutes = steps.reduce((sum, s) => sum + (s.timeMinutes ?? 0), 0);

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto" }}>
      <StartChecklist
        steps={steps}
        header={
          <div>
            <h1 style={{ margin: "0 0 8px", fontSize: 50 }}>להתחיל מאפס</h1>
            <p className="text-muted" style={{ margin: 0, fontSize: 18, maxWidth: "54ch" }}>
              התקנה, סשן ראשון, והמושגים שבלעדיהם אי-אפשר להתחיל. סך הכול
              ~{totalMinutes} דקות — וההתקדמות נשמרת בדפדפן שלך בלבד.
            </p>
          </div>
        }
      />
    </main>
  );
}
