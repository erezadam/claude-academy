#!/usr/bin/env node
// מעבר חד-פעמי: כתיבת שדות מודל-התוכן ל-frontmatter של כל knowledge-base.
// קלט: TSV (category/slug \t mission \t level \t type) — mission ריק = מאמר
// reference שמחוץ לטקסונומיית המשימות. tool/origin/timeMinutes/last_reviewed
// נגזרים כאן. שימוש: node scripts/write-frontmatter.mjs <plan.tsv>
import fs from "node:fs";

const plan = new Map();
for (const line of fs.readFileSync(process.argv[2], "utf-8").trim().split("\n")) {
  const [key, mission, level, type] = line.split("\t");
  plan.set(key, { mission, level, type });
}

const files = fs
  .readdirSync("knowledge-base", { recursive: true })
  .filter((f) => f.endsWith(".md"))
  .map((f) => `knowledge-base/${f}`)
  .sort();

let written = 0;
for (const file of files) {
  const key = file.replace(/^knowledge-base\//, "").replace(/\.md$/, "");
  const p = plan.get(key);
  if (!p) {
    console.error(`אין שורה בתוכנית עבור ${key} — מדלג`);
    continue;
  }
  const raw = fs.readFileSync(file, "utf-8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) {
    console.error(`אין frontmatter ב-${file} — מדלג`);
    continue;
  }
  let fm = m[1];
  const get = (k) => fm.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim();
  const setOrAdd = (k, v) => {
    if (v === undefined || v === "") return;
    if (new RegExp(`^${k}:`, "m").test(fm)) fm = fm.replace(new RegExp(`^${k}:.*$`, "m"), `${k}: ${v}`);
    else fm += `\n${k}: ${v}`;
  };

  const category = file.split("/")[1];
  const body = raw.slice(m[0].length);
  const words = body.split(/\s+/).length;

  setOrAdd("mission", p.mission || undefined); // reference — בלי mission
  setOrAdd("level", p.level);
  setOrAdd("type", p.type);
  setOrAdd("tool", category === "git" ? "git" : key.includes("git") ? "both" : "claude-code");
  if (!get("origin")) setOrAdd("origin", get("source_url") ? "official" : "original");
  setOrAdd("timeMinutes", Math.max(2, Math.round(words / 180)));
  // last_reviewed מאותחל מ-last_verified הנוכחי — העדות הטובה ביותר מתי
  // אדם קרא את הקובץ. מכאן והלאה: ידני בלבד.
  if (!get("last_reviewed") && get("last_verified")) setOrAdd("last_reviewed", get("last_verified"));

  fs.writeFileSync(file, `---\n${fm}\n---\n${body}`);
  written++;
}
console.log(`נכתבו ${written}/${files.length} קבצים.`);
