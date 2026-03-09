---
title: "git remote"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-push, git-pull, git-clone]
---

## git remote

מה זה עושה: מנהל חיבורים לשרתים חיצוניים (GitHub, GitLab וכו').

### שימוש
```bash
git remote -v                     # הצג remotes קיימים
git remote add origin [URL]       # הוסף remote
git remote remove origin          # הסר remote
git remote set-url origin [URL]   # שנה URL
```

### תהליך חיבור לGitHub
```bash
# 1. צור repo ב-GitHub (ללא README)
# 2. חבר מקומית:
git remote add origin https://github.com/user/repo.git

# 3. שלח לראשונה:
git push -u origin main
git push -u origin develop
```

### בדיקת חיבור
```bash
git remote -v
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)
```

💡 `origin` הוא שם המוסכמה — אפשר לקרוא לו כל שם, אבל origin הוא universal.

⚠️ אם ה-URL השתנה (שינית שם repo):
```bash
git remote set-url origin [URL חדש]
```

→ קשור ל: git-push, git-pull, git-clone
