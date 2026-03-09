---
title: "git status"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-add, git-diff, git-log]
---

## git status

מה זה עושה: מראה מה השתנה — מה staged, מה לא, מה לא עקוב.

### שימוש
```bash
git status
git status -s    # קצר — שורה אחת לקובץ
```

### קריאת הפלט
```
On branch feature/login

Changes to be committed:     ← staged (אחרי git add)
  modified: src/auth.ts

Changes not staged:          ← שונה אך לא staged
  modified: src/utils.ts

Untracked files:             ← חדש, Git לא מכיר
  src/newfile.ts
```

### צבעים
- 🟢 ירוק = staged, מוכן לcommit
- 🔴 אדום = שונה אבל לא staged

💡 הרץ `git status` לפני **כל** פעולה — זה 2 שניות שחוסכים שגיאות.

→ קשור ל: git-add, git-diff, git-log
