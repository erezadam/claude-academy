---
title: "תיקיית .claude — מבנה הקבצים שClaude Code קורא"
category: guides
last_verified: 2026-09-26
status: needs-review
source_url: https://code.claude.com/docs/en/claude-directory
related: [memory, hooks-guide, skills, mcp-connect, extend-claude-code, first-claude-md]
mission: spec
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-09-26T12:00:00+03:00"
pathOrder: 8
---

Claude Code קורא הוראות, הגדרות, skills, subagents וזיכרון משני מקומות: ספריית הפרויקט שלך, ו-`~/.claude` בספריית הבית. קבצי הפרויקט מיועדים ל-commit בגיט כדי לשתפם עם הצוות; קבצי `~/.claude` הם הגדרות אישיות שחלות על כל הפרויקטים.

## ספריית הפרויקט — קבצים שמחויבים לגיט

### CLAUDE.md

הוראות הפרויקט שClaude טוען לתוך ה-context בתחילת כל session. כתוב כאן מוסכמות, פקודות נפוצות והקשר ארכיטקטורלי.

- שמור מתחת ל-200 שורות. קבצים ארוכים יותר נטענים במלואם אך עלולים להפחית את ההתאמה
- אם משהו רלוונטי רק למשימות ספציפיות, העבר אותו ל-skill או לרול path-scoped — כך הוא נטען רק לפי הצורך
- עובד גם ב-`.claude/CLAUDE.md` אם מעדיפים לשמור את שורש הפרויקט נקי
- אם הריפו מכיל `AGENTS.md` עבור coding agents אחרים, Claude Code יכול לקרוא אותו לבד או לצד CLAUDE.md

### .mcp.json

שרתי MCP ברמת הפרויקט, משותפים עם הצוות. נמצא בשורש הפרויקט (לא בתוך `.claude/`).

- שרתים מתחברים בתחילת ה-session; schema הכלים נדחה לטעינה לפי דרישה
- השתמש בהפניות למשתני סביבה לסודות: `${NOTION_TOKEN}`
- לשרתים אישיים שלא מיועדים לשיתוף: `claude mcp add --scope user` (כותב ל-`~/.claude.json`)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
```

### .worktreeinclude

רשימת קבצים מ-gitignore שיועתקו לכל worktree חדש שClaude יוצר. Worktrees הם checkouts חדשים, כך שקבצים untracked כמו `.env` חסרים ברירת מחדל. התחביר זהה ל-`.gitignore`.

```text
# Local environment
.env
.env.local

# API credentials
config/secrets.json
```

## תיקיית .claude/ — הגדרות ברמת הפרויקט

### settings.json

קובץ ההגדרות הראשי: הרשאות, hooks ותצורה. מחייב — Claude Code אוכף אותו ללא תלות בהוראות.

| שדה | תפקיד |
|-----|--------|
| `permissions.allow` / `deny` | פקודות וכלים מותרים/חסומים |
| `hooks` | סקריפטים שרצים על אירועי session (edit, write, וכו') |
| `statusLine` | התצוגה בתחתית המסך בזמן עבודת Claude |
| `model` | מודל ברירת מחדל לפרויקט |
| `env` | משתני סביבה לכל session |
| `outputStyle` | בחירת סגנון פלט מ-`output-styles/` |

הגדרות מסוג מערך (כמו `permissions.allow`) מצטרפות מכל הסקופים; הגדרות סקלריות (כמו `model`) לוקחות את הערך הספציפי ביותר.

```json
{
  "permissions": {
    "allow": ["Bash(npm test *)", "Bash(npm run *)"],
    "deny": ["Bash(rm -rf *)"]
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{"type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"}]
    }]
  }
}
```

### settings.local.json

עקיפות אישיות לפרויקט — מקבל עדיפות על פני `settings.json`. נכנס ל-gitignore אוטומטית כשClaude Code שומר הגדרות לתוכו. פורמט JSON זהה ל-`settings.json`.

### .claude/rules/

כללים שנטענים לפי תבניות נתיב קבצים. שימושי לכללים שצריכים לחול רק על קוד ספציפי בפרויקט.

### .claude/skills/

תבניות פקודה לשימוש חוזר — מה שמקבלות `/name` בסשן. `commands/` הוא שם ישן לאותו מנגנון; לפרויקטים חדשים עדיף `skills/`.

### .claude/agents/

הגדרות subagents מותאמות — עם כלים, הוראות ומודל משלהם.

### .claude/workflows/

סקריפטים לתזמור dynamic workflows (ריצת subagents במקביל).

### .claude/output-styles/

קבצי סגנון פלט מותאמים (Markdown, JSON, וכו').

### .claude/memory/

ספריית auto memory — נוצרת ומתוחזקת אוטומטית על ידי Claude.

## ספריית הבית — ~/.claude/

קבצים אישיים שחלים על כל הפרויקטים. לא מיועדים ל-commit.

| קובץ/תיקייה | תפקיד |
|-------------|--------|
| `settings.json` | הגדרות גלובליות; מוחלפות על ידי הגדרות הפרויקט |
| `keybindings.json` | קיצורי מקלדת מותאמים |
| `themes/` | ערכות נושא מותאמות |
| `projects/` | תמלולי session |
| `memory/` | auto memory אישי |

ב-Windows, הנתיב הוא `%USERPROFILE%\.claude`. כשמגדירים `CLAUDE_CONFIG_DIR`, כל הנתיבים מ-`~/.claude` עוברים לאותה ספרייה.

## מה שרוב המשתמשים צריכים

רוב המשתמשים עורכים רק `CLAUDE.md` ו-`settings.json`. שאר הספרייה אופציונלי — מוסיפים skills, rules או subagents לפי הצורך.
