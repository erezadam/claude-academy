---
title: "כלי Cron — CronCreate, CronList, CronDelete"
category: scheduling
layer: advanced
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-loop]
badge: new
---

## כלי Cron — ניהול משימות מתוזמנות

מה זה עושה: שלושה כלים פנימיים לניהול jobs מתוזמנים שנוצרו עם `/loop`.

---

### CronCreate

כלי פנימי — Claude יוצר job מתוזמן. בדרך כלל מופעל אוטומטית דרך `/loop`.

```bash
# נוצר אוטומטית כשמריצים:
/loop 5m check deploy status
# Claude משתמש ב-CronCreate ברקע
```

---

### CronList

מציג את כל המשימות המתוזמנות הפעילות ב-session הנוכחי.

```
CronList

# פלט לדוגמה:
# ID   | Interval | Prompt                    | Status
# cr-1 | 5m       | check deploy status       | active
# cr-2 | 1h       | scan for vulnerabilities  | active
# cr-3 | 0 9 * * *| summarize merged PRs      | paused
```

---

### CronDelete

ביטול משימה מתוזמנת לפי ה-Job ID שלה.

```bash
CronDelete cr-1
# ✓ Job cr-1 cancelled
```

---

### מגבלות כלליות

| מגבלה | ערך |
|-------|-----|
| מקסימום jobs per session | 50 |
| תוקף מקסימלי | 3 ימים |
| scope | session בלבד — לא ממשיך אחרי סגירה |

---

### טיפים

- השתמש ב-`CronList` לפני יצירת jobs חדשים כדי לוודא שאין כפילויות
- מחק jobs שכבר לא נחוצים עם `CronDelete` כדי לא לבזבז resources
- אם session נסגר — כל ה-jobs מתבטלים אוטומטית

> קשור ל: /loop
