---
name: architecture
description: מייצר או מרענן את ARCHITECTURE.md בשורש הריפו מתוך recon אמיתי של הקוד — מחליף את מנגנון codeatlas החיצוני. regeneration מלא של snapshot ארכיטקטוני בעברית, על ענף ייעודי עם PR. רענון ידני מכוון בלבד.
disable-model-invocation: true
---

# Architecture — יצירת ARCHITECTURE.md מ-recon של הקוד

אתה מייצר מחדש את `ARCHITECTURE.md` בשורש הריפו. זהו **regeneration מלא של snapshot, לא עריכה נקודתית** — ה-doc הוא צילום-מצב של הריפו ברגע ההרצה, ולכן אין ערך לשימור טקסט ישן: כל הרצה מפיקה את הקובץ כולו מחדש מתוך מה שנמצא בקוד עכשיו.

## שלב 1 — Recon (חובה לפני כתיבה)

כל ספירה, נתיב, ומספר-שורה בקובץ הסופי חייבים לנבוע מפלט פקודה אמיתי — לא מהערכה ולא מזיכרון. הרץ בפועל, בין השאר:

- `ls` / `find` על התיקיות המרכזיות: `app/`, `components/`, `lib/`, `data/`, `knowledge-base/`, `.claude/skills/`, `scripts/`, `.github/workflows/`, `public/`
- `wc -l` על קבצי מפתח (למשל `lib/knowledge.ts`, `lib/seo.ts`, `lib/admin.ts`, קבצי workflow)
- `grep -n` לאיתור נקודות כניסה, ייצוא פונקציות, ותלויות בין שכבות
- ספירת מאמרים ב-`knowledge-base/` לפי קטגוריה (`find knowledge-base -name '*.md' | wc -l` וכד')
- `cat package.json` לזיהוי stack, גרסאות, וסקריפטים
- קריאת `.github/workflows/*.yml` ו-`.claude/skills/*/SKILL.md` להבנת האוטומציות

אם נתון לא הופק מפקודה — אל תכתוב אותו.

## שלב 2 — כתיבת ARCHITECTURE.md

כתוב את הקובץ בשורש הריפו, **בעברית**, במבנה הבא:

1. **Header** — שורה ראשונה: `נוצר ע"י skill:architecture ב-<תאריך> · commit <hash>` (התאריך מ-`date +%Y-%m-%d`, ה-hash מ-`git rev-parse --short HEAD`).
2. **TL;DR** — פסקה קצרה: מה הפרויקט, מה הוא משרת, ומה מנוע התוכן שלו.
3. **Stack** — טבלה: שכבה / טכנולוגיה / גרסה (מ-`package.json`).
4. **מפת תיקיות** — עץ תיקיות עם הסבר שורה לכל תיקייה, כולל ספירות קבצים אמיתיות.
5. **נקודות כניסה** — routes של Next.js (`app/`), API routes, סקריפטים, ו-workflows.
6. **שכבות** — הפרדת אחריות: UI (components), דומיין (lib), תוכן (knowledge-base/data), אוטומציה (skills/workflows/scripts).
7. **זרימות נתונים** — כולל **חובה** את שתי זרימות התוכן:
   - **הזרימה הנכנסת (pull)**: triage → אישור אנושי → publish → PR של תוכן — פריטים שהמשתמש מזין ידנית.
   - **ה-pipeline השבועי (push)**: workflow שבועי אוטומטי → auto-merge על build ירוק → watchdog יומי.
   הסבר איך שתיהן נפגשות ב-`knowledge-base/` ומה ההבדל בבקרה האנושית ביניהן.
8. **גבולות ותלויות** — תלויות חיצוניות (GitHub Actions, מקורות תוכן מ-allowlist), וגבולות פנימיים בין שכבות.
9. **צמתים קריטיים (SPOF)** — נקודות כשל יחידות: למשל קבצי lib מרכזיים, ה-spec (`.claude/academy-update-spec.md`), ה-workflows.
10. **החלטות ארכיטקטוניות** — החלטות מרכזיות שנצפו בקוד והרציונל שלהן.
11. **פערים וסיכונים** — מה חסר, שברירי, או מסתמך על הנחות.

## שלב 3 — ענף ו-PR

1. צור ענף `docs/architecture-<YYYY-MM-DD>` מ-main עדכני.
2. commit של `ARCHITECTURE.md` בלבד — אסור לגעת בשום קובץ אחר.
3. דחוף ופתח PR עם תיאור קצר של מה הרענון כולל.
4. **עצור.** אין למזג, אין לגעת ב-main, אין להמשיך לפעולות נוספות. המיזוג הוא החלטה אנושית.

## איסורים

- אין להפעיל את הסקיל אוטונומית — הפעלה ידנית מכוונת בלבד.
- אין לערוך שום קובץ מלבד `ARCHITECTURE.md`.
- אין להעתיק נתונים מגרסה קודמת של הקובץ או ממסמכים חיצוניים (codeatlas) — הכל מה-recon הנוכחי בלבד.
