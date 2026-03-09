---
title: "/terminal-setup, /keybindings, /statusline — הגדרות טרמינל"
category: claude-code
layer: intermediate
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-config, keyboard-shortcuts]
badge: new
---

## /terminal-setup, /keybindings, /statusline — הגדרות טרמינל

פקודות להתאמה אישית של הטרמינל, קיצורי מקלדת ושורת סטטוס.

---

## /terminal-setup — הגדרת טרמינל

מה זה עושה: מגדיר קיצורי מקלדת ואינטגרציות עבור הטרמינל שלך.

```bash
/terminal-setup
```

### מה מקבלים
- הגדרת key bindings ספציפיות לטרמינל (iTerm2, Terminal.app, Warp, etc.)
- אופטימיזציות ביצועים
- הגדרת shell integration

---

## /keybindings — קיצורי מקלדת

מה זה עושה: פותח או יוצר קובץ keybindings מותאם אישית.

```bash
/keybindings
```

### מה אפשר להגדיר
- שינוי קיצורי מקלדת קיימים
- הוספת chord bindings (צירופי מקשים)
- קיצורים ספציפיים ל-workflow שלך

הקובץ נשמר ב: `~/.claude/keybindings.json`

---

## /statusline — שורת סטטוס

מה זה עושה: מגדיר מה מוצג בשורת הסטטוס בתחתית הטרמינל.

```bash
/statusline
```

### אפשרויות תצוגה
- מודל נוכחי
- שימוש ב-tokens
- שם ה-branch
- סטטוס כלים

> קשור ל: /config, /theme
