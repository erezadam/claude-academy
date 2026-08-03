// מקור אמת יחיד לכתובת האתר ולמטא-דאטה משותף.
// נגזר מ-NEXT_PUBLIC_SITE_URL, עם נפילה לכתובת ה-production הידועה.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tachlesai.co.il"
).replace(/\/$/, "");

// המותג יושב בשורש; האקדמיה היא מדור.
export const BRAND_NAME = "תכלס AI";
export const SITE_NAME = "האקדמיה של קלוד"; // שם המדור — נשאר בתבנית ה-title של מאמרים

// מטא-דאטה של השורש — המותג, לא המדור.
export const ROOT_TITLE = "תכלס AI — ארז אדם | ניתוח והטמעת סוכני AI בארגונים";
export const ROOT_DESCRIPTION =
  "מנכ״ל ו-CIO לשעבר שמנתח את התהליך ובונה את הסוכן. ארכיטקטורה, אבטחת מידע והטמעה — בלי מסירה לגורם שלישי.";

export const GITHUB_URL = "https://github.com/erezadam/claude-academy";

export const SITE_DESCRIPTION =
  "מאגר ידע מקיף בעברית ל-Claude Code ו-Git — פקודות, מדריכים ותהליכי עבודה, הכל במקום אחד.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
