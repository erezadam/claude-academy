---
title: "/permissions"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/config, /sandbox, /doctor]
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
