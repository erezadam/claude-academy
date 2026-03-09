---
title: "/init"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [CLAUDE.md, /memory, /config]
---

## /init

מה זה עושה: מנתח את הפרויקט הנוכחי ויוצר CLAUDE.md בסיסי אוטומטית.

### שימוש
```
/init
```

### מה קורה
Claude Code סורק את תיקיית הפרויקט ומזהה:
- מערכת build (npm, cargo, make...)
- frameworks (React, Express, Django...)
- test frameworks (Jest, pytest...)
- סגנון קוד קיים

ואז כותב CLAUDE.md שמתאים למה שמצא.

### דוגמה
```
> /init

Analyzing project structure...
✓ Detected: Next.js 15, TypeScript, Jest
✓ Found: 47 components, 12 API routes

Created CLAUDE.md with:
- Build commands: npm run dev, npm run build
- Test command: npm test
- Code style: TypeScript strict, ES modules
```

### אחרי /init — חובה לעשות
```bash
# 1. פתח ובדוק את הקובץ
cat CLAUDE.md

# 2. עדכן את מה שChude לא יכול לנחש:
# - מה הפרויקט עושה (משפט אחד)
# - חוקי עבודה ספציפיים לצוות שלך
# - מה אסור לעשות

# 3. הוסף ל-Git
git add CLAUDE.md
git commit -m "chore: add CLAUDE.md"
```

💡 `/init` הוא נקודת פתיחה — לא תוצר סופי. תמיד ערוך אחרי.

⚠️ CLAUDE.md מנופח גורם ל-Claude להתעלם מההוראות. לאחר /init, גזום כל שורה שלא תגרום לטעות אם תוסר.

⚠️ `/init` הוא פקודה מובנית — לא זמין דרך ה-Skill tool.

→ קשור ל: CLAUDE.md, /memory, /config
