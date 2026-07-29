# משימה: עדכון שבועי של claude-academy

אתה סוכן שמתחזק אתר תוכן בעברית (RTL) על Claude Code. בצע את כל השלבים למטה ופתח PR. אל תכתוב ל-main.

## כללי ברזל
- אל תמציא תוכן. כתוב אך ורק מה שמופיע במקור הרשמי. אין מקור אמין -> אין מאמר.
- scope: קטגוריות claude-code, scheduling, workflows, guides, project-docs. אל תיגע ב-git.
- אל תיצור קטגוריה חדשה לבד — רק המלץ בדוח.
- markdown נתמך בלבד: h2, h3, פסקאות, code inline/block, טבלה, hr, inline. אסור: רשימות מקוננות, blockquote, תמונות, h1/h4. אם פריט דורש מבנה לא נתמך — סמן בדוח כ"דורש עיצוב ידני", אל תכתוב markdown שבור.
- data/changelog.json הוא חלק מהפלט החובה של כל סריקה עם שינויים — עדכן אותו בכל ריצה שמייצרת פריטי NEW/CHANGED.

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

### 5.0 בדיקת ייחודיות slug (חובה, לפני כל כתיבה)
הכתובות שטוחות (/a/<slug>) — slug כפול הוא התנגשות אמיתית. לפני יצירת קובץ:
`ls knowledge-base/*/*.md | xargs -n1 basename | sort | uniq -d` + ודא שה-slug החדש לא קיים באף תיקייה. התנגשות = עצור, דווח בגוף ה-PR, אל תשנה שם קיים לבד.

לכל פריט NEW צור knowledge-base/<category>/<slug>.md עם frontmatter מלא של מודל התוכן:
---
title: "<כותרת בעברית>"
category: <category>
last_verified: <תאריך היום YYYY-MM-DD>
status: needs-review
source_url: <ה-URL המלא והאמיתי מהמקור — host מה-allowlist של scripts/verify-sources.mjs בלבד>
related: []
mission: <ר' 5.1>
level: <ר' 5.2>
type: <guide|reference|recipe — ר' 5.3>
tool: <claude-code|git|both>
origin: official
timeMinutes: <מספר מילים בגוף ÷ 180, מעוגל, מינימום 2>
pathOrder: <ר' 5.4 — רק אם type אינו reference>
---

**אסור בהחלט לכתוב last_reviewed.** השדה ידני ומשמעותו "אדם קרא ואימת טענות"; מאמר אוטומטי נולד בלעדיו, מוצג באתר עם "נוצר אוטומטית — טרם נסקר", ונכנס לתור ההתיישנות. חתימה אוטומטית שלו שוברת את מנגנון הביקורת.

### 5.1 mission — לפי כוונת המאמר, לעולם לא לפי תיקייה
start = למי שמעולם לא השתמש (התקנה, ריצה ראשונה) · daily = עבודה שוטפת בסשן · code = עבודה על קוד וחזרה אחורה (git, review, checkpoints) · automate = בלי אדם בלולאה (hooks, תזמון, headless, CI) · spec = ידע ותיעוד פרויקט (CLAUDE.md, זיכרון) · advanced = הרחבת הפלטפורמה (sub-agents, MCP, skills, plugins, sandbox).

### 5.2 level — הרובריקה היחסית
beginner = אפשר לקרוא מיד אחרי מסלול /start, בלי שום מושג נוסף · intermediate = דורש ניסיון עם הכלי או מושג נוסף אחד (branches, JSON config, cron, hooks) · advanced = דורש הבנת מנגנון פנימי או מערכת שנייה שלמה.

### 5.3 type
reference = כרטיס פקודה/טבלה לשליפה (בלי mission ובלי pathOrder — שייך לטבלת הפקודות) · recipe = צעד-אחר-צעד לתרחיש · guide = הסבר מושגי.

### 5.4 pathOrder — שיבוץ בשרשרת
מאמר לימוד חדש נכנס בסוף המשימה שלו: מצא את ה-pathOrder הגבוה במשימה (grep על קבצים עם אותו mission) וקבע max+1. next מחושב ב-build מ-mission+pathOrder — אין שום קובץ אחר לעדכן.

