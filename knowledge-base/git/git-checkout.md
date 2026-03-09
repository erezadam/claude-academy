---
title: "git checkout / git switch"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-branch, git-stash, git-merge]
---

## git checkout / git switch

מה זה עושה: מעבר בין ענפים.

### שימוש
```bash
# מודרני (Git 2.23+) — מומלץ
git switch [branch]               # עבור לענף קיים
git switch -c feature/x           # צור + עבור

# קלאסי — עדיין עובד
git checkout [branch]
git checkout -b feature/x         # צור + עבור
```

### דוגמאות
```bash
# תחילת פיצ'ר חדש
git switch develop
git pull origin develop
git switch -c feature/user-profile

# חזרה לprevious branch
git switch -
```

### git checkout לקבצים (שימוש שונה לגמרי!)
```bash
# שחזר קובץ ספציפי למצב האחרון בcommit
git checkout HEAD -- src/utils.ts

# ⚠️ זה מחק את השינויים בקובץ — לא ניתן לביטול
```

💡 `git switch -` (מינוס) = חזור לענף הקודם. שימושי מאוד.

⚠️ אם יש שינויים לא saved ואתה עובר ענף — Git יבקש לעשות stash או commit קודם.

→ קשור ל: git-branch, git-stash, git-merge
