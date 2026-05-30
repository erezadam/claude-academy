---
title: "Subagents — סוכנים ייעודיים ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/sub-agents
related: []
---

## Subagents

Subagents הם עוזרי AI ייעודיים שמטפלים בסוגי משימות ספציפיים. השתמש בsubagent כש-side task יציף את השיחה הראשית בתוצאות חיפוש, logs, או תוכן קבצים שלא תפנה אליהם שוב — ה-subagent מבצע את העבודה ב-context window משלו ומחזיר רק את הסיכום.

כל subagent רץ ב-context window משלו עם system prompt מותאם, גישה לכלים ספציפיים, והרשאות עצמאיות. לסשנים מקבילים מרובים עם ניטור מרכזי, ראה background agents (`/en/agent-view`).

---

## Subagents מובנים

Claude Code כולל subagents מובנים שClaudeמשתמש בהם אוטומטית לפי הצורך:

| Subagent | מודל | כלים | מתי Claude משתמש בו |
|:--|:--|:--|:--|
| **Explore** | Haiku (מהיר) | read-only בלבד | חיפוש וניתוח codebase ללא שינויים |
| **Plan** | יורש מהשיחה | read-only בלבד | מחקר codebase במצב plan mode |
| **general-purpose** | יורש מהשיחה | כל הכלים | מחקר ויישום מורכב, שלבים תלויים |

Explore ו-Plan דולגים על קבצי CLAUDE.md ו-git status כדי לשמור על מחקר מהיר וזול.

---

## יצירת Subagent מותאם

צור `~/.claude/agents/name.md` עבור subagent שזמין בכל הפרויקטים, או `.claude/agents/name.md` לפרויקט ספציפי.

דוגמה לsubagent לניתוח ביצועים:

```yaml
---
name: perf-analyzer
description: Analyzes performance bottlenecks. Use for profiling requests, benchmarking, or identifying slow code paths.
model: claude-haiku-4-5-20251001
tools:
  - Read
  - Bash
---

You are a performance analysis specialist. Focus on identifying bottlenecks,
measuring execution time, and suggesting concrete optimizations. Always include
before/after benchmarks when proposing changes.
```

---

## הגדרת Subagent — שדות Frontmatter

| שדה | תיאור |
|:--|:--|
| `name` | מזהה ייחודי — שם התיקייה/קובץ |
| `description` | Claude קורא זאת כדי להחליט מתי להאציל — כתוב בבהירות |
| `model` | מודל לשימוש (אפשר Haiku לחיסכון בעלויות) |
| `tools` | רשימת כלים מותרים (ריק = כל הכלים) |

---

## יתרונות עיקריים

**שימור context** — חיפוש וreview מתנהלים ב-context נפרד; רק הסיכום מגיע לשיחה הראשית.

**הגבלת כלים** — subagent read-only לא יכול לשנות קבצים גם אם יש בעיה.

**שליטה בעלויות** — ניתוב משימות חיפוש לHaiku חוסך עלות לעומת מודל מלא.

**התמחות** — system prompt ממוקד לדומיין ספציפי נותן תוצאות טובות יותר.
