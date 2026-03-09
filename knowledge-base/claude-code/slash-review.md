---
title: "/review"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/plan, /security-review, /todos]
---

## /review

מה זה עושה: מבקש code review על השינויים האחרונים.

### שימוש
```
/review
```

### מה Claude בודק
```
1. איכות קוד — קריאות, מבנה, naming
2. בעיות אבטחה — injection, חשיפת מידע
3. ביצועים — loops, queries, memory
4. כיסוי tests — מה חסר
5. תיעוד — מה לא מוסבר
```

### דוגמה
```
> /review

Claude מנתח את git diff מאז הcommit האחרון:

⚠️ security/auth.ts:47
   SQL query מחרוזות — risk of injection
   המלצה: השתמש ב-parameterized queries

⚠️ api/users.ts:23
   password מוחזר ב-response
   המלצה: הסר password מה-return object

✅ components/Header.tsx — נקי
✅ utils/format.ts — נקי
```

### לפני commit — workflow מומלץ
```
/review          ← קבל feedback
# תקן בעיות
/review          ← אמת שנפתר
git add .
git commit -m "..."
```

💡 הרץ `/review` לפני כל commit חשוב — חוסך זמן ב-PR review.

💡 לבדיקת אבטחה מעמיקה יותר: `/security-review`

→ קשור ל: /plan, /security-review, /todos
