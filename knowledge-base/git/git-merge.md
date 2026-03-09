---
title: "git merge"
category: git
layer: intermediate
last_verified: 2026-03-07
status: current
related: [git-rebase, git-branch, git-checkout]
---

## git merge

מה זה עושה: משלב ענף אחד לתוך אחר.

### שימוש
```bash
git merge [branch]                # merge לענף הנוכחי
git merge --no-ff [branch]        # שמור תמיד merge commit
git merge --squash [branch]       # דחס הכל לcommit אחד
git merge --abort                 # בטל merge תקוע
```

### תהליך נכון
```bash
# 1. עבור לענף המקבל
git switch develop

# 2. משוך עדכונים
git pull origin develop

# 3. מזג
git merge feature/user-auth

# 4. שלח
git push origin develop

# 5. נקה
git branch -d feature/user-auth
```

### Merge Conflicts — מה לעשות
```bash
# Git יסמן את הקבצים המתנגשים
# פתח אותם — תראה:

<<<<<<< HEAD
  קוד שלך
=======
  קוד מהbranch האחר
>>>>>>> feature/user-auth

# ערוך ידנית → בחר מה להשאיר
# אחרי עריכה:
git add [קבצים שתוקנו]
git commit -m "merge: resolve conflicts in auth module"
```

💡 `--no-ff` (no fast-forward) = יוצר תמיד merge commit עם ההיסטוריה. מומלץ לצוות.
💡 `--squash` = מצוין כשיש הרבה WIP commits שלא שווה לשמור.

⚠️ לעולם אל תמזג ישיר ל-main — תמיד דרך PR/MR.

→ קשור ל: git-rebase, git-branch, git-log
