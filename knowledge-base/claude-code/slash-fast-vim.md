---
title: "/fast, /theme — ומה קרה ל-/vim ול-/output-style"
category: claude-code
layer: basic
last_verified: 2026-07-29
status: needs-review
source_url: https://code.claude.com/docs/en/commands
source_url_extra: https://code.claude.com/docs/en/fast-mode https://code.claude.com/docs/en/output-styles
related: [slash-model, slash-config]
level: beginner
type: reference
tool: claude-code
origin: official
timeMinutes: 2
last_reviewed: 2026-07-29
---

## /fast, /theme — ומה קרה ל-/vim ול-/output-style

שתי פקודות חיות לשליטה במהירות ובצבעים — ושתי פקודות שהוסרו, שאנשים עדיין מחפשים.

---

## /fast — מצב מהיר

מה זה עושה: מפעיל/מכבה מצב מהיר — פלט מהיר יותר, במחיר גבוה יותר.

```bash
/fast          # toggle
/fast on       # הפעל
/fast off      # כבה
```

חשוב לדעת לפני שמפעילים: מצב מהיר זמין רק במודלי Opus. אם אתה עובד על מודל אחר, Claude Code יעבור אוטומטית ל-Opus כשתפעיל אותו — כלומר הפעלת `/fast` כן יכולה להחליף לך מודל. התמחור של מצב מהיר גבוה מהתמחור הרגיל.

---

## /vim — הוסר בגרסה 2.1.92

הפקודה `/vim` כבר לא קיימת. אם הקלדת אותה וקיבלת שגיאה — זו הסיבה.

מה עושים היום במקום:

```bash
/config        # → Editor mode → בחר Vim או Normal
```

מצב העריכה של Vim עצמו לא הוסר — רק הפקודה הישירה. המעבר בין מצבי העריכה עבר ל-`/config`.

---

## /output-style — הוסר בגרסה 2.1.91

הפקודה העצמאית `/output-style` הוצאה משימוש בגרסה 2.1.73 והוסרה בגרסה 2.1.91.

הסגנונות עצמם (Default / Explanatory / Learning) עדיין קיימים — אבל מגדירים אותם דרך `/config` או ישירות בהגדרה `outputStyle`:

```bash
/config        # → Output style
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
