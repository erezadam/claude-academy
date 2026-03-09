---
title: "git log"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-diff, git-show, git-reset]
---

## git log

מה זה עושה: מציג היסטוריית commits.

### שימוש
```bash
git log                           # מלא
git log --oneline                 # קצר — שורה אחת לcommit
git log --oneline -10             # 10 אחרונים
git log --oneline --graph         # עם ויזואליזציה של branches
git log --author="שם"             # של מישהו ספציפי
git log --since="2 weeks ago"     # לפי זמן
git log -- [קובץ]                 # היסטוריה של קובץ ספציפי
```

### דוגמאות
```bash
# כל יום — בדיקה מהירה
git log --oneline -5
# a3f9b12 feat: add user profile page
# b7e2d01 fix: resolve login crash
# c1a4e88 chore: update dependencies

# ויזואליזציה של branches
git log --oneline --graph --all
# * a3f9b12 (HEAD -> feature/x) feat: profile
# | * b7e2d01 (develop) fix: login
# |/
# * c1a4e88 chore: deps

# מי שינה קובץ ספציפי
git log --oneline -- src/auth.ts
```

💡 `git log --oneline --graph --all` הוא ה-"מפה" של הrepository. שימושי מאוד.

→ קשור ל: git-diff, git-show, git-reset
