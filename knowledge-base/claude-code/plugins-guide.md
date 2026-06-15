---
title: "Plugins — חבילות הרחבה לשיתוף"
category: claude-code
layer: intermediate
last_verified: 2026-05-30
created: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/plugins
related: [skills, sub-agents, hooks, mcp, plugin-marketplaces]
---

## Plugins

Plugin הוא דרך לארוז פונקציונליות מותאמת ל-Claude Code ולשתף אותה בין פרויקטים וצוותים. Plugin הוא תיקייה עם manifest בשם `plugin.json` (שיושב בתת-תיקייה `.claude-plugin/`), והוא יכול לכלול skills, agents, hooks ו-MCP servers. המדריך הזה עוסק ביצירת plugins משלך — אם אתה מחפש להתקין plugins קיימים, זה נושא נפרד.

---

## מה זה עושה / למה זה שימושי

Claude Code תומך בשתי דרכים להוסיף skills, agents ו-hooks: קונפיגורציה standalone בתיקיית `.claude/`, או plugin עם manifest. ההבדל המעשי הוא שיתוף, namespacing וגרסאות.

| גישה | שמות Skills | הכי מתאים ל |
|:--|:--|:--|
| **Standalone** (תיקיית `.claude/`) | `/hello` | workflows אישיים, התאמות לפרויקט יחיד, ניסויים מהירים |
| **Plugins** (תיקייה עם `.claude-plugin/plugin.json`) | `/plugin-name:hello` | שיתוף עם הצוות, הפצה לקהילה, releases עם גרסאות, שימוש חוזר בכמה פרויקטים |

השתמש ב-**standalone** כשאתה מתאים את Claude Code לפרויקט בודד, כשהקונפיגורציה אישית ולא צריכה שיתוף, כשאתה מתנסה ב-skills או hooks לפני אריזה, או כשאתה רוצה שמות קצרים כמו `/hello` או `/deploy`.

השתמש ב-**plugin** כשאתה רוצה לשתף פונקציונליות עם הצוות או הקהילה, כשאתה צריך את אותם skills/agents בכמה פרויקטים, כשאתה רוצה ניהול גרסאות ועדכונים קלים, כשאתה מפיץ דרך marketplace, וכשאתה בסדר עם skills בעלי namespace כמו `/my-plugin:hello` (ה-namespacing מונע קונפליקטים בין plugins שונים). דרך טובה להתחיל היא standalone לאיטרציה מהירה, ולהמיר ל-plugin כשמוכנים לשתף.

---

## איך משתמשים — Quickstart

ה-quickstart בונה plugin עם skill מותאם: יוצרים manifest, מוסיפים skill, ובודקים מקומית עם הדגל `--plugin-dir`. תנאי מקדים: Claude Code מותקן ומאומת. אם הפקודה `/plugin` לא מופיעה, יש לעדכן את Claude Code לגרסה האחרונה.

### שלב 1 — צור את תיקיית ה-plugin

```bash
mkdir my-first-plugin
```

### שלב 2 — צור את ה-manifest

קובץ ה-manifest ב-`.claude-plugin/plugin.json` מגדיר את זהות ה-plugin: שם, תיאור וגרסה. Claude Code משתמש ב-metadata הזה כדי להציג את ה-plugin במנהל ה-plugins.

```bash
mkdir my-first-plugin/.claude-plugin
```

צור את `my-first-plugin/.claude-plugin/plugin.json` עם התוכן:

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

| שדה | תפקיד |
|:--|:--|
| `name` | מזהה ייחודי ו-namespace של ה-skills. skills מקבלים את זה כ-prefix (למשל `/my-first-plugin:hello`) |
| `description` | מוצג במנהל ה-plugins בעת עיון או התקנה |
| `version` | אופציונלי. אם מוגדר, משתמשים מקבלים עדכונים רק כשמגדילים אותו. אם מושמט וה-plugin מופץ דרך git, ה-commit SHA משמש כגרסה וכל commit נחשב גרסה חדשה |
| `author` | אופציונלי. שימושי לייחוס |

### שלב 3 — הוסף skill

Skills נמצאים בתיקיית `skills/`. כל skill הוא תיקייה עם קובץ `SKILL.md`. שם התיקייה הופך לשם ה-skill, מקדים ב-namespace של ה-plugin (התיקייה `hello/` ב-plugin בשם `my-first-plugin` יוצרת `/my-first-plugin:hello`).

