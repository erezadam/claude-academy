---
title: "/model"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/config, /cost]
---

## /model

מה זה עושה: מחליף מודל AI באמצע session — בלי לצאת ולחזור.

### שימוש
```
/model
```

### מודלים זמינים (2026)
```
claude-opus-4-6     ← הכי חזק, הכי יקר
claude-sonnet-4-6   ← ברירת מחדל — מאוזן
claude-haiku-4-5    ← הכי מהיר, הכי זול (90% פחות)
```

### מתי להחליף מודל

| משימה | מודל מומלץ |
|--------|------------|
| refactoring מורכב, ארכיטקטורה | Opus |
| כתיבת קוד, debug רגיל | Sonnet (ברירת מחדל) |
| תיקוני סגנון, שאלות פשוטות | Haiku |
| CI/CD, עיבוד batch | Haiku |

### דוגמה
```
> /model
# תפריט נפתח
# בחר: claude-haiku-4-5

# עכשיו כל הפקודות רצות על Haiku — מהר וזול
```

💡 החלף ל-Haiku לפני tasks פשוטים — חיסכון של 90% בעלות.

💡 ניתן לציין מודל ספציפי ב-skill frontmatter:
```yaml
model: claude-haiku-4-5
```

→ קשור ל: /cost, /config
