import { getAllArticles, getContentModifiedDate } from "@/lib/knowledge";
import { SITE_URL, BRAND_NAME } from "@/lib/seo";

// פיד RSS מהקורפוס: 30 המאמרים האחרונים לפי published (קומיט ראשון —
// אירוע אמיתי), עם dateModified כנ"ל. נבנה בזמן build.
export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = getAllArticles()
    .filter((a) => a.published)
    .sort((a, b) => (b.published! > a.published! ? 1 : -1))
    .slice(0, 30)
    .map((a) => {
      const url = `${SITE_URL}/academy/a/${a.slug}`;
      const pub = new Date(a.published!).toUTCString();
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(a.whatItDoes || a.title)}</description>
    </item>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${BRAND_NAME} · האקדמיה של קלוד`)}</title>
    <link>${SITE_URL}/academy</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${esc("Claude Code ו-Git בעברית — כל מאמר מאומת מול המקור שלו.")}</description>
    <language>he</language>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
