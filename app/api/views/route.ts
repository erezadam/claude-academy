import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// מונה כניסות גלובלי — סופר כל טעינת דף. INCR אטומי ב-Upstash Redis.
// משתני הסביבה UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// נטענים אוטומטית ע"י Redis.fromEnv().

const VIEWS_KEY = "academy:home:views";

// הגבלת קצב לפי IP על ה-INCR — מונע ניפוח מלאכותי של המונה.
// 60 בקשות ל-60 שניות: גבוה בהרבה מגלישה אנושית אמיתית (מאמר נקרא בדקות),
// כך שקורא לגיטימי לעולם לא נחסם, אך סקריפט מוגבל ל-60/דקה במקום אינסוף.
// fail-open בכוונה: מונה צפיות שנשבר כש-Redis נופל אינו בעיית אבטחה.
const RL_MAX = 60;
const RL_WINDOW_SECONDS = 60;

export const runtime = "edge";
export const dynamic = "force-dynamic";

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return Redis.fromEnv();
}

async function overLimit(redis: Redis, ip: string): Promise<boolean> {
  try {
    const key = `academy:views:rl:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RL_WINDOW_SECONDS);
    return count > RL_MAX;
  } catch {
    return false; // fail-open — לא חוסם אם ה-rate-limit עצמו נכשל
  }
}

// POST — סופר כניסה חדשה ומחזיר את הספירה המעודכנת
export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ views: null, configured: false });
  }
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await overLimit(redis, ip)) {
    return NextResponse.json(
      { views: null, error: "rate-limited" },
      { status: 429 },
    );
  }
  try {
    const views = await redis.incr(VIEWS_KEY);
    return NextResponse.json({ views, configured: true });
  } catch {
    return NextResponse.json({ views: null, configured: true }, { status: 503 });
  }
}

// GET — קורא את הספירה בלי להגדיל
export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ views: null, configured: false });
  }
  try {
    const views = (await redis.get<number>(VIEWS_KEY)) ?? 0;
    return NextResponse.json({ views, configured: true });
  } catch {
    return NextResponse.json({ views: null, configured: true }, { status: 503 });
  }
}
