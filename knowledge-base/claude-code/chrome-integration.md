---
title: "אינטגרציית Chrome — אוטומציה של דפדפן מה-CLI (בטא)"
category: claude-code
layer: basic
last_verified: 2026-06-27
status: needs-review
source_url: https://code.claude.com/docs/en/chrome
related: [computer-use, skills, common-workflows]
---

Claude Code משתלב עם תוסף Chrome של Claude כדי לתת יכולות אוטומציה של דפדפן ישירות מה-CLI. בונים את הקוד, ואז בודקים ומאבחנים בדפדפן בלי להחליף הקשר.

## מה זה עושה / למה זה שימושי

עם Chrome מחובר, אפשר לשרשר פעולות דפדפן עם משימות קוד בזרימת עבודה אחת:

- **Debug בזמן אמת**: קריאת שגיאות console ומצב DOM ישירות, ואז תיקון הקוד שגרם להן
- **אימות עיצוב**: בניית UI ממוק Figma ואז פתיחתו בדפדפן לאימות
- **בדיקת web apps**: בדיקת validation טפסים, רגרסיות ויזואליות, או flows של משתמש
- **web apps עם אימות**: אינטראקציה עם Google Docs, Gmail, Notion, או כל app שמחוברים אליו
- **חילוץ נתונים**: שליפת מידע מובנה מעמודי אינטרנט ושמירתו מקומית
- **אוטומציה**: אוטומציה של מטלות דפדפן חוזרות כמו מילוי טפסים
- **הקלטת session**: הקלטת אינטראקציות דפדפן כ-GIF לתיעוד

## דרישות

- [Google Chrome](https://www.google.com/chrome/) או [Microsoft Edge](https://www.microsoft.com/edge)
- [תוסף Claude בChrome](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) גרסה 1.0.36 ומעלה
- Claude Code גרסה 2.0.73 ומעלה
- Plan ישיר של Anthropic (Pro, Max, Team, או Enterprise) — לא זמין דרך Amazon Bedrock, Google Cloud Vertex AI, או Microsoft Foundry

האינטגרציה אינה נתמכת על Brave, Arc, או דפדפני Chromium אחרים, ואינה נתמכת ב-WSL.

## איך משתמשים

### הפעלה

הפעל Claude Code עם הדגל `--chrome`:

```bash
claude --chrome
```

אפשר גם להפעיל Chrome מתוך session קיים:

```bash
/chrome
```

הרץ `/chrome` בכל עת לבדיקת מצב החיבור, ניהול הרשאות, או חיבור מחדש לתוסף.

### הפעלה כברירת מחדל

להימנע מהעברת `--chrome` בכל session, הרץ `/chrome` ובחר "Enabled by default".

שים לב: הפעלת Chrome כברירת מחדל מגדילה את צריכת context כיוון שכלי הדפדפן תמיד נטענים.

### דוגמאות שימוש

**בדיקת web app מקומי:**

```text
I just updated the login form validation. Can you open localhost:3000,
try submitting the form with invalid data, and check if the error
messages appear correctly?
```

**Debug עם console logs:**

```text
Open the dashboard page and check the console for any errors when
the page loads.
```

**חילוץ נתונים:**

```text
Go to the product listings page and extract the name, price, and
availability for each item. Save the results as a CSV file.
```

**הקלטת GIF:**

```text
Record a GIF showing how to complete the checkout flow, from adding
an item to the cart through to the confirmation page.
```

## פתרון בעיות נפוצות

| שגיאה | סיבה | פתרון |
| :----- | :---- | :----- |
| "Browser extension is not connected" | native messaging host לא מוצא את התוסף | הפעל מחדש Chrome ו-Claude Code, הרץ `/chrome` לחיבור מחדש |
| "Extension not detected" | התוסף לא מותקן או מושבת | התקן או הפעל את התוסף ב-`chrome://extensions` |
| "No tab available" | Claude ניסה לפעול לפני שה-tab מוכן | בקש מ-Claude לפתוח tab חדש ולנסות שוב |
| "Receiving end does not exist" | service worker של התוסף הלך ל-idle | הרץ `/chrome` ובחר "Reconnect extension" |

אם ה-extension לא זוהה בפעם הראשונה — הפעל מחדש את Chrome כדי שיקרא את קובץ native messaging host החדש.
