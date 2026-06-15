---
title: "Subagents — סוכנים ייעודיים ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-06-14
updated: 2026-06-14
created: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/sub-agents
related: ["skills", "plugins-guide", "/agents"]
---

Subagents הם עוזרי AI ייעודיים שמטפלים בסוגי משימות ספציפיים. השתמש ב-subagent כש-side task היה מציף את השיחה הראשית בתוצאות חיפוש, ב-logs או בתוכן קבצים שלא תפנה אליהם שוב — ה-subagent מבצע את העבודה ב-context window משלו ומחזיר רק את הסיכום. הגדר subagent מותאם כשאתה מוצא את עצמך מפעיל שוב ושוב את אותו סוג של worker עם אותן הוראות.

כל subagent רץ ב-context window משלו עם system prompt מותאם, גישה לכלים ספציפית, והרשאות עצמאיות. כש-Claude נתקל במשימה שתואמת ל-`description` של subagent, הוא מאציל אליה את המשימה, וה-subagent עובד באופן עצמאי ומחזיר תוצאות.

subagents עובדים בתוך session יחיד. כדי להריץ הרבה sessions עצמאיים במקביל ולנטר אותם ממקום אחד, ראה background agents. עבור sessions שמתקשרים זה עם זה, ראה agent teams.

## מה זה עושה / למה זה שימושי

subagents עוזרים בכמה דרכים מרכזיות. **שימור context** — שמירת exploration ו-implementation מחוץ לשיחה הראשית. **אכיפת אילוצים** — הגבלת אילו כלים ה-subagent יכול להשתמש בהם. **שימוש חוזר בהגדרות** — שיתוף subagents ברמת משתמש בין פרויקטים. **התמחות התנהגות** — system prompts ממוקדים לדומיינים ספציפיים. **שליטה בעלויות** — ניתוב משימות למודלים מהירים וזולים יותר כמו Haiku.

Claude משתמש ב-`description` של כל subagent כדי להחליט מתי להאציל אליו משימות. לכן, כשאתה יוצר subagent, כתוב `description` ברור כדי ש-Claude יֵדע מתי להשתמש בו.

## Subagents מובנים

Claude Code כולל subagents מובנים ש-Claude משתמש בהם אוטומטית כשמתאים. כל אחד יורש את ההרשאות של השיחה האב, עם הגבלות כלים נוספות.

Explore ו-Plan דולגים על קבצי CLAUDE.md ועל git status של ה-session האב, כדי לשמור על מחקר מהיר וזול. כל subagent מובנה אחר, וכן subagents מותאמים, טוענים את שניהם.

| Subagent | מודל | כלים | מטרה / מתי Claude משתמש בו |
|:--|:--|:--|:--|
| **Explore** | Haiku (מהיר, latency נמוך) | read-only (אין גישה ל-Write ו-Edit) | גילוי קבצים, חיפוש קוד, exploration של codebase ללא שינויים |
| **Plan** | יורש מהשיחה | read-only (אין גישה ל-Write ו-Edit) | מחקר codebase במהלך plan mode, לאיסוף context לפני הצגת תוכנית |
| **General-purpose** | יורש מהשיחה | כל הכלים | משימות מורכבות רב-שלביות שדורשות גם exploration וגם פעולה |

בעת הפעלת Explore, Claude מציין רמת יסודיות: **quick** לחיפושים ממוקדים, **medium** ל-exploration מאוזן, או **very thorough** לניתוח מקיף. Plan מריץ את המחקר ב-context מבודד תוך איסוף ה-context הנדרש.

