---
title: "/fast, /vim, /output-style, /theme — מצבים ועיצוב"
category: claude-code
layer: basic
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-model, slash-config]
badge: new
---

## /fast, /vim, /output-style, /theme — מצבים ועיצוב

פקודות לשליטה במהירות הפלט, מצב עריכה, סגנון פלט וערכת צבעים.

---

## /fast — מצב מהיר

מה זה עושה: מפעיל/מכבה מצב מהיר — אותו מודל, פלט מהיר יותר.

```bash
/fast          # toggle
/fast on       # הפעל
/fast off      # כבה
```

> חשוב: זה **לא** מחליף מודל — זה אותו מודל עם אופטימיזציית מהירות.

---

## /vim — מצב Vim

מה זה עושה: מעבר בין מצב עריכה רגיל למצב Vim בשורת הקלט.

```bash
/vim
```

### למי מתאים
- משתמשי Vim/Neovim שרגילים ל-keybindings של Vim
- מי שרוצה ניווט מהיר יותר בטקסט

---

## /output-style — סגנון פלט

מה זה עושה: משנה את סגנון התגובות של Claude.

```bash
/output-style Default      # ברירת מחדל
/output-style Explanatory  # הסברים מפורטים
/output-style Learning     # מצב למידה — מסביר כל צעד
```

| סגנון | מתי |
|-------|-----|
| Default | עבודה רגילה |
| Explanatory | כשרוצים להבין לעומק |
| Learning | למידת כלי/שפה חדשה |

---

## /theme — ערכת צבעים

מה זה עושה: משנה את ערכת הצבעים של הטרמינל.

```bash
/theme
```

> קשור ל: /model, /config
