---
title: "מצבי הרשאה ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-07-04
status: needs-review
source_url: https://code.claude.com/docs/en/permission-modes
related: [auto-mode-config, slash-permissions, sandboxing]
---

מצבי הרשאה שולטים בתדירות שבה Claude מבקש אישור לפני עריכת קבצים או הרצת פקודות. כל מצב מייצג פשרה שונה בין נוחות לפיקוח.

## מה זה עושה / למה זה שימושי

כשClaude רוצה לערוך קובץ, להריץ פקודת מעטפת או לבצע בקשת רשת — הוא עוצר ומבקש אישור. מצב ההרשאה קובע כמה עצירות כאלה יהיו. מצב Manual מחייב אישור לכל פעולה; מצבים פתוחים יותר מאפשרים ל-Claude לעבוד ברצף ארוך ולדווח בסיום.

## מצבים זמינים

| מצב | מה רץ ללא בקשה | מתאים ל |
| :--- | :--- | :--- |
| `default` | קריאה בלבד. מוצג כ-**Manual** ב-CLI ובהרחבות IDE | התחלה, עבודה רגישה |
| `acceptEdits` | קריאה, עריכת קבצים ופקודות מערכת-קבצים נפוצות (`mkdir`, `touch`, `mv`, `cp`, `rm`) | איטרציה על קוד שאתה בוחן |
| `plan` | קריאה בלבד | חקירת קוד לפני שינויים |
| `auto` | הכל, עם בדיקות רקע | משימות ארוכות, הפחתת עייפות-אישורים |
| `dontAsk` | כלים שאושרו מראש בלבד | CI נעול וסקריפטים |
| `bypassPermissions` | הכל | מכולות ו-VM מבודדים בלבד |

המצב `default` מוצג כ-**Manual** ב-CLI ובהרחבות VS Code ו-JetBrains. ערך ה-config הוא `default`, אך ה-CLI מקבל גם `manual` כ-alias — לדוגמה `claude --permission-mode manual` (דורש Claude Code v2.1.200 ומעלה).

## איך משתמשים

**החלפה במהלך סשן** (CLI): לחץ `Shift+Tab` כדי לרוץ בין `default` → `acceptEdits` → `plan`. המצב הנוכחי מופיע בשורת הסטטוס.

**בהפעלה**:

```bash
claude --permission-mode acceptEdits
```

```bash
claude --permission-mode plan
```

**כברירת מחדל קבועה** (settings):

```json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}
```

## מצב acceptEdits

מאפשר ל-Claude ליצור ולערוך קבצים בתיקיית העבודה ללא בקשה. שורת הסטטוס מציגה `⏵⏵ accept edits on`. בנוסף לעריכות קבצים, המצב מאשר אוטומטית פקודות Bash כגון `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp` ו-`sed` בתוך תיקיית העבודה. נתיבים מחוץ לטווח זה ממשיכים לדרוש אישור.

## מצב plan

מנחה את Claude לחקור ולהציע שינויים מבלי לבצע אותם. Claude קורא קבצים ומריץ פקודות חקירה, אך אינו עורך קוד. ניתן להיכנס גם עם פרפיקס `/plan` לפרומפט בודד.

כשהתוכנית מוכנה, Claude מציג אותה ומציע:
- אישור ומעבר ל-auto mode
- אישור ו-accept edits
- אישור עם בחינה ידנית
- המשך תכנון עם משוב

לחיצה על `Ctrl+G` פותחת את התוכנית בעורך הטקסט לעריכה ישירה לפני שClaude ממשיך.

## מצב auto

מאפשר ל-Claude לבצע ללא בקשות הרשאה שגרתיות. מודל classifier נפרד בוחן פעולות לפני ביצוען וחוסם פעולות שחורגות מהבקשה, מכוונות לתשתית לא מוכרת, או נראות מונעות מתוכן עוין.

**דרישות לשימוש ב-auto mode**:
- Claude Code v2.1.83 ומעלה
- בחשבונות Team ו-Enterprise: Owner חייב להפעיל את המצב ב-admin settings
- מודל: Claude Opus 4.6 ומעלה, או Sonnet 4.6 ומעלה (ב-Anthropic API)

**ברירת מחדל — חסום**:
- הורדה והרצת קוד (`curl | bash`)
- שליחת מידע רגיש לנקודות קצה חיצוניות
- דיפלוי לסביבת ייצור, מחיקות גורפות, שינויי הרשאות
- `git reset --hard`, `git clean -fd`, `git stash drop`
- Force push או push ישיר ל-`main`
- `terraform destroy`, `pulumi destroy`

**ברירת מחדל — מותר**:
- פעולות קבצים מקומיות בתיקיית העבודה
- התקנת תלויות שמוגדרות ב-lock files
- בקשות HTTP לקריאה בלבד
- Push לענף שממנו התחלת או שClaude יצר

אם ה-classifier חוסם פעולה 3 פעמים ברצף או 20 פעמים בסך הכל, ה-auto mode מופסק ו-Claude Code חוזר לשאול. ניתן להריץ `claude auto-mode defaults` לראות את רשימות הכללים המלאות.

## מסלולים מוגנים

בכל המצבים פרט ל-`bypassPermissions`, כתיבה לנתיבים מוגנים (כגון קבצי הגדרות של Claude עצמו) לעולם אינה מאושרת אוטומטית.

## VS Code ו-JetBrains

ב-VS Code: לחץ על מחוון המצב בתחתית תיבת הפרומפט.

| תווית UI | מצב |
| :--- | :--- |
| Manual | `default` |
| Edit automatically | `acceptEdits` |
| Plan mode | `plan` |
| Auto mode | `auto` |
| Bypass permissions | `bypassPermissions` |
