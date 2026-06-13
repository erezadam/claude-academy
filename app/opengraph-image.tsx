import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// טקסט באנגלית בכוונה: למנוע ASCII — מנוע ImageResponse (Satori) חסר תמיכת
// bidi ומרנדר עברית הפוכה, במיוחד בטקסט מעורב. אנגלית מתרנדרת נכון בלי
// תלות בפונט חיצוני.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b1120",
          padding: "90px",
        }}
      >
        <div
          style={{
            width: 90,
            height: 8,
            background: "#3b82f6",
            borderRadius: 4,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          Claude Academy
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#94a3b8",
            marginTop: 28,
            maxWidth: 980,
          }}
        >
          The Hebrew knowledge base for Claude Code &amp; Git
        </div>
      </div>
    ),
    { ...size },
  );
}
