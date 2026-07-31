// מקור אמת יחיד לכתובת האתר ולמטא-דאטה משותף.
// נגזר מ-NEXT_PUBLIC_SITE_URL, עם נפילה לכתובת ה-production הידועה.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tachlesai.co.il"
).replace(/\/$/, "");

// המותג יושב בשורש; האקדמיה היא מדור.
export const BRAND_NAME = "תכלס AI";
export const SITE_NAME = "האקדמיה של קלוד"; // שם המדור — נשאר בתבנית ה-title של מאמרים

export const SITE_DESCRIPTION =
  "מאגר ידע מקיף בעברית ל-Claude Code ו-Git — פקודות, מדריכים ותהליכי עבודה, הכל במקום אחד.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
