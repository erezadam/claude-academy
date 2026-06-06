---
title: "Desktop Scheduled Tasks — משימות מתוזמנות ב-Claude Code Desktop"
category: scheduling
layer: basic
last_verified: 2026-06-06
status: needs-review
source_url: https://code.claude.com/docs/en/desktop-scheduled-tasks
related: ["routines", "scheduled-tasks", "slash-loop"]
---

משימות מתוזמנות של Desktop מפעילות Claude אוטומטית בתדירות קבועה על המכונה המקומית שלכם — לבדיקות קוד יומיות, ביקורת תלויות, או עדכוני בוקר.

## מה זה עושה / למה זה שימושי

משימה מקומית (Desktop) שונה מ-Routine שרצה בענן:

| | ענן (Routines) | Desktop | `/loop` |
| :--- | :--- | :--- | :--- |
| רץ על | תשתית Anthropic | המכונה שלכם | המכונה שלכם |
| דורש מחשב פעיל | לא | כן | כן |
| דורש סשן פתוח | לא | לא | כן |
| גישה לקבצים מקומיים | לא (clone טרי) | כן | כן |
| מרווח מינימלי | שעה | דקה | דקה |

השתמשו ב-Desktop כאשר המשימה צריכה גישה לקבצים מקומיים. השתמשו ב-Routines לעבודה שצריכה לרוץ גם כשהמחשב כבוי.

## איך משתמשים

### יצירת משימה

לחצו **Routines** בסרגל הצד → **New routine** → **Local**. מלאו את השדות:

| שדה | תיאור |
| :--- | :--- |
| Name | מזהה המשימה (הופך ל-kebab-case ומשמש כשם תיקייה) |
| Description | תקציר קצר |
| Instructions | מה Claude יבצע בכל ריצה |
| Schedule | תדירות הריצה |

תיקייה (folder) חובה לפני שמירה. אם עוד לא אמרתם ל-Desktop לסמוך על התיקייה, תופיע בקשת אמון.

ניתן גם ליצור משימה בשפה טבעית בתוך כל סשן: "set up a daily code review that runs every morning at 9am".

### אפשרויות תזמון

- **Manual**: רק בלחיצה על "Run now"
- **Hourly**: כל שעה
- **Daily**: שעה קבועה (ברירת מחדל: 9:00)
- **Weekdays**: ימי עסקים בלבד
- **Weekly**: יום ושעה קבועים

לתזמון מותאם (כל 15 דקות, פעם בחודש, פעם אחת בשעה מסוימת), בקשו מ-Claude בשיחה: "schedule a task to run all tests every 6 hours".

### ניהול משימות

מדף הפרטים של כל משימה ניתן:

- **Run now**: הפעלה מיידית בלי לחכות לתזמון
- **Status**: שינוי בין Active ל-Paused
- **Edit**: עריכת הגדרות
- **Review history**: היסטוריית ריצות, כולל ריצות שדולגו עם הסבר הדילוג
- **Review allowed permissions**: צפייה ושלילת אישורי כלים שנשמרו
- **Delete**: מחיקת המשימה ואיפוס כל הסשנים שיצרה

### הרשאות

לכל משימה מצב הרשאות משלה. לחצו **Run now** לאחר יצירה, צפו בבקשות הרשאה, ובחרו "always allow" לכל כלי — ריצות עתידיות יאשרו אוטומטית.

### עריכת ה-prompt ישירות מהדיסק

```text
~/.claude/scheduled-tasks/<task-name>/SKILL.md
```

שינויים בקובץ זה נכנסים לתוקף בריצה הבאה. לוח הזמנים, תיקייה, מודל ומצב פעיל/כבוי אינם בקובץ זה — שנו אותם דרך טופס Edit.
