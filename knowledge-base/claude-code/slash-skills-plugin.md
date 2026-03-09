---
title: "/skills, /plugin — skills ותוספים"
category: claude-code
layer: intermediate
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-agents, slash-config]
badge: new
---

## /skills, /plugin — ניהול Skills ותוספים

פקודות לצפייה ב-skills זמינות וניהול plugins.

---

## /skills — רשימת Skills

מה זה עושה: מציג את כל ה-skills הזמינות ב-session הנוכחי.

```bash
/skills
```

### מה מקבלים
- רשימת skills מותאמות שהוגדרו ב-CLAUDE.md או ב-settings
- skills מובנות של Claude Code
- skills מ-plugins מותקנים

### Skills לעומת Commands
- **Commands** (`/clear`, `/compact`) — פעולות מובנות קבועות
- **Skills** (`/new-project`, `/backup`) — פעולות מותאמות שאתה מגדיר

---

## /plugin — ניהול תוספים

מה זה עושה: ממשק לניהול plugins — חיפוש, התקנה, הסרה.

```bash
/plugin                  # פתח ממשק ניהול
/plugin install [name]   # התקן plugin
/plugin remove [name]    # הסר plugin
/plugin list             # רשימת מותקנים
```

### מה זה Plugins?
- הרחבות של Claude Code שמוסיפות יכולות חדשות
- יכולים להוסיף skills, כלים, ו-MCP servers
- מותקנים מ-marketplace או מ-GitHub

> קשור ל: /agents, /mcp, /hooks
