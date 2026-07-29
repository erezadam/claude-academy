---
title: "git pull"
category: git
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://git-scm.com/docs/git-pull
related: [git-push, git-fetch, git-merge]
level: beginner
type: reference
tool: git
origin: official
timeMinutes: 2
last_reviewed: 2026-03-07
---

## git pull

מה זה עושה: מושך עדכונים מהשרת ומשלב אותם לקוד המקומי.

### שימוש
```bash
git pull                          # משוך לbranch הנוכחי
git pull origin [branch]          # מפורש
git pull --rebase                 # משוך + rebase במקום merge
```

### מה git pull עושה בפועל
```
git pull = git fetch + git merge
```

### דוגמה
```bash
# תחילת יום עבודה — תמיד
git checkout develop
git pull origin develop
git checkout feature/my-feature
```

💡 `git pull --rebase` שומר על היסטוריה נקייה יותר — מומלץ לעובדים לבד.

⚠️ אם יש לך שינויים לא saved ו-pull גורם לconflict — Git יעצור ויבקש לפתור.
   פתרון: `git stash` לפני pull, `git stash pop` אחריו.

→ קשור ל: git-push, git-fetch, git-stash, git-merge
