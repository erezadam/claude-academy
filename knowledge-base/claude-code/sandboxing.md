---
title: "Sandbox של Bash — בידוד פקודות ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-06-24
status: needs-review
source_url: https://code.claude.com/docs/en/sandboxing
related: [slash-security-sandbox, permissions, auto-mode-config]
---

ה-Bash sandbox מאפשר ל-Claude להריץ פקודות shell ברוב המקרים ללא עצירה לאישור. במקום לאשר כל פקודה בנפרד, מגדירים אילו קבצים ואיזה דומיינים הפקודות יכולות לגשת אליהם — ומערכת ההפעלה אוכפת את הגבול הזה על כל פקודה ועל כל תהליכי הבן שלה.

## מה זה עושה / למה זה שימושי

ה-sandbox מספק שתי שכבות בידוד: **בידוד filesystem** — פקודות כותבות רק לתיקיית העבודה ול-session temp ברירת מחדל; **בידוד רשת** — אין דומיינים שאושרו מראש, והאישור הראשון לכל דומיין חדש נשאל ממך. שכבות אלה אוכפות על כל תהליך שהפקודה מייצרת, כולל כלים כמו `kubectl`, `terraform` ו-`npm`.

ה-sandbox שונה ממצבי הרשאות: מצבי הרשאות שולטים **האם** כלי רץ; ה-sandbox שולט **למה** פקודת Bash יכולה לגשת לאחר שרצה.

## איך משתמשים

ה-sandbox מובנה ב-Claude Code ורץ על macOS, Linux ו-WSL2. Windows native אינו נתמך.

```text
/sandbox
```

הפקודה פותחת פאנל עם שלושה טאבים: **Mode** לבחירת אופן האישור, **Overrides** לשליטה ב-fallback, ו-**Config** לצפייה בהגדרות הפעילות.

### מצבי sandbox

**Auto-allow mode** — פקודות sandboxed רצות אוטומטית ללא prompt. פקודות שלא ניתן להריץ בתוך ה-sandbox (כגון גישה לדומיין לא-מאושר) נופלות אחורה ל-flow הרגיל של הרשאות.

**Regular permissions mode** — כל פקודות ה-Bash עוברות את flow הרגיל של הרשאות, גם כשהן sandboxed. מספק שליטה גבוהה יותר אבל דורש יותר אישורים.

בשני המצבים, ה-sandbox אוכף את אותן הגבלות filesystem ורשת. ההבדל הוא רק האם פקודות sandboxed מאושרות אוטומטית.

## הגדרה

### הגדרות filesystem

ברירת המחדל: כתיבה לתיקיית העבודה ול-session temp בלבד; קריאה מכל המחשב (כולל `~/.aws/credentials` ו-`~/.ssh/` — יש להוסיפם ל-`denyRead` כדי לחסום אותם).

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["~/.kube", "/tmp/build"],
      "denyRead": ["~/.aws", "~/.ssh"],
      "allowRead": ["."]
    }
  }
}
```

| הגדרה | פעולה |
|:--|:--|
| `allowWrite` | מעניק גישת כתיבה לנתיבים מחוץ לתיקיית העבודה |
| `denyWrite` | חוסם גישת כתיבה לנתיבים ספציפיים |
| `denyRead` | חוסם גישת קריאה לנתיבים ספציפיים |
| `allowRead` | מתיר מחדש קריאה בתוך אזור `denyRead` |

כשאותו מערך filesystem מוגדר במספר scopes של settings, המערכים ממוזגים — נתיבים מכל scope משולבים, לא מוחלפים.

### הגנה על credentials

בגרסה 2.1.187 נוספה הגדרת `sandbox.credentials` לחסימת גישת פקודות sandboxed לקבצי credentials ומשתני סביבה סודיים:

```json
{
  "sandbox": {
    "enabled": true,
    "credentials": true
  }
}
```

כשמוגדר, פקודות sandboxed אינן יכולות לקרוא `~/.aws/credentials`, `~/.ssh/` ומשתני סביבה כמו `AWS_SECRET_ACCESS_KEY`.

### הגדרות רשת

אין דומיינים מאושרים מראש. ב-`allowedDomains` אפשר לאשר דומיינים מראש:

```json
{
  "sandbox": {
    "enabled": true,
    "allowedDomains": ["api.example.com", "*.internal.company.com"]
  }
}
```

### הגדרה ארגונית

לאכיפת sandbox על כל המשתמשים בארגון דרך managed settings:

```json
{
  "sandbox": {
    "enabled": true,
    "failIfUnavailable": true,
    "allowUnsandboxedCommands": false
  }
}
```

`failIfUnavailable: true` — Claude Code לא יתחיל אם ה-sandbox לא יכול להאתחל. `allowUnsandboxedCommands: false` — מבטל את ה-escape hatch שמאפשר ל-Claude לנסות שוב פקודה שנכשלה מחוץ ל-sandbox.

## מגבלות ידועות

ה-sandbox מצמצם סיכונים אך אינו גבול בידוד מלא:

**פילטור רשת** — הפרוקסי המובנה לא מבצע TLS inspection. דומיינים רחבים כמו `github.com` יכולים ליצור נתיב לחילוץ נתונים. למודל איום חזק יותר, הגדר custom proxy עם TLS inspection.

**כלי קבצים מובנים** — Read, Edit ו-Write משתמשים במערכת ההרשאות ישירות ולא עוברים דרך ה-sandbox.

**תאימות כלים** — `jest` עם watchman, פקודות `docker` ו-`open`/`osascript` על macOS דורשים הגדרה מיוחדת או הרצה מחוץ ל-sandbox.

**subagents** — פקודות Bash בתוך subagent הן sandboxed כאשר sandboxing מופעל ב-session האב.
