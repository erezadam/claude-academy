---
title: "git diff"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-status, git-log, git-add]
---

## git diff

מה זה עושה: מראה בדיוק מה השתנה — שורה אחר שורה.

### שימוש
```bash
git diff                          # שינויים לא staged
git diff --staged                 # שינויים staged (אחרי add)
git diff HEAD                     # הכל מאז commit אחרון
git diff [branch1] [branch2]      # הבדל בין ענפים
git diff [hash1] [hash2]          # הבדל בין commits
```

### קריאת הפלט
```diff
- שורה שנמחקה  (אדום)
+ שורה שנוספה  (ירוק)
  שורה ללא שינוי
```

### דוגמאות
```bash
# לפני commit — ראה בדיוק מה אתה שולח
git diff --staged

# השווה בין ענפים
git diff develop feature/login

# מה השתנה בשבוע האחרון
git diff HEAD~7
```

💡 לפני כל `git add .` — הרץ `git diff` לראות בדיוק מה נכנס לcommit.

→ קשור ל: git-status, git-log, git-add
