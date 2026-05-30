---
title: "Skills — הרחבת יכולות Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/skills
related: []
---

## Skills

Skills מרחיבים את מה ש-Claude יכול לעשות. צור קובץ `SKILL.md` עם הוראות ו-Claude מוסיף אותו לערכת הכלים שלו. Claude משתמש ב-skills כשרלוונטי, או שאתה יכול להפעיל ישירות עם `/skill-name`.

השתמש ב-skill כשאתה תמיד מדביק אותן הוראות, checklist, או תהליך רב-שלבי לשיחה — או כשחלק ב-CLAUDE.md גדל להיות תהליך ולא עובדה. בשונה מ-CLAUDE.md, גוף ה-skill נטען רק כשמשתמשים בו.

**הערה חשובה:** Custom commands ב-`.claude/commands/` ו-skills ב-`.claude/skills/` עובדים באותו אופן. קבצים קיימים ב-`.claude/commands/` ממשיכים לעבוד.

---

## Skills מובנים

Claude Code כולל סט skills מובנים הזמינים בכל session:

| Skill | תפקיד |
|:--|:--|
| `/code-review` | review קוד עם רמת effort שניתן להגדרה |
| `/loop` | הרצת prompt על interval חוזר |
| `/debug` | debug מובנה |
| `/batch` | עיבוד קבצים מרובים |
| `/run` | הפעלת אפליקציה לאימות שינוי |
| `/verify` | אימות שינוי קוד מול אפליקציה פועלת |
| `/claude-api` | עזרה עם Anthropic SDK |

---

## יצירת Skill ראשון

**שלב 1 — צור תיקיית skill:**

```bash
mkdir -p ~/.claude/skills/summarize-changes
```

**שלב 2 — כתוב SKILL.md:**

כל skill צריך קובץ `SKILL.md` עם שני חלקים: YAML frontmatter בין `---` שמסביר ל-Claude מתי להשתמש ב-skill, ותוכן markdown עם ההוראות.

```yaml
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points, then list any risks you notice such as missing error handling, hardcoded values, or tests that need updating. If the diff is empty, say there are no uncommitted changes.
```

**שלב 3 — בדיקה:**

```text
/summarize-changes
```

---

## Dynamic Context Injection

השורה `` !`git diff HEAD` `` בדוגמה למעלה היא **dynamic context injection**: Claude Code מריץ את הפקודה ומחליף את השורה בפלט שלה לפני ש-Claude רואה את תוכן ה-skill. כך ההוראות מגיעות עם הנתונים הנוכחיים כבר מוטמעים.

---

## מיקום Skills

| מיקום | שם Skill | הזמינות |
|:--|:--|:--|
| `~/.claude/skills/name/` | `/name` | כל הפרויקטים |
| `.claude/skills/name/` | `/name` | הפרויקט הנוכחי |
| `.claude/skills/name/` (ב-plugin) | `/plugin-name:name` | לפי plugin namespace |

Claude Code טוען skills מ-`.claude/skills/` אוטומטית — אין צורך בmarketplace.