בנוסף קיימים helper agents נוספים שמופעלים אוטומטית: `statusline-setup` (מודל Sonnet, כשמריצים `/statusline`) ו-`claude-code-guide` (מודל Haiku, כששואלים שאלות על פיצ'רים של Claude Code).

## איך משתמשים

subagents מוגדרים בקבצי Markdown עם YAML frontmatter. אפשר ליצור אותם ידנית, או באמצעות הפקודה `/agents`.

הפקודה `/agents` פותחת ממשק עם טאבים לניהול subagents. הטאב **Running** מציג subagents חיים ומאפשר לפתוח או לעצור אותם. הטאב **Library** מאפשר לצפות בכל ה-subagents הזמינים (מובנים, משתמש, פרויקט, plugin), ליצור חדשים עם guided setup או generation של Claude, לערוך ולמחוק. זו הדרך המומלצת ליצור ולנהל subagents.

### קובץ subagent בסיסי

קבצי subagent משתמשים ב-YAML frontmatter להגדרה, ואחריו ה-system prompt ב-Markdown. ה-frontmatter מגדיר את ה-metadata וההגדרות; ה-body הופך ל-system prompt שמנחה את התנהגות ה-subagent. subagents מקבלים רק את ה-system prompt הזה (בתוספת פרטי סביבה בסיסיים כמו תיקיית העבודה), לא את כל ה-system prompt של Claude Code.

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

subagents נטענים בתחילת ה-session. אם הוספת או ערכת קובץ subagent ישירות בדיסק, הפעל מחדש את ה-session כדי לטעון אותו. subagents שנוצרו דרך ממשק `/agents` נכנסים לתוקף מיד ללא הפעלה מחדש.

### הפעלה מפורשת

כשהאצלה אוטומטית לא מספיקה, אפשר לבקש subagent בעצמך. יש שלושה דפוסים שמסלימים מהמלצה חד-פעמית עד ברירת מחדל לכל ה-session.

ב-**שפה טבעית** פשוט נוקבים בשם ה-subagent, ו-Claude מחליט אם להאציל:

```text
Use the test-runner subagent to fix failing tests
Have the code-reviewer subagent look at my recent changes
```

ב-**@-mention** מבטיחים שה-subagent הספציפי ירוץ למשימה אחת. מקלידים `@` ובוחרים מה-typeahead, בדיוק כמו ב-@-mention של קבצים:

```text
@"code-reviewer (agent)" look at the auth changes
```

ברמת **session שלם** מריצים את ה-thread הראשי כ-subagent עם הדגל `--agent`. ה-system prompt של ה-subagent מחליף את ברירת המחדל של Claude Code לחלוטין; קבצי CLAUDE.md וזיכרון הפרויקט עדיין נטענים:

```bash
claude --agent code-reviewer
```

כדי להפוך זאת לברירת מחדל לכל session בפרויקט, מגדירים `agent` ב-`.claude/settings.json` (הדגל ב-CLI גובר על ההגדרה אם שניהם קיימים):

```json
{
  "agent": "code-reviewer"
}
```

## מיקומי קבצים וטווח (Scope)

subagents הם קבצי Markdown עם YAML frontmatter, ומאחסנים אותם במיקומים שונים לפי טווח. כשכמה subagents חולקים אותו `name`, המיקום בעדיפות הגבוהה יותר מנצח.

| מיקום | טווח | עדיפות | איך יוצרים |
|:--|:--|:--|:--|
| Managed settings | כלל הארגון | 1 (הגבוהה) | פריסה דרך managed settings |
| דגל `--agents` ב-CLI | ה-session הנוכחי | 2 | העברת JSON בהפעלת Claude Code |
| `.claude/agents/` | הפרויקט הנוכחי | 3 | אינטראקטיבי או ידני |
| `~/.claude/agents/` | כל הפרויקטים שלך | 4 | אינטראקטיבי או ידני |
| תיקיית `agents/` של plugin | היכן שה-plugin מופעל | 5 (הנמוכה) | מותקן עם plugins |

**subagents של פרויקט** (`.claude/agents/`) מתאימים ל-subagents ספציפיים ל-codebase — מומלץ להכניס אותם ל-version control כדי שהצוות ישתמש וישפר אותם. הם מתגלים ע"י טיפוס מעלה מתיקיית העבודה הנוכחית. **subagents של משתמש** (`~/.claude/agents/`) הם אישיים וזמינים בכל הפרויקטים שלך.

Claude Code סורק את `.claude/agents/` ואת `~/.claude/agents/` באופן רקורסיבי, כך שאפשר לארגן הגדרות לתת-תיקיות כמו `agents/review/` או `agents/research/`. נתיב תת-התיקייה לא משפיע על האופן שבו subagent מזוהה — הזהות נובעת רק משדה ה-`name`. יש לשמור על ערכי `name` ייחודיים בכל העץ: אם שני קבצים באותו scope מצהירים על אותו שם, Claude Code שומר אחד ומשליך את השני ללא אזהרה.

### subagents מוגדרים דרך CLI

אפשר להגדיר subagents כ-JSON בעת הפעלת Claude Code. הם קיימים רק לאותו session ואינם נשמרים לדיסק — שימושי לבדיקות מהירות או scripts. אפשר להגדיר כמה ב-קריאת `--agents` אחת:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger. Analyze errors, identify root causes, and provide fixes."
  }
}'
```

הדגל `--agents` מקבל את אותם שדות frontmatter כמו subagents מבוססי-קובץ. משתמשים ב-`prompt` עבור ה-system prompt, מקביל ל-body של ה-Markdown בקבצים.

**subagents של plugins** מגיעים מ-plugins שהותקנו, ומופיעים ב-`/agents` לצד ה-subagents המותאמים. מסיבות אבטחה, subagents של plugins אינם תומכים בשדות `hooks`, `mcpServers` או `permissionMode` — שדות אלה מתעלמים מהם בעת טעינה מ-plugin. אם צריך אותם, מעתיקים את קובץ ה-agent ל-`.claude/agents/` או `~/.claude/agents/`.

## שדות Frontmatter נתמכים

רק `name` ו-`description` הם חובה.

| שדה | חובה | תיאור |
|:--|:--|:--|
| `name` | כן | מזהה ייחודי באותיות קטנות ומקפים. hooks מקבלים ערך זה כ-`agent_type`. שם הקובץ אינו חייב להתאים |
| `description` | כן | מתי Claude אמור להאציל ל-subagent הזה |
| `tools` | לא | הכלים שה-subagent יכול להשתמש בהם. יורש את כל הכלים אם מושמט |
| `disallowedTools` | לא | כלים לחסום, מוסרים מהרשימה הנורשת או המצוינת |
| `model` | לא | המודל לשימוש: `sonnet`, `opus`, `haiku`, מזהה מלא (למשל `claude-opus-4-8`), או `inherit`. ברירת מחדל: `inherit` |
| `permissionMode` | לא | מצב הרשאות: `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, או `plan`. מתעלמים ממנו ב-plugin subagents |
| `maxTurns` | לא | מספר מקסימלי של agentic turns לפני שה-subagent עוצר |
| `skills` | לא | skills לטעינה מראש ל-context של ה-subagent בתחילתו. התוכן המלא מוזרק, לא רק ה-description |
| `mcpServers` | לא | MCP servers הזמינים ל-subagent הזה. מתעלמים ממנו ב-plugin subagents |
| `hooks` | לא | hooks של מחזור-חיים מוגבלים ל-subagent הזה. מתעלמים ממנו ב-plugin subagents |
| `memory` | לא | טווח זיכרון מתמשך: `user`, `project`, או `local`. מאפשר למידה חוצת-sessions |
| `background` | לא | `true` כדי להריץ תמיד את ה-subagent כמשימת רקע. ברירת מחדל: `false` |
| `effort` | לא | רמת effort בעת פעילות ה-subagent. גוברת על רמת ה-effort של ה-session. אפשרויות: `low`, `medium`, `high`, `xhigh`, `max` |
| `isolation` | לא | `worktree` כדי להריץ ב-git worktree זמני, עם עותק מבודד של ה-repository |
| `color` | לא | צבע תצוגה ברשימת המשימות וב-transcript: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, או `cyan` |
| `initialPrompt` | לא | מוגש אוטומטית כתור המשתמש הראשון כשה-agent רץ כ-agent הראשי (דרך `--agent` או הגדרת `agent`) |

