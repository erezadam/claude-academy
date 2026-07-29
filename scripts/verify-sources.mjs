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
  // פקודות slash עצמאיות (לא חלק מ-URL או נתיב): /rewind, /config.
  // (?![a-z-]*\/) — רכיב נתיב (/path/to/x) אינו פקודה; ה-lookahead מכסה גם
  // קידומות (בלעדיו backtracking היה מחלץ /pat מתוך /path/).
  /(?<![\w/:.])\/[a-z][a-z-]{1,}(?![a-z-]*\/)/g,
  // משתני סביבה: לפחות קו-תחתון אחד, אותיות גדולות
  /(?<![\w])[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+(?![\w])/g,
  // מפתחות-קונפיג מנוקדים: word.word(.word)
  /(?<![\w./-])[a-z][a-zA-Z0-9]*(?:\.[a-z][a-zA-Z0-9]+)+(?![\w/-])/g,
];

// טוקנים מנוקדים שהם למעשה דומיינים / שמות-קבצים — לא מפתחות-קונפיג.
const DOMAIN_OR_FILE = /\.(com|org|net|io|dev|md|mdx|ts|tsx|js|mjs|cjs|jsx|json|sh|txt|html|css|yml|yaml|lock|sample|example|py)$/i;
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
  // host התיעוד הרשמי של Claude API (היורש של docs.anthropic.com).
  "platform.claude.com",
  // התיעוד הרשמי של Git — האתר מלמד גם Git (הכרעת מדיניות, 2026-07-29).
  "git-scm.com",
]);

