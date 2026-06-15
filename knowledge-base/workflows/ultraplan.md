---
title: "Ultraplan — תכנון בענן ועריכה שיתופית"
category: workflows
layer: intermediate
last_verified: 2026-06-14
created: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/ultraplan
related: ["dynamic-workflows", "agent-view", "worktrees"]
---

Ultraplan מעביר משימת תכנון מה-CLI המקומי ל-session של Claude Code on the web שרץ ב-plan mode. Claude מנסח את התוכנית בענן בזמן שאתם ממשיכים לעבוד בטרמינל. כשהתוכנית מוכנה, פותחים אותה בדפדפן, מגיבים על קטעים ספציפיים ובוחרים היכן לבצע.

## מה זה עושה / למה זה שימושי

Ultraplan שימושי כשרוצים ממשק סקירה עשיר יותר ממה שהטרמינל מציע:

- **Feedback ממוקד** — מגיבים על קטעים ספציפיים בתוכנית במקום להגיב לה כולה
- **ניסוח ללא עצירה** — התוכנית נוצרת מרחוק, הטרמינל פנוי לעבודה אחרת
- **ביצוע גמיש** — מאשרים הרצה בענן, או מחזירים את התוכנית לטרמינל

Ultraplan דורש חשבון Claude Code on the web ו-repository ב-GitHub. אינו זמין ב-Bedrock, Vertex AI, Foundry.

## איך משתמשים

**הפעלה מה-CLI** — שלוש דרכים:

```text
/ultraplan migrate the auth service from sessions to JWTs
```

או הכלילו את המילה `ultraplan` בכל prompt רגיל:

```text
ultraplan: audit every API endpoint under src/routes/
```

או לחצו **No, refine with Ultraplan** כשה-plan mode המקומי מסיים ומציג תוכנית.

**מעקב אחר התקדמות** — הריצו `/tasks` ובחרו את רשומת ultraplan לפרטים ו-link:

```text
/tasks
```

| סטטוס | משמעות |
|:--|:--|
| `◇ ultraplan` | Claude חוקר את ה-codebase ומנסח |
| `◇ ultraplan needs your input` | Claude שאל שאלה — פתחו את ה-session link |
| `◆ ultraplan ready` | התוכנית מוכנה לסקירה בדפדפן |

## סקירה ועריכה בדפדפן

כשהסטטוס מגיע ל-`◆ ultraplan ready`, פתחו את ה-session link ב-claude.ai. ממשק הסקירה מאפשר:

- **תגובות inline** — סמנו קטע והשאירו הערה ל-Claude לטיפול
- **Emoji reactions** — סמנו אישור או דאגה בלי לכתוב תגובה מלאה
- **Sidebar outline** — קפצו בין קטעי התוכנית

ניתן לבקש עדכונים כמה פעמים שרוצים לפני שבוחרים היכן לבצע.

## בחירת מקום הביצוע

כשהתוכנית מוכנה, בוחרים בדפדפן:

**ביצוע בענן** — לחצו **Approve Claude's plan and start coding**. ה-session ממשיך בענן; הטרמינל מציג אישור.

**החזרה לטרמינל** — לחצו **Approve plan and teleport back to terminal**. ה-session בענן נארכב, ובטרמינל מופיע dialog עם שלוש אפשרויות:

- **Implement here** — הזרקת התוכנית ל-conversation הנוכחי
- **Start new session** — פתיחת session חדש עם התוכנית כ-context
- **Cancel** — שמירת התוכנית לקובץ לשימוש מאוחר יותר
