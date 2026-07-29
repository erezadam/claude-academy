---
title: "/todos"
category: claude-code
layer: basic
last_verified: 2026-07-29
status: current
source_url: https://code.claude.com/docs/en/commands
source_url_extra: https://code.claude.com/docs/en/changelog
related: [/plan, /review, /status]
---

## /todos

> הערה: הפקודה `/todos` אינה מופיעה ברשימת הפקודות בתיעוד הרשמי הנוכחי (נבדק ב-2026-07-29). היא מתועדת רק ב-changelog (v1.0.93). ייתכן שהוסרה או שולבה בכלי אחר — נעדכן כשיתברר.

מה זה עושה: מציג את רשימת המשימות של Claude לsession הנוכחי.

### שימוש
```
/todos
```

### מה מוצג
```
> /todos

📋 TODO List — session נוכחי

✅ צור קובץ auth.ts
✅ הוסף JWT middleware
🔄 כתוב tests ל-authentication  ← בביצוע
⬜ עדכן README
⬜ הוסף rate limiting
⬜ deploy לstaging
```

### מה הסמלים אומרים
```
✅ בוצע
🔄 בביצוע עכשיו
⬜ ממתין
❌ בוטל
```

### מתי להשתמש
- ✅ באמצע משימה גדולה — לראות מה נשאר
- ✅ לפני סיום session — לא לשכוח כלום
- ✅ כשClaude נראה "אבוד" — לזכור מה היה המטרה

### workflow מומלץ לסיום יום
```
/todos      ← מה נשאר פתוח
/cost       ← כמה הוצאנו
/memory     ← תעד מה למדת
/clear      ← נקה לsession מחר
```

💡 Claude מנהל את הרשימה אוטומטית — אתה רק צופה.

→ קשור ל: /plan, /review, /status
