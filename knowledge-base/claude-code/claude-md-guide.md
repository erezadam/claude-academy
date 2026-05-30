---
title: "שיטות עבודה מומלצות עם Claude Code"
category: claude-code
layer: basic
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/best-practices
related: [/init, /memory, slash-commands-all]
---

## שיטות עבודה מומלצות עם Claude Code

Claude Code הוא סביבת קידוד אג'נטית — הוא קורא קבצים, מריץ פקודות, עושה שינויים ועובד עצמאית על בעיות. זה משנה את אופן העבודה: במקום לכתוב קוד בעצמך ולבקש review, אתה מתאר מה אתה רוצה ו-Claude מגלה כיצד לבנות אותו.

משאב מפתח לניהול: **context window** — הוא מתמלא מהר, וביצועים יורדים ככל שמתמלא. כל קריאת קובץ, כל פקודה, כל תשובה — הכל נכנס לcontext.

---

## תן ל-Claude דרך לאמת את עבודתו

תן ל-Claude בדיקה שהוא יכול להריץ: tests, build, screenshot להשוואה. זה ההבדל בין session שאתה צופה בו לsession שאתה הולך ממנו.

בלי בדיקה, "נראה שסיימתי" הוא האות היחיד הזמין. עם בדיקה, הלולאה נסגרת לבד: Claude עושה את העבודה, מריץ את הבדיקה, קורא את התוצאה ומבצע iteration.

| אסטרטגיה | לפני | אחרי |
|:--|:--|:--|
| קריטריון אימות | "implement email validation" | "write validateEmail. run tests after implementing" |
| אימות UI | "make dashboard look better" | "[screenshot] implement this design. screenshot result and compare" |
| שורש בעיה | "the build is failing" | "build fails with [error]. fix it, verify build succeeds, address root cause" |

**אפשרויות עצמת סגירה:**
- **בprompt אחד:** בקש מ-Claude להריץ ולבצע iteration באותו הודעה
- **עם `/goal`:** evaluator נפרד בודק מחדש לאחר כל תור
- **Stop hook:** סקריפט חוסם את סיום התור עד שהבדיקה עוברת
- **Verification subagent:** מודל חדש מנסה להפריך את התוצאה

---

## חקור קודם, אז תכנן, אז קדד

הסתעפות ישירה לקידוד יכולה לייצר קוד שפותר את הבעיה הלא נכונה. השתמש ב-plan mode להפריד חקירה מביצוע.

**ארבעת שלבי העבודה המומלצים:**

**1 — חקור:** היכנס ל-plan mode. Claude קורא קבצים ועונה על שאלות ללא שינויים.

```text
read /src/auth and understand how we handle sessions and login.
```

**2 — תכנן:** בקש מ-Claude לצור תוכנית יישום מפורטת. לחץ `Ctrl+G` לפתיחת התוכנית בעורך לעריכה ישירה לפני שClaude ממשיך.

**3 — יישם:** צא מplan mode ותן ל-Claude לקדד, תוך אימות מול התוכנית שלו.

**4 — commit:** בקש מ-Claude לעשות commit עם הודעה תיאורית ולפתוח PR.

---

## CLAUDE.md — הזיכרון הקבוע

Claude Code לא זוכר כלום בין sessions. `CLAUDE.md` הוא קובץ Markdown שClaudeקורא אוטומטית בתחילת כל session.

```
~/.claude/CLAUDE.md           ← גלובלי — כל הפרויקטים
./CLAUDE.md                   ← פרויקט — נטען אוטומטית
./.claude/CLAUDE.local.md     ← אישי — ב-.gitignore
```

**כלל הזהב:** שאל כל שורה — "האם הסרת שורה זו תגרום ל-Claude לטעות?" שמור רק מה שהתשובה עליו חיובית. **יעד: מתחת ל-100 שורות.**

CLAUDE.md מנופח (500+ שורות) גורם ל-Claude Code להכניס system-reminder שClaudeמתעלם ממנו. פחות = יותר.

---

## בקש ראיות, לא הצהרות

בקש מ-Claude להציג ראיות ולא לטעון הצלחה: פלט ה-tests, הפקודה שהריץ ומה היא החזירה, screenshot של התוצאה. סקירת ראיות מהירה יותר מהפעלה חוזרת של האימות.