```bash
mkdir -p my-first-plugin/skills/hello
```

צור את `my-first-plugin/skills/hello/SKILL.md`:

```markdown
---
description: Greet the user with a friendly message
disable-model-invocation: true
---

Greet the user warmly and ask how you can help them today.
```

### שלב 4 — בדוק את ה-plugin

הרץ את Claude Code עם הדגל `--plugin-dir` כדי לטעון את ה-plugin:

```bash
claude --plugin-dir ./my-first-plugin
```

אחרי ש-Claude Code עולה, נסה את ה-skill החדש:

```shell
/my-first-plugin:hello
```

Claude יגיב בברכה. הרצת `/help` תציג את ה-skill תחת ה-namespace של ה-plugin. skills של plugin תמיד מקבלים namespace (כמו `/my-first-plugin:hello`) כדי למנוע קונפליקטים כששני plugins מכילים skill באותו שם. כדי לשנות את ה-prefix, עדכן את השדה `name` ב-`plugin.json`.

### שלב 5 — הוסף ארגומנטים ל-skill

כדי להפוך את ה-skill לדינמי, ה-placeholder `$ARGUMENTS` קולט כל טקסט שהמשתמש מספק אחרי שם ה-skill.

```markdown
---
description: Greet the user with a personalized message
---

# Hello Skill

Greet the user named "$ARGUMENTS" warmly and ask how you can help them today. Make the greeting personal and encouraging.
```

הרץ `/reload-plugins` כדי לקלוט את השינויים, ואז נסה את ה-skill עם שם:

```shell
/my-first-plugin:hello Alex
```

Claude יברך אותך בשמך.

---

## פיתוח plugin בתוך תיקיית ה-skills

במקום להעביר `--plugin-dir` בכל הפעלה, אפשר לשמור plugin בתיקיית ה-skills ולתת ל-Claude Code לטעון אותו אוטומטית. הפקודה `claude plugin init` יוצרת שלד כזה:

```bash
claude plugin init my-tool
```

זה יוצר את `~/.claude/skills/my-tool/` עם manifest `.claude-plugin/plugin.json` וקובץ `SKILL.md` ראשוני. בסשן הבא הוא נטען כ-`my-tool@skills-dir` ללא marketplace וללא שלב התקנה.

---

## מבנה plugin

יצרת plugin עם skill, אבל plugins יכולים לכלול הרבה יותר: agents מותאמים, hooks, MCP servers, LSP servers ו-background monitors. טעות נפוצה: אסור להכניס את התיקיות `commands/`, `agents/`, `skills/` או `hooks/` לתוך `.claude-plugin/`. רק `plugin.json` נמצא בתוך `.claude-plugin/` — כל שאר התיקיות חייבות להיות ברמת השורש של ה-plugin.

| תיקייה | מיקום | תפקיד |
|:--|:--|:--|
| `.claude-plugin/` | שורש ה-plugin | מכיל את ה-manifest `plugin.json` (אופציונלי אם רכיבים משתמשים במיקומי ברירת מחדל) |
| `skills/` | שורש ה-plugin | Skills כתיקיות `<name>/SKILL.md` |
| `commands/` | שורש ה-plugin | Skills כקבצי Markdown שטוחים. ל-plugins חדשים השתמש ב-`skills/` |
| `agents/` | שורש ה-plugin | הגדרות agents מותאמים |
| `hooks/` | שורש ה-plugin | event handlers בקובץ `hooks.json` |
| `.mcp.json` | שורש ה-plugin | קונפיגורציות של MCP servers |
| `.lsp.json` | שורש ה-plugin | קונפיגורציות של LSP servers ל-code intelligence |
| `monitors/` | שורש ה-plugin | קונפיגורציות של background monitors בקובץ `monitors.json` |
| `bin/` | שורש ה-plugin | קבצי הרצה שמתווספים ל-`PATH` של כלי ה-Bash בזמן שה-plugin מופעל |
| `settings.json` | שורש ה-plugin | settings ברירת מחדל שמוחלים כשה-plugin מופעל |

---

## פיתוח plugins מורכבים יותר

### הוספת Skills

Plugins יכולים לכלול Agent Skills. Skills הם model-invoked: Claude משתמש בהם אוטומטית לפי הקשר המשימה. הוסף תיקיית `skills/` בשורש ה-plugin עם תיקיות skill שמכילות קבצי `SKILL.md`:

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── code-review/
        └── SKILL.md
