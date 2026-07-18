---
title: "/doctor — בדיקת תצורה מקיפה ומתקנת"
category: claude-code
layer: basic
last_verified: 2026-07-18
status: needs-review
source_url: https://code.claude.com/docs/en/commands
related: [slash-commands-all, hooks-guide, memory, skills]
---

`/doctor` הוא skill מובנה שמאבחן בעיות תצורה והתקנה ב-Claude Code ויכול גם לתקן אותן — לא רק לדווח עליהן. מציג ממצאים ומבקש אישור לפני כל שינוי.

דרוש Claude Code v2.1.205 ומעלה. ל-CLAUDE.md trim נדרש v2.1.206.

## מה זה עושה / למה זה שימושי

`/doctor` עובר על מספר תחומים ומציע תיקונים:

**בדיקות התקנה:** מוצא בעיות PATH, התקנות כפולות, קבצי settings פגומים, וגרסאות מיושנות.

**ניצול context:** מזהה skills, MCP servers ו-plugins שאינם בשימוש אבל צורכים context window.

**CLAUDE.md:** מוצא קבצי CLAUDE.md מקומיים שמשכפלים תוכן של קבצים מ-commit, מציע לקצץ סעיפים שClaude יכול לגזור מהקוד עצמו (פריסת תיקיות, רשימות dependencies, סקירות ארכיטקטורה), ומציע להעביר הנחיות שנשארות ל-skills ו-CLAUDE.md מקוננים שנטענים לפי דרישה.

**hooks:** מסמן hooks איטיים.

**auto mode ופקודות:** מציע להפוך auto mode לברירת מחדל ולאשר מראש פקודות read-only שנחסמות לעיתים קרובות.

## איך משתמשים

```text
/doctor
```

או מהטרמינל בלי לפתוח session (קריאה-בלבד, אבחון התקנה):

```bash
claude doctor
```

שם חלופי בתוך session:

```text
/checkup
```

## תהליך הבדיקה

`/doctor` מציג ממצאים תחילה ומבקש אישור לפני כל שינוי. אין שינויים אוטומטיים. לדוגמה, אם מזהה תוכן CLAUDE.md שניתן לקצץ, יציג מה מתכוון להסיר ויבקש אישור לפני שמוחק.

זה שונה מהתנהגות הגרסאות הישנות (לפני v2.1.205), שבהן `/doctor` פתח מסך אבחון קריאה-בלבד בלבד.

## מתי להריץ

- אחרי עדכון של claude-code
- כשיש התנהגות מוזרה בלתי מוסברת
- כשה-API לא מגיב
- כשרוצים לנקות skills/MCP/plugins שהצטברו
- כשה-context window מתמלא מהר
