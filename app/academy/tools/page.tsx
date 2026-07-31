import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "כלים והרחבות",
  description:
    "היכולות שמרחיבות את Claude Code מעבר לשיחה בטרמינל, וכלי האקדמיה.",
};

// עמוד כלים — מימוש isTools מ-"Claude Academy - Site.dc.html": כרטיסי
// יכולות שמפנים למאמרי העומק, ולצידם כלי האקדמיה עצמם.
interface Tool {
  code: string;
  name: string;
  level: string;
  needs: string;
  href: string;
  desc: string;
  external?: boolean;
}

const CAPABILITIES: Tool[] = [
  { code: "MCP", name: "Model Context Protocol", level: "מתקדמים", needs: "שרת MCP", href: "/academy/a/slash-mcp", desc: "מחבר את קלוד למקורות חיצוניים — DB, ‏Jira, ‏Figma — כקריאות כלים אמיתיות." },
  { code: "HOOKS", name: "Hooks", level: "מתקדמים", needs: "settings.json", href: "/academy/a/hooks-guide", desc: "מריץ פקודה שלך בנקודות מוגדרות בסשן: לפני עריכה, אחרי commit, בסיום." },
  { code: "SKILLS", name: "Skills", level: "מתקדמים", needs: "תיקיית skills", href: "/academy/a/skills", desc: "תיקיית הוראות שקלוד טוען לפי הקשר — כך תהליך חוזר נשמע אותו דבר כל פעם." },
  { code: "AGENTS", name: "Subagents", level: "מתקדמים", needs: "—", href: "/academy/a/sub-agents", desc: "סוכני-משנה שרצים במקביל על תתי-משימות ומחזירים תוצאה מרוכזת." },
  { code: "CLAUDE.MD", name: "CLAUDE.md", level: "מתחילים", needs: "—", href: "/academy/a/first-claude-md", desc: "הזיכרון הקבוע של הפרויקט: כללים, סגנון ומוסכמות שנטענים בכל סשן." },
  { code: "WORKTREE", name: "Worktrees", level: "מתקדמים", needs: "git 2.5+", href: "/academy/a/worktrees", desc: "כמה סשנים על אותו repo בלי שידרכו זה על זה." },
];

const ACADEMY_TOOLS: Tool[] = [
  { code: "WIZARD", name: "אשף פרויקט חדש", level: "מתחילים", needs: "—", href: "/academy/wizard", desc: "ענה על כמה שאלות וקבל את כל הפקודות מוכנות להרצה — Git, ‏CLAUDE.md ו-GitHub." },
  { code: "GALLERY", name: "Design Gallery", level: "מתחילים", needs: "—", href: "/academy/design-gallery/", desc: "12 מערכות עיצוב מוכנות לשימוש — דמו חי, קוד CSS ו-Skill Prompt.", external: true },
];

function ToolCard({ t }: { t: Tool }) {
  const inner = (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span className="font-mono-ds" style={{ fontSize: 12, color: "var(--color-accent-700)" }}>{t.code}</span>
        <span className="tag tag-outline">{t.level}</span>
      </div>
      <div className="card-title" style={{ fontSize: 23 }}>{t.name}</div>
      <p className="card-body">{t.desc}</p>
      <div className="card-meta">דורש: {t.needs}</div>
      <i className="corner tl" /><i className="corner tr" />
      <i className="corner bl" /><i className="corner br" />
    </>
  );
  const style = { padding: 20, gap: 10 } as const;
  return t.external ? (
    <a href={t.href} className="card blueprint" style={style}>{inner}</a>
  ) : (
    <Link href={t.href} className="card blueprint" style={style}>{inner}</Link>
  );
}

export default function ToolsPage() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ padding: "40px 40px 24px", borderBottom: "1px solid var(--color-divider)" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 48 }}>כלים והרחבות</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: 17, maxWidth: "62ch" }}>
          היכולות שמרחיבות את Claude Code מעבר לשיחה בטרמינל — ולצידן כלי
          האקדמיה. לכל אחת: מה זה, מתי כדאי, ומה חייב להיות לך לפני.
        </p>
      </div>
      <div style={{ padding: "32px 40px 24px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {CAPABILITIES.map((t) => <ToolCard key={t.code} t={t} />)}
      </div>
      <h6 className="text-muted" style={{ padding: "0 40px", margin: "8px 0 12px" }}>כלי האקדמיה</h6>
      <div style={{ padding: "0 40px 56px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {ACADEMY_TOOLS.map((t) => <ToolCard key={t.code} t={t} />)}
      </div>
    </main>
  );
}