## שליטה ביכולות ה-Subagent

### כלים זמינים

subagents יורשים את הכלים הפנימיים וכלי ה-MCP הזמינים בשיחה הראשית כברירת מחדל. הכלים הבאים תלויים ב-UI או ב-session state ואינם זמינים ל-subagents גם אם רשומים בשדה `tools`: `Agent`, `AskUserQuestion`, `EnterPlanMode`, `ExitPlanMode` (אלא אם ה-`permissionMode` הוא `plan`), `ScheduleWakeup`, ו-`WaitForMcpServers`.

כדי להגביל כלים, משתמשים בשדה `tools` (allowlist) או `disallowedTools` (denylist). הדוגמה הזו מתירה אך ורק את Read, Grep, Glob ו-Bash — ה-subagent לא יכול לערוך קבצים, לכתוב קבצים, או להשתמש בכלי MCP:

```yaml
---
name: safe-researcher
description: Research agent with restricted capabilities
tools: Read, Grep, Glob, Bash
---
```

הדוגמה הזו משתמשת ב-`disallowedTools` כדי לרשת כל כלי מהשיחה הראשית פרט ל-Write ו-Edit:

```yaml
---
name: no-writes
description: Inherits every tool except file writes
disallowedTools: Write, Edit
---
```

אם שניהם מוגדרים, `disallowedTools` מוחל קודם, ואז `tools` נפתר מול המאגר שנותר. כלי שרשום בשניהם — מוסר.

