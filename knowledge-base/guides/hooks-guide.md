---
title: "מדריך Hooks — אוטומציה של פעולות ב-Claude Code"
category: guides
layer: intermediate
last_verified: 2026-06-20
status: needs-review
source_url: https://code.claude.com/docs/en/hooks-guide
related: [skills, sub-agents, plugins-guide, slash-hooks]
---

Hooks הם פקודות shell שמריצות אוטומטית בנקודות ספציפיות במחזור החיים של Claude Code. הם מספקים שליטה דטרמיניסטית על ההתנהגות — כלומר פעולות מסוימות תמיד יקרו, ללא תלות בשיקול דעת המודל.

## מה זה עושה / למה זה שימושי

Hooks מאפשרים לאכוף כללי פרויקט, לאוטומט משימות חוזרות, ולשלב את Claude Code עם כלים קיימים. לדוגמה: עיצוב קוד אוטומטי אחרי כל עריכה, חסימת גישה לקבצים רגישים, שליחת התראות כשהמודל מחכה לקלט.

## איך משתמשים

Hooks מוגדרים ב-`settings.json`. כל hook כולל event, matcher (ביטוי רגולרי לסינון), ופקודה להרצה.

**דוגמה: התראת desktop כשהמודל מחכה לקלט (macOS)**

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**דוגמה: עיצוב אוטומטי עם Prettier אחרי כל עריכה**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

**דוגמה: חסימת עריכה לקבצים מוגנים**

צור קובץ `.claude/hooks/protect-files.sh`:

```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done

exit 0
```

ורשום אותו ב-`settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Events עיקריים

| Event | מתי מופעל |
| :---- | :--------- |
| `PreToolUse` | לפני שהמודל מריץ כלי |
| `PostToolUse` | אחרי שהמודל מריץ כלי |
| `Notification` | כשהמודל מחכה לקלט או אישור |
| `SessionStart` | בתחילת session (ניתן לסנן לפי `compact`) |
| `CwdChanged` | כשהתיקייה הנוכחית משתנה |
| `FileChanged` | כשקובץ ספציפי משתנה |
| `ConfigChange` | כשקובץ הגדרות משתנה |
| `PermissionRequest` | לפני הצגת דיאלוג אישור |

## קודי יציאה ושליטה בהתנהגות

| קוד יציאה | משמעות |
| :--------- | :------- |
| `0` | המשך רגיל |
| `1` | שגיאה — מוצגת למודל אבל לא חוסמת |
| `2` | חסימה — הפעולה מבוטלת ומוחזרת הודעה למודל |

## מיקום קבצי ה-Hooks

| מיקום | השפעה |
| :----- | :----- |
| `~/.claude/settings.json` | כל הפרויקטים |
| `.claude/settings.json` | פרויקט ספציפי |
| `.claude/settings.local.json` | מקומי, לא מועלה ל-git |

## הגדרת אישור אוטומטי

Hooks יכולים לאשר אוטומטית בקשות הרשאה ספציפיות — בלי דיאלוג:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"decision\": \"allow\"}'"
          }
        ]
      }
    ]
  }
}
```

---

לתיעוד מלא של schemas, פורמטי JSON, ו-hooks מתקדמים (async, MCP), ראו את [Hooks Reference](https://code.claude.com/docs/en/hooks).
