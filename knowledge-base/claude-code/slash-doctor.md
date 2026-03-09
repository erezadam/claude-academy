---
title: "/doctor"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/config, /login, /clear]
---

## /doctor

מה זה עושה: מריץ אבחון מלא של הסביבה — מוצא 80% מהבעיות תוך 5 שניות.

### שימוש
```
/doctor
```

### מה נבדק
```
> /doctor

✅ Node.js version: 22.x (מינימום נדרש: 18)
✅ API connection: OK
✅ Authentication: Valid token
✅ CLAUDE.md: Found and valid
✅ File permissions: Read/Write OK
⚠️ MCP servers: 1 error — "github" not responding
❌ Proxy: Detected but not configured
```

### 8 בדיקות שרצות

| בדיקה | מה בודק |
|--------|---------|
| Node.js | גרסה ≥ 18 (22 מומלץ 2026) |
| API | חיבור ל-Anthropic |
| Auth | תוקף ה-token |
| CLAUDE.md | קיום ותקינות |
| Permissions | הרשאות קריאה/כתיבה |
| MCP servers | כל שרת MCP מוגדר |
| Config | תקינות settings.json |
| Proxy | אם מוגדר — בדיקת תצורה |

### תיקון שגיאות נפוצות

```bash
# token פג תוקף
> /login

# שגיאת JSON ב-settings.json
# פתח ותקן:
~/.claude/settings.json

# עדכון לגרסה חדשה
npm install -g @anthropic-ai/claude-code

# MCP server לא מגיב
> /mcp
# בדוק את הגדרות השרת
```

### מתי להריץ
- ✅ אחרי כל עדכון של claude-code
- ✅ כשיש התנהגות מוזרה בלתי מוסברת
- ✅ כשה-API לא מגיב
- ✅ על מכונה חדשה אחרי התקנה

💡 תתחיל תמיד עם `/doctor` לפני שאתה מחפש פתרונות מורכבים — ברוב המקרים הבעיה שם.

→ קשור ל: /config, /login, /clear