### בחירת מודל

שדה `model` שולט באיזה מודל ה-subagent משתמש: alias (`sonnet`, `opus`, `haiku`), מזהה מלא (למשל `claude-opus-4-8`), או `inherit` (אותו מודל כמו השיחה הראשית). אם לא צוין, ברירת המחדל היא `inherit`. סדר הפתרון: משתנה הסביבה `CLAUDE_CODE_SUBAGENT_MODEL`, ואז פרמטר `model` לכל invocation, ואז שדה `model` בהגדרה, ולבסוף מודל השיחה הראשית.

### מצבי הרשאות

שדה `permissionMode` שולט באופן שבו ה-subagent מטפל ב-prompts של הרשאות.

| מצב | התנהגות |
|:--|:--|
| `default` | בדיקת הרשאות רגילה עם prompts |
| `acceptEdits` | קבלה אוטומטית של עריכות קבצים ופקודות filesystem נפוצות בנתיבים בתיקיית העבודה |
| `auto` | classify ברקע בודק פקודות וכתיבות לתיקיות מוגנות |
| `dontAsk` | דחייה אוטומטית של prompts (כלים שהותרו במפורש עדיין עובדים) |
| `bypassPermissions` | דילוג על prompts של הרשאות |
| `plan` | plan mode (exploration ב-read-only) |

יש להשתמש ב-`bypassPermissions` בזהירות — הוא מדלג על כל ה-prompts, כולל כתיבות ל-`.git`, `.claude`, `.vscode` ועוד. אם ה-parent משתמש ב-`bypassPermissions` או `acceptEdits`, זה גובר ולא ניתן לעקיפה. אם ה-parent ב-auto mode, ה-subagent יורש auto mode וה-`permissionMode` שלו מתעלם.

### טעינת skills מראש

שדה `skills` מזריק תוכן skill ל-context של ה-subagent בתחילתו, ונותן לו ידע דומיין בלי שיצטרך לגלות ולטעון skills בזמן ריצה:

```yaml
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---

Implement API endpoints. Follow the conventions and patterns from the preloaded skills.
```

השדה שולט אילו skills נטענים מראש, לא אילו skills ה-subagent יכול לגשת אליהם — בלעדיו, ה-subagent עדיין יכול לגלות ולהפעיל skills של פרויקט, משתמש ו-plugin דרך כלי ה-Skill. אי אפשר לטעון מראש skills שמגדירים `disable-model-invocation: true`.

### זיכרון מתמשך

שדה `memory` נותן ל-subagent תיקייה מתמשכת ששורדת בין שיחות, לבניית ידע לאורך זמן (דפוסי codebase, תובנות debugging, החלטות ארכיטקטוניות):

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
memory: user
---

