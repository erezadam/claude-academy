import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BRAND_NAME } from "@/lib/seo";

export const alt = `${BRAND_NAME} — ארז אדם`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ‏Heebo Bold סטטי (OFL) — לפונטים המובנים של Satori אין גליפים עבריים.
// למנוע אין תמיכת bidi, ולכן: (1) אותיות המילה העברית מסודרות בקובץ בסדר
// ויזואלי (הפוך) כדי שיירונדרו נכון; (2) "AI" יושב בילד flex נפרד משמאל,
// כפי ש"תכלס AI" נראה בטקסט RTL אמיתי.
const HEBREW_VISUAL = "תכלס".split("").reverse().join("");

export default async function OpengraphImage() {
  const heeboBold = await readFile(
    join(process.cwd(), "assets", "fonts", "Heebo-Bold.ttf"),
  );

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
          fontFamily: "Heebo",
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
            fontSize: 110,
            fontWeight: 700,
            color: "#ffffff",
            display: "flex",
            gap: 34,
          }}
        >
          <span>AI</span>
          <span>{HEBREW_VISUAL}</span>
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#94a3b8",
            marginTop: 28,
            letterSpacing: 1,
            display: "flex",
          }}
        >
          Tachles AI
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Heebo",
          data: heeboBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
