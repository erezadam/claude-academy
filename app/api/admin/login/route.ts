import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin";

// אימות סיסמה בצד-שרת. בהצלחה — מנפיק cookie httpOnly לחודש.
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
