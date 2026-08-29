---
title: "תיקיית .claude — מה נמצא איפה ולמה"
category: claude-code
last_verified: 2026-08-29
status: needs-review
source_url: https://code.claude.com/docs/en/claude-directory
related: ["first-claude-md", "memory", "hooks-reference", "skills", "sub-agents"]
mission: spec
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 5
published: "2026-08-29T12:00:00+03:00"
pathOrder: 9
---

Claude Code קורא מכמה מקומות: תיקיית שורש הפרויקט, תיקיית `.claude/` בפרויקט, ותיקיית `~/.claude/` הגלובלית. להבין מה נמצא איפה מונע בלבול כשהגדרה לא מופעלת כמצופה.

## קבצים בשורש הפרויקט

שלושה קבצים נמצאים ישירות בשורש — לא בתוך `.claude/`:

| קובץ | מחויב ל-git | תפקיד |
| :--- | :--- | :--- |
| `CLAUDE.md` | כן | הוראות פרויקט שClaude קורא בכל סשן |
| `.mcp.json` | כן | שרתי MCP ברמת פרויקט, משותפים לצוות |
| `.worktreeinclude` | כן | קבצים gitignored להעתקה ל-worktrees חדשים |

**CLAUDE.md** — ההוראות הבסיסיות לפרויקט: פקודות build ו-test, קונבנציות קוד, הנחיות ארכיטקטורה. נטען בכל סשן. שמרו על פחות מ-200 שורות; תוכן ארוך יותר עדיין נטען במלואו אך עשוי להפחית היצמדות. ניתן גם ב-`.claude/CLAUDE.md` אם מעדיפים שורש פרויקט נקי.

**`.mcp.json`** — שרתי MCP ברמת הפרויקט שכל הצוות משתמש בהם. לשרתים אישיים שלא מיועדים ל-commit, השתמשו ב-`claude mcp add --scope user` שכותב ל-`~/.claude.json`.

**`.worktreeinclude`** — קבצים gitignored (כמו `.env`) שאמורים להיות זמינים ב-worktrees שClaude יוצר. worktrees הם checkouts נקיים, לכן קבצים untracked חסרים ברירת מחדל. הדפוסים משתמשים בתחביר `.gitignore`.

## תיקיית .claude/ — פרויקט

| קובץ / תיקייה | מחויב ל-git | תפקיד |
| :--- | :--- | :--- |
| `settings.json` | כן | הרשאות, hooks, הגדרות — נאכף ע"י Claude Code |
| `settings.local.json` | לא (gitignored) | הגדרות אישיות שגוברות על settings.json של הצוות |
| `rules/` | כן | הוראות נושאיות, אופציונלית מוגבלות לנתיבים |
| `skills/` | כן | prompts לשימוש חוזר שמופעלים ב-`/שם` |
| `commands/` | כן | פקודות חד-קובץ (שמות קבצים = שמות פקודות) |
| `agents/` | כן | subagents עם context window נפרד |
| `workflows/` | כן | סקריפטי workflow דינמיים |
| `output-styles/` | כן | סגנונות פלט לשיתוף עם הצוות |
| `agent-memory/` | כן | זיכרון מתמשך של subagents עם `memory: project` |

**settings.json** — בניגוד ל-CLAUDE.md שClaude **קורא** כהנחיה, ה-settings נאכפים ע"י Claude Code בין אם Claude "ציית" ובין אם לא. כאן מגדירים: `permissions.allow/deny`, `hooks`, `statusLine`, `model`, `env`. הגדרות מסוג מערך (כמו `permissions.allow`) מצטברות על פני כל הscopes; סקלרים (כמו `model`) משתמשים בערך הספציפי ביותר.

**settings.local.json** — gitignored אוטומטית כשClaude Code שומר הגדרה בקובץ זה. גובר על `settings.json` של הצוות. שימושי כשצריך הרשאות שונות מהברירת מחדל של הצוות.

**rules/** — הוראות פרויקט מחולקות לקבצי נושא. חוק **ללא** frontmatter `paths:` נטען בתחילת כל סשן כמו CLAUDE.md. חוק **עם** `paths:` נטען רק כשClaude קורא קובץ תואם — כך חוקי testing נכנסים לcontext רק בעת עבודה על קבצי test. ניתן לארגן בתת-תיקיות; Claude Code מגלה רקורסיבית. כשCLAUDE.md מתקרב ל-200 שורות, שקלו לפצל לrules.

**skills/** ו-**commands/** — שניהם מאפשרים הפעלה ב-`/שם`. skills משתמשים בתיקייה עם `SKILL.md` ויכולים לאגד קבצים נלווים (templates, scripts). commands הם קובץ markdown אחד. לזרימות עבודה חדשות, מומלץ skills.

**agents/** — כל קובץ markdown מגדיר subagent עם system prompt, כלים, ומודל משלו. Subagents רצים ב-context window נפרד, מה שמשמר את השיחה הראשית נקייה. מומלץ להכניס ל-version control לשיתוף עם הצוות.

**workflows/** — סקריפטי JavaScript שClaude כותב ושומר כאן דרך `/workflows`. הסקריפטים מתאמים subagents רבים.

## תיקיית ~/.claude/ — גלובלית

הגרסה הגלובלית של `.claude/`. קבצים כאן חלים על **כל** הפרויקטים ולעולם אינם מגיעים ל-commit.

| קובץ / תיקייה | תפקיד |
| :--- | :--- |
| `CLAUDE.md` | העדפות גלובליות — נטענות יחד עם ה-CLAUDE.md של הפרויקט |
| `settings.json` | הגדרות גלובליות — project settings.json גובר עליהן |
| `keybindings.json` | קיצורי מקלדת מותאמים אישית. הריצו `/keybindings` ליצירה |
| `projects/` | auto memory של כל session — נכתב ע"י Claude Code אוטומטית |
| `rules/`, `skills/`, `commands/`, `agents/`, `workflows/` | כמו ב-.claude/ אבל זמינים בכל פרויקט |
| `output-styles/` | סגנונות פלט אישיים |
| `agent-memory/` | זיכרון מתמשך של subagents עם `memory: user` |

**`~/.claude/CLAUDE.md`** — העדפות גלובליות: סגנון תגובות, פורמט commit, קונבנציות אישיות. נטען לצד ה-CLAUDE.md של הפרויקט. כשיש סתירה, הוראות פרויקט גוברות.

**`~/.claude/projects/`** — כאן Claude Code שומר את ה-auto memory (MEMORY.md) לכל session. Claude כותב לכאן אוטומטית בסיום סשנים. אל תיצרו קבצים כאן ידנית — Claude מנהל אותם.

**`keybindings.json`** — קיצורי מקלדת מותאמים. Ctrl+C, Ctrl+D, Ctrl+M ו-Caps Lock שמורים ולא ניתנים לשינוי.

## עדיפויות ומיזוג

כשאותו setting מוגדר בכמה מקומות, הסדר (מהגבוה לנמוך): managed settings → CLI flags → `.claude/settings.local.json` → `.claude/settings.json` → `~/.claude/settings.json`.

הגדרות מסוג **מערך** (כמו `permissions.allow`) **מצטברות** — כל scope מוסיף לרשימה. הגדרות **סקלריות** (כמו `model`) — המיקום הספציפי ביותר גובר.

CLAUDE.md שונה: גלובלי ופרויקט **שניהם** נטענים לcontext ולא מוחלפים זה בזה.
