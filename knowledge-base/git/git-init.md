---
title: "git init"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-add, git-commit, git-remote]
---

## git init

מה זה עושה: יוצר repository Git חדש בתיקייה הנוכחית.

### שימוש
```bash
git init
git init [שם-תיקייה]
```

### דוגמה
```bash
mkdir my-project && cd my-project
git init
# → Initialized empty Git repository in .git/
```

### מה נוצר
תיקיית `.git/` נסתרת — הלב של כל ה-repository.
**אל תמחק אותה לעולם.**

💡 אחרי init, הצעד הבא תמיד: `git add . && git commit -m "chore: initial setup"`

⚠️ אל תריץ `git init` בתוך תיקייה שכבר יש בה `.git/`

→ קשור ל: git-add, git-commit, git-remote
