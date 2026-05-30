---
title: "וורקפלואו דינמי — תזמור סוכנים בקנה מידה"
category: workflows
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/workflows
related: []
---

## וורקפלואו דינמי

וורקפלואו דינמי הוא סקריפט JavaScript שClaudeכותב עבור המשימה שתתאר. Runtime מריץ אותו ברקע, בזמן שה-session שלך נשאר פנוי. השתמש בו כשמשימה דורשת יותר סוכנים ממה שchat אחד יכול לתאם, או כשאתה רוצה שהתזמור עצמו יהיה קוד שניתן לקרוא ולהריץ מחדש.

דורש Claude Code v2.1.154 ומעלה. זמין בכל plan בתשלום.

---

## מתי להשתמש — השוואה

| | Subagents | Skills | Workflows |
|:--|:--|:--|:--|
| מה זה | עובד שClaudeמפעיל | הנחיות שClaudeעוקב אחריהן | סקריפט שה-runtime מריץ |
| מי מחליט מה מריצים | Claude, תור אחרי תור | Claude, לפי ה-prompt | הסקריפט |
| תוצאות ביניים | context window של Claude | context window של Claude | משתני הסקריפט |
| קנה מידה | מספר משימות לתור | כמו subagents | עשרות עד מאות סוכנים לריצה |
| ניתן לחזרה | הגדרת העובד | ההנחיות | התזמור עצמו |
| הפרעה | מחדש את התור | מחדש את התור | ניתן לחידוש באותו session |

Workflow מעביר את התוכנית לתוך קוד — הלולאה, ההסתעפות והתוצאות נמצאות בסקריפט, לא ב-context של Claude. זה גם מאפשר לסוכנים לבדוק זה את עבודתו של זה לפני דיווח.

---

## הרצת workflow מובנה — /deep-research

`/deep-research` הוא ה-workflow המובנה של Claude Code. הוא מפזר חיפושי רשת ממגוון זוויות, מביא את המקורות שמוצא, מצליב אותם ומחזיר דוח עם ציטוטים.

```text
/deep-research What changed in the Node.js permission model between v20 and v22?
```

לאחר אישור, הריצה מתחילה ברקע. הפעל `/workflows` בכל עת כדי לפתוח את תצוגת ההתקדמות:

```text
/workflows
```

התצוגה מראה כל שלב עם מספר הסוכנים, סך ה-tokens והזמן שחלף. כשהריצה מסתיימת, הדוח מגיע ל-session.

---

## כתיבת workflow מותאם

תאר את המשימה ובקש מ-Claude לכתוב workflow:

```text
Write a workflow that audits every TypeScript file for missing return types
and opens a PR with fixes
```

Claude כותב את הסקריפט, ניתן לסקור אותו לפני הרצה. Workflows שמורים הופכים לפקודות `/` ומופיעים ב-autocomplete לצד הפקודות המובנות.

---

## ניהול ריצות

`/workflows` מציג ריצות פעילות ושהושלמו. לאחר בחירת ריצה ניתן לנווט בין שלבים, לקדוח לפרטי כל שלב ולבטל ריצה פעילה. פס התקדמות מופיע גם מתחת לsbox הקלט בזמן שריצה מתנהלת.
