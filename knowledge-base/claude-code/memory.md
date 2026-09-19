---
title: "זיכרון — CLAUDE.md ו-Auto Memory לאורך סשנים"
published: "2026-06-06T11:15:00+03:00"
body_changed_at: 2026-09-19
category: claude-code
layer: basic
last_verified: 2026-09-19
status: needs-review
source_url: https://code.claude.com/docs/en/memory
related: ["claude-md-guide", "slash-init", "slash-hooks"]
mission: spec
pathOrder: 2
level: beginner
type: guide
tool: claude-code
origin: official
timeMinutes: 2
---

כל סשן של Claude Code מתחיל עם חלון הקשר ריק. שני מנגנונים מעבירים ידע בין סשנים: קבצי CLAUDE.md ו-auto memory.

## מה זה עושה / למה זה שימושי

| | קבצי CLAUDE.md | Auto memory |
| :--- | :--- | :--- |
| **מי כותב** | אתם | Claude |
| **מה מכיל** | הוראות וחוקים | לקחים ודפוסים שנצברו |
| **Scope** | פרויקט, משתמש, ארגון | לפי repository (משותף בין worktrees) |
| **נטען לתוך** | כל סשן | כל סשן (200 שורות ראשונות / 25KB) |
| **שימוש ל** | סטנדרטים, ארכיטקטורה, תהליכי עבודה | פקודות build, תובנות debugging, העדפות |

השתמשו ב-CLAUDE.md להנחיה מכוונת. Auto memory מאפשר ל-Claude ללמוד מתיקוניכם בלי מאמץ ידני.

## איך משתמשים

### מיקומי CLAUDE.md

| Scope | מיקום | שיתוף עם |
| :--- | :--- | :--- |
| מדיניות ארגון | `/etc/claude-code/CLAUDE.md` (Linux) | כל משתמשי הארגון |
| הגדרות משתמש | `~/.claude/CLAUDE.md` | רק אתם (כל הפרויקטים) |
| הוראות פרויקט | `./CLAUDE.md` או `./.claude/CLAUDE.md` | חברי הצוות דרך גיט |
| הגדרות מקומיות | `./CLAUDE.local.md` | רק אתם (הפרויקט הנוכחי) |

### יצירת CLAUDE.md לפרויקט

```bash
/init
```

`/init` מנתח את הקוד ויוצר קובץ עם פקודות build, הוראות בדיקה, ומוסכמות הפרויקט שהוא מגלה. אם CLAUDE.md כבר קיים, `/init` מציע שיפורים.

### כתיבת הוראות אפקטיביות

מטרו לפחות מ-200 שורות לכל קובץ CLAUDE.md. הוראות ספציפיות ותמציתיות עובדות הכי טוב:

- "Use 2-space indentation" — לא "Format code properly"
- "Run `npm test` before committing" — לא "Test your changes"
- "API handlers live in `src/api/handlers/`" — לא "Keep files organized"

הוסיפו לCLAUDE.md כאשר:

- Claude עושה אותה טעות בפעם השנייה
- תיקון קוד מגלה משהו שClaude היה צריך לדעת
- הקלדתם אותו הבהרה בסשנים שונים

### ייבוא קבצים נוספים

```markdown
See @README for project overview and @package.json for npm commands.

## Additional Instructions
- git workflow @docs/git-instructions.md
```

נתיבים יחסיים ומוחלטים נתמכים. ייבוא נטען לתוך ההקשר בהפעלת הסשן.

### AGENTS.md

מגרסה 2.1.277, Claude Code יכול לקרוא `AGENTS.md` ישירות כהוראות הפרויקט — ללא צורך בייבוא ידני. הטבלה הבאה מסכמת מה Claude קורא לפי השילוב שקיים ב-repository:

| מה יש ב-repository | מה Claude קורא |
| :--- | :--- |
| `AGENTS.md` בלבד (ללא `CLAUDE.md` או `CLAUDE.local.md`) | `AGENTS.md` |
| `AGENTS.md` + `CLAUDE.md` או `CLAUDE.local.md` | `CLAUDE.md` בלבד |
| `CLAUDE.md` שמייבא `AGENTS.md` ב-`@` | `CLAUDE.md` כולל תוכן `AGENTS.md` |

ברירת המחדל היא `claude-md-or-agents-md`. לשינוי ההגדרה:

```text
/config → Project instructions
```

ערכים אפשריים: `claude-md-or-agents-md`, `claude-md-and-agents-md` (שניהם יחד), `claude-md`, `managed-only`.

**מגבלה:** תמיכת AGENTS.md אינה זמינה על Amazon Bedrock, Vertex AI, Foundry, ובסשנים ש-telemetry מושבת בהם (v2.1.277+). בסשנים אלה יש לייבא ידנית:

```markdown
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

### Auto Memory

כאשר auto memory מופעל, Claude כותב הערות לעצמו על בסיס תיקוניכם והעדפותיכם — בלי שתצטרכו לעדכן ידנית. שמור עד 200 שורות ראשונות לפי repository.

לניהול ידני של auto memory:

```text
/memory
```

## טיפול בבעיות

אם הוראה אינה מבוצעת, השתמשו ב-`/context` לצפייה במה שנטען. ודאו שהקובץ בנתיב הנכון, ושאין הוראות סותרות. הוראות ספציפיות יותר עובדות טוב יותר מהוראות כלליות.
