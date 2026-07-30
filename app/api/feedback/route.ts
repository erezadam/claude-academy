import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// משוב קהילה: נשמר ב-Upstash Redis (נצפה באזור האישי) ופותח GitHub Issue
// עם תווית community — ההתראה מגיעה במייל דרך GitHub, וההצעה נוחתת בצינור
// הטריאז' הקיים. המייל של הפונה נשמר רק ב-Redis, לעולם לא ב-issue הציבורי.

export const dynamic = "force-dynamic";

const FEEDBACK_KEY = "academy:feedback";
const MAX_STORED = 500;
const RATE_LIMIT_PER_HOUR = 5;

const KINDS = ["רעיון", "מאמר חסר", "טעות במאמר", "אחר"] as const;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return Redis.fromEnv();
}

async function openGithubIssue(kind: string, message: string): Promise<boolean> {
  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://api.github.com/repos/erezadam/claude-academy/issues",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `[קהילה] ${kind}: ${message.slice(0, 60)}${message.length > 60 ? "…" : ""}`,
          body: `${message}\n\n---\nהתקבל מטופס המשוב באתר. פרטי קשר (אם הושארו) שמורים באזור האישי, לא כאן.`,
          labels: ["community"],
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }
  const p = payload as Record<string, unknown>;
  const kind = typeof p.kind === "string" ? p.kind : "";
  const message = typeof p.message === "string" ? p.message.trim() : "";
  const email = typeof p.email === "string" ? p.email.trim() : "";
  const honeypot = typeof p.website === "string" ? p.website : "";

  // honeypot מלא = בוט. מחזירים "הצלחה" בלי לשמור.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!KINDS.includes(kind as (typeof KINDS)[number])) {
    return NextResponse.json({ ok: false, error: "bad-kind" }, { status: 400 });
  }
  if (message.length < 5 || message.length > 2000 || email.length > 200) {
    return NextResponse.json({ ok: false, error: "bad-length" }, { status: 400 });
  }

  const redis = getRedis();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (redis) {
    // הגבלת קצב: עד 5 הודעות לשעה לכל IP.
    try {
      const rlKey = `academy:feedback:rl:${ip}`;
      const count = await redis.incr(rlKey);
      if (count === 1) await redis.expire(rlKey, 3600);
      if (count > RATE_LIMIT_PER_HOUR) {
        return NextResponse.json({ ok: false, error: "rate-limit" }, { status: 429 });
      }
    } catch {
      /* Redis זמנית לא זמין — לא חוסמים משוב לגיטימי */
    }
    try {
      await redis.lpush(
        FEEDBACK_KEY,
        JSON.stringify({
          ts: new Date().toISOString(),
          kind,
          message,
          email: email || null,
        })
      );
      await redis.ltrim(FEEDBACK_KEY, 0, MAX_STORED - 1);
    } catch {
      /* אם השמירה נפלה — עדיין ננסה לפתוח issue */
    }
  }

  const issueOpened = await openGithubIssue(kind, message);
  return NextResponse.json({ ok: true, issueOpened });
}