```

כל `SKILL.md` מכיל YAML frontmatter והוראות. כלול `description` כדי ש-Claude ידע מתי להשתמש ב-skill:

```yaml
---
description: Reviews code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
---

When reviewing code, check for:
1. Code organization and structure
2. Error handling
3. Security concerns
4. Test coverage
```

אחרי התקנת ה-plugin, הרץ `/reload-plugins` כדי לטעון את ה-Skills.

### הוספת LSP servers

LSP (Language Server Protocol) plugins נותנים ל-Claude code intelligence בזמן אמת. עבור שפות נפוצות כמו TypeScript, Python ו-Rust, מומלץ להתקין את ה-LSP plugins המוכנים מה-marketplace הרשמי, וליצור LSP plugin מותאם רק כשצריך תמיכה בשפה שאין לה plugin רשמי. ליצירת plugin כזה, הוסף קובץ `.lsp.json`:

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

משתמשים שמתקינים את ה-plugin חייבים שיהיה מותקן אצלם ה-binary של ה-language server.

### הוספת background monitors

Background monitors מאפשרים ל-plugin לעקוב אחרי לוגים, קבצים או סטטוס חיצוני ברקע, ולהודיע ל-Claude כשאירועים מגיעים. Claude Code מפעיל כל monitor אוטומטית כשה-plugin פעיל, כך שאין צורך להנחות את Claude להתחיל את המעקב. הוסף קובץ `monitors/monitors.json` בשורש ה-plugin עם מערך של monitors:

```json
[
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log"
  }
]
```

כל שורת stdout מה-`command` נמסרת ל-Claude כהתראה במהלך הסשן.

### שילוח settings ברירת מחדל

Plugins יכולים לכלול קובץ `settings.json` בשורש שמחיל קונפיגורציית ברירת מחדל כשה-plugin מופעל. כרגע נתמכים רק המפתחות `agent` ו-`subagentStatusLine`. הגדרת `agent` מפעילה אחד מה-agents המותאמים של ה-plugin כ-thread הראשי — מחילה את ה-system prompt שלו, הגבלות הכלים והמודל. כך plugin יכול לשנות את התנהגות ברירת המחדל של Claude Code כשהוא מופעל:

```json
{
  "agent": "security-reviewer"
}
```

הדוגמה הזו מפעילה את ה-agent בשם `security-reviewer` שמוגדר בתיקיית `agents/` של ה-plugin. settings מ-`settings.json` גוברים על `settings` שמוצהרים ב-`plugin.json`. מפתחות לא מוכרים מתעלמים מהם בשקט.

### בדיקת plugins מקומית

הדגל `--plugin-dir` טוען plugin ישירות ללא צורך בהתקנה:

```bash
claude --plugin-dir ./my-plugin
```

הדגל מקבל גם ארכיון `.zip` של תיקיית ה-plugin (דורש Claude Code v2.1.128 ומעלה):

```bash
claude --plugin-dir ./my-plugin.zip
```

כשל-plugin שנטען עם `--plugin-dir` יש אותו שם כמו plugin מותקן מ-marketplace, העותק המקומי גובר באותו סשן — מה שמאפשר לבדוק שינויים ב-plugin מותקן בלי להסיר אותו. החריג: plugins ש-managed settings מאלצים להפעיל או להשבית — את אלה `--plugin-dir` לא יכול לעקוף.

תוך כדי שינויים, הרץ `/reload-plugins` כדי לקלוט עדכונים בלי restart. זה טוען מחדש plugins, skills, agents, hooks, MCP servers ו-LSP servers של plugins. בדוק רכיבים: נסה skills עם `/plugin-name:skill-name`, ודא ש-agents מופיעים ב-`/agents`, וודא ש-hooks עובדים. אפשר לטעון כמה plugins בבת אחת על ידי ציון הדגל כמה פעמים:

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

לבדיקת plugin שכבר ארוז כ-`.zip` ומתארח ב-URL (למשל artifact של CI), השתמש ב-`--plugin-url` במקום. Claude Code מוריד את הארכיון בהפעלה וטוען אותו לאותו סשן בלבד. אם ההורדה נכשלת או הארכיון לא תקין, Claude Code מדווח על שגיאת טעינה ומתחיל בלעדיו. כוון את הדגל רק לארכיונים שאתה שולט בהם או סומך עליהם:

```bash
claude --plugin-url https://example.com/my-plugin.zip --plugin-url https://example.com/other.zip
```

### דיבוג בעיות plugin

אם ה-plugin לא עובד כצפוי: בדוק את המבנה — ודא שהתיקיות בשורש ה-plugin ולא בתוך `.claude-plugin/`. בדוק רכיבים בנפרד — כל skill, agent ו-hook בנפרד. השתמש בכלי validation ודיבוג ייעודיים.

### שיתוף plugins

כשה-plugin מוכן לשיתוף: הוסף `README.md` עם הוראות התקנה ושימוש, בחר אסטרטגיית גרסאות (האם להגדיר `version` מפורש או להסתמך על ה-commit SHA), הפץ דרך plugin marketplace, ובדוק עם אחרים לפני הפצה רחבה. כדי לשמור plugin פנימי לצוות, ארח את ה-marketplace ב-repository פרטי.

---

## הגשה ל-marketplace הקהילתי

Anthropic מתחזקת שני marketplaces ציבוריים ל-plugins של Claude Code. `claude-plugins-official` הוא אוסף נבחר של plugins שמתוחזק על ידי Anthropic וזמין אוטומטית בכל התקנה של Claude Code. `claude-community` הוא ה-marketplace הקהילתי הציבורי שאליו מגיעות הגשות צד-שלישי אחרי סקירה. משתמשים מוסיפים אותו עם `/plugin marketplace add anthropics/claude-plugins-community` ומתקינים ממנו כ-`@claude-community`.

להגשת plugin לסקירה ב-marketplace הקהילתי, יש שני טפסים בתוך האפליקציה: ב-Claude.ai בכתובת [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit), וב-Console בכתובת [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit). הרץ `claude plugin validate` מקומית לפני ההגשה — pipeline הסקירה מריץ את אותה בדיקה על כל הגשה, יחד עם סינון בטיחות אוטומטי.

plugins מאושרים מוצמדים ל-commit SHA ספציפי בקטלוג של `anthropics/claude-plugins-community`, ו-CI מעדכן את ההצמדה אוטומטית ככל שאתה דוחף commits חדשים. הקטלוג הציבורי מסונכרן בלילה מ-pipeline הסקירה, כך שיכול להיות עיכוב בין אישור להופעת ה-plugin. ה-marketplace הרשמי, `claude-plugins-official`, נבחר בנפרד ולפי שיקול דעת Anthropic — אין תהליך הגשה, וטופס ההגשה לא מוסיף plugins ל-marketplace הרשמי.

---

## המרת קונפיגורציות קיימות ל-plugin

אם כבר יש לך skills או hooks בתיקיית `.claude/`, אפשר להמיר אותם ל-plugin לשיתוף והפצה קלים יותר.

### שלב 1 — צור את מבנה ה-plugin

```bash
mkdir -p my-plugin/.claude-plugin
```

צור את ה-manifest ב-`my-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "description": "Migrated from standalone configuration",
  "version": "1.0.0"
}
```

### שלב 2 — העתק את הקבצים הקיימים

```bash
# Copy commands
cp -r .claude/commands my-plugin/

# Copy agents (if any)
cp -r .claude/agents my-plugin/

# Copy skills (if any)
cp -r .claude/skills my-plugin/
```

### שלב 3 — העבר hooks

אם יש hooks ב-settings, צור תיקיית hooks והעתק את אובייקט ה-`hooks` מ-`.claude/settings.json` או `settings.local.json` — הפורמט זהה. הפקודה מקבלת את קלט ה-hook כ-JSON ב-stdin, אז השתמש ב-`jq` כדי לחלץ את נתיב הקובץ:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npm run lint:fix" }]
      }
    ]
  }
}
```

### מה משתנה בהמרה

| Standalone (`.claude/`) | Plugin |
|:--|:--|
| זמין רק בפרויקט אחד | ניתן לשיתוף דרך marketplaces |
| קבצים ב-`.claude/commands/` | קבצים ב-`plugin-name/commands/` |
| Hooks ב-`settings.json` | Hooks ב-`hooks/hooks.json` |
| צריך להעתיק ידנית כדי לשתף | התקנה עם `/plugin install` |

אחרי ההמרה אפשר להסיר את הקבצים המקוריים מ-`.claude/` כדי להימנע מכפילויות — גרסת ה-plugin גוברת כשהיא נטענת.
