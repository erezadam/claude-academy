import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Article {
  slug: string;
  title: string;
  category: string;
  whatItDoes: string;
  firstCodeBlock: string;
  content: string;
  layer?: "basic" | "intermediate" | "advanced";
  lastVerified?: string;
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
      lastVerified: normalizeDate(data.last_verified),
    };
  });
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

export function getArticle(
  categorySlug: string,
  articleSlug: string
): Article | undefined {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.articles.find((a) => a.slug === articleSlug);
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
