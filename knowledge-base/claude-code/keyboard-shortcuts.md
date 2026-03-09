---
title: "קיצורי מקלדת"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/rewind, /plan, /compact]
---

## קיצורי מקלדת — Claude Code

הדרך המהירה ביותר לשלוט בClaude Code.

---

### ניווט בסיסי

| קיצור | פעולה |
|-------|--------|
| `Ctrl+C` | ביטול פעולה נוכחית |
| `Ctrl+G` | פתח עורך חיצוני (VS Code) |
| `Ctrl+R` | חיפוש בהיסטוריית פקודות |
| `Esc + Esc` | /rewind — checkpoint אחורה |

---

### מצבי עבודה

| קיצור | פעולה |
|-------|--------|
| `Shift+Tab` | מעבר מהיר בין מצבים |
| ← מצב רגיל | Claude שואל לפני כל פעולה |
| ← auto-accept | Claude מבצע הכל בלי לשאול |
| ← plan mode | Claude מתכנן בלי לכתוב קוד |

הcurrent mode מוצג מתחת ל-prompt.

---

### הכנסת תוכן

| קיצור | פעולה |
|-------|--------|
| `# [טקסט]` | שמור זיכרון מהיר ל-CLAUDE.md |
| `@ [path]` | הכנס קובץ לcontext — autocomplete |
| `! [command]` | הרץ bash ישירות בלי prompt |
| `Ctrl+B` | הרץ task ארוך ברקע |

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

→ קשור ל: /rewind, /plan, /memory
