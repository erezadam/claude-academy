#!/usr/bin/env node
// שער אימות-מקור דטרמיניסטי לעדכון השבועי.
//
// מטרה: build ירוק מוכיח שה-markdown מתקמפל, לא שהתוכן נכון. השער הזה חוסם
// מיזוג כשמאמר מציג מזהה טכני "רשמי" שאינו מופיע במקור — בדיוק התקלה שבה
// `sandbox.credentials` (מפתח שלא קיים) הגיע לאתר החי.
//
// מה נבדק (מחלקות בעלות אות חזק שמזוהות כציטוט רשמי, מתוך קטעי code בלבד):
//   • flags ארוכים:        --remote-control, --spawn, --capacity ...
//   • פקודות slash:        /rewind, /config, /sandbox ...
//   • משתני סביבה:         CLAUDE_CODE_SUBPROCESS_ENV_SCRUB, AWS_SECRET_ACCESS_KEY ...
//   • מפתחות-קונפיג מנוקדים: sandbox.credentials, sandbox.enabled ...
//
// מה לא נבדק במכוון (כדי להימנע מ-false-positives שיחסמו תוכן לגיטימי, ולכן
// אינו "שתיקה" אלא גבול מוצהר): שמות-קבצים/נתיבי-דוגמה, ערכי JSON, ומילות
// פרוזה. דוגמאות הן הרכבה לגיטימית ולא ציטוט מילולי מהמקור.
//
// שימוש:  node scripts/verify-sources.mjs <file.md> [file2.md ...]
//         ללא ארגומנטים — נגזרת רשימת קבצי knowledge-base שהשתנו מול origin/main.
// יציאה:  0 = כל המזהים נתמכים במקור.  1 = לפחות מזהה אחד לא אומת / מקור לא נגיש.

import fs from "node:fs";
import { execFileSync } from "node:child_process";

// ---- עזרי טקסט ----

