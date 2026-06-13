// אימות גישה לאזור האישי (/admin).
// הסיסמה נשמרת ב-ADMIN_PASSWORD (env). ה-cookie מחזיק hash של הסיסמה —
// כך הסיסמה עצמה לעולם לא יושבת ב-cookie, ואי אפשר לזייף בלי לדעת אותה.

const SALT = "claude-academy-admin:v1";

export const ADMIN_COOKIE = "admin_auth";

export async function computeToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ה-token הצפוי לפי הסיסמה שב-env. null אם הסיסמה לא הוגדרה.
export async function expectedToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return computeToken(password);
}
