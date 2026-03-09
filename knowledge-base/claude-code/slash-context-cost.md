---
title: "/context ו-/cost"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/compact, /clear, /model]
---

## /context ו-/cost — ניטור session

---

## /context — צפייה בשימוש context window

מה זה עושה: מראה כמה מה-context window בשימוש ואיפה הוא הולך.

### שימוש
```
/context
```

### פלט
```
Context usage: 67,432 / 200,000 tokens (33%)

████████░░░░░░░░░░░░ 33%

Breakdown:
  System + CLAUDE.md:  4,200 (6%)
  Conversation:       41,000 (61%)
  Files in context:   22,232 (33%)

Skills budget: 3,200 / 16,000 chars used
⚠️ 2 skills excluded (budget exceeded)
```

### צבעי statusline
```
🟢 ירוק  > 50% פנוי    — עבודה רגילה
🟡 צהוב  20-50% פנוי   — שקול /compact
🔴 אדום  < 20% פנוי    — /compact מיידי
```

### מתי להריץ
- לפני משימה גדולה — לדעת כמה מקום יש
- אחרי /compact — לאמת שהדחיסה עבדה
- כשיש skills שלא עובדים — יכול להיות budget בעיה

---

## /cost — עלות session נוכחי

מה זה עושה: מראה כמה tokens נצרכו ומה העלות הכספית.

### שימוש
```
/cost
```

### פלט
```
Session cost: $0.43

Input tokens:   124,000  ($0.37)
Output tokens:   12,800  ($0.19)
Cache reads:     89,000  (free)

Model: claude-sonnet-4-6
Duration: 47 minutes
```

### עלויות לפי מודל (2026)

| מודל | Input (M tokens) | Output (M tokens) |
|------|-----------------|-------------------|
| Opus 4.6 | $15 | $75 |
| Sonnet 4.6 | $3 | $15 |
| Haiku 4.5 | $0.80 | $4 |

### שימוש נכון
```bash
# תחילת יום — קו בסיס
/cost

# תוך session ארוך — בדיקה
/cost

# לפני /clear — תיעד כמה עלה
/cost
/clear
```

💡 session ממוצע של refactoring: $0.20–$0.80. אם יורה מעל $2 — כנראה יש loop.

💡 `/usage` (שונה מ-/cost) = מכסה חודשית של ה-plan שלך. `/cost` = עלות session נוכחי.

→ קשור ל: /compact, /clear, /model
