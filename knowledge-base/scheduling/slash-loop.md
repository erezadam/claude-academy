---
title: "/loop — תזמון משימות חוזרות"
category: scheduling
layer: advanced
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [cron-tools]
badge: new
---

## /loop — תזמון משימות חוזרות

מה זה עושה: מתזמן משימה שתרוץ באופן חוזר בתוך ה-session — לפי interval או cron expression.

---

### שימוש בסיסי

```bash
/loop [interval] [prompt]
```

### דוגמאות

```bash
# בדוק סטטוס deploy כל 5 דקות
/loop 5m check deploy status

# סכם PRs שמורגו — כל יום ב-09:00
/loop 0 9 * * * summarize merged PRs

# סרוק פרצות אבטחה כל שעה
/loop 1h scan for security vulnerabilities
```

---

### יחידות זמן נתמכות

| יחידה | משמעות | דוגמה |
|-------|--------|-------|
| `s` | שניות | `30s` |
| `m` | דקות | `5m` |
| `h` | שעות | `1h` |
| `d` | ימים | `1d` |
| cron | ביטוי cron מלא | `0 9 * * *` |

---

### מגבלות

- **session-scoped** — המשימות פעילות רק כל עוד ה-session פתוח
- **פג תוקף** אחרי 3 ימים אוטומטית
- **מקסימום 50 משימות** פעילות per session
- משימות לא ממשיכות אחרי סגירת session

---

### ניהול משימות מתוזמנות

| כלי | מה עושה |
|-----|---------|
| `CronCreate` | כלי פנימי — Claude יוצר job מתוזמן |
| `CronList` | הצג כל המשימות הפעילות + Job IDs |
| `CronDelete [job-id]` | בטל משימה לפי ID |

ראה מאמר נפרד: **כלי Cron** לפרטים מלאים.

---

### תרחישים מומלצים

```bash
# ניטור CI/CD
/loop 5m check if GitHub Actions workflow completed

# ניטור שרת
/loop 1h check server health and report errors

# תזכורת יומית
/loop 0 17 * * * remind me to commit and push today's work
```

> קשור ל: CronCreate, CronList, CronDelete
