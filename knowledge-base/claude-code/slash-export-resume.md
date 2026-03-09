---
title: "/export ו-/resume"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/clear, /memory, /rewind]
---

## /export ו-/resume — שמירה והמשך sessions

---

## /export — ייצוא השיחה

מה זה עושה: שומר את כל השיחה לקובץ או clipboard.

### שימוש
```
/export                        ← clipboard
/export conversation.md        ← קובץ markdown
/export --clipboard            ← clipboard מפורש
```

### מתי להשתמש
- ✅ תיעוד החלטות חשובות שנעשו בsession
- ✅ שיתוף עם עמית — "תראה מה Claude הציע"
- ✅ לפני /clear — שמור את ההיסטוריה
- ✅ audit trail — מה שינינו ולמה

---

## /resume — חזרה לsession קודם

מה זה עושה: פותח session picker ומאפשר לחזור לשיחה קודמת.

### שימוש
```
/resume                        ← תפריט sessions
/resume [session-id]           ← session ספציפי

# מחוץ ל-Claude Code:
claude -c                      ← session אחרון
claude -r [session-id]         ← session ספציפי
claude --from-pr [number]      ← session של PR
```

### תפריט /resume
```
> /resume

Recent sessions:
  1. [היום 14:32] "auth refactor" — develop branch
  2. [אתמול 09:15] "payment integration" — feature/payments
  3. [שלשום 16:44] "bug fix login crash" — main

Select session:
```

💡 תן שמות לsessions עם `/rename "שם"` — הרבה יותר קל למצוא אחרי כן.

💡 `claude -c` = הקיצור היומי שלך — ממשיך ממש מאיפה שעצרת.

→ קשור ל: /clear, /memory, /rewind
