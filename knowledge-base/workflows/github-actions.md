---
title: "Claude Code ב-GitHub Actions — אוטומציה עם @claude"
published: "2026-08-01T12:00:00+03:00"
category: workflows
layer: intermediate
last_verified: 2026-08-01
status: needs-review
source_url: https://code.claude.com/docs/en/github-actions
related: [slash-code-review, dynamic-workflows, parallel-agents]
mission: automate
pathOrder: 1
level: intermediate
type: recipe
tool: claude-code
origin: official
timeMinutes: 4
---

Claude Code GitHub Actions מביאה אוטומציה מבוססת-AI לתהליך GitHub. עם תיוג `@claude` בכל PR או issue, קלוד יכול לנתח קוד, ליצור pull requests, לממש פיצ'רים ולתקן באגים — תוך כיבוד הסטנדרטים של הפרויקט. לביקורות אוטומטיות שמתפרסמות בכל PR ללא trigger, ראו [Code Review](slash-code-review).

## מה אפשר לעשות

- **יצירת PR מיידית**: תארו מה אתם צריכים, וקלוד יוצר PR שלם עם כל השינויים הנדרשים
- **מימוש קוד מ-issues**: הפכו issues לקוד עובד עם פקודה יחידה
- **כיבוד הסטנדרטים**: קלוד מכבד את קובץ `CLAUDE.md` שלכם ודפוסי הקוד הקיימים
- **ברירת מחדל מאובטחת**: הקוד שלכם נשאר על runners של GitHub

## התקנה מהירה

הריצו `/install-github-app` בטרמינל Claude Code. הפקודה מתקינה את אפליקציית Claude GitHub על הריפו שלכם ומנחה אתכם להוסיף workflows ו-API key secret.

שימו לב: דרוש להיות אדמין של הריפו. שיטה זו זמינה למשתמשי Claude API ישירים בלבד. לשימוש עם Amazon Bedrock או Google Cloud, עיינו בתיעוד המתאים.

## התקנה ידנית

אם `/install-github-app` נכשל או אם מעדיפים הגדרה ידנית:

**שלב 1** — התקינו את אפליקציית Claude GitHub על הריפו: [https://github.com/apps/claude](https://github.com/apps/claude)

האפליקציה מבקשת הרשאות read & write עבור Contents, Issues, ו-Pull requests.

**שלב 2** — הוסיפו `ANTHROPIC_API_KEY` ל-secrets של הריפו.

**שלב 3** — העתיקו את קובץ ה-workflow מ-[examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) לתוך `.github/workflows/` בריפו שלכם.

## דוגמת workflow בסיסי

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

ה-workflow הזה עונה לתיוגי `@claude` בתגובות.

## דוגמת אוטומציה עם prompt

```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
          claude_args: "--model opus"
```

## שימוש עם Skills

ניתן להעביר הפעלת skill כ-`prompt`. לדוגמה, לשימוש ב-skill מ-plugin שמותקן דרך marketplace — מציינים `plugin_marketplaces`, `plugins`, ואת הפקודה המלאה של ה-skill בשדה `prompt`. הפקודה עוברת לסשן של קלוד כמו כל prompt רגיל, ויכולה לכלול משתני הקשר של GitHub מה-workflow.

## דוגמאות שימוש בתגובות

בתגובות ל-issue או PR:

```
@claude implement this feature based on the issue description
@claude how should I implement user authentication for this endpoint?
@claude fix the TypeError in the user dashboard component
```

## שינויים עיקריים מגרסת Beta לגרסת GA (v1.0)

| קלט Beta | קלט v1.0 |
| :--- | :--- |
| `mode` | הוסר — מזוהה אוטומטית |
| `direct_prompt` | `prompt` |
| `custom_instructions` | `claude_args: --append-system-prompt` |
| `max_turns` | `claude_args: --max-turns` |
| `model` | `claude_args: --model` |
| `allowed_tools` | `claude_args: --allowedTools` |

## שיקולי עלות

שימוש ב-Claude Code GitHub Actions כרוך בשני סוגי עלויות: דקות GitHub Actions (על runners), וטוקני API (לפי אורך הפרומפטים וגודל הריפו).
