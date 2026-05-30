# משימה: עדכון שבועי של claude-academy

אתה סוכן שמתחזק אתר תוכן בעברית (RTL) על Claude Code. בצע את כל השלבים למטה ופתח PR. אל תכתוב ל-main.

## כללי ברזל
- אל תמציא תוכן. כתוב אך ורק מה שמופיע במקור הרשמי. אין מקור אמין -> אין מאמר.
- scope: קטגוריות claude-code, scheduling, workflows, guides, project-docs. אל תיגע ב-git.
- אל תיצור קטגוריה חדשה לבד — רק המלץ בדוח.
- markdown נתמך בלבד: h2, h3, פסקאות, code inline/block, טבלה, hr, inline. אסור: רשימות מקוננות, blockquote, תמונות, h1/h4. אם פריט דורש מבנה לא נתמך — סמן בדוח כ"דורש עיצוב ידני", אל תכתוב markdown שבור.

## שלב 1 — איסוף מקורות (דרך Bash/curl)
curl -s https://code.claude.com/docs/llms.txt
curl -s https://code.claude.com/docs/en/changelog.md
curl -s https://code.claude.com/docs/en/whats-new.md   # אופציונלי

## שלב 2 — בניית אינדקס dedup מקומי
- קרא כל קובץ .md תחת knowledge-base/ ; חלץ source_url ו-last_verified מה-frontmatter.
- נרמל כל source_url: הסר סיומת .md, מקטע /en/, סלאש סופי ומרכאות.
- בנה מפה: normalized_url -> { slug, category, last_verified }.

## שלב 3 — סיווג מול האינדקס
- NEW: לא קיים באינדקס.
- CHANGED: קיים, אבל המקור עודכן / הגרסה חדשה מ-last_verified.
- UNCHANGED: דלג.
שמור רק NEW/CHANGED בתוך ה-scope (לא git).

## שלב 4 — מיפוי קטגוריה (עצור בהתאמה ראשונה)
1. אוטומציה מבוססת-זמן (/loop, /schedule, Routines, cron) -> scheduling
2. דפוס עבודה / תהליך רב-שלבי -> workflows
3. prompt/תבנית לתיעוד פרויקט -> project-docs
4. מדריך עומק רב-מושגי -> guides
5. ברירת מחדל (פקודה/דגל/יכולת) -> claude-code

## שלב 5 — כתיבת קבצים
לכל פריט NEW צור knowledge-base/<category>/<slug>.md עם frontmatter:
---
title: "<כותרת בעברית>"
category: <category>
layer: <basic|intermediate>
last_verified: <תאריך היום YYYY-MM-DD>
status: needs-review
source_url: <ה-URL המלא והאמיתי מהמקור>
related: []
---
<גוף בעברית, markdown נתמך בלבד, מבוסס אך ורק על המקור>

לכל פריט CHANGED: עדכן את הקובץ הקיים, עדכן last_verified להיום, status: needs-review.

## שלב 6 — אימות
npm run build
אם נכשל בגלל קובץ שכתבת — תקן או מחק וציין בדוח. אל תמשיך עם build שבור.

## שלב 7 — PR + דוח
- ענף: academy-update/YYYY-MM-DD ; commit + push.
- gh pr create. גוף ה-PR = דוח בשני חלקים:
  ### נוסף / עודכן  (טבלה: כותרת | קטגוריה | layer | NEW/CHANGED | קישור למקור)
  ### המלצות קטגוריה (דורש החלטה)  — אם יש, אחרת "אין".
- אם אין NEW/CHANGED בכלל: אל תפתח PR; כתוב שאין עדכונים השבוע.
