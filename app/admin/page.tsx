import Link from "next/link";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import { ADMIN_COOKIE, expectedToken } from "@/lib/admin";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "אזור אישי",
  robots: { index: false, follow: false },
};

const VERCEL_ANALYTICS_URL =
  "https://vercel.com/erez1964-gmailcoms-projects/claude-academy/analytics";

interface FeedbackItem {
  ts: string;
  kind: string;
  message: string;
  email: string | null;
}

// 50 ההודעות האחרונות מטופס המשוב (academy:feedback).
async function getFeedback(): Promise<FeedbackItem[] | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  try {
    const redis = Redis.fromEnv();
    const raw = await redis.lrange<string | FeedbackItem>("academy:feedback", 0, 49);
    return raw
      .map((r) => (typeof r === "string" ? (JSON.parse(r) as FeedbackItem) : r))
      .filter((f) => f && typeof f.message === "string");
  } catch {
    return null;
  }
}

async function getViews(): Promise<number | null> {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  try {
    const redis = Redis.fromEnv();
    return (await redis.get<number>("academy:home:views")) ?? 0;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const expected = await expectedToken();
  const configured = expected !== null;
  const cookieStore = await cookies();
  const authed =
    configured && cookieStore.get(ADMIN_COOKIE)?.value === expected;

  if (!authed) {
    return <LoginForm configured={configured} />;
  }

  const views = await getViews();
  const feedback = await getFeedback();

  return (
    <div className="min-h-screen font-sans bg-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-h2 font-bold text-ink">אזור אישי</h1>
          <LogoutButton />
        </div>

        {/* מונה כניסות */}
        <div className="rounded-xl border border-rule bg-gray-50 p-6 mb-4">
          <p className="text-small text-ink-soft mb-1">סך כל הכניסות לדף הבית</p>
          <p className="text-h1 font-bold text-ink tabular-nums">
            {views === null ? "—" : views.toLocaleString("he-IL")}
          </p>
        </div>

        {/* הודעות מהקהילה */}
        <div className="rounded-xl border border-rule bg-gray-50 p-6 mb-4">
          <p className="text-small text-ink-soft mb-3">
            הודעות מהקהילה ({feedback?.length ?? 0} אחרונות)
          </p>
          {!feedback || feedback.length === 0 ? (
            <p className="text-small text-ink-soft">אין הודעות עדיין.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {feedback.map((f, i) => (
                <li key={i} className="border-b border-rule pb-3 last:border-b-0">
                  <p className="text-small text-ink-soft">
                    {f.kind} · {f.ts?.slice(0, 16).replace("T", " ")}
                    {f.email ? ` · ${f.email}` : ""}
                  </p>
                  <p className="text-small text-ink whitespace-pre-wrap">{f.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* אנליטיקה מלאה */}
        <a
          href={VERCEL_ANALYTICS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-rule bg-white p-5 mb-4 transition-all hover:border-action"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-h2">📊</span>
            <h2 className="text-body font-bold text-ink">
              דשבורד האנליטיקה המלא
            </h2>
          </div>
          <p className="text-small text-ink-soft">
            מבקרים, דפים מובילים, מקורות תנועה, מדינות ומכשירים — ב-Vercel
            (כניסה עם המייל שלך). נפתח בלשונית חדשה.
          </p>
        </a>

        {/* הגדרת מונה */}
        <Link
          href="/optout"
          className="group block rounded-xl border border-rule bg-white p-5 transition-all hover:border-action"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-h2">🙈</span>
            <h2 className="text-body font-bold text-ink">
              החרגת עצמי מהספירה
            </h2>
          </div>
          <p className="text-small text-ink-soft">
            שהכניסות שלך לא ייכללו במונה (לכל דפדפן בנפרד).
          </p>
        </Link>

        <div className="mt-10">
          <Link href="/" className="text-small text-accent hover:underline">
            &rarr; חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
