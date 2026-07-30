---
title: "/config"
category: claude-code
layer: basic
last_verified: 2026-07-29
status: current
source_url: https://code.claude.com/docs/en/commands
related: [/model, /permissions, /theme]
level: beginner
type: reference
tool: claude-code
origin: official
timeMinutes: 2
---

## /config

מה זה עושה: פותח ממשק הגדרות — 20+ הגדרות לניהול Claude Code.

### שימוש
```
/config
```

### 4 קטגוריות הגדרות

**Permissions — הרשאות:**
```
Read files:     ✅ מותר
Write files:    ✅ מותר
Execute bash:   ⚠️ שואל
Web fetch:      ✅ מותר
MCP servers:    ✅ מותר
```

**Appearance — עיצוב:**
```
Theme:          dark / light / system
Statusline:     on / off
Language:       he / en
```

**Model — מודל ברירת מחדל:**
```
Default model:  claude-sonnet-4-6
```

**Integrations — אינטגרציות:**
```
IDE:            VS Code / JetBrains / None
GitHub:         connected / not connected
```

### קובץ ההגדרות הישיר
```bash
# כל ההגדרות נשמרות כאן
~/.claude/settings.json
```

### הגדרות נפוצות
```json
{
  "model": "claude-sonnet-4-6",
  "theme": "dark",
  "permissions": {
    "allowedTools": ["Read", "Write", "Bash(git *)"],
    "deny": ["Read(.env)", "Write(production.*)"]
  }
}
```

💡 הרץ `/config` פעם אחת בהתקנה — ואל תגע בו יותר אלא אם צריך.

→ קשור ל: /model, /permissions, /doctor
