import fs from "fs";
import { execFileSync } from "child_process";
import path from "path";
import matter from "gray-matter";

export type Level = "beginner" | "intermediate" | "advanced";
export type Mission = "start" | "daily" | "code" | "automate" | "spec" | "advanced";
export type ArticleType = "guide" | "reference" | "recipe";
export type Tool = "claude-code" | "git" | "both";
export type Origin = "official" | "original";

export interface Article {
  slug: string;
  title: string;
  category: string;
  whatItDoes: string;
  firstCodeBlock: string;
  content: string;
  layer?: "basic" | "intermediate" | "advanced";
  status?: string; // סמן תור פנימי בלבד — לא מניע UI (עיצוב סופי בדיון)
  lastVerified?: string; // מתרענן אוטומטית ע"י שער האימות — מתי אומתו הפקודות
  lastReviewed?: string; // ידני בלבד, נאכף מול reviews.jsonl — מתי אדם קרא ואימת
  bodyChangedAt?: string; // הצינור מטביע כשגוף מאמר שנסקר משתנה אחרי הסקירה
  published?: string; // תאריך הקומיט הראשון של הקובץ — הוזן חד-פעמית, לא מנוחש
  level: Level;
  mission: Mission;
  type: ArticleType;
  tool: Tool;
  origin: Origin;
  pathOrder?: number;
  timeMinutes?: number;
  // next אינו נשמר כשדה — הוא מחושב מ-mission + pathOrder (מקור אמת אחד).
  // next_override קיים לחריגים בין-משימתיים בלבד.
  nextOverride?: string;
  prerequisites?: string[];
}

// ברירות מחדל בטוחות כשהשדה חסר בקובץ. mission נגזר מהתיקייה הנוכחית.
const MISSION_BY_CATEGORY: Record<string, Mission> = {
  git: "code",
  "claude-code": "daily",
  scheduling: "automate",
  workflows: "code",
  guides: "advanced",
  "project-docs": "spec",
};

// שש המשימות — שמות בשפת המצב של הקורא, לא בשם הכלי (כלל מהיום הראשון).
export const MISSION_META: Record<Mission, { name: string; description: string }> = {
  start: { name: "להתחיל מאפס", description: "התקנה, סשן ראשון, והמושגים שבלעדיהם אי-אפשר להתחיל" },
  daily: { name: "לעבוד יומיום", description: "סשנים, הקשר, עלות ושיטות עבודה שוטפות" },
  code: { name: "לשלוט בקוד ולחזור אחורה", description: "Git, סקירות קוד, checkpoints — ומה עושים כשמשהו נשבר" },
  automate: { name: "להפעיל אוטומציה", description: "hooks, תזמון, לולאות והרצה בלי אדם בלולאה" },
  spec: { name: "לאפיין ולתעד", description: "CLAUDE.md, זיכרון, ומסמכי פרויקט" },
  advanced: { name: "להרחיב את הפלטפורמה", description: "סוכנים, MCP, ‏skills והרחבות" },
};

export const MISSION_ORDER: Mission[] = ["start", "daily", "code", "automate", "spec", "advanced"];

// מאמרי הלימוד של משימה — כרטיסי reference מחוץ לטקסונומיית המשימות
// (מקומם בטבלת הפקודות), ולכן מסוננים כאן.
export function getMissionArticles(mission: Mission): Article[] {
  return getAllArticles()
    .filter((a) => a.type !== "reference" && a.mission === mission)
    .sort((a, b) => (a.pathOrder ?? 999) - (b.pathOrder ?? 999));
}

// "הצעד הבא" מחושב: next_override מנצח; אחרת הבא באותה משימה לפי
// pathOrder; לאחרון במשימה — אין (העמוד מקשר לעמוד המשימה).
export function getNextArticle(article: Article): Article | undefined {
  if (article.nextOverride) return getArticle(article.nextOverride);
  if (article.type === "reference") return undefined;
  const siblings = getMissionArticles(article.mission);
  const i = siblings.findIndex((a) => a.slug === article.slug);
  if (i === -1 || i === siblings.length - 1) return undefined;
  return siblings[i + 1];
}

const LEVELS: readonly Level[] = ["beginner", "intermediate", "advanced"];
const MISSIONS: readonly Mission[] = ["start", "daily", "code", "automate", "spec", "advanced"];
const TYPES: readonly ArticleType[] = ["guide", "reference", "recipe"];
const TOOLS: readonly Tool[] = ["claude-code", "git", "both"];

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  articles: Article[];
}