// מנרמל טקסט להשוואה: מסיר תגי HTML, ממיר ל-lowercase, מאחד רווחים.
function normalize(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// מחלץ את כל אזורי ה-code מגוף ה-markdown: בלוקים מגודרים ו-inline code.
function extractCodeRegions(body) {
  const regions = [];
  const fenced = body.match(/```[\s\S]*?```/g) || [];
  regions.push(...fenced);
  // inline code — אחרי הסרת הבלוקים המגודרים כדי לא לספור פעמיים.
  const withoutFenced = body.replace(/```[\s\S]*?```/g, " ");
  const inline = withoutFenced.match(/`[^`]+`/g) || [];
  regions.push(...inline);
  return regions.join("\n");
}

// תבניות המזהים שנבדקים. כל אחת מחזירה את הטוקן כפי שיש לחפש במקור.
const TOKEN_PATTERNS = [
  // flags ארוכים: --foo / --fooBar / --foo-bar
  /--[A-Za-z][A-Za-z0-9-]+/g,
  // פקודות slash עצמאיות (לא חלק מ-URL או נתיב): /rewind, /config
  /(?<![\w/:.])\/[a-z][a-z-]{1,}/g,
  // משתני סביבה: לפחות קו-תחתון אחד, אותיות גדולות
  /(?<![\w])[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+(?![\w])/g,
  // מפתחות-קונפיג מנוקדים: word.word(.word)
  /(?<![\w./-])[a-z][a-zA-Z0-9]*(?:\.[a-z][a-zA-Z0-9]+)+(?![\w/-])/g,
];

// טוקנים מנוקדים שהם למעשה דומיינים / שמות-קבצים — לא מפתחות-קונפיג.
const DOMAIN_OR_FILE = /\.(com|org|net|io|dev|md|mdx|ts|tsx|js|mjs|cjs|jsx|json|sh|txt|html|css|yml|yaml|lock|sample|example)$/i;
// דומיינים נפוצים שמופיעים כקישור ולא כהגדרה.
const KNOWN_DOMAIN = /(claude\.com|github\.com|anthropic\.com|google\.com|myaccount\.google)/i;

function extractTokens(codeText) {
  const found = new Set();
  for (const re of TOKEN_PATTERNS) {
    for (const m of codeText.matchAll(re)) {
      let tok = m[0].trim();
      if (tok.length < 3) continue;
      if (DOMAIN_OR_FILE.test(tok) || KNOWN_DOMAIN.test(tok)) continue;
      found.add(tok);
    }
  }
  return [...found];
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { data, body: raw.slice(m[0].length) };
}

// allowlist של hosts רשמיים בלבד. מונע SSRF (source_url מ-PR/fork זדוני שמצביע
// לכתובת פנימית כמו metadata endpoint) — וגם אוכף שהמקור הוא תיעוד רשמי.
// השוואת hostname מדויקת, לא startsWith/includes.
const ALLOWED_HOSTS = new Set([
  "code.claude.com",
  "docs.claude.com",
  "docs.anthropic.com",
  "anthropic.com",
  "www.anthropic.com",
  "claude.com",
]);

function isAllowedSource(u) {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" && ALLOWED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

// מושך את טקסט המקור: גם ה-URL כפי שהוא וגם גרסת ה-.md (טקסט נקי). מחזיר
// מחרוזת מנורמלת מאוחדת, או null אם שום וריאנט לא החזיר 200.
async function fetchSource(url) {
  if (!isAllowedSource(url)) return null;
  const variants = [url];
  if (!url.endsWith(".md")) variants.push(url.replace(/\/?$/, "") + ".md");
  let combined = "";
  let any200 = false;
  for (const v of variants) {
    try {
      const res = await fetch(v, { redirect: "follow", headers: { "User-Agent": "claude-academy-verify" } });
      if (res.ok) {
        any200 = true;
        combined += " " + (await res.text());
      }
    } catch {
      /* ממשיכים לוריאנט הבא */
    }
  }
  return any200 ? normalize(combined) : null;
}

async function verifyFile(file) {
  const problems = [];
  if (!fs.existsSync(file)) return [`${file}: file not found`];
  const raw = fs.readFileSync(file, "utf-8");
  const { data, body } = parseFrontmatter(raw);
  const url = data.source_url;
  if (!url) return [`${file}: missing source_url in frontmatter`];
  if (!isAllowedSource(url))
    return [`${file}: source_url is not an official https host (allowlist): ${url}`];

  const sourceText = await fetchSource(url);
  if (sourceText === null) return [`${file}: source_url not reachable (no 200): ${url}`];

  const tokens = extractTokens(extractCodeRegions(body));
  for (const tok of tokens) {
    if (!sourceText.includes(tok.toLowerCase())) {
      problems.push(`${file}: unverified token \`${tok}\` not found in source ${url}`);
    }
  }
  return problems;
}

// ---- main ----

let files = process.argv.slice(2);
if (files.length === 0) {
  try {
    // ללא shell — git מקבל את ה-pathspec כארגומנט ומרחיב אותו בעצמו.
    const out = execFileSync(
      "git",
      ["diff", "--name-only", "--diff-filter=AM", "origin/main...HEAD", "--", "knowledge-base/**/*.md"],
      { encoding: "utf-8" }
    );
    files = out.split("\n").map((s) => s.trim()).filter(Boolean);
  } catch {
    files = [];
  }
}

if (files.length === 0) {
  console.log("verify-sources: אין קבצי knowledge-base שהשתנו — מדלג.");
  process.exit(0);
}

const allProblems = [];
for (const file of files) {
  const problems = await verifyFile(file);
  if (problems.length === 0) console.log(`✓ ${file}`);
  else {
    for (const p of problems) console.log(`✗ ${p}`);
    allProblems.push(...problems);
  }
}

if (allProblems.length > 0) {
  console.log(`\nשער אימות-מקור נכשל: ${allProblems.length} טענות לא אומתו.`);
  process.exit(1);
}
console.log(`\n✅ שער אימות-מקור עבר: כל המזהים בכל ${files.length} הקבצים נתמכים במקור.`);
process.exit(0);
