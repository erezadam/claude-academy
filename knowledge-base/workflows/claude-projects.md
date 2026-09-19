---
title: "Projects — ניהול עבודה מתמשכת עם Claude"
category: workflows
last_verified: 2026-09-19
status: needs-review
source_url: https://code.claude.com/docs/en/claude-projects
related: ["parallel-agents", "routines", "agent-teams", "dynamic-workflows"]
mission: automate
level: advanced
type: guide
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-09-19T12:00:00+03:00"
pathOrder: 9
---

Project הוא שיחה מתמשכת אחת שבה Claude מתאם זרם של עבודה קשורה עבורכם. אתם שולחים משימות לשיחה; Claude פותח **thread** לכל משימה. כל thread הוא [סשן ענן](/docs/en/claude-code-on-the-web) שרץ ברקע ומסתיים אפילו לאחר שסגרתם את המחשב.

Projects נמצאים בבטא ציבורית ב-Pro ו-Max. גישה לאתר: [claude.ai/code](https://claude.ai/code).

## מה זה עושה / למה זה שימושי

בלי Project, כאשר מריצים כמה סשנים במקביל, אתם עושים את התיאום בעצמכם: מחליטים מה כל סשן עובד עליו, חוזרים על אותו רקע בפתיחת כל סשן, ובודקים מה סיים או צריך תשובה. עם Project, במקום זאת:

- שולחים עבודה למקום אחד — באג, stack trace, או רשימת משימות — וClaude פותח thread לכל פריט
- מגדירים הקשר פעם אחת — כל thread חדש מתחיל עם repositories, הוראות וזיכרון של הפרויקט
- מסתלקים ומוצאים עבודה שהושלמה — ה-**Overview** מראה אילו threads סיימו, אילו PR מוכנים לסקירה, ואילו thread מחכים לתשובתכם

### מתי כדאי להשתמש ב-Project

Project שווה ליצור כאשר העבודה מצדיקה:

- **מטרה אחת על פני repositories רבים** — למשל: "הבא את כל השירותים לתצורת ה-lint החדשה"
- **אזור שממשיכים להזין אליו** — באגים, stack traces ובקשות סקירה לשירות אחד, שנשלחים לאורך זמן
- **בנייה או מיגרציה גדולה מסשן אחד** — spec.md שמתפרס ל-threads שכל אחד לוקח חלק

Project **פחות מתאים** כאשר:

- משימה בודדת שמתאימה לסשן אחד — עדיף סשן ענן ישיר
- עבודה שצריכה כלים שנמצאים רק במחשב המקומי (DB מקומי, VPN פנימי) — עדיף agent view

## כיצד מאורגן Project

| רכיב | תפקיד |
| :--- | :--- |
| **שיחת הפרויקט** | סשן תיאום אחד ארוך-טווח. מקבל את מה שאתם שולחים ומחליט מה הופך ל-thread |
| **Threads** | עובדים. כל thread הוא סשן ענן נפרד עם context window משלו |
| **Overview pane** | מציג כל threads בו-זמנית, מה מחכה לכם, ואילו PR נפתחו |
| **Library tab** | קבצים שהוספתם וקבצים שהthreads הפיקו |

כל thread מתחיל עם: repositories וקבצים של הפרויקט, ה-CLAUDE.md, skills, plugins בכל repository, ו-cloud environment שמגדיר גישת רשת ומשתני סביבה.

## איך משתמשים

**יצירת Project חדש:**

```text
claude.ai/code → Projects (סרגל צד) → New project
```

שם הפרויקט הוא שדה חובה. Goal ורשימת repositories — אופציונלי בהתחלה, ניתן להוסיף מאוחר יותר תחת **Project settings > Environment**.

**שליחת עבודה:**

פשוט הדבקו תיאור משימה, באג, או stack trace לשיחת הפרויקט. Claude מחליט מה הופך ל-thread ומה נענה במקום.

**מעקב אחרי threads:**

```text
Overview pane → Waiting on you
```

כאן מוצגים threads שצריכים תשובתכם. Threads שסיימו מופיעים כ-PR מוכנים לסקירה תחת **Pull requests**.

## דרישות מוקדמות

לפני יצירת Project, ודאו:

- אתם על תוכנית Pro או Max ו-**Projects** מופיע בסרגל הצד
- אם Project עובד על קוד: הקוד נמצא ב-github.com (לא GHES, GitLab או Bitbucket), וה-Claude GitHub App מותקן על ה-repositories הרלוונטיים

---

Projects משתמשים במגבלות התוכנית שלכם — אותן מגבלות כמו שאר הסשנים, אך thread מרובים מנצלים אותן מהר יותר.
