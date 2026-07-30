#!/usr/bin/env node
// דוח התיישנות: לפי last_reviewed (ביקורת אנושית, ידני) — לא last_verified
// (שמתרענן אוטומטית ע"י השער). רק מאמרי tool: claude-code — תיעוד Git לא
// זז באותו קצב, ותוכן מקורי לא מתיישן מול מקור.
// תור עבודה קבוע לעדכון תוכן — לא משבר חד-פעמי.
// שימוש: node scripts/staleness-report.mjs [--top N] [--markdown]
import fs from "node:fs";

const files = fs
  .readdirSync("knowledge-base", { recursive: true })
  .filter((f) => f.endsWith(".md"))
  .map((f) => `knowledge-base/${f}`)
  .sort();

const rows = [];
for (const file of files) {
  const raw = fs.readFileSync(file, "utf-8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  const get = (k) => fm?.[1].match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim();
  const origin = get("origin");
  if (origin === "original") continue; // תוכן מקורי — אין מקור להתיישן מולו
  const tool = get("tool");
  if (tool && tool !== "claude-code") continue; // תיעוד Git לא זז באותו קצב
  // מאמר שלא נסקר אינו "מיושן" — הוא "טרם נסקר". העדיפות בתור נגזרת
  // מהתאריך הקיים: last_reviewed אם יש, אחרת גיל last_verified (קיים לכולם).
  const lr = get("last_reviewed");
  const lv = get("last_verified");
  const ref = lr || lv;
  rows.push({
    file,
    lastVerified: lr ? lr : lv ? `${lv} (טרם נסקר)` : "(חסר)",
    days: ref ? Math.floor((Date.now() - new Date(ref).getTime()) / 86400000) : 0,
  });
}
rows.sort((a, b) => b.days - a.days);

const topArg = process.argv.indexOf("--top");
const top = topArg > -1 ? Number(process.argv[topArg + 1]) : rows.length;
const md = process.argv.includes("--markdown");

if (md) {
  console.log("| מאמר | נבדק לאחרונה | ימים |");
  console.log("|---|---|---|");
  for (const r of rows.slice(0, top))
    console.log(`| ${r.file} | ${r.lastVerified} | ${r.days === Infinity ? "—" : r.days} |`);
} else {
  for (const r of rows.slice(0, top))
    console.log(`${String(r.days === Infinity ? "?" : r.days).padStart(5)}  ${r.lastVerified.padEnd(12)}  ${r.file}`);
}
const stale = rows.filter((r) => r.days > 90).length;
console.error(`\n${rows.length} מאמרים עם מקור; ${stale} מעל 90 יום.`);
