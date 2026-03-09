---
title: "git branch"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-checkout, git-merge, git-rebase]
---

## git branch

מה זה עושה: מנהל ענפים — רשימה, יצירה, מחיקה.

### שימוש
```bash
git branch                        # רשימת ענפים מקומיים
git branch -a                     # מקומיים + remote
git branch [שם]                   # יצירת ענף חדש (לא עובר אליו)
git branch -d [שם]                # מחיקה בטוחה (אחרי merge)
git branch -D [שם]                # מחיקה בכוח
git branch -m [ישן] [חדש]         # שינוי שם
```

### אסטרטגיית ענפים מומלצת
```
main          ← production בלבד
  └── develop ← אינטגרציה שוטפת
        ├── feature/user-auth
        ├── feature/payment
        └── fix/login-crash
```

### דוגמאות
```bash
# ראה איפה אתה
git branch
# * develop        ← הכוכב = הענף הנוכחי
#   main
#   feature/login

# צור ועבור — כך עושים בפועל
git checkout -b feature/new-thing

# סיימת פיצ'ר — נקה
git branch -d feature/new-thing
```

💡 שמות ענפים טובים: `feature/`, `fix/`, `chore/`, `docs/` — ברורים ועקביים.

⚠️ `git branch -D` (אות גדולה) מוחק גם בלי merge — זהירות.

→ קשור ל: git-checkout, git-merge, git-log
