---
title: "/pr-comments, /security-review — סקירת PR ואבטחה"
category: claude-code
layer: intermediate
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-review]
badge: new
---

## /pr-comments, /security-review — סקירת PR ואבטחה

פקודות מתקדמות לעבודה עם Pull Requests ובדיקות אבטחה.

---

## /pr-comments — תגובות PR

מה זה עושה: מציג תגובות מ-GitHub PR ישירות בטרמינל.

```bash
/pr-comments 123       # PR מספר 123
/pr-comments           # PR של ה-branch הנוכחי
```

### מה מקבלים
- כל תגובות ה-review
- inline comments על שורות קוד
- סטטוס approvals

### מתי להשתמש
- אחרי שפתחת PR ומחכה ל-review
- רוצה לראות תגובות בלי לצאת מהטרמינל
- לפני שעונים על comments — לראות הכל במקום אחד

---

## /security-review — סריקת אבטחה

מה זה עושה: סריקת אבטחה ממוקדת לשינויים הממתינים (staged + unstaged).

```bash
/security-review
```

### מה נבדק
- SQL injection
- XSS (Cross-Site Scripting)
- Hardcoded secrets (API keys, passwords, tokens)
- Insecure dependencies
- OWASP Top 10

### מתי להשתמש
- **לפני כל commit** — במיוחד בקוד שמטפל בקלט משתמש
- לפני PR למערכות production
- אחרי הוספת dependency חדש

```bash
# workflow מומלץ לפני commit
/security-review    # בדוק אבטחה
/diff               # ראה שינויים
git add .
git commit -m "..."
```

> קשור ל: /review, /install-github-app
