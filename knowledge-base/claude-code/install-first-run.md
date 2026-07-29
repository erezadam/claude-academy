---
title: "התקנה והרצה ראשונה"
category: claude-code
layer: basic
last_verified: 2026-07-29
last_reviewed: 2026-07-29
status: needs-review
source_url: https://code.claude.com/docs/en/quickstart
source_url_extra: https://code.claude.com/docs/en/commands
related: [what-is-claude-code, prompting-basics]
mission: start
level: beginner
type: guide
tool: claude-code
origin: official
timeMinutes: 10
pathOrder: 2
next: prompting-basics
---

## התקנה והרצה ראשונה

בסוף העמוד הזה Claude Code מותקן, רץ בתוך פרויקט, וקיבלת ממנו תשובה ראשונה. עשר דקות.

## מה צריך לפני

- טרמינל (Terminal ב-macOS, PowerShell ב-Windows).
- חשבון Claude — מנוי Pro/Max/Team, או חשבון Console עם קרדיט API.
- תיקיית פרויקט כלשהי. גם תיקייה עם שלושה קבצים נחשבת.

## שלב 1 — התקנה

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

לוודא שההתקנה עבדה:

```bash
claude --version
```

אמור להופיע מספר גרסה ולידו ‎(Claude Code). ההתקנה הזו מתעדכנת מעצמה ברקע — לא תצטרך להתקין שוב.

## שלב 2 — כניסה לחשבון

מריצים את הפקודה `claude` ובפעם הראשונה תתבקש להתחבר — האישור נפתח בדפדפן. אחרי זה ההתחברות נשמרת. אם תצטרך להחליף חשבון בהמשך:

```
/login
```

## שלב 3 — פתיחה בתוך פרויקט

זה החלק שאנשים מפספסים: את Claude Code פותחים **מתוך תיקיית הפרויקט**, כי הוא עובד על מה שנמצא סביבו.

```bash
cd /path/to/your/project
claude
```

מעל שורת הקלט תראה את הגרסה, המודל ותיקיית העבודה.

## שלב 4 — הבקשה הראשונה שבטוח עובדת

הקלד:

```
what does this project do?
```

(או בעברית: "מה הפרויקט הזה עושה?") — הוא יקרא את הקבצים ויחזיר סיכום. זו בקשת קריאה בלבד: שום דבר לא משתנה, ואתה רואה שהחיבור לפרויקט עובד.

## איך יוצאים

```
/exit
```

או ‎Ctrl+D פעמיים. הסשן נשמר — `/resume` יחזיר אותך אליו.

## אם משהו נתקע

`/help` מציג את כל הפקודות הזמינות. שגיאת התקנה — יש עמוד פתרון תקלות ייעודי בתיעוד הרשמי (troubleshoot-install).
