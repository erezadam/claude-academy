// מקור אמת יחיד לכתובת האתר ולמטא-דאטה משותף.
// נגזר מ-NEXT_PUBLIC_SITE_URL, עם נפילה לכתובת ה-production הידועה.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://claude-academy-zeta.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "האקדמיה של קלוד";

export const SITE_DESCRIPTION =
  "מאגר ידע מקיף בעברית ל-Claude Code ו-Git — פקודות, מדריכים ותהליכי עבודה, הכל במקום אחד.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
