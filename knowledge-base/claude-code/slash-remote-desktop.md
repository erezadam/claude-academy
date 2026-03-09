---
title: "/remote-control, /desktop, /chrome — אינטגרציות חיצוניות"
category: claude-code
layer: intermediate
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-config, slash-mcp]
badge: new
---

## /remote-control, /desktop, /chrome — אינטגרציות חיצוניות

פקודות לחיבור Claude Code לממשקים חיצוניים.

---

## /remote-control — שליטה מרחוק

מה זה עושה: הופך את ה-session הנוכחי לנגיש מ-claude.ai בדפדפן. מילת מפתח: `/rc`.

```bash
/remote-control
/rc              # קיצור
```

### מה קורה
- ה-session הטרמינלי מחובר ל-claude.ai
- אפשר להמשיך את העבודה מהדפדפן
- שני הממשקים מסונכרנים

### מתי להשתמש
- רוצה לעבור למחשב אחר
- רוצה לשתף session עם חבר צוות
- רוצה ממשק גרפי נוח יותר

---

## /desktop — Claude Code Desktop

מה זה עושה: ממשיך את ה-session באפליקציית Claude Code Desktop. מילת מפתח: `/app`.

```bash
/desktop
/app          # קיצור
```

### ההבדל מ-/remote-control
- `/rc` — ממשיך בדפדפן (claude.ai)
- `/desktop` — ממשיך באפליקציית Desktop נפרדת

---

## /chrome — אינטגרציית Chrome

מה זה עושה: מגדיר אינטגרציה עם דפדפן Chrome.

```bash
/chrome
```

### מה מקבלים
- Claude Code יכול לגשת לדפים פתוחים ב-Chrome
- שימושי ל-debugging של web apps
- בדיקת DOM, console, network

> קשור ל: /ide, /mcp
