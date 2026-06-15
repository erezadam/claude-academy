---
title: "Sessions — ניהול שיחות, המשך וסניפים"
category: claude-code
layer: basic
last_verified: 2026-06-14
created: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/sessions
related: ["slash-export-resume", "slash-fork-rename-exit", "slash-compact-clear", "worktrees"]
---

Session הוא שיחה שמורה הקשורה לתיקיית פרויקט. Claude Code שומר אותה מקומית תוך כדי עבודה, כך שאפשר להמשיך מהנקודה שנעצרתם, לפצל session לנסיון גישה אחרת, או לעבור בין משימות.

## מה זה עושה / למה זה שימושי

Sessions מאפשרים המשכיות אמיתית — לא רק היסטוריית הודעות, אלא context מלא כולל כלים שנטענו, קבצים שנקראו וזיכרון הפרויקט. Sessions נשמרים ב-JSONL תחת `~/.claude/projects/<project>/` ומנוקים אחרי 30 יום כברירת מחדל.

## איך משתמשים

**המשך session:**

```bash
claude --continue          # ממשיך את ה-session האחרון בתיקייה
claude --resume            # פותח picker לבחירת session
claude --resume auth-refactor  # ממשיך session לפי שם
claude --from-pr 1234      # ממשיך את ה-session שיצר PR מסוים
```

**ניתן גם מתוך session פעיל:**

```text
/resume
```

## שמות Sessions

Sessions עם שמות קלים יותר למצוא ולהמשיך:

```bash
claude -n auth-refactor    # שמות בהפעלה
```

```text
/rename auth-refactor      # שינוי שם בתוך session
```

ב-picker (`/resume`): סמנו session ולחצו `Ctrl+R` לשינוי שם.

## picker של Sessions

פותחים עם `/resume` או `claude --resume` ללא ארגומנטים:

| קיצור | פעולה |
|:--|:--|
| `↑` / `↓` | ניווט בין sessions |
| `Enter` | המשך ה-session המסומן |
| `Space` | תצוגה מקדימה של תוכן ה-session |
| `Ctrl+R` | שינוי שם ה-session המסומן |
| `/` | חיפוש (אפשר להדביק URL של PR) |
| `Ctrl+A` | הצגת sessions מכל הפרויקטים |
| `Ctrl+W` | הרחבה לכל ה-worktrees של ה-repo |
| `Ctrl+B` | סינון לפי branch נוכחי |

## פיצול Session (Branch)

ליצירת עותק של השיחה עד כה לניסיון גישה אחרת, בלי לאבד את הנתיב הנוכחי:

```text
/branch try-streaming-approach
```

```bash
claude --continue --fork-session   # מהשורת הפקודה
```

Session המקורי נשאר ב-picker. הרשאות שאושרו "for this session" אינן עוברות לסניף.

## ייצוא ומיקום קבצים

```text
/export    # מעתיק ל-clipboard או שומר לקובץ טקסט
```

Transcripts מאוחסנים ב-`~/.claude/projects/<project>/<session-id>.jsonl`. להגדרת מיקום שונה:

```bash
CLAUDE_CONFIG_DIR=/path/to/dir
```
