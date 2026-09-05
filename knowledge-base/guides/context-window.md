---
title: "חלון ההקשר של Claude Code — מה נטען ומתי"
category: guides
last_verified: 2026-09-05
status: needs-review
source_url: https://code.claude.com/docs/en/context-window
related: [memory, prompt-caching, how-claude-code-works, slash-context-cost]
mission: daily
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 3
published: "2026-09-05T12:00:00+03:00"
pathOrder: 29
---

חלון ההקשר הוא המידע שקיים בזיכרון של Claude בכל רגע נתון בשיחה. הבנת מה נטען, מתי ובכמה טוקנים — עוזרת לנהל שיחות ארוכות ביעילות ולהבין מדוע `/compact` לפעמים הכרחי.

## מה נטען אוטומטית בתחילת כל שיחה

Claude Code טוען כמה שכבות של מידע לפני שמגיעה ההודעה הראשונה שלכם:

| מרכיב | טוקנים | פרטים |
| :--- | :--- | :--- |
| System prompt | ~4,200 | הוראות ליבה להתנהגות וכלים — אתם לא רואים אותו |
| Auto memory (MEMORY.md) | ~680 | רשימות שקלוד כתב לעצמו: פקודות בנייה, דפוסים שזיהה. עד 200 שורות או 25KB |
| Environment info | ~280 | תיקיית עבודה, פלטפורמה, מעטפת, גרסת OS וסטטוס git |
| MCP tools (deferred) | ~120 | שמות הכלים בלבד — הסכמות המלאות נטענות לפי דרישה |
| Skill descriptions | ~450 | שורת תיאור לכל skill — הגוף המלא נטען רק בשימוש |
| ~/.claude/CLAUDE.md | ~320 | ההעדפות הגלובליות שלכם לכל הפרויקטים |
| Project CLAUDE.md | ~1,800 | קונבנציות הפרויקט — הקובץ החשוב ביותר ליצור |

סך ה-startup הוא כ-7,850 טוקנים מתוך חלון של 200K.

## מה מגדיל את ההקשר בזמן שיחה

**קריאות קבצים** הן הצרכן הגדול ביותר. כל `Read` מוסיף את תוכן הקובץ המלא — קובץ בגודל בינוני יכול להוסיף 2,000-3,000 טוקנים. קלוד מראה "Read auth.ts" בטרמינל, אבל תוכן הקובץ נמצא רק אצלו.

**Rules (קבצי `.claude/rules/`)** נטענים אוטומטית כשקלוד קורא קובץ שנמצא בתוך ה-`paths:` שהגדרתם ב-rule.

**Skills**: כשקלוד משתמש ב-skill, הגוף המלא שלו נטען לתוך ההקשר. Skills עם `disable-model-invocation: true` נשארים מחוץ להקשר לחלוטין עד שאתם מפעילים אותם ידנית.

## ניהול הקשר מלא — `/compact`

כשההקשר מתמלא, Claude Code מדחס אותו אוטומטית עם `/compact`. ניתן להפעיל ידנית:

```text
/compact
```

לאחר `/compact`, רוב תוכן ה-startup נטען מחדש (CLAUDE.md, environment וכד'). אולם **רשימת ה-skills לא נטענת מחדש** — רק ה-skills שנעשה בהם שימוש בפועל נשמרים.

כדי לבדוק את מצב ההקשר:

```text
/context
```

השורה "Skills" מראה את גודל הרשימה **אחרי** החלת ה-budget, כפי שהמודל באמת מקבל.

## טיפים לניהול הקשר

הרבו לקרוא קבצים עם פרומפטים ספציפיים ("תקן את הבאג ב-auth.ts") כדי ש-Claude יקרא פחות קבצים. למשימות מחקריות כבדות — האצילו ל-subagent שיחזור רק עם הממצאים:

```text
use a subagent to investigate how our auth system handles token refresh
```

שמרו על CLAUDE.md מתחת ל-200 שורות. העבירו תוכן עזר ארוך ל-skills — הם נטענים רק בשימוש.
