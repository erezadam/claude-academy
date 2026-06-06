---
title: "Ultrareview — סקירת קוד עמוקה רב-סוכנית בענן"
category: guides
layer: intermediate
last_verified: 2026-06-06
status: needs-review
source_url: https://code.claude.com/docs/en/ultrareview
related: ["slash-code-review", "sub-agents", "dynamic-workflows"]
---

`/code-review ultra` מפעיל סקירת קוד עמוקה בתשתית ענן: צי של סוכני-סקירה מקבילים מחפשים ומאמתים באגים לפני שממזגים.

## מה זה עושה / למה זה שימושי

בניגוד לסקירה מקומית (`/review`), ultrareview מציע:

- **אות גבוה יותר**: כל ממצא נבדק ומאומת באופן עצמאי — התוצאות מתמקדות בבאגים אמיתיים ולא בהצעות סגנון
- **כיסוי רחב יותר**: סוכנים רבים חוקרים את השינוי במקביל, מה שמגלה בעיות שסריקה יחידה מפספסת
- **ללא שימוש במשאבים מקומיים**: הסקירה רצה ב-sandbox מרוחק, הטרמינל שלכם פנוי לעבודה אחרת

## השוואה בין גישות

| | `/review` | `/code-review ultra` |
| :--- | :--- | :--- |
| רץ | מקומית בסשן | מרחוק בענן |
| עומק | סריקה חד-פעמית | צי רב-סוכני עם אימות עצמאי |
| משך | שניות עד דקות | 5–10 דקות |
| עלות | שימוש רגיל | ריצות חינמיות, לאחר מכן ~$5–$20 |
| הכי מתאים | משוב מהיר בזמן פיתוח | ביטחון לפני merge |

## איך משתמשים

### הרצה בסיסית

```text
/code-review ultra
```

ללא ארגומנטים, סוקר את ה-diff בין הענף הנוכחי לענף ברירת המחדל, כולל שינויים לא-committed.

### סקירת Pull Request

```text
/code-review ultra 1234
```

ב-PR mode, ה-sandbox משכפל את ה-PR ישירות מ-GitHub. עובד עם `github.com` ועם GitHub Enterprise Server.

אם ה-repository גדול מדי לחבילה מקומית, Claude Code ייתן הנחיה לעבור ל-PR mode: פתחו draft PR ורוצו `/code-review ultra <PR-number>`.

### מעקב אחר סקירה פעילה

```text
/tasks
```

מציג סקירות פועלות ומושלמות. הסקירה רצה כ-background task — ניתן להמשיך לעבוד ולקבל התראה בסיום (כ-5–10 דקות).

### הרצה לא-אינטראקטיבית (CI / scripts)

```bash
claude ultrareview
claude ultrareview 1234
claude ultrareview origin/main
```

ממתין לסיום הסקירה, מדפיס ממצאים ל-stdout, יוצא עם קוד 0 בהצלחה או 1 בכשל.

| דגל | תיאור |
| :--- | :--- |
| `--json` | פלט JSON גולמי במקום ממצאים מפורמטים |
| `--timeout <minutes>` | זמן המתנה מקסימלי (ברירת מחדל: 30 דקות) |

## תמחור ורצות חינמיות

| תוכנית | ריצות חינמיות | לאחר מכן |
| :--- | :--- | :--- |
| Pro | 3 ריצות | usage credits |
| Max | 3 ריצות | usage credits |
| Team / Enterprise | אין | usage credits |

3 הריצות החינמיות הן הקצבה חד-פעמית ואינן מתחדשות. ריצה שנעצרה מוקדם או שנכשלה עדיין נספרת.

---

**דרישות**: אימות עם חשבון Claude.ai (לא ניתן להשתמש עם API key בלבד). לא זמין עם Amazon Bedrock, Google Vertex AI, Microsoft Foundry, או ארגונים עם Zero Data Retention.
