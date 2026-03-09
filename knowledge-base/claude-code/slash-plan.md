---
title: "/plan"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/review, /todos, Shift+Tab]
---

## /plan

מה זה עושה: עובר למצב תכנון — Claude מתכנן ומסביר **בלי** לכתוב קוד.

### שימוש
```
/plan
```

### מה קורה
```
לפני /plan:   Claude מיד כותב קוד
אחרי /plan:   Claude מתכנן, שואל, מסביר — ממתין לאישורך
```

### יציאה ממצב plan
```
/plan    ← שוב — יוצא ממצב plan
```

או: `Shift+Tab` — מעבר מהיר בין מצבים.

### מתי להשתמש
- ✅ לפני feature גדול — לתכנן לפני שמתחילים
- ✅ כשאתה לא בטוח מה Claude עומד לעשות
- ✅ refactoring שמשפיע על הרבה קבצים
- ✅ ארכיטקטורה — לקבל הצעה לפני ביצוע
- ❌ תיקוני bugs פשוטים — בזבוז זמן

### דוגמה
```
> /plan
> הוסף authentication לכל ה-API routes

Claude: "אתכנן לפני שאבצע. הנה הגישה:
1. נוסיף middleware לכל route
2. נשתמש ב-JWT tokens
3. נוסיף rate limiting
4. נעדכן את הtests

זה ישפיע על 12 קבצים. רוצה להמשיך?"

> כן
> /plan    ← יצא ממצב plan
```

💡 `/plan` + `Shift+Tab` = הדרך הכי מהירה לשלוט מה Claude עושה.

→ קשור ל: /review, /todos
