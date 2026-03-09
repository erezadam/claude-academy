---
title: "CLAUDE.md — המדריך המלא"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/best-practices
related: [/init, /memory, slash-commands-all]
---

## CLAUDE.md — קובץ הזיכרון המרכזי

מה זה עושה: קובץ Markdown שClaudeCode קורא אוטומטית בתחילת כל session — הזיכרון הקבוע של הפרויקט.

---

### למה זה קריטי

Claude Code **לא זוכר כלום** בין sessions. בלי CLAUDE.md:
```
Session 1: "השתמש תמיד ב-TypeScript strict"
Session 2: Claude שכח ← כותב JavaScript רגיל
```

עם CLAUDE.md:
```
כל session: Claude קורא → זוכר → מיישם
```

---

### מיקומים אפשריים

```
~/.claude/CLAUDE.md           ← גלובלי — כל הפרויקטים
./CLAUDE.md                   ← פרויקט — נטען אוטומטית
./src/CLAUDE.md               ← תת-תיקייה — נטען לפי דרישה
./.claude/CLAUDE.local.md     ← אישי — ב-.gitignore
```

**מה לשים איפה:**
- גלובלי: סגנון עבודה אישי, העדפות שחוזרות
- פרויקט: stack, commands, conventions הספציפיים
- תת-תיקייה: הנחיות לחלק ספציפי (backend/, frontend/)

---

### מבנה מומלץ — WHAT / WHY / HOW

```markdown
# CLAUDE.md — [שם הפרויקט]

## WHAT — מה הפרויקט
[משפט אחד. מה המוצר עושה.]
Stack: [רשימה קצרה]

## WHY — למה ואיך עובדים כאן
[מה מיוחד בפרויקט הזה שClaudeלא יכול לנחש]

## HOW — איך עובדים

### פקודות חיוניות
```bash
[הפקודות שClaudeישתמש בהן]
```

### כללי קוד
- [כלל 1]
- [כלל 2]

### Git workflow
- [קצר ומדויק]

### ✅ לפני commit
- [ ] [בדיקה 1]
- [ ] [בדיקה 2]

### ⚠️ NEVER
- NEVER [דבר קריטי לאסור]
```

---

### כלל הזהב: שאל כל שורה

```
"האם הסרת שורה זו תגרום לClaudeלטעות?"

כן → שמור את השורה
לא → מחק אותה
```

**יעד: מתחת ל-100 שורות.**

---

### imports — לקבצים נוספים

```markdown
# בתוך CLAUDE.md — הפניה לקבצים אחרים
@README.md
@package.json
@docs/api.md
@docs/git-instructions.md
```

Claude קורא אותם לפי דרישה — לא טוענים הכל לcontext.

---

### שגיאה נפוצה: CLAUDE.md מנופח

```
❌ הבעיה:
CLAUDE.md עם 500 שורות של הכל

✅ מה קורה:
Claude Code מכניס system-reminder:
"This context may or may not be relevant.
 You should not respond unless highly relevant."

תוצאה: Claude מתעלם מההוראות שלך
```

**הפתרון:** גזום ללא רחמים. פחות = יותר.

---

### Check into Git

```bash
# תמיד
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md"

# CLAUDE.local.md — אישי, לא לshare
echo "CLAUDE.local.md" >> .gitignore
```

---

### עדכון שוטף

CLAUDE.md הוא קוד. עדכן כש:
- Claude טועה שוב ושוב באותו דבר → הוסף כלל
- הוספת library חדשה לפרויקט → עדכן stack
- שינוי convention בצוות → עדכן

```bash
# עדכון מהיר בלי /memory
# הקש בתחילת שורה:
# [הכלל החדש] ← Claude שומר אוטומטית
```

→ קשור ל: /init, /memory, /clear
