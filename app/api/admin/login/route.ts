import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin";

// אימות סיסמה בצד-שרת. בהצלחה — מנפיק cookie httpOnly לחודש.
// הגנת brute-force: עד 5 ניסיונות כושלים לרבע שעה לכל IP.
const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

async function tooManyAttempts(ip: string): Promise<boolean> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return false;
  }
  try {
    const redis = Redis.fromEnv();
    const key = `academy:admin:rl:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, WINDOW_SECONDS);
    return count > MAX_ATTEMPTS;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await tooManyAttempts(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  if (password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await computeToken(expected);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ימים
  });
  return res;
}
