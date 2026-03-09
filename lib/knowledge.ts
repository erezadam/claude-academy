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
  workflows: {
    name: "תהליכי עבודה",
    description: "תרחישים מעשיים ותהליכי עבודה מומלצים",
    icon: "⚡",
  },
};

const WORKFLOWS_ARTICLES: Article[] = [
  {
    slug: "git-flow-basics",
    title: "Git Flow — תהליך עבודה בסיסי",
    category: "workflows",
    whatItDoes: "איך לעבוד עם branches בצוות — מ-feature branch ועד merge",
    firstCodeBlock:
      "git checkout -b feature/my-feature\n# ... עבודה ...\ngit push -u origin feature/my-feature",
    content: `## Git Flow — תהליך עבודה בסיסי

איך לעבוד עם branches בצוות — מ-feature branch ועד merge.

### השלבים

\`\`\`bash
# 1. צור branch חדש מ-develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. עבוד ושמור
git add .
git commit -m "feat: add new feature"

# 3. שלח ל-remote
git push -u origin feature/my-feature

# 4. פתח Pull Request ב-GitHub

# 5. אחרי אישור — merge ונקה
git checkout develop
git pull origin develop
git branch -d feature/my-feature
\`\`\``,
  },
  {
    slug: "claude-code-new-project",
    title: "פתיחת פרויקט חדש עם Claude Code",
    category: "workflows",
    whatItDoes: "השלבים המומלצים להקמת פרויקט חדש מאפס עם Claude Code",
    firstCodeBlock: "/init\n# ערוך את CLAUDE.md\n/memory",
    content: `## פתיחת פרויקט חדש עם Claude Code

השלבים המומלצים להקמת פרויקט חדש מאפס עם Claude Code.

### השלבים

\`\`\`bash
# 1. אתחול
/init

# 2. ערוך את CLAUDE.md שנוצר
/memory

# 3. הגדר Git
git init
git add .
git commit -m "chore: initial setup"

# 4. חבר ל-GitHub
git remote add origin [URL]
git push -u origin main
\`\`\``,
  },
  {
    slug: "code-review-workflow",
    title: "Code Review — תהליך סקירת קוד",
    category: "workflows",
    whatItDoes: "איך לעשות סקירת קוד יעילה עם Git ו-Claude Code",
    firstCodeBlock:
      'git diff develop...feature/my-feature\n# או בקש מ-Claude:\n"תסקור את השינויים ב-PR הזה"',
    content: `## Code Review — תהליך סקירת קוד

איך לעשות סקירת קוד יעילה עם Git ו-Claude Code.

### השלבים

\`\`\`bash
# 1. ראה מה השתנה
git diff develop...feature/my-feature

# 2. בקש מ-Claude לסקור
"תסקור את השינויים ב-PR הזה"

# 3. בדוק נקודות קריטיות
git log --oneline develop..feature/my-feature
\`\`\``,
  },
  {
    slug: "debug-with-claude",
    title: "דיבאג עם Claude Code",
    category: "workflows",
    whatItDoes: "שיטות לאיתור ותיקון באגים בעזרת Claude Code",
    firstCodeBlock:
      '/doctor\n# תאר את הבאג:\n"יש שגיאה בדף login — הכפתור לא מגיב"',
    content: `## דיבאג עם Claude Code

שיטות לאיתור ותיקון באגים בעזרת Claude Code.

### השלבים

\`\`\`bash
# 1. בדוק שהסביבה תקינה
/doctor

# 2. תאר את הבאג בבירור
"יש שגיאה בדף login — הכפתור לא מגיב לאחר לחיצה"

# 3. אם ניסוי נכשל — חזור אחורה
/rewind
# נסה גישה אחרת

# 4. שמור את הפתרון
/memory
# "באג X נפתר על ידי Y"
\`\`\``,
  },
];

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
    };
  });
}

export function getCategories(): Category[] {
  const knowledgeBase = path.join(process.cwd(), "knowledge-base");

  return Object.entries(CATEGORY_META).map(([slug, meta]) => {
    let articles: Article[];

    if (slug === "workflows") {
      articles = WORKFLOWS_ARTICLES;
    } else {
      const dirPath = path.join(knowledgeBase, slug);
      articles = readArticlesFromDir(dirPath, slug);
    }

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
