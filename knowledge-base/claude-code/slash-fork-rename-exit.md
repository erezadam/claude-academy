---
title: "/fork, /rename, /exit — ניהול סשנים"
category: claude-code
layer: basic
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-compact-clear, slash-export-resume]
badge: new
---

## /fork, /rename, /exit — ניהול סשנים

שלוש פקודות לניהול מתקדם של sessions ב-Claude Code.

---

## /fork — פיצול שיחה

מה זה עושה: מפצל את השיחה הנוכחית לסשן נפרד מהנקודה הנוכחית.

```bash
/fork
/fork my-experiment     # עם שם מותאם
```

### מתי להשתמש
- רוצה לנסות כיוון אחר בלי לאבד את ההקשר הנוכחי
- רוצה "snapshot" של השיחה לפני ניסוי מסוכן
- עבודה מקבילית על שתי גישות שונות

---

## /rename — שינוי שם סשן

מה זה עושה: משנה את שם הסשן הנוכחי לזיהוי קל יותר.

```bash
/rename auth-refactor
/rename "payment feature v2"
```

### מתי להשתמש
- ברירת המחדל של שמות sessions היא timestamps — שם ברור עוזר למצוא אותם אחר כך
- שימושי עם `/resume` — קל יותר לחזור ל-session בעל שם ברור

---

## /exit — יציאה

מה זה עושה: יציאה מ-Claude Code. מילת מפתח חלופית: `/quit`.

```bash
/exit
/quit     # אותו דבר
```

> טיפ: `Ctrl+C` פעמיים עושה את אותו הדבר.

> קשור ל: /resume, /compact, /clear
