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
  // created: date the article was added (immutable). updated: date of the last
  // genuine content change. Together they drive the derived updates feed
  // (getChangelog) — lastVerified is a re-check date and does NOT feed it.
  created?: string;
  updated?: string;
  // Cross-references to other article slugs (may span categories). Resolved to
  // real articles by getRelatedArticles; unresolvable slugs are dropped.
  related?: string[];
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
      created: normalizeDate(data.created),
      updated: normalizeDate(data.updated),
      related: normalizeRelated(data.related),
    };
  });
}

// Frontmatter `related` may be an array, a single string, or absent. Normalize
// to a clean string[] (trimmed, non-empty), or undefined when there's nothing.
function normalizeRelated(value: unknown): string[] | undefined {
  const arr = Array.isArray(value) ? value : value != null ? [value] : [];
  const slugs = arr
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);
  return slugs.length > 0 ? slugs : undefined;
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

// Maximum number of dated update entries surfaced in the "What's New" feed.
const MAX_CHANGELOG_ENTRIES = 12;

// Derives the "What's New" feed from the articles themselves — the single
// source of truth. Each article contributes a "new" event on its `created`
// date and a "changed" event on its `updated` date (when `updated` differs
// from `created`). Events are grouped by date, newest first. There is no
// separate changelog file to maintain, so the feed can never drift from the
// catalog. `created` falls back to `lastVerified` so an article missing the
// field is never lost from the feed.
export function getChangelog(): ChangelogEntry[] {
  const byDate = new Map<string, ChangelogItem[]>();

  const add = (date: string, item: ChangelogItem) => {
    const list = byDate.get(date);
    if (list) list.push(item);
    else byDate.set(date, [item]);
  };

  for (const a of getAllArticles()) {
    const created = a.created ?? a.lastVerified;
    if (created) {
      add(created, {
        title: a.title,
        category: a.category,
        slug: a.slug,
        type: "new",
      });
    }
    if (a.updated && a.updated !== created) {
      add(a.updated, {
        title: a.title,
        category: a.category,
        slug: a.slug,
        type: "changed",
      });
    }
  }

  // ISO date strings sort lexically, so plain string compare == chronological.
  return Array.from(byDate.entries())
    .sort(([d1], [d2]) => (d1 < d2 ? 1 : d1 > d2 ? -1 : 0))
    .slice(0, MAX_CHANGELOG_ENTRIES)
    .map(([date, items]) => ({ date, items, summary: buildSummary(items) }));
}

// Auto-generates a short Hebrew summary from an entry's items, e.g.
// "נוספו 7 מאמרים חדשים ועודכנו 2".
function buildSummary(items: ChangelogItem[]): string {
  const newCount = items.filter((i) => i.type === "new").length;
  const changedCount = items.filter((i) => i.type === "changed").length;
  const parts: string[] = [];
  if (newCount > 0) {
    parts.push(
      newCount === 1 ? "נוסף מאמר חדש אחד" : `נוספו ${newCount} מאמרים חדשים`
    );
  }
  if (changedCount > 0) {
    parts.push(
      changedCount === 1 ? "עודכן מאמר אחד" : `עודכנו ${changedCount} מאמרים`
    );
  }
  // Join with the Hebrew conjunction ו attached to the next word (no hyphen):
  // "נוספו 7 מאמרים חדשים ועודכנו 2 מאמרים".
  if (parts.length === 2) return `${parts[0]} ו${parts[1]}`;
  return parts.join("");
}

// Resolves a slug to its article across all categories (first match wins on the
// rare duplicate slug). Backs getRelatedArticles and any slug-only reference.
export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

// Returns the subset of an article's `related` slugs that resolve to real
// articles, as Article objects. Unresolvable references (e.g. "/agents",
// "mcp", "slash-commands") are silently dropped so the UI never renders a
// broken link. Self-references are excluded.
export function getRelatedArticles(article: Article): Article[] {
  if (!article.related) return [];
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const ref of article.related) {
    const resolved = getArticleBySlug(ref);
    if (!resolved) continue;
    if (resolved.slug === article.slug) continue;
    if (seen.has(resolved.slug)) continue;
    seen.add(resolved.slug);
    out.push(resolved);
  }
  return out;
}
