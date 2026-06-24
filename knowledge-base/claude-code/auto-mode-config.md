---
title: "הגדרת Auto Mode — שליטה בסיווג אוטומטי"
category: claude-code
layer: intermediate
last_verified: 2026-06-24
status: needs-review
source_url: https://code.claude.com/docs/en/auto-mode-config
related: [slash-security-sandbox, permissions, sandboxing]
---

Auto mode מריץ את Claude Code ללא prompts הרשאות שגרתיים, על-ידי ניתוב פקודות דרך מסווג שחוסם פעולות בלתי-הפיכות, הרסניות, או כאלה שמכוונות מחוץ לסביבה שלך. חוקי Deny ו-Ask מפורשים מוערכים לפני המסווג ועדיין חוסמים או שואלים.

## מה זה עושה / למה זה שימושי

ה-block `autoMode` בhttps settings מאפשר לך להגדיר איזה repos, buckets ודומיינים הארגון שלך סומך עליהם. המסווג משתמש במידע זה כדי להחליט מה "חיצוני" ומה "פנימי". ברירת המחדל: סמיכות רק לתיקיית העבודה ולremotes המוגדרים של ה-repo.

Auto mode עצמו (ההפעלה שלו ומה הוא חוסם כברירת מחדל) מוסבר ב-[Permission modes](/en/permission-modes). דף זה הוא ה-reference להגדרה.

## איך משתמשים

### הגדרת תשתית מהימנה

עבור רוב הארגונים, `autoMode.environment` הוא השדה היחיד שדרוש. השתמש ב-`"$defaults"` כדי לשמר את הרשימה המובנית ולהוסיף עליה:

```json
{
  "autoMode": {
    "environment": [
      "$defaults",
      "Source control: github.example.com/acme-corp and all repos under it",
      "Trusted cloud buckets: s3://acme-build-artifacts, gs://acme-ml-datasets",
      "Trusted internal domains: *.corp.example.com, api.internal.example.com",
      "Key internal services: Jenkins at ci.example.com, Artifactory at artifacts.example.com"
    ]
  }
}
```

הערכים הם פרוזה, לא regex או תבניות כלים. המסווג קורא אותם כחוקים בשפה טבעית.

| Scope | קובץ | שימוש |
|:--|:--|:--|
| מפתח יחיד | `~/.claude/settings.json` | תשתית אישית מהימנה |
| פרויקט + מפתח | `.claude/settings.local.json` | buckets או שירותים לפרויקט ספציפי |
| ארגון | managed settings | תשתית לכל המפתחים |
| `--settings` / Agent SDK | JSON inline | overrides לפי-invocation לאוטומציה |

שים לב: המסווג **לא** קורא `autoMode` מה-`settings.json` המשותף של הפרויקט, כדי שlrepo לא יוכל להזריק חוקי allow משלו.

### עקיפת חוקי block ו-allow

שלושה שדות נוספים מאפשרים להחליף את רשימות ברירת המחדל:

```json
{
  "autoMode": {
    "environment": ["$defaults", "Source control: github.example.com/acme-corp"],
    "allow": [
      "$defaults",
      "Deploying to the staging namespace is allowed: staging is isolated from production"
    ],
    "soft_deny": [
      "$defaults",
      "Never run database migrations outside the migrations CLI"
    ],
    "hard_deny": [
      "$defaults",
      "Never send repository contents to third-party code-review APIs"
    ]
  }
}
```

סדר עדיפויות בתוך המסווג:

- `hard_deny` — חוסם ללא תנאי. כוונת משתמש ו-allow exceptions לא חלים.
- `soft_deny` — חוסם בשלב הבא. כוונת משתמש מפורשת ו-`allow` exceptions יכולים לעקוף.
- `allow` — מבטל soft_deny תואמים כחריגות.
- כוונת משתמש מפורשת — מבטלת soft blocks שנותרו.

---

**אזהרה חשובה:** הגדרת כל אחד מ-`environment`, `allow`, `soft_deny` או `hard_deny` **ללא** `"$defaults"` מחליף את הרשימה המובנית כולה. `hard_deny` ללא `"$defaults"` מבטל חוקי data exfiltration ו-auto-mode bypass מובנים.

---

## פקודות CLI

שלוש תת-פקודות מסייעות לבדוק ולאמת את ההגדרה:

```bash
# הדפסת חוקים מובנים (environment, allow, soft_deny, hard_deny) כ-JSON
claude auto-mode defaults

# הדפסת מה שהמסווג משתמש בו בפועל עם ההגדרות שלך
claude auto-mode config

# קבלת משוב AI על חוקים מותאמים שכתבת
claude auto-mode critique
```

הרץ `claude auto-mode config` לאחר שמירת ההגדרות כדי לאשר שהחוקים הפעילים הם כמצופה.

## סקירת denials

כשauto mode חוסם פקודה, הcחסימה נרשמת ב-`/permissions` תחת טאב "Recently denied". לחץ `r` על פעולה שנחסמה כדי לסמן אותה לניסיון חוזר. חסימות חוזרות לאותו יעד בדרך כלל אומרות שחסר context ב-`autoMode.environment` — הוסף את היעד שם ואז הרץ `claude auto-mode config` כדי לאשר שנכנס לתוקף.
