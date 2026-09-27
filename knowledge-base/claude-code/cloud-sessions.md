---
title: "הרצת Claude Code בענן"
category: claude-code
last_verified: 2026-09-27
status: needs-review
source_url: https://code.claude.com/docs/en/claude-code-on-the-web
related: [routines, claude-projects, remote-control, parallel-agents]
mission: daily
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-09-27T12:00:00+03:00"
pathOrder: 33
---

סשן ענן הוא סשן Claude Code שרץ על תשתית ענן במקום על המחשב שלך. הסשן ממשיך לרוץ גם אחרי שסוגרים את המחשב, וניתן לנטר ולהפנות אותו מכל מכשיר.

## מה זה עושה

סשני ענן זמינים בתוכניות Pro, Max, Team ו-Enterprise (עם מושב premium). ניתן להפעיל אותם מ:

- **דפדפן**: [claude.ai/code](https://claude.ai/code)
- **מובייל**: לשונית Code באפליקציית Claude
- **Desktop app**: בחר Cloud במקום Local בעת יצירת סשן
- **טרמינל**: `claude --cloud`
- **Routines**: כל הרצה מתוזמנת רצה כסשן ענן

## איך מפעילים סשן ענן מהטרמינל

```bash
claude --cloud "Fix the authentication bug in src/auth/login.ts"
```

הפקודה יוצרת סשן חדש ב-claude.ai. ה-VM בענן משכפל את ה-remote של ה-repository הנוכחי בענף הנוכחי — לא את ה-checkout המקומי. אם יש commits מקומיים שלא נדחפו לעדיין, יש לדחוף אותם קודם.

### הרצת מספר משימות במקביל

כל `--cloud` יוצר סשן עצמאי. ניתן להפעיל כמה בו-זמנית:

```bash
claude --cloud "Fix the flaky test in auth.spec.ts"
claude --cloud "Update the API documentation"
claude --cloud "Refactor the logger to use structured output"
```

### שליחת הודעת המשך לסשן רץ

```bash
claude -p "your message" --cloud <session-id>
```

הפקודה מעלה הודעה לסשן ויוצאת מיד, בלי להמתין לתשובה. מזהה הסשן מופיע ב-claude.ai/code.

## העברת סשן בין ענן לטרמינל

### מהטרמינל לענן

```bash
claude --cloud "Execute the migration plan in docs/migration-plan.md"
```

### מהענן לטרמינל (teleport)

כאשר רוצים להמשיך עבודה שהתחילה בענן מקומית:

```bash
# בחירה אינטראקטיבית של סשן
claude --teleport

# המשך סשן ספציפי
claude --teleport <session-id>
```

בתוך סשן קיים ניתן גם:

```bash
/teleport
```

Teleport מאמת שנמצאים ב-repository הנכון, משכפל ומחייב את הענף מהסשן הענני, וטוען את היסטוריית השיחה המלאה לטרמינל.

**דרישות ל-teleport:**
- ה-working directory נקי (אין שינויים שלא הוגשו)
- נמצאים ב-checkout של אותו repository (לא fork)
- הענף מהסשן הענני נמצא ב-remote
- מחוברים לאותו חשבון claude.ai שיצר את הסשן

## חיבור GitHub

סשני ענן דורשים גישה ל-repository כדי לשכפל קוד ולדחוף ענפים:

| שיטה | כיצד מחברים | מתאים ל |
| --- | --- | --- |
| **GitHub App** | מאשרים במהלך onboarding בדפדפן | צוותים, Auto-fix |
| **`/web-setup`** | מריצים `/web-setup` בטרמינל להעברת ה-`gh` token | מפתחים בודדים עם `gh` CLI |

### repository ללא GitHub remote

כאשר ה-repository אין לו remote, Claude Code אורז ומעלה אותו ישירות לסשן הענן. מקסימום גודל: 100 MB.

```bash
# כפה העלאה גם כאשר יש remote
CCR_FORCE_BUNDLE=1 claude --cloud "Run the test suite and fix any failures"
```

## הגבלות

- `--cloud` זמין רק עם חשבון Anthropic — לא עם Amazon Bedrock, Google Cloud, או ספקי צד שלישי אחרים.
- מדיניות הארגון (`allow_remote_sessions`) חייבת להיות מופעלת; Owner יכול להפעילה ב-claude.ai/admin-settings/claude-code.
- ארגונים עם Zero Data Retention לא יכולים להשתמש ב-`/web-setup` ובסשני ענן.
