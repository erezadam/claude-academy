---
title: "Checkpointing — עקיבה והחזרה של שינויים"
category: claude-code
layer: basic
last_verified: 2026-06-20
status: needs-review
source_url: https://code.claude.com/docs/en/checkpointing
related: [slash-rewind, sessions, slash-compact-clear]
---

Checkpointing עוקב אחרי כל שינוי קובץ שביצע Claude Code, ומאפשר לחזור במהירות לנקודת עבודה קודמת אם משהו השתבש.

## מה זה עושה / למה זה שימושי

Claude Code יוצר checkpoint אוטומטי לפני כל עריכה. אם ניסוי נכשל, קוד השתבש, או הכיוון לא היה נכון — אפשר לחזור לנקודה מדויקת בתוך השיחה בלחיצת כפתור, מבלי להשתמש ב-git.

Checkpoints שמורים בין sessions ומנוקים אוטומטית אחרי 30 יום (ניתן להגדרה).

## איך משתמשים

### פתיחת תפריט Rewind

```text
/rewind
```

או: לחץ `Esc` פעמיים כששורת הקלט ריקה.

התפריט מציג את כל ה-prompts ששלחת בשיחה. בחר נקודה ובחר פעולה:

| פעולה | משמעות |
| :---- | :------ |
| Restore code and conversation | מחזיר קוד ושיחה לנקודה שנבחרה |
| Restore conversation | מחזיר שיחה, שומר קוד נוכחי |
| Restore code | מחזיר קוד, שומר שיחה |
| Summarize from here | דחס שיחה מנקודה זו והלאה לסיכום |
| Summarize up to here | דחס שיחה עד לנקודה זו לסיכום |

### הבדל בין Restore לבין Summarize

**Restore** — מבטל שינויים: מחזיר קבצים, היסטוריה, או שניהם.

**Summarize** — דחס חלק מהשיחה לסיכום AI ללא שינוי קבצים:
- `Summarize from here` — ה-messages לפני הנקודה נשמרים; מה שאחריה מוחלף בסיכום.
- `Summarize up to here` — ה-messages לפני הנקודה מוחלפים בסיכום; נשאר בסוף השיחה.

## מגבלות

**שינויי Bash לא נעקבים** — קבצים שהשתנו דרך bash (כמו `rm`, `mv`, `cp`) לא ניתנים לשחזור.

**לא תחליף ל-git** — Checkpoints הם "undo מקומי" ברמת session. לגרסאות קבועות ושיתוף, השתמש ב-git.
