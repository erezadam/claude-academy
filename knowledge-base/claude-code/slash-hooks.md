---
title: "/hooks"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/config, /permissions, /agents]
---

## /hooks

מה זה עושה: מנהל automation hooks — סקריפטים שרצים אוטומטית בנקודות מסוימות.

### שימוש
```
/hooks
```

### 4 סוגי hooks

| Hook | מתי רץ |
|------|---------|
| `PreToolUse` | לפני שClaude משתמש בכלי |
| `PostToolUse` | אחרי שClaude משתמש בכלי |
| `Notification` | כשClaude שולח notification |
| `Stop` | כשClaude מסיים session |

### דוגמות שימושיות

**פורמט Python אוטומטי אחרי כל כתיבה:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write(*.py)",
      "hooks": [{
        "type": "command",
        "command": "python -m black $file"
      }]
    }]
  }
}
```

**ESLint לפני כל שמירה:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write(*.ts)",
      "hooks": [{
        "type": "command",
        "command": "npx eslint $file --fix"
      }]
    }]
  }
}
```

**התראה כשClaude מסיים:**
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Claude סיים\" with title \"Claude Code\"'"
      }]
    }]
  }
}
```

💡 Hooks = QA אוטומטי. הגדר פעם אחת, Claude תמיד מפרמט ובודק.

→ קשור ל: /config, /permissions