You are a code reviewer. As you review code, update your agent memory with
patterns, conventions, and recurring issues you discover.
```

| Scope | מיקום | מתי להשתמש |
|:--|:--|:--|
| `user` | `~/.claude/agent-memory/<name-of-agent>/` | ה-subagent צריך לזכור למידה בכל הפרויקטים |
| `project` | `.claude/agent-memory/<name-of-agent>/` | הידע ספציפי לפרויקט וניתן לשיתוף דרך version control |
| `local` | `.claude/agent-memory-local/<name-of-agent>/` | הידע ספציפי לפרויקט אך לא אמור להיכנס ל-version control |

`project` היא ברירת המחדל המומלצת. כשזיכרון מופעל, ה-system prompt של ה-subagent כולל הוראות לקריאה וכתיבה לתיקיית הזיכרון, את 200 השורות הראשונות או 25KB של `MEMORY.md` (המוקדם מביניהם), וכלי Read, Write ו-Edit מופעלים אוטומטית.

### חוקים מותנים עם hooks

לשליטה דינמית יותר על שימוש בכלים, משתמשים ב-hooks מסוג `PreToolUse` לאימות פעולות לפני ביצוען. הדוגמה הזו יוצרת subagent שמתיר רק שאילתות database ל-read-only:

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

ה-hook מקבל JSON דרך stdin עם הפקודה ב-`tool_input.command`. ה-script מחלץ את הפקודה ויוצא עם exit code 2 כדי לחסום פעולות כתיבה ולהחזיר הודעת שגיאה ל-Claude.

### השבתת subagents ספציפיים

אפשר למנוע מ-Claude להשתמש ב-subagents ספציפיים ע"י הוספתם למערך `deny` ב-settings, בפורמט `Agent(subagent-name)`. זה עובד גם ל-subagents מובנים וגם מותאמים:

```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(my-custom-agent)"]
  }
}
```

## הרצת subagents — foreground או background

**subagents ב-foreground** חוסמים את השיחה הראשית עד שמסתיימים, ו-prompts של הרשאות מועברים אליך כשהם עולים. **subagents ב-background** רצים במקביל בזמן שאתה ממשיך לעבוד — הם רצים עם ההרשאות שכבר ניתנו ב-session, ודוחים אוטומטית כל קריאת כלי שהייתה דורשת prompt. אם subagent ברקע נכשל בגלל הרשאות חסרות, אפשר להתחיל subagent חדש ב-foreground עם אותה משימה כדי לנסות שוב עם prompts אינטראקטיביים.

Claude מחליט אם להריץ ב-foreground או background לפי המשימה. אפשר גם לבקש "run this in the background", או ללחוץ **Ctrl+B** כדי להעביר משימה רצה לרקע. כדי להשבית את כל פונקציונליות הרקע, מגדירים את משתנה הסביבה `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` ל-`1`.

## דפוסי עבודה נפוצים

### בידוד פעולות בנפח גבוה

אחד השימושים היעילים ביותר ל-subagents הוא בידוד פעולות שמייצרות הרבה output. הרצת tests, שליפת תיעוד, או עיבוד קבצי log יכולים לצרוך context משמעותי. בהאצלתם ל-subagent, ה-output המפורט נשאר ב-context שלו ורק הסיכום הרלוונטי חוזר לשיחה הראשית:

```text
Use a subagent to run the test suite and report only the failing tests with their error messages
```

### מחקר מקבילי

לחקירות עצמאיות, אפשר לייצר מספר subagents שיעבדו בו-זמנית. כל אחד חוקר את התחום שלו, ואז Claude מסנתז את הממצאים. זה עובד הכי טוב כשנתיבי המחקר לא תלויים זה בזה:

```text
Research the authentication, database, and API modules in parallel using separate subagents
```

### שרשור subagents

ל-workflows רב-שלביים, אפשר לבקש מ-Claude להשתמש ב-subagents ברצף. כל subagent מסיים את משימתו ומחזיר תוצאות, ואז Claude מעביר context רלוונטי ל-subagent הבא:

```text
Use the code-reviewer subagent to find performance issues, then use the optimizer subagent to fix them
```

## subagent מול שיחה ראשית

משתמשים ב-**שיחה הראשית** כשהמשימה דורשת הלוך-ושוב תכוף או חידוד איטרטיבי, כשכמה שלבים חולקים context משמעותי (תכנון → מימוש → testing), כששינוי מהיר וממוקד, או כש-latency חשוב (subagents מתחילים מאפס ועשויים להזדקק לזמן לאיסוף context).

משתמשים ב-**subagents** כשהמשימה מייצרת output מפורט שאינך צריך ב-context הראשי, כשרוצים לאכוף הגבלות כלים או הרשאות, או כשהעבודה עצמאית ויכולה להחזיר סיכום.

כדאי לשקול **Skills** במקום זאת כשרוצים prompts או workflows לשימוש חוזר שרצים ב-context של השיחה הראשית במקום ב-context מבודד של subagent. לשאלה מהירה על משהו שכבר בשיחה, עדיף `/btw` — היא רואה את כל ה-context אך אין לה גישה לכלים, והתשובה נזרקת במקום להתווסף להיסטוריה.

החל מ-Claude Code v2.1.172, subagents יכולים לייצר subagents משלהם. Subagents ב-foreground יכולים לבצע nesting בכל עומק. Subagents ב-background מוגבלים ל-5 רמות עומק — הרמה החמישית אינה מקבלת את כלי ה-Agent ולא יכולה לפצל הלאה. כדי למנוע מ-subagent ספציפי לייצר subagents נוספים, יש להשמיט את `Agent` מרשימת ה-`tools` שלו.

## מה נטען בתחילת subagent

כל subagent מתחיל עם context window טרי ומבודד. הוא לא רואה את היסטוריית השיחה שלך, את ה-skills שכבר הפעלת, או את הקבצים ש-Claude כבר קרא. ה-context ההתחלתי של subagent (שאינו fork) מכיל את ה-**System prompt** (ה-prompt של ה-agent עצמו בתוספת פרטי סביבה, לא כל ה-system prompt של Claude Code), את ה-**Task message** (prompt ההאצלה ש-Claude כותב), את **CLAUDE.md וזיכרון** (כל רמות היררכיית הזיכרון; Explore ו-Plan מדלגים על זה), את **Git status** (snapshot מתחילת ה-session האב; Explore ו-Plan מדלגים), ואת ה-**skills שנטענו מראש** (התוכן המלא של כל skill בשדה `skills`).

Explore ו-Plan הם ה-subagents היחידים שמשמיטים CLAUDE.md ו-git status, ואין שדה frontmatter או הגדרה לשנות זאת. אם חוק חייב להגיע ל-subagent (למשל "התעלם מתיקיית `vendor/`"), יש לחזור עליו ב-prompt שאתה נותן ל-Claude בעת ההאצלה.

## Fork של השיחה הנוכחית

forked subagents הם ניסיוניים ודורשים Claude Code v2.1.117 ומעלה. מפעילים אותם ע"י הגדרת משתנה הסביבה `CLAUDE_CODE_FORK_SUBAGENT` ל-`1`.

fork הוא subagent שיורש את כל השיחה עד כה במקום להתחיל מאפס. זה מבטל את בידוד הקלט ש-subagents מספקים בדרך כלל: fork רואה את אותו system prompt, כלים, מודל והיסטוריית הודעות כמו ה-session הראשי, כך שאפשר למסור לו side task בלי להסביר מחדש את המצב. קריאות הכלי של ה-fork עדיין נשארות מחוץ לשיחה, ורק התוצאה הסופית חוזרת. כדאי להשתמש ב-fork כש-subagent בעל שם היה צריך יותר מדי רקע כדי להיות שימושי, או כשרוצים לנסות כמה גישות במקביל מאותה נקודת התחלה.

הפעלת fork mode משנה את Claude Code בשלוש דרכים: Claude מייצר fork בכל פעם שהיה משתמש ב-subagent מסוג general-purpose; כל יצירת subagent רצה ברקע; והפקודה `/fork` מייצרת fork. אפשר להתחיל fork עם `/fork` ואחריו directive:

```text
/fork draft unit tests for the parser changes so far
```

ה-fork מופיע ב-panel מתחת ל-prompt ורץ ברקע בזמן שאתה ממשיך לעבוד. כשהוא מסיים, התוצאה מגיעה כהודעה בשיחה הראשית. בגלל שה-system prompt והגדרות הכלים של ה-fork זהים ל-parent, הבקשה הראשונה שלו עושה שימוש חוזר ב-prompt cache של ה-parent, מה שמוזיל את ה-fork לעומת יצירת subagent טרי. fork לא יכול לייצר forks נוספים.

## דוגמאות subagents

### Code reviewer

subagent ב-read-only שסוקר קוד מבלי לשנותו, עם גישת כלים מוגבלת (ללא Edit או Write):

```markdown
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### Debugger

subagent שיכול גם לנתח וגם לתקן בעיות. בניגוד ל-code reviewer, הוא כולל את Edit כי תיקון באגים דורש שינוי קוד:

```markdown
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not the symptoms.
```

### Data scientist

subagent ספציפי-דומיין לעבודת ניתוח נתונים, שמגדיר במפורש `model: sonnet` לניתוח מתוחכם יותר:

```markdown
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Always ensure queries are efficient and cost-effective.
```

## Best practices

יש לתכנן subagents ממוקדים — כל subagent צריך להצטיין במשימה ספציפית אחת. יש לכתוב `description` מפורט — Claude משתמש בו כדי להחליט מתי להאציל. יש להגביל גישת כלים — להעניק רק הרשאות נחוצות לאבטחה ולמיקוד. ויש להכניס ל-version control — לשתף subagents של פרויקט עם הצוות.
