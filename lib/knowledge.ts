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
