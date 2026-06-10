import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// מונה כניסות גלובלי. INCR אטומי ב-Upstash Redis.
// משתני הסביבה UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// נטענים אוטומטית ע"י Redis.fromEnv().

const VIEWS_KEY = "academy:home:views";

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

// POST — סופר כניסה חדשה ומחזיר את הספירה המעודכנת
export async function POST() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ views: null, configured: false });
  }
  try {
    const views = await redis.incr(VIEWS_KEY);
    return NextResponse.json({ views, configured: true });
  } catch {
    return NextResponse.json({ views: null, configured: true }, { status: 503 });
  }
}

// GET — קורא את הספירה בלי להגדיל (לשימוש עתידי / בדיקה)
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