function isAllowedSource(u) {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" && ALLOWED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

// חריגי מדיניות: source-exceptions.json בשורש הריפו (לא frontmatter — חריג
// בתוך קובץ תוכן נעלם בדיף; קובץ מרכזי נראה לעין). כל רשומה: file, host,
// reason, recheck (YYYY-MM-DD). host מחוץ ל-allowlist מותר רק אם יש רשומה
// תואמת של הקובץ וה-hostname, ואזהרה גלויה מודפסת בדוח.
function loadExceptions() {
  try {
    const arr = JSON.parse(fs.readFileSync("source-exceptions.json", "utf-8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
const EXCEPTIONS = loadExceptions();
function findException(file, url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  return (
    EXCEPTIONS.find(
      (e) =>
        e && e.file === file && e.host === host &&
        typeof e.reason === "string" && e.reason.trim() &&
        /^\d{4}-\d{2}-\d{2}$/.test(e.recheck || "")
    ) || null
  );
}

// מושך את טקסט המקור: גם ה-URL כפי שהוא וגם גרסת ה-.md (טקסט נקי). מחזיר
// מחרוזת מנורמלת מאוחדת, או null אם שום וריאנט לא החזיר 200.
// bypassAllowlist=true רק במסלול source_exception; גם אז נאכף https בלבד.
async function fetchSource(url, bypassAllowlist = false) {
  if (bypassAllowlist) {
    try {
      if (new URL(url).protocol !== "https:") return null;
    } catch {
      return null;
    }
  } else if (!isAllowedSource(url)) return null;
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
  if (!any200) return null;
  // raw שומר רישיות למשתני-סביבה (case-sensitive); normalized לשאר המזהים.
  const raw = combined.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ");
  return { normalized: normalize(combined), raw };
}

// התאמת טוקן מלא עם גבולות: תו מזהה (אות/ספרה/_/./-) צמוד משני הצדדים פוסל,
// כך ש---continu לא "מאומת" בגלל --continue. משתני-סביבה (ALL_CAPS) מושווים
// case-sensitive מול הטקסט הגולמי; שאר המזהים — case-insensitive.
const ENV_VAR_SHAPE = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/;
function tokenFoundIn(source, tok) {
  const caseSensitive = ENV_VAR_SHAPE.test(tok);
  const needle = caseSensitive ? tok : tok.toLowerCase();
  const esc = needle.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  return new RegExp(`(?<![\\w.-])${esc}(?![\\w.-])`).test(
    caseSensitive ? source.raw : source.normalized
  );
}

async function verifyFile(file) {
  const problems = [];
  if (!fs.existsSync(file)) return [`${file}: file not found`];
  const raw = fs.readFileSync(file, "utf-8");
  const { data, body } = parseFrontmatter(raw);
  // תוכן מקורי (ניסיון, לא תיעוד) — פטור מהשער, בהודעה גלויה. מחזיר סנטינל
  // כדי שהקובץ לא ייספר "עובר" — פטור אינו אימות.
  if ((data.origin || "").trim() === "original") {
    console.log(`○ ${file}: origin: original — תוכן מקורי, פטור משער האימות.`);
    return null;
  }
  const url = data.source_url;
  if (!url) return [`${file}: missing source_url in frontmatter`];
  const exception = findException(file, url);
  if (!isAllowedSource(url)) {
    if (!exception)
      return [`${file}: source_url is not an official https host (allowlist): ${url}`];
    console.log(
      `⚠ ${file}: חריג מ-source-exceptions.json — host מחוץ ל-allowlist: ${url} | נימוק: ${exception.reason} | בדיקה חוזרת: ${exception.recheck}`
    );
  }

  const sourceText = await fetchSource(url, !isAllowedSource(url) && !!exception);
  // source_url_extra: עמודי תיעוד רשמיים נוספים (מופרדים ברווח). נשמרים
  // בנפרד מהמקור הראשי: טוקן שמאומת רק דרך מקור משני מדווח גלוי עם ה-URL
  // שסיפק אותו — אחרת המקור הראשי יכול למות ולהתחבא מאחורי המשני.
  const extraSources = [];
  for (const extraUrl of (data.source_url_extra || "").split(/\s+/).filter(Boolean)) {
    if (!isAllowedSource(extraUrl)) continue;
    const extra = await fetchSource(extraUrl);
    if (extra) extraSources.push({ url: extraUrl, text: extra });
  }
  if (sourceText === null) return [`${file}: source_url not reachable (no 200): ${url}`];

  const tokens = extractTokens(extractCodeRegions(body));
  for (const tok of tokens) {
    if (tokenFoundIn(sourceText, tok)) continue;
    const via = extraSources.find((s) => tokenFoundIn(s.text, tok));
    if (via) {
      console.log(`ℹ ${file}: \`${tok}\` אומת דרך מקור משני בלבד: ${via.url}`);
      continue;
    }
    problems.push(`${file}: unverified token \`${tok}\` not found in source ${url}`);
  }
  return problems;
}

// ---- main ----

// ללא ארגומנטים: הקורפוס המלא. "ירוק בלי בדיקה" היה החור שאיפשר לריקבון
// להצטבר — ריצה ריקה כבר לא קיימת. בדיקת diff-בלבד נשארת באחריות הקוראים
// (stop-gate.sh, workflows) שמעבירים רשימת קבצים מפורשת.
let files = process.argv.slice(2);
if (files.length === 0) {
  files = fs
    .readdirSync("knowledge-base", { recursive: true })
    .filter((f) => f.endsWith(".md"))
    .map((f) => `knowledge-base/${f}`)
    .sort();
}

if (files.length === 0) {
  console.log("verify-sources: לא נמצאו קבצי knowledge-base.");
  process.exit(1);
}

// ריצה מוצלחת מרעננת את last_verified של הקובץ — "מתי אומתו הפקודות
// והדגלים". התיישנות תוכן נמדדת ב-last_reviewed (ידני בלבד), לא כאן.
function stampLastVerified(file) {
  const today = new Date().toISOString().slice(0, 10);
  const raw = fs.readFileSync(file, "utf-8");
  let updated;
  if (/^last_verified:.*$/m.test(raw)) {
    updated = raw.replace(/^last_verified:.*$/m, `last_verified: ${today}`);
  } else {
    updated = raw.replace(/^---\n/, `---\nlast_verified: ${today}\n`);
  }
  if (updated !== raw) fs.writeFileSync(file, updated);
}

const allProblems = [];
let verified = 0;
let exempt = 0;
for (const file of files) {
  const problems = await verifyFile(file);
  if (problems === null) exempt++;
  else if (problems.length === 0) {
    verified++;
    stampLastVerified(file);
    console.log(`✓ ${file}`);
  } else {
    for (const p of problems) console.log(`✗ ${p}`);
    allProblems.push(...problems);
  }
}

// מה בדיוק נבדק: מזהים טכניים בקטעי code (פקודות slash, דגלים, משתני-סביבה,
// מפתחות-קונפיג) מול source_url. השער אינו מאמת טענות פרוזה, ערכי ברירת-מחדל
// או סמנטיקה — "עובר" משמעו שאוצר-המילים הטכני קיים במקור, לא שהמאמר נכון.
if (allProblems.length > 0) {
  console.log(`\nשער אימות-מקור נכשל: ${allProblems.length} טענות לא אומתו (${verified} אומתו-מילונית, ${exempt} פטורים כתוכן מקורי).`);
  process.exit(1);
}
console.log(`\n✅ שער אימות-מקור: המזהים הטכניים ב-${verified} קבצים קיימים במקורות; ${exempt} קבצים פטורים (origin: original) ולא נבדקו. אימות מילוני בלבד — לא אימות טענות.`);
process.exit(0);
