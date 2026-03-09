---
title: "git stash"
category: git
layer: intermediate
last_verified: 2026-03-07
status: current
related: [git-checkout, git-pull, git-branch]
---

## git stash

מה זה עושה: שומר שינויים זמנית בצד — בלי commit.

### שימוש
```bash
git stash                         # שמור הכל
git stash save "תיאור"            # עם תיאור
git stash list                    # רשימת stashes
git stash pop                     # שחזר + מחק
git stash apply                   # שחזר + **שמור** ב-stash
git stash drop stash@{0}          # מחק stash ספציפי
git stash clear                   # מחק הכל
```

### מתי להשתמש
```bash
# תרחיש 1: צריך לעבור ענף אבל יש שינויים
git stash
git switch main
# ... עובד על main ...
git switch feature/my-thing
git stash pop

# תרחיש 2: לפני git pull שעלול לגרום conflict
git stash
git pull origin develop
git stash pop

# תרחיש 3: ניסוי שלא עבד — זרוק ותחזור
git stash
# הכל חזר למצב הנקי
```

### רשימה וניהול
```bash
git stash list
# stash@{0}: On feature/x: תיאור
# stash@{1}: On develop: תיאור ישן

git stash pop stash@{1}           # שחזר ספציפי
```

💡 `pop` = apply + drop. `apply` = apply בלי למחוק. כמעט תמיד רוצים `pop`.

⚠️ stash לא עובר בין מכונות — הוא מקומי לחלוטין.

→ קשור ל: git-checkout, git-pull, git-branch
