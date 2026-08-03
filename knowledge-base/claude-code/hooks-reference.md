---
title: "מדריך עיון: אירועי Hooks ב-Claude Code"
published: "2026-08-01T12:00:00+03:00"
category: claude-code
layer: intermediate
last_verified: 2026-08-01
status: needs-review
source_url: https://code.claude.com/docs/en/hooks
related: [hooks-guide, slash-hooks, sandboxing, skills]
level: intermediate
type: reference
tool: claude-code
origin: official
timeMinutes: 3
---

Hooks הם פקודות shell, נקודות קצה HTTP, פרומפטים LLM, או כלי MCP שמופעלים אוטומטית בנקודות מוגדרות במחזור החיים של Claude Code. דף זה הוא מדריך עיון לכל האירועים, הסכמה, ומיקומי ההגדרה. להתחלה מהירה עם דוגמאות ראו [מדריך Hooks](hooks-guide).

## טבלת אירועים

| אירוע | מתי מופעל |
| :--- | :--- |
| `SessionStart` | בתחילת סשן חדש או כשממשיכים סשן קיים |
| `Setup` | עם `--init-only`, או `--init`/`--maintenance` במצב `-p` |
| `UserPromptSubmit` | כשמגישים פרומפט, לפני שקלוד מעבד אותו |
| `UserPromptExpansion` | כשפקודת משתמש מתרחבת לפרומפט, לפני שמגיעה לקלוד |
| `PreToolUse` | לפני ביצוע קריאת כלי — יכול לחסום |
| `PermissionRequest` | כשקריאת כלי דורשת החלטת הרשאה |
| `PermissionDenied` | כשמסווג auto mode דוחה קריאת כלי; `{retry: true}` מאפשר ניסיון חוזר |
| `PostToolUse` | אחרי שקריאת כלי הצליחה |
| `PostToolUseFailure` | אחרי שקריאת כלי נכשלה |
| `PostToolBatch` | אחרי שאצווה שלמה של קריאות כלי מקבילות נפתרה, לפני קריאת המודל הבאה |
| `Notification` | כשClaude Code שולח התראה |
| `MessageDisplay` | בזמן שטקסט הודעת עוזר מוצג |
| `SubagentStart` | כשסוכן-משנה נוצר |
| `SubagentStop` | כשסוכן-משנה מסיים |
| `TaskCreated` | כשמשימה נוצרת דרך `TaskCreate` |
| `TaskCompleted` | כשמשימה מסומנת כמושלמת |
| `Stop` | כשקלוד מסיים לענות |
| `StopFailure` | כשהתור מסתיים בגלל שגיאת API; הפלט וקוד היציאה מתעלמים מהם |
| `TeammateIdle` | כשחבר צוות ב-agent team עומד להיכנס למצב בטל |
| `InstructionsLoaded` | כשקובץ CLAUDE.md או `.claude/rules/*.md` נטען להקשר |
| `ConfigChange` | כשקובץ תצורה משתנה במהלך סשן |
| `CwdChanged` | כשספריית העבודה משתנה, לדוגמה כשקלוד מריץ פקודת `cd` |
| `FileChanged` | כשקובץ עקוב משתנה בדיסק; `matcher` מציין אילו שמות קבצים לעקוב |
| `WorktreeCreate` | כשנוצר worktree חדש דרך `--worktree` או `isolation: "worktree"` |
| `WorktreeRemove` | כשworktree מוסר |
| `PreCompact` | לפני דחיסת הקשר |
| `PostCompact` | אחרי השלמת דחיסת הקשר |
| `Elicitation` | כששרת MCP מבקש קלט משתמש במהלך קריאת כלי |
| `ElicitationResult` | אחרי שמשתמש עונה לבקשת Elicitation, לפני שהתשובה נשלחת לשרת |
| `SessionEnd` | כשסשן מסתיים |

## מיקומי הגדרת Hook

| מיקום | טווח | ניתן לשיתוף |
| :--- | :--- | :--- |
| `~/.claude/settings.json` | כל הפרויקטים שלכם | לא — מקומי למחשב |
| `.claude/settings.json` | פרויקט יחיד | כן — ניתן לקמיט |
| `.claude/settings.local.json` | פרויקט יחיד | לא — נכנס ל-gitignore |
| הגדרות מדיניות מנוהלת | כלל הארגון | כן — נשלט על ידי מנהל |
| frontmatter של Plugin | כשהפלאגין פעיל | כן — מבוקר בקוד הפלאגין |
| frontmatter של Skill או Subagent | כשהרכיב פעיל | כן — מוגדר בקובץ הרכיב |

## מבנה ה-Hook ב-JSON

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": ".claude/hooks/block-rm.sh"
          }
        ]
      }
    ]
  }
}
```

שלוש רמות קינון:

- **אירוע hook** — לדוגמה `PreToolUse`
- **קבוצת matcher** — מסנן מתי ה-hook מופעל
- **מטפל hook** — הפקודה, HTTP, פרומפט, או כלי MCP שרץ

## סוגי מטפלים

| סוג | תיאור |
| :--- | :--- |
| `command` | פקודת shell שמקבלת JSON דרך stdin |
| `http` | בקשת HTTP POST עם JSON בגוף הבקשה |
| `prompt` | פרומפט LLM — מפעיל מודל שני לעיבוד ההחלטה |
| `mcp` | כלי MCP |

## קודי יציאה ובקרת זרימה

קוד יציאה 0 ללא פלט מ-stdout — ה-hook אינו מחזיר החלטה וזרימה הרגילה ממשיכה.

קריאת `PreToolUse` שרוצה לחסום מחזירה JSON ל-stdout:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "הסבר לקלוד"
  }
}
```

אירועי `SessionStart`, `PostToolUse`, ו-`Stop` (ואחרים) יכולים להחזיר הודעה לקלוד דרך `continue_with_message` בפלט.
