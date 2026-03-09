---
title: "/rewind"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/clear, /compact, Esc+Esc]
---

## /rewind

מה זה עושה: מחזיר את הקוד והשיחה לנקודה קודמת בsession — כמו Ctrl+Z לכל session.

### שימוש
```
/rewind
Esc + Esc    ← קיצור מקלדת (זהה)
```

### אפשרויות (עדכון 2026)
```
> /rewind

Select checkpoint:
  3. [10 min ago] "add authentication middleware"
  2. [25 min ago] "create user model"
  1. [42 min ago] "initial setup"

Rollback type:
  [A] Rewind both code and conversation
  [B] Rewind code only (keep conversation)   ← חדש ב-2026
  [C] Summarize from here (surgical compact)
```

### מתי להשתמש

```bash
# Claude שינה קובץ לא נכון
Esc + Esc
"Rewind code only"
# הקוד חזר — השיחה נשמרת

# ניסוי גדול שלא עבד
/rewind
"Rewind both"
# חזרת למצב לפני הניסוי

# תיקנת את Claude פעמיים ועדיין טועה
/rewind  →  חזור לפני הטעות הראשונה
# prompt חדש עם הבנה טובה יותר
```

### "Rewind code only" — למה זה שימושי
```
שיחה:  "נסה גישה חדשה" ← נשמרת
קוד:   [חוזר למצב לפני הניסוי]

תוצאה: אתה יכול להגיד "עכשיו נסה ככה..."
        בלי לאבד את ההסבר שכבר נתת
```

### "Summarize from here"
חלופה כירורגית ל-/compact:
- שומר את ה-context הראשוני בשלמותו
- מסכם רק את החלק שאוכל מקום (debugging ארוך)

💡 השתמש ב-/rewind בנדיבות — זה ה-safety net שלך. נסה גישות מסוכנות בידיעה שאפשר לחזור.

💡 כלל: אחרי 2 תיקונות שלא עבדו → /rewind ותתחיל עם prompt טוב יותר. אל תמשיך לדחוף.

→ קשור ל: /clear, /compact, /context
