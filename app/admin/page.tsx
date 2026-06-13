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

  return (
    <div className="min-h-screen font-sans bg-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-gray-900">אזור אישי</h1>
          <LogoutButton />
        </div>

        {/* מונה כניסות */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 mb-4">
          <p className="text-sm text-gray-600 mb-1">סך כל הכניסות לדף הבית</p>
          <p className="text-4xl font-bold text-gray-900 tabular-nums">
            {views === null ? "—" : views.toLocaleString("he-IL")}
          </p>
        </div>

        {/* אנליטיקה מלאה */}
        <a
          href={VERCEL_ANALYTICS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-gray-200 bg-white p-5 mb-4 transition-all hover:border-gray-900"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📊</span>
            <h2 className="text-base font-bold text-gray-900">
              דשבורד האנליטיקה המלא
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            מבקרים, דפים מובילים, מקורות תנועה, מדינות ומכשירים — ב-Vercel
            (כניסה עם המייל שלך). נפתח בלשונית חדשה.
          </p>
        </a>

        {/* הגדרת מונה */}
        <Link
          href="/optout"
          className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-900"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🙈</span>
            <h2 className="text-base font-bold text-gray-900">
              החרגת עצמי מהספירה
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            שהכניסות שלך לא ייכללו במונה (לכל דפדפן בנפרד).
          </p>
        </Link>

        <div className="mt-10">
          <Link href="/" className="text-sm text-blue-700 hover:underline">
            &rarr; חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
