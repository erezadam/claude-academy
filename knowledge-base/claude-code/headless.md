---
title: "Headless Mode — הפעלת Claude Code ללא אינטראקציה"
published: 2026-07-25
category: claude-code
layer: intermediate
last_verified: 2026-07-29
status: needs-review
source_url: https://code.claude.com/docs/en/headless
related: [sessions, sub-agents, sandboxing, slash-commands-all]
mission: automate
pathOrder: 6
level: advanced
type: guide
tool: claude-code
origin: official
timeMinutes: 3
---

Headless mode מאפשר להפעיל את Claude Code בצורה לא-אינטראקטיבית — ב-scripts, CI/CD, ו-pipelines — באמצעות הדגל `-p` (ראשי תיבות של `--print`).

## מה זה עושה / למה זה שימושי

דגל `-p` מריץ prompt אחד ומסיים: Claude מקבל את ה-prompt, מבצע את הפעולות, ומחזיר תשובה ב-stdout. אין UI אינטראקטיבי, אין המתנה לקלט. מתאים לשילוב עם כלים כמו `grep`, `jq`, ו-CI pipelines.

```bash
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
```

## איך משתמשים

### שימוש בסיסי

```bash
claude -p "What does the auth module do?"
```

### Bare mode — הפעלה מהירה יותר

הדגל `--bare` מדלג על auto-discovery של hooks, skills, plugins, MCP servers, auto memory ו-CLAUDE.md. שימושי ל-CI כדי לקבל תוצאה עקבית בכל מכונה:

```bash
claude --bare -p "Summarize this file" --allowedTools "Read"
```

ב-bare mode נדרש `ANTHROPIC_API_KEY` (אין OAuth). לטעינת הגדרות ספציפיות, העבר אותן ב-flags:

| לטעינת... | השתמש ב |
|:--|:--|
| הוספות ל-system prompt | `--append-system-prompt` / `--append-system-prompt-file` |
| הגדרות | `--settings <file-or-json>` |
| שרתי MCP | `--mcp-config <file-or-json>` |
| agents מותאמים | `--agents <json>` |
| plugin | `--plugin-dir <path>` / `--plugin-url <url>` |

### Pipe נתונים דרך Claude

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

stdin מוגבל ל-10MB. לקלט גדול יותר, כתוב לקובץ והפנה לנתיב.

### אוטומציה ב-package.json

```json
{
  "scripts": {
    "lint:claude": "git diff main | claude -p \"you are a typo linter. for each typo in this diff, report filename:line on one line and the issue on the next. return nothing else.\""
  }
}
```

### פורמט פלט

```bash
claude -p "Summarize this project" --output-format json
```

| `--output-format` | תיאור |
|:--|:--|
| `text` | פלט טקסט רגיל (ברירת מחדל) |
| `json` | JSON עם result, session ID ומטה-data |
| `stream-json` | JSON מפוצל לשורות לstreaming בזמן אמת |

### Structured Output עם JSON Schema

```bash
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

התוצאה ב-field `structured_output` בתוך ה-JSON.

### Streaming

```bash
claude -p "Explain recursion" --output-format stream-json --verbose --include-partial-messages
```

### אישור כלים אוטומטי

```bash
claude -p "Run the test suite and fix any failures" \
  --allowedTools "Bash,Read,Edit"
```

לאישור כל ה-filesystem writes ללא prompt:

```bash
claude -p "Apply the lint fixes" --permission-mode acceptEdits
```

### יצירת commit

```bash
claude -p "Look at my staged changes and create an appropriate commit" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

`Bash(git diff *)` מתיר כל פקודה שמתחילה ב-`git diff`. הרווח לפני `*` חשוב.

### המשך שיחה

```bash
claude -p "Review this codebase for performance issues"
claude -p "Now focus on the database queries" --continue
claude -p "Generate a summary of all issues found" --continue
```

עם session ID ספציפי:

```bash
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

### התאמת system prompt

```bash
gh pr diff "$1" | claude -p \
  --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
  --output-format json
```

## הערות חשובות

Skills מוגדרים-משתמש עובדים ב-`-p` mode: כלול `/skill-name` ב-prompt string. פקודות terminal-only כמו `/login` אינן זמינות.

`--bare` הוא המצב המומלץ לקריאות scripted ו-SDK, ויהפוך לברירת מחדל עבור `-p` בגרסה עתידית.
