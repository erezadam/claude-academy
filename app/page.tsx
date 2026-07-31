import Link from "next/link";
import { BRAND_NAME } from "@/lib/seo";

/*
 * ⚠️ טיוטה — עמוד המותג של תכלס AI ממתין לכתיבה אנושית של בעל האתר.
 * בכוונה אין כאן טקסט שיווקי, מספרים או הבטחות: העמוד לא יטען שום דבר
 * שלא נבדק. רק כותרת, משפט ניטרלי אחד, וקישורי מדורים.
 */
export const metadata = {
  title: `${BRAND_NAME}`,
  description: "מדורי תוכן בעברית. מדור ראשון: האקדמיה של קלוד.",
};

export default function BrandHome() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 40px" }}>
      <p className="text-small font-mono-ds text-muted" style={{ marginBottom: 16 }}>
        tachlesai.co.il
      </p>
      <h1 style={{ fontSize: 68, margin: "0 0 16px", lineHeight: 1.03 }}>{BRAND_NAME}</h1>
      <p className="text-muted" style={{ fontSize: 19, maxWidth: "50ch", margin: "0 0 40px" }}>
        מדורי תוכן בעברית על עבודה עם AI.
      </p>

      <h6 className="text-muted" style={{ margin: "0 0 12px" }}>מדורים</h6>
      <ul style={{ maxWidth: 640, padding: 0, listStyle: "none", margin: 0 }}>
        <li style={{ borderTop: "1px solid var(--color-divider)", padding: "16px 0" }}>
          <Link href="/academy" className="card-title" style={{ fontSize: 26 }}>
            האקדמיה של קלוד ←
          </Link>
          <p className="text-muted" style={{ margin: "4px 0 0", fontSize: 16 }}>
            Claude Code ו-Git בעברית.
          </p>
        </li>
      </ul>
    </main>
  );
}
