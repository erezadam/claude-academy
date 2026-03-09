---
title: "/diff, /copy — צפייה והעתקה"
category: claude-code
layer: basic
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-export-resume, slash-context-cost]
badge: new
---

## /diff, /copy — צפייה והעתקה

פקודות לצפייה בשינויים והעתקת תוכן.

---

## /diff — הצגת שינויים

מה זה עושה: מציג את כל השינויים הפתוחים ו-diff לפי תורות (turns) בסשן הנוכחי.

```bash
/diff
```

### מה מקבלים
- רשימת קבצים שהשתנו
- diff מפורט לפי כל turn
- סיכום של סך השינויים

### מתי להשתמש
- לפני commit — לראות בדיוק מה השתנה
- אחרי סדרת שינויים — לוודא שלא שכחת משהו
- לפני `/rewind` — להבין מה יאבד

---

## /copy — העתקה ל-clipboard

מה זה עושה: מעתיק את התגובה האחרונה של Claude ל-clipboard.

```bash
/copy
```

### מתי להשתמש
- כשרוצים להדביק קוד שClaude כתב למקום אחר
- כשרוצים לשתף תגובה עם חבר צוות
- כשעובדים עם IDE חיצוני ורוצים להעביר קוד

> טיפ: `/export` מייצא את כל השיחה, `/copy` מעתיק רק את התגובה האחרונה.

> קשור ל: /export, /diff
