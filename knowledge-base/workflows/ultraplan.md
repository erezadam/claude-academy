---
title: "Ultraplan — תכנון בענן ועריכה שיתופית"
published: "2026-06-14T18:27:18+03:00"
body_changed_at: "2026-08-08T12:00:00+03:00"
category: workflows
layer: intermediate
last_verified: 2026-08-08
status: needs-review
source_url: https://code.claude.com/docs/en/ultraplan
related: ["dynamic-workflows", "agent-view", "worktrees"]
mission: advanced
pathOrder: 4
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 2
---

**הוסר בגרסה 2.1.222 (אוגוסט 2026).** Anthropic הסירה את תצוגה המקדימה המחקרית של Ultraplan. לתכנון, השתמשו ב-[plan mode](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode) מקומית, או ב-[Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web) לסשן ענן.

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

**מעקב אחר התקדמות** — ניתן היה לעקוב דרך רשימת ה-tasks הפנימית של Claude Code (הוסר בגרסה 2.1.222).

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
