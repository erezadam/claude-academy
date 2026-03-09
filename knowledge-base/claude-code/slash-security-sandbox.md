---
title: "/security-review ו-/sandbox"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/review, /permissions, /doctor]
---

## /security-review ו-/sandbox — אבטחה

---

## /security-review — בדיקת אבטחה מעמיקה

מה זה עושה: בדיקת אבטחה מקיפה של כל השינויים הממתינים.

### שימוש
```
/security-review
```

### מה נבדק
```
🔍 SQL injection vulnerabilities
🔍 XSS attack vectors
🔍 Authentication bypasses
🔍 API keys בקוד
🔍 חשיפת sensitive data ב-logs
🔍 חורי CORS
🔍 Race conditions
🔍 Path traversal vulnerabilities
```

### פלט לדוגמה
```
> /security-review

🚨 HIGH: SQL injection — src/db/users.ts:34
   Raw string interpolation in query
   Fix: Use parameterized queries

⚠️ MEDIUM: Sensitive data in logs — src/auth/login.ts:67
   Email logged on failed login
   Fix: Log only user ID

✅ No hardcoded secrets found
✅ CORS properly configured
```

---

## /sandbox — הרצה בסביבה מבודדת

מה זה עושה: מפעיל מצב sandbox — bash רץ ב-isolation בלי גישה לרשת ולמערכת.

### שימוש
```
/sandbox
```

### מתי להשתמש
- ✅ הרצת קוד לא מוכר
- ✅ ניסויים שעלולים לפגוע במערכת
- ✅ CI/CD — להריץ Claude ב-pipeline מבלי סיכון

💡 `/security-review` לפני כל deploy לproduction — 5 דקות שחוסכות שעות.

→ קשור ל: /review, /permissions
