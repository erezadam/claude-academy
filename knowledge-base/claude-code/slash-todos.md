---
title: "/todos"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/plan, /review, /status]
---

## /todos

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
