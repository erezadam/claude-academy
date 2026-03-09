---
title: "קיצורי מקלדת"
category: claude-code
layer: basic
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/rewind, /plan, /compact]
---

## קיצורי מקלדת — Claude Code

הדרך המהירה ביותר לשלוט בClaude Code. עדכני למרץ 2026.

---

### ניווט ושליטה

| קיצור | פעולה |
|-------|--------|
| `Escape` | ביטול generation נוכחי |
| `Escape × 2` | Rewind / סיכום — חזרה לנקודה קודמת |
| `Ctrl+C` | יציאה מהסשן (לחץ פעמיים) |
| `Ctrl+R` | חיפוש בהיסטוריית הפרומפטים |
| `Ctrl+G` | פתח פרומפט עורך טקסט חיצוני |

---

### מצבי עבודה

| קיצור | פעולה |
|-------|--------|
| `Shift+Tab` | מחזור בין מצבים: Auto-Accept / Plan / Normal |
| ← Normal | Claude שואל לפני כל פעולה |
| ← Auto-Accept | Claude מבצע הכל בלי לשאול |
| ← Plan mode | Claude מתכנן בלי לכתוב קוד |

הcurrent mode מוצג מתחת ל-prompt.

---

### שליטה בפלט ומודל

| קיצור | פעולה |
|-------|--------|
| `Ctrl+O` | Verbose output — הצג שימוש מפורט בכלים |
| `Ctrl+T` | הצג/הסתר רשימת משימות |
| `Alt+P` | החלף מודל בלי לנקות פרומפט |
| `Alt+T` | הפעל/כבה extended thinking |

---

### הכנסת תוכן ועריכה

| קיצור | פעולה |
|-------|--------|
| `# [טקסט]` | שמור זיכרון מהיר ל-CLAUDE.md |
| `@ [path]` | הכנס קובץ לcontext — autocomplete |
| `! [command]` | הרץ bash ישירות בלי prompt |
| `Ctrl+B` | הרץ task ברקע (Background) |
| `Ctrl+K` | מחק עד סוף שורה |
| `Ctrl+U` | מחק שורה שלמה |

---

### דוגמות שימוש

```bash
# הכנסת קובץ לcontext
@ src/auth/login.ts
"מה הבעיה בפונקציה הזו?"

# הרצת bash ישירה
! git log --oneline -5

# זיכרון מהיר
# תמיד השתמש ב-zod לvalidation

# task ברקע
Ctrl+B   ← npm test רץ ברקע, ממשיכים לדבר

# החלפת מודל מהירה
Alt+P    ← בחר מודל אחר בלי לאבד את הפרומפט
```

---

### הגדרת קיצורים אישיים

```bash
/keybindings
# פותח ~/.claude/keybindings.json
# שינויים נכנסים לתוקף מיד
```

💡 `Shift+Tab` + `Esc+Esc` = השניים הכי חשובים. תרגיל אותם.

💡 `Ctrl+B` = הרץ tests ברקע תוך כדי שממשיכים לדבר עם Claude.

💡 `Alt+P` = החלף מודל מהר — שימושי כשרוצים מודל חזק יותר למשימה ספציפית.

→ קשור ל: /rewind, /plan, /memory, /keybindings