const CATEGORY_META: Record<
  string,
  { name: string; description: string; icon: string }
> = {
  git: {
    name: "פקודות Git",
    description: "כל פקודות Git הבסיסיות והמתקדמות עם הסברים בעברית",
    icon: "🔀",
  },
  "claude-code": {
    name: "Claude Code",
    description: "פקודות, טיפים ומדריכים לעבודה עם Claude Code",
    icon: "🤖",
  },
  scheduling: {
    name: "תזמון ולולאות",
    description: "תזמון משימות חוזרות עם /loop ו-Cron — חדש מרץ 2026",
    icon: "⏱️",
  },
  guides: {
    name: "מדריכים",
    description: "מדריכים מקיפים ומעמיקים — Skills, MCP, ועוד",
    icon: "📖",
  },
  workflows: {
    name: "תהליכי עבודה",
    description: "תרחישים מעשיים ותהליכי עבודה מומלצים",
    icon: "⚡",
  },
  "project-docs": {
    name: "תיעוד פרויקט",
    description:
      "שלושה פרומפטים גנריים שמייצרים תיעוד מקצועי לכל פרויקט - מה, איך, ולמה.",
    icon: "📚",
  },
};

function extractWhatItDoes(content: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("מה זה עושה:")) {
      return trimmed.replace("מה זה עושה:", "").trim();
    }
  }
  // Fallback: first non-header, non-empty paragraph
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("---") &&
      !trimmed.startsWith("|") &&
      !trimmed.startsWith("```") &&
      !trimmed.startsWith("מה זה עושה")
    ) {
      const clean = trimmed.replace(/\*\*/g, "").replace(/\*/g, "");
      if (clean.length > 10) {
        return clean.length > 120 ? clean.slice(0, 120) + "..." : clean;
      }
    }
  }
  return "";
}

function extractFirstCodeBlock(content: string): string {
  const match = content.match(/```(?:bash)?\n([\s\S]*?)```/);
  if (match) {
    const code = match[1].trim();
    // Return first few meaningful lines
    const lines = code.split("\n").slice(0, 4);
    return lines.join("\n");
  }
  return "";
}

// חותמת מלאה (ISO עם אזור זמן) כשקיימת — ל-schema; אחרת כמו שהיא.
function fullTimestamp(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  const str = String(value).trim();
  return str || undefined;
}

// gray-matter (js-yaml) parses an unquoted YAML date like `2026-03-07` as a
// Date object; a quoted one stays a string. Normalize both to "YYYY-MM-DD".
function normalizeDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const str = String(value).trim();
  return str || undefined;
}

function readArticlesFromDir(dirPath: string, category: string): Article[] {
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(".md", "");

    return {
      slug,
      title: data.title || slug,
      category,
      whatItDoes: extractWhatItDoes(content),
      firstCodeBlock: extractFirstCodeBlock(content),
      content,
      layer: data.layer ?? undefined,
      status: typeof data.status === "string" ? data.status : undefined,
      lastVerified: normalizeDate(data.last_verified),
      lastReviewed: fullTimestamp(data.last_reviewed),
      bodyChangedAt: fullTimestamp(data.body_changed_at),
      published: fullTimestamp(data.published),
      level: pick(data.level, LEVELS, "intermediate"),
      mission: pick(data.mission, MISSIONS, MISSION_BY_CATEGORY[category] ?? "daily"),
      type: pick(data.type, TYPES, "guide"),
      tool: pick(data.tool, TOOLS, category === "git" ? "git" : "claude-code"),
      origin: data.origin === "original" ? "original" : "official",
      pathOrder: typeof data.pathOrder === "number" ? data.pathOrder : undefined,
      timeMinutes: typeof data.timeMinutes === "number" ? data.timeMinutes : undefined,
      nextOverride:
        typeof data.next_override === "string" && data.next_override
          ? data.next_override
          : undefined,
      prerequisites: Array.isArray(data.prerequisites)
        ? data.prerequisites.filter((p: unknown): p is string => typeof p === "string")
        : undefined,
    };
  });
}

