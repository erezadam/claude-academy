---
title: "Plugins — חבילות הרחבה לשיתוף"
category: claude-code
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/plugins
related: []
---

## Plugins

Plugins מאפשרים להרחיב את Claude Code עם פונקציונליות מותאמת שניתן לשתף בין פרויקטים וצוותים. Plugin הוא תיקייה עם manifest בשם `plugin.json` המכילה skills, agents, hooks ו-MCP servers.

---

## Standalone vs Plugins

| גישה | שמות Skills | הכי מתאים ל |
|:--|:--|:--|
| **Standalone** (תיקיית `.claude/`) | `/hello` | workflows אישיים, התאמות לפרויקט, ניסויים |
| **Plugins** (עם `plugin.json`) | `/plugin-name:hello` | שיתוף עם צוות, הפצה לקהילה, releases עם גרסאות |

השתמש ב-**standalone** כשמתאים רק לפרויקט אחד, הקונפיגורציה אישית, או מתנסים לפני אריזה. השתמש ב-**plugin** כשרוצים לשתף, לגרסות, או להפיץ דרך marketplace.

---

## יצירת Plugin — Quickstart

**שלב 1 — צור תיקיית plugin:**

```bash
mkdir my-first-plugin
```

**שלב 2 — צור את ה-manifest:**

```bash
mkdir my-first-plugin/.claude-plugin
```

צור `my-first-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

| שדה | תפקיד |
|:--|:--|
| `name` | מזהה ייחודי ו-namespace של skills (כגון `/my-first-plugin:hello`) |
| `description` | מוצג במנהל ה-plugins |
| `version` | אופציונלי — משתמשים מקבלים עדכונים רק כשמגרסים |
| `author` | אופציונלי — לייחוס |

**שלב 3 — הוסף skill:**

Skills נמצאים בתיקיית `skills/`. כל skill הוא תיקייה עם `SKILL.md`. שם התיקייה הופך לשם ה-skill, מקדים ב-namespace של ה-plugin.

```bash
mkdir -p my-first-plugin/skills/hello
```

צור `my-first-plugin/skills/hello/SKILL.md`:

```yaml
---
description: Greets the user
---

Say hello to the user and introduce yourself as the my-first-plugin assistant.
```

**שלב 4 — בדוק עם --plugin-dir:**

```bash
claude --plugin-dir ./my-first-plugin
```

בתוך Claude Code, הרץ `/my-first-plugin:hello` לבדיקה.

---

## Namespacing

Skills בplugins מקבלים prefix: `/plugin-name:skill-name`. זה מונע קונפליקטים בין plugins שונים. Plugin שמותקן ב-`.claude/skills/` ייצור שמות ללא namespace.
