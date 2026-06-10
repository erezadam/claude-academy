import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// מונה מבקרים ייחודיים לפי IP.
// כל IP עובר hashing (SHA-256 + salt) ונשמר ב-Set של Redis —
// SADD מוסיף רק אם ה-IP חדש, SCARD מחזיר את מספר הייחודיים.
// לא נשמר אף IP גולמי.

const VISITORS_KEY = "academy:home:unique-visitors";

// salt קבוע כדי שלא ניתן יהיה לשחזר IP מתוך ה-hash (הגנה מפני rainbow tables).
const SALT = "claude-academy:v1";

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

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for עשוי להכיל רשימה — ה-IP של הלקוח הוא הראשון
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// POST — רושם את המבקר (אם חדש) ומחזיר את מספר הייחודיים
export async function POST(request: NextRequest) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ views: null, configured: false });
  }
  try {
    const hashed = await hashIp(getClientIp(request));
    await redis.sadd(VISITORS_KEY, hashed);
    const views = await redis.scard(VISITORS_KEY);
    return NextResponse.json({ views, configured: true });
  } catch {
    return NextResponse.json({ views: null, configured: true }, { status: 503 });
  }
}

// GET — קורא את מספר הייחודיים בלי לרשום מבקר
export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ views: null, configured: false });
  }
  try {
    const views = await redis.scard(VISITORS_KEY);
    return NextResponse.json({ views, configured: true });
  } catch {
    return NextResponse.json({ views: null, configured: true }, { status: 503 });
  }
}