// ‏dateModified ל-JSON-LD: ‏body_changed_at אם אוכלס; אחרת תאריך הקומיט
// האחרון שנגע בקובץ (על clone רדוד ייתכן שאין — ואז מושמט, לא מנוחש).
// ‏last_verified במפורש לא — הוא מתרענן בכל ריצת שער ואינו מודד שינוי תוכן.
const gitDateCache = new Map<string, string | undefined>();
export function getContentModifiedDate(article: Article): string | undefined {
  if (article.bodyChangedAt) return article.bodyChangedAt;
  const file = `knowledge-base/${article.category}/${article.slug}.md`;
  if (gitDateCache.has(file)) return gitDateCache.get(file);
  let date: string | undefined;
  try {
    date =
      execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
        encoding: "utf-8",
        cwd: process.cwd(),
      }).trim() || undefined;
  } catch {
    date = undefined;
  }
  gitDateCache.set(file, date);
  return date;
}

export function getCategories(): Category[] {
  const knowledgeBase = path.join(process.cwd(), "knowledge-base");

  return Object.entries(CATEGORY_META).map(([slug, meta]) => {
    const dirPath = path.join(knowledgeBase, slug);
    const articles = readArticlesFromDir(dirPath, slug);

    return { slug, ...meta, articles };
  });
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

// slug -> Hebrew display name, built from the single source of truth
// (getCategories). Pass this to client components so they never hardcode
// category names — a new category shows up automatically.
export function getCategoryNameMap(): Record<string, string> {
  return Object.fromEntries(getCategories().map((c) => [c.slug, c.name]));
}

// כתובות המאמרים שטוחות (/a/<slug>); slug ייחודי בכל knowledge-base —
// נאכף ב-build ע"י getArticle (זריקה על כפילות הייתה שוברת את הייצור מוקדם).
export function getArticle(articleSlug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === articleSlug);
}

export function getAllArticles(): Article[] {
  return getCategories().flatMap((c) => c.articles);
}

// Most recent last_verified across all articles, as "YYYY-MM-DD", or null if
// none carry the field. ISO date strings sort lexically, so max == newest.
export function getLastUpdated(): string | null {
  const dates = getAllArticles()
    .map((a) => a.lastVerified)
    .filter((d): d is string => Boolean(d));

  if (dates.length === 0) return null;
  return dates.reduce((max, d) => (d > max ? d : max));
}

// חמשת המאמרים עם last_verified העדכני ביותר — רצועת "עודכן לאחרונה"
// בעמוד הבית. מספרים חיים, לא כתובים ביד.
export function getRecentlyVerified(limit = 5): Article[] {
  return getAllArticles()
    .filter((a) => a.lastVerified)
    .sort((a, b) => (b.lastVerified! > a.lastVerified! ? 1 : -1))
    .slice(0, limit);
}

export interface ChangelogItem {
  title: string;
  category: string;
  slug: string;
  type: "new" | "changed";
}

export interface ChangelogEntry {
  date: string;
  summary: string;
  items: ChangelogItem[];
}

// Reads data/changelog.json (server-side). Returns [] on any problem — missing
// file, empty content, invalid JSON, or a missing/non-array `entries` — never
// throws, so a malformed changelog can't break the build or the homepage.
export function getChangelog(): ChangelogEntry[] {
  try {
    const file = path.join(process.cwd(), "data", "changelog.json");
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.entries) ? parsed.entries : [];
  } catch {
    return [];
  }
}

export interface RecentCommandUpdate {
  slug: string;
  title: string;
  type: "new" | "changed";
}

// The claude-code items from the latest changelog batch (entries[0]) that
// resolve to a real claude-code article. This is the SINGLE derivation behind
// both the homepage red "updated this week" badge and the filtered
// /commands-list view, so the two can never disagree with each other or with
// the "What's New" panel. Intersecting with real article slugs (like
// getRelatedArticles does) is the data-integrity guard: a changelog item that
// points at a non-existent command is silently dropped — it never inflates the
// count or produces a broken link.
export function getLatestCommandUpdates(): RecentCommandUpdate[] {
  const entries = getChangelog();
  if (entries.length === 0) return [];

  const realSlugs = new Set(
    (getCategoryBySlug("claude-code")?.articles ?? []).map((a) => a.slug)
  );

  return entries[0].items
    .filter((it) => it.category === "claude-code" && realSlugs.has(it.slug))
    .map((it) => ({ slug: it.slug, title: it.title, type: it.type }));
}

// Integrity check: every changelog item whose {category, slug} does NOT resolve
// to a real article. Empty array == the changelog and the catalog agree. Useful
// in a test/CI step to catch drift between data/changelog.json and the articles.
export function validateChangelogIntegrity(): ChangelogItem[] {
  const real = new Set(getAllArticles().map((a) => `${a.category}/${a.slug}`));
  return getChangelog()
    .flatMap((e) => e.items)
    .filter((it) => !real.has(`${it.category}/${it.slug}`));
}
