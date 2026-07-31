---
title: "/permissions"
published: 2026-03-09
category: claude-code
layer: intermediate
last_verified: 2026-07-29
status: current
source_url: https://code.claude.com/docs/en/commands
source_url_extra: https://code.claude.com/docs/en/cli-reference
related: [/config, /sandbox, /doctor]
level: intermediate
type: reference
tool: claude-code
origin: official
timeMinutes: 2
---

## /permissions

מה זה עושה: מציג ומעדכן הרשאות לכלים — מה Claude Code יכול ולא יכול לעשות.

### שימוש
```
/permissions
```

### מבנה הרשאות
```
Allow:  Claude יכול לבצע בלי לשאול
Ask:    Claude שואל לפני כל ביצוע
Deny:   Claude לא יכול בשום מקרה
```

### דוגמת הגדרה
```json
// settings.json
{
  "permissions": {
    "allowedTools": [
      "Read",
      "Write",
      "Bash(git *)",
      "Bash(npm test:*)",
      "Bash(npm run:*)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Write(production.*)",
      "Bash(rm -rf *)"
    ]
  }
}
```

### הרשאות Skills
```
# אפשר רק skills ספציפיים
Skill(commit)       ← מדויק
Skill(review-pr *)  ← כל מה שמתחיל ב-review-pr
Skill(deploy *)     ← חסום לחלוטין
```

### מצב --dangerously-skip-permissions
```bash
claude --dangerously-skip-permissions
```
⚠️ מבטל **כל** שאילות הרשאה — רק בתיקייה בטוחה ולמשימות ספציפיות.

💡 הגדר Deny לקבצים רגישים: `.env`, `production.*`, `*.pem`

→ קשור ל: /config, /sandbox
