---
title: "דגלי CLI — הפעלה מהטרמינל"
category: claude-code
layer: advanced
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/cli
related: [slash-commands-all]
badge: new
---

## דגלי CLI — הפעלת Claude Code מהטרמינל

מה זה עושה: דגלים להפעלת Claude Code במצבים שונים — headless, אוטומציה, CI/CD.

---

### דגלים עיקריים

```bash
# Headless — הדפס תוצאה וצא
claude -p "query"

# פלט JSON עם metadata
claude -p "query" --output-format json

# פלט JSON בסטרימינג
claude -p "query" --output-format stream-json
```

---

### טבלת דגלים מלאה

| דגל | תיאור | דוגמה |
|-----|--------|-------|
| `-p "query"` | Headless — הדפס תוצאה וצא | `claude -p "explain this code"` |
| `--output-format json` | פלט JSON עם metadata | `claude -p "..." --output-format json` |
| `--output-format stream-json` | פלט JSON בסטרימינג | שימושי ל-pipelines |
| `--append-system-prompt "..."` | הוסף הנחיות מערכת | בלי לדרוס ברירות מחדל |
| `--system-prompt "..."` | החלף system prompt לחלוטין | שליטה מלאה |
| `--allowedTools "..."` | הגבל כלים זמינים | אבטחה ב-CI |
| `--dangerously-skip-permissions` | דלג אישורים | **אוטומציה בלבד!** |
| `--resume [id]` | המשך session ב-headless | CI/CD pipelines |
| `--agents [json]` | הגדר subagents inline | אוטומציה מתקדמת |
| `--from-pr [number]` | פתח session מקושר ל-PR | code review |

---

### תרחישי שימוש

**CI/CD Pipeline:**
```bash
claude -p "run tests and report" --output-format json --dangerously-skip-permissions
```

**Code Review אוטומטי:**
```bash
claude --from-pr 42 -p "review this PR for security issues"
```

**Pipeline עם כלים מוגבלים:**
```bash
claude -p "analyze code" --allowedTools "Read,Grep,Glob"
```

**המשך session קודם:**
```bash
claude --resume abc123 -p "what was the status?"
```

---

### אזהרות

- `--dangerously-skip-permissions` — **לעולם לא** בסביבת production ידנית. רק באוטומציה מבוקרת
- `--system-prompt` דורס את כל ה-system prompt הרגיל — כולל CLAUDE.md
- `--append-system-prompt` בטוח יותר — מוסיף בלי לדרוס

> קשור ל: כל פקודות Claude Code