### 5.5 כללים עריכתיים מחייבים
- פקודה שהוסרה מהמוצר אינה נמחקת מהמאמר — היא מקבלת תווית "הוסרה בגרסה X" והפניה לדרך הנוכחית.
- פקודות-דוגמה של המחבר (skills מותאמים) מופרדות חזותית מפקודות מובנות: טקסט מודגש עם "(דוגמה)", לא code, לעולם לא באותה טבלה בלי סימון.
- פקודה שנעלמה מהתיעוד בלי אזכור הסרה ב-changelog: כתוב "לא מופיע בתיעוד הנוכחי (נבדק ב-<תאריך>)" — אל תמכור ודאות שאין לך.
<גוף בעברית, markdown נתמך בלבד, מבוסס אך ורק על המקור>

### מבנה גוף המאמר (חובה — markdown נתמך בלבד: h2, h3, פסקאות, code block, טבלה, hr, inline; בלי רשימות מקוננות, blockquote, תמונות, h1/h4)
- **פסקת פתיחה:** משפט-שניים שמסבירים בקצרה מה הפקודה/היכולת.
- **## מה זה עושה / למה זה שימושי** — ההקשר והערך, מבוסס על המקור.
- **## איך משתמשים** — חובה לפחות בלוק קוד אחד עם דוגמה אמיתית מהמקור.
- **סעיפי ## נוספים לפי הצורך** (דגלים / אפשרויות / מיקומים / טבלאות) — רק אם המקור מספק את המידע.
- **`related` ב-frontmatter** — מלא בפקודות/מאמרים קשורים (slugs או שמות פקודות), אל תשאיר ריק אם יש קשרים ברורים.

לכל פריט CHANGED: עדכן את הקובץ הקיים, עדכן last_verified להיום, status: needs-review. אל תיגע ב-last_reviewed, ב-mission, ב-pathOrder או ב-origin של קובץ קיים.

## שלב 6 — אימות
npm run build
אם נכשל בגלל קובץ שכתבת — תקן או מחק וציין בדוח. אל תמשיך עם build שבור.

## שלב 6.5 — אימות תוכן מול המקור (חובה — מונע הזיות)
build ירוק מוכיח שה-markdown מתקמפל, לא שהתוכן נכון. לכל פריט NEW/CHANGED שכתבת,
לפני פתיחת ה-PR: עבור על כל פקודה, דגל, מפתח-הגדרה וטענה במאמר — וודא שכל אחד מהם
מופיע במפורש ב-source_url (או בעמוד רשמי אחר תחת code.claude.com/docs). אם טענה
אינה ניתנת לאימות במקור רשמי — היא הזיה: הסר או תקן אותה לפי המקור. שגיאות נפוצות
לחפש: מפתח-הגדרה שלא קיים, דגל מומצא, פורמט JSON שגוי בדוגמה, סמנטיקה שגויה
(למשל קודי-יציאה). אל תפרסם טענה שלא אישרת במקור.

## שלב: עדכון changelog.json
אחרי שנקבעו פריטי NEW/CHANGED (שלב 3), עדכן את `data/changelog.json`:
- בנה רשומה חדשה: `{ "date": "<תאריך הסריקה YYYY-MM-DD>", "summary": "<משפט עברי קצר: כמה פריטים וממה>", "items": [...] }`.
- כל item: `{ "title", "category", "slug", "type" }` — `type` = `"new"` לפריט NEW, `"changed"` לפריט CHANGED.
- כלל קריטי: כלול ב-items רק פריטים שה-status שלהם `needs-review` (אלה תוצרי הסריקה האמיתית). אל תכלול פריטים עם `status: current` — אלה backfill/refactor שחולקים תאריך אבל אינם עדכון תוכן. (תאריך לבד תופס יותר מדי; תאריך + needs-review מדויק.)
- `slug` הוא שם הקובץ בלבד, בלי סיומת `.md` ובלי נתיב.
- הוסף את הרשומה בראש המערך `entries` (החדש למעלה).
- שמור עד 12 רשומות; גזום ישנות מזה.
- אם אין פריטים מתאימים — אל תוסיף רשומה כלל.
- ודא תקינות JSON: `jq . data/changelog.json`.

## שלב 7 — PR + דוח
- ענף: academy-update/YYYY-MM-DD ; commit + push.
- gh pr create. גוף ה-PR = דוח בשני חלקים:
  ### נוסף / עודכן  (טבלה: כותרת | קטגוריה | layer | NEW/CHANGED | קישור למקור)
  ### המלצות קטגוריה (דורש החלטה)  — אם יש, אחרת "אין".
- אם אין NEW/CHANGED בכלל: אל תפתח PR; כתוב שאין עדכונים השבוע.
