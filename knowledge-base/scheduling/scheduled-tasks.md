---
title: "תזמון משימות בתוך Session — /loop וכלי Cron"
category: scheduling
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/scheduled-tasks
related: []
---

## תזמון משימות בתוך Session

Scheduled tasks מאפשרים ל-Claude להריץ prompt אוטומטית על interval. השתמש בהם כדי לפקח על deploy, לשמור על PR, לבדוק build ממושך, או להזכיר לך משהו מאוחר יותר ב-session.

**Tasks הם session-scoped:** הם חיים בשיחה הנוכחית ומפסיקים כשמתחילים שיחה חדשה. חידוש עם `--resume` מחזיר tasks שלא פגו (recurring שנוצרו ב-7 הימים האחרונים, או חד-פעמי שמועדו עוד לא עבר).

---

## השוואת אפשרויות תזמון

| | Cloud (Routines) | Desktop | /loop |
|:--|:--|:--|:--|
| רץ על | ענן Anthropic | המחשב שלך | המחשב שלך |
| דורש מחשב פועל | לא | כן | כן |
| דורש session פתוח | לא | לא | כן |
| גישה לקבצים מקומיים | לא | כן | כן |
| interval מינימלי | שעה | דקה | דקה |

---

## /loop — interval קבוע

כשמספקים interval, Claude ממיר לביטוי cron ומאשר את הקצב וה-Job ID:

```text
/loop 5m check if the deployment finished and tell me what happened
```

יחידות נתמכות: `s` (שניות), `m` (דקות), `h` (שעות), `d` (ימים). שניות מעוגלות לדקה הקרובה. interval שלא מתאים לשלב cron נקי (כגון `7m`) מעוגל ו-Claude מציין מה נבחר.

---

## /loop — interval דינמי

כשלא מציינים interval, Claude בוחר באופן דינמי. לאחר כל iteration הוא בוחר עיכוב בין דקה לשעה בהתאם למה שצפה: המתנות קצרות כשbuild מסתיים או PR פעיל, המתנות ארוכות כשאין פעילות.

```text
/loop check whether CI passed and address any review comments
```

---

## /loop — prompt תחזוקה מובנה

כשלא מציינים prompt, Claude משתמש ב-prompt תחזוקה מובנה. בכל iteration הוא, לפי הסדר:

- ממשיך עבודה לא גמורה מהשיחה
- מטפל ב-PR של הענף הנוכחי: הערות review, CI שנכשל, conflicts
- מריץ passes לניקוי כשאין שום דבר אחר

```text
/loop
```

`/loop` ריק רץ על interval דינמי. הוסף interval לתזמון קבוע: `/loop 15m`.

---

## ניהול tasks

להציג ולבטל tasks מתוזמנים, השתמש בכלי `CronList` ו-`CronDelete` שClaudeיכול להפעיל. ניתן לבטל task גם דרך ה-ID שמוצג בעת יצירתו.
