#!/usr/bin/env node
// מנוע תחזוקה: כשה-changelog הרשמי מזכיר פקודה/דגל, מצא אילו מאמרים
// בקורפוס מזכירים אותם. הופך את תור ההתיישנות מרשימה שממתינה למשמעת
// אנושית לרשימה שמגיעה מעצמה.
//
// שימוש: node scripts/impact-scan.mjs [--versions N]
// פלט: markdown ל-stdout — לכל טוקן מה-changelog שמופיע בקורפוס: הגרסה,
// הטוקן, ורשימת המאמרים. exit 0 תמיד (דוח, לא שער).
import fs from "node:fs";

const N = (() => {
  const i = process.argv.indexOf("--versions");
  return i > -1 ? Number(process.argv[i + 1]) : 3;
})();

const res = await fetch("https://code.claude.com/docs/en/changelog.md", {
  headers: { "User-Agent": "claude-academy-impact-scan" },
});
if (!res.ok) {
  console.error(`changelog fetch failed: ${res.status}`);
  process.exit(0); // רעש רשת אינו כישלון — הדוח פשוט לא ייוצר החודש
}
const text = await res.text();

// N בלוקי הגרסאות האחרונים — פורמט העמוד: <Update label="X.Y.Z" ...>...</Update>
const blocks = [...text.matchAll(/<Update label="([^"]+)"[^>]*>([\s\S]*?)<\/Update>/g)]
  .slice(0, N)
  .map((m) => `${m[1]}\n${m[2]}`);

const TOKEN_RE = /(--[A-Za-z][A-Za-z0-9-]+|(?<![\w/:.])\/[a-z][a-z-]{2,}(?![a-z-]*\/)|(?<![\w])[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+(?![\w]))/g;

const corpus = fs
  .readdirSync("knowledge-base", { recursive: true })
  .filter((f) => f.endsWith(".md"))
  .map((f) => [`knowledge-base/${f}`, fs.readFileSync(`knowledge-base/${f}`, "utf-8")]);

const rows = [];
for (const block of blocks) {
  const version = block.split("\n")[0].trim();
  const tokens = new Set((block.match(TOKEN_RE) || []).map((t) => t.trim()));
  for (const tok of tokens) {
    const esc = tok.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
    const re = new RegExp(`(?<![\\w.-])${esc}(?![\\w.-])`);
    const hits = corpus.filter(([, body]) => re.test(body)).map(([f]) => f);
    if (hits.length > 0) rows.push({ version, tok, hits });
  }
}

if (rows.length === 0) {
  console.log(`אין חפיפה בין ${N} הגרסאות האחרונות לקורפוס.`);
  process.exit(0);
}
console.log(`# סריקת השפעה — ${N} גרסאות changelog אחרונות מול הקורפוס\n`);
for (const r of rows) {
  console.log(`- **גרסה ${r.version}** נגעה ב-\`${r.tok}\` — מופיע ב-${r.hits.length} מאמרים: ${r.hits.join(", ")}`);
}
