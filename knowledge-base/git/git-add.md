---
title: "git add"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-commit, git-status, git-reset]
---

## git add

מה זה עושה: מכין שינויים ל-commit (מעביר ל-"staging area").

### שימוש
```bash
git add .                  # הכל
git add [קובץ]             # קובץ ספציפי
git add [תיקייה]/          # תיקייה שלמה
git add -p                 # בחירה אינטראקטיבית חלקית
```

### דוגמאות
```bash
# הכן הכל
git add .

# רק קובץ אחד
git add src/components/Header.tsx

# רק חלקים מקובץ — שימושי לcommits נקיים
git add -p src/utils.ts
```

💡 `git add -p` מאפשר לבחור בדיוק אילו שורות נכנסות לcommit — הרגל טוב.

⚠️ `git add .` מוסיף **הכל** כולל קבצים שלא התכוונת. תמיד הרץ `git status` קודם.

→ קשור ל: git-status, git-commit, git-reset
