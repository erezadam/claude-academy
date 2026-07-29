---
title: "Claude Code ב-Monorepo ובקוד-בייס גדול"
category: guides
layer: intermediate
last_verified: 2026-07-25
status: needs-review
source_url: https://code.claude.com/docs/en/large-codebases
related: [memory, claude-md-guide, worktrees, plugins-guide, skills]
mission: daily
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 4
last_reviewed: 2026-07-25
---

קוד-בייס גדול — בין אם monorepo עם חבילות רבות ובין אם עץ בודד עם מיליוני שורות — עשוי למלא את חלון ההקשר של Claude בהוראות וקריאות קבצים שאינן רלוונטיות למשימה. מדריך זה מראה כיצד לצמצם את ה-context למה שהמשימה באמת דורשת.

## מה זה עושה / למה זה שימושי

כאשר מפעילים `claude` מתיקיית השורש, Claude טוען את כל קבצי ה-CLAUDE.md שבנתיב ופותח קבצים לפי הצורך — גישה שעובדת היטב בפרויקטים קטנים אך הופכת יקרה ב-token בקוד-בייס גדול. ההגדרות בדף זה פועלות באופן עצמאי ומצטברות — ניתן ליישם כמה שרוצים.

| רוצה ש... | השתמש ב |
|:--|:--|
| יטען רק את ה-conventions של החבילה הנוכחית | CLAUDE.md לפי תיקייה |
| ידלג על CLAUDE.md של חבילות שאינך עובד בהן | `claudeMdExcludes` |
| לא יפתח קוד build output או vendor | כללי `Read` דחייה ב-`permissions.deny` |
| ימצא הגדרות דרך language server במקום לסרוק קבצים | תוסף code intelligence |
| ב-worktree, יבדוק רק תיקיות רלוונטיות | `worktree.sparsePaths` |

## מתי להפעיל Claude מהשורש ומתי מתיקיית-חבילה

נקודת ההפעלה קובעת אילו קבצים Claude יכול לגשת אליהם, אילו CLAUDE.md נטענים, ואילו project settings פעילים.

| הפעלה מ... | גישה לקבצים | CLAUDE.md שנטען בהפעלה | מתי להשתמש |
|:--|:--|:--|:--|
| שורש ה-repo | כל הקבצים | שורש בלבד; תת-תיקיות לפי דרישה | משימות שמשתרעות על מספר חבילות |
| תת-תיקייה | אותה תת-עץ בלבד (עד הוספת הרשאה) | CLAUDE.md של התיקייה + כל אבות-הנתיב | עבודה ממוקדת בחבילה אחת |

## CLAUDE.md מרובד לפי תיקייה

Claude Code טוען כל קובץ CLAUDE.md מתיקיית העבודה ומכל אב-נתיב בהפעלה, ואז טוען קבצים של תת-תיקיות לפי דרישה כשהוא פותח קבצים שם.

פיצול נפוץ לשתי שכבות:

- **CLAUDE.md שורשי** — כללים שחלים בכל מקום: תקני קוד, conventions של commit, מבנה ה-repo
- **CLAUDE.md לכל חבילה** — conventions ספציפיים לסטאק של אותה חבילה

```markdown
# CLAUDE.md בשורש — דוגמה ל-monorepo

This is a monorepo with three packages under packages/:

- packages/api: Node.js REST API with Express, TypeScript, and PostgreSQL
- packages/web: React frontend with Vite, TypeScript, and TailwindCSS
- packages/shared: shared TypeScript utilities used by both api and web

Run commands from the package directory, not the monorepo root.
```

```markdown
# packages/api/CLAUDE.md — דוגמה לחבילה ספציפית

This package is the REST API server.

- Run tests: `npm test` (uses Vitest)
- Run dev server: `npm run dev` (port 3001)
- Database migrations: `npm run migrate`

API routes are in src/routes/. Database queries use Knex in src/db/.
```

כדי לוודא אילו קבצים נטענו, הריצו `/context` ובדקו את הרשימה תחת **Memory files**.

### דילוג על CLAUDE.md של חבילות לא-רלוונטיות

ה-setting `claudeMdExcludes` מגדיר patterns של קבצים שלעולם לא ייטענו:

```json
{
  "claudeMdExcludes": [
    "**/packages/web/**"
  ]
}
```

כך קבצי CLAUDE.md ו-rules של החבילה הזו מדולגים לחלוטין. ניתן להגדיר ב-`.claude/settings.local.json` כדי שיחול רק עליך.

## חסימת קריאות קוד שנוצר ו-vendor

Claude מכבד `.gitignore` כברירת מחדל, כך ש-`node_modules/`, `dist/` ו-`build/` מחוץ לתוצאות חיפוש. עבור נתיבים שמחויבים ל-repo — כמו SDK בתוך vendor — הוסף כללי `Read` דחייה:

```json
{
  "permissions": {
    "deny": [
      "Read(./**/dist/**)",
      "Read(./**/build/**)",
      "Read(./**/*.generated.*)",
      "Read(./vendor/**)"
    ]
  }
}
```

כללי הדחייה חלים על כלי קבצים מובנים ועל פקודות Bash מזוהות (`cat`, `head`, `grep`, `find`) כשהנתיב הדחוי מועבר כארגומנט.

## הפחתת קריאות קבצים עם Code Intelligence

ב-codebase גדול, מציאת הגדרה או שימוש בסמל עשויה לעלות בקריאות קבצים רבות. תוספי code intelligence מחברים את Claude לשרת שפה כדי לבצע קפיצה להגדרה וחיפוש references ישירות.

ה-marketplace הרשמי מכיל תוספים ל-TypeScript, Python, Go, Rust ועוד. להתקנת תוסף TypeScript בתוך session:

```shell
/plugin install typescript-lsp@claude-plugins-official
```

כדי להפעיל תוסף לכל הצוות, הוסף אותו ל-`enabledPlugins` ב-`.claude/settings.json` של הפרויקט.

## Worktree Sparse Checkout

כשClaude יוצר worktree (למשל עבור משימה מקבילה), `worktree.sparsePaths` מגדיר אילו תיקיות ייבדקו — מה שמונע checkout של כל החבילות:

```json
{
  "worktree": {
    "sparsePaths": ["packages/api", "packages/shared"]
  }
}
```

## גישה לחבילות נוספות באותו session

`--add-dir` (או `additionalDirectories` בהגדרות) מעניק ל-Claude גישה לתיקייה נוספת מאותו session — שימושי כשמשימה דורשת קריאה וכתיבה בחבילה אחות:

```shell
claude --add-dir ../packages/shared
```

## Skills לפי תיקייה

ניתן להוסיף תיקיית `.claude/skills/` לכל חבילה. Skills ישמשו רק כשClaude עובד בתיקייה הזו, כך שprocedures ספציפיים לחבילה לא מזהמים את ה-context של חבילות אחרות.

## Plugin לריכוז conventions

כשהgrowth של CLAUDE.md files לפי תיקייה הפך לקשה לניהול, plugin פנימי ב-marketplace ארגוני יכול לאחד את כל ה-conventions למקום אחד שכל מפתח מתקין — במקום לנהל קבצים בכל חבילה.
