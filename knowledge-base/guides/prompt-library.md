---
title: "ספריית פרומפטים — תבניות עבודה מוכחות עם Claude Code"
category: guides
last_verified: 2026-09-26
status: needs-review
source_url: https://code.claude.com/docs/en/prompt-library
related: [common-workflows, building-skills, memory, slash-code-review, claude-md-guide]
mission: daily
level: beginner
type: guide
tool: claude-code
origin: official
timeMinutes: 3
published: "2026-09-26T12:00:00+03:00"
pathOrder: 32
---

ספריית הפרומפטים הרשמית של Claude Code היא אוסף תבניות מוכנות לשימוש, ממוינות לפי שלב בתהליך הפיתוח (גילוי, תכנון, מימוש, בדיקה, אוטומציה) ולפי תפקיד (מפתח, PM, דיזיינר, מרקטינג).

## מה זה עושה / למה זה שימושי

הספרייה פתרה בעיה נפוצה: אנשים יודעים שClaude Code יכול לעזור, אבל לא בטוחים איך לנסח את הבקשה. הפרומפטים כאן מבוססים על דפוסים מוכחים מתיעוד Anthropic ומהצוותים שמשתמשים בכלי מדי יום.

## דפוסים שגורמים לפרומפט לעבוד

הפרומפטים בספרייה חולקים שישה דפוסים. הבנתם מאפשרת לעצב פרומפט חדש לכל משימה.

### תאר את התוצאה, לא את השלבים

אמור מה אתה רוצה ותן לClaude למצוא את הקבצים:

```text
add rate limiting to the public API and make sure existing tests still pass
```

### תן לו דרך לבדוק את עצמו

בקש run, test, compare או verify באותו פרומפט — Claude יחזור על הניסיון במקום לעצור אחרי ניסיון ראשון:

```text
write the migration, run it against the dev database, and confirm the schema matches
```

### הפנה למקור

ציין קובץ, טסט או דפוס קיים כנקודת ייחוס — הקוד החדש יישמר עקבי עם מה שכבר יש:

```text
add a settings page that follows the same layout as the profile page
```

### ציין יעד מדיד

כשהמטרה היא ביצועים או כיסוי, תן מטריקה וסף מדויק:

```text
get the bundle size under 200KB and show me what you removed
```

### תן לו את הארטיפקט

הדבק שגיאות, לוגים, screenshots וoutput ישירות בפרומפט, או הקלד `@` להפנייה לקובץ:

```text
why is the build failing? @build.log
```

### אמור איך אתה רוצה את התשובה

ציין פורמט, אורך או קהל יעד — התשובה תתאים לשימוש שתעשה בה:

```text
explain how the payment retry logic works as an HTML page with a diagram, then open it in my browser
```

## קטגוריות הפרומפטים

הספרייה מכסה את שלבי SDLC המרכזיים:

| שלב | קטגוריות לדוגמה |
|-----|-----------------|
| גילוי (Discover) | Onboard, Understand |
| תכנון (Design) | Plan, Prototype |
| מימוש (Build) | Implement |
| אימות (Validate) | Debug, Review, Commit |
| אוטומציה | Automate |

דוגמאות מהשלב הראשון:

```text
give me an overview of this codebase: architecture, key directories, and how the pieces connect
```

```text
what would break if I deleted {target}?
```

```text
plan how to refactor the {target} to {goal}. list the files you would change, but don't edit anything yet
```

## מאיפה הגיעו הפרומפטים

הפרומפטים מבוססים על דפוסים מ:
- [Common workflows](/docs/en/common-workflows): מדריכי צעד-אחר-צעד למשימות יומיומיות
- [Best practices](/docs/en/best-practices): דפוסי prompting והגדרת פרויקט
- בלוג Anthropic על שימוש פנימי (הנדסה, מוצר, דיזיין, נתונים)
- מדריך אימוץ ארגוני (enterprise adoption guide)

## צעד הבא — הפיכת פרומפט לכלי קבוע

כשפרומפט עובד טוב לפרויקט שלך, הצעד הבא הוא להפוך אותו לחלק מהסביבה:

- **שמור כ-skill**: כל אחד בצוות יכול להריץ אותו כ-`/command`
- **תעד מוסכמות ב-CLAUDE.md**: כל session יתחיל עם אותו context
- **השתמש ב-plan mode**: לשינויים גדולים — Claude מציג את רשימת הקבצים לפני שמתחיל לערוך
