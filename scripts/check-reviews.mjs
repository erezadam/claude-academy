#!/usr/bin/env node
// אכיפת חתימות סקירה: reviews.jsonl הוא מקור האמת. כל מאמר עם last_reviewed
// חייב רשומה תואמת (slug+date אחרון); רשומה בלי מאמר תואם — כישלון. כך
// אתחול מכני של last_reviewed מפיל את הבילד במקום להיחסם ע"י כלל במסמך.
import fs from "node:fs";

const records = new Map(); // slug -> אחרון
if (fs.existsSync("reviews.jsonl")) {
  for (const line of fs.readFileSync("reviews.jsonl", "utf-8").split("\n").filter(Boolean)) {
    const r = JSON.parse(line);
    records.set(r.slug, r); // השורה המאוחרת בקובץ גוברת
  }
}

const problems = [];
const seen = new Set();
for (const f of fs.readdirSync("knowledge-base", { recursive: true }).filter((x) => x.endsWith(".md"))) {
  const path = `knowledge-base/${f}`;
  const slug = f.split("/").pop().replace(/\.md$/, "");
  const m = fs.readFileSync(path, "utf-8").match(/^last_reviewed:\s*"?([0-9]{4}-[0-9]{2}-[0-9]{2})/m);
  if (!m) continue;
  seen.add(slug);
  const rec = records.get(slug);
  if (!rec) problems.push(`${path}: last_reviewed=${m[1]} בלי רשומה ב-reviews.jsonl`);
  else if (rec.date !== m[1]) problems.push(`${path}: last_reviewed=${m[1]} אבל reviews.jsonl אומר ${rec.date}`);
}
for (const slug of records.keys()) {
  if (!seen.has(slug)) problems.push(`reviews.jsonl: רשומה ל-${slug} בלי last_reviewed תואם במאמר`);
}

if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  process.exit(1);
}
console.log(`✓ check-reviews: ${seen.size} חתימות סקירה תואמות את reviews.jsonl`);
