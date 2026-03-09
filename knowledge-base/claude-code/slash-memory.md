---
title: "/memory"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [CLAUDE.md, /init, /clear]
---

## /memory

מה זה עושה: פותח עורך לקבצי CLAUDE.md — ניהול הזיכרון הקבוע של Claude Code.

### שימוש
```
/memory
```

### מה נפתח
תפריט אינטראקטיבי לעריכת:
- `~/.claude/CLAUDE.md` — גלובלי (כל הפרויקטים)
- `./CLAUDE.md` — פרויקט נוכחי
- `./[תיקייה]/CLAUDE.md` — תת-תיקייה ספציפית

### שלוש רמות זיכרון

```
~/.claude/CLAUDE.md          ← גלובלי: חל על כל session
./CLAUDE.md                  ← פרויקט: נטען אוטומטית בכל session
./.claude/skills/[skill]/    ← Skill: נטען לפי דרישה
```

### דוגמה — הוספת כלל חדש

```
> /memory

[תפריט נפתח]
> Edit project CLAUDE.md

[עורך נפתח]

# מוסיף:
## כלל חדש שנלמד היום
- תמיד השתמש בzod לvalidation, לא ב-joi
```

### מתי להשתמש
- ✅ כשClaudeטועה שוב ושוב — תוסף כלל ב-CLAUDE.md
- ✅ בסיום session — תתעד מה למדת
- ✅ כשמוסיפים convention חדש לפרויקט
- ❌ לא לדברים זמניים — עדיף להגיד בשיחה

### טריק: # להוספה מהירה בלי /memory

```
# תמיד השתמש בfetch ולא ב-axios בפרויקט הזה
```

הקש `#` בתחילת שורה — Claude Code ישמור את זה ב-CLAUDE.md אוטומטית.

💡 CLAUDE.md הוא קוד — עדכן כשמשהו לא עובד, גזום כשהוא גדל מדי.

⚠️ Claude Code מכניס system-reminder שאומר לו להתעלם מ-CLAUDE.md אם לא רלוונטי. קובץ ארוך = Claude מתעלם יותר.

→ קשור ל: CLAUDE.md, /init, /clear
