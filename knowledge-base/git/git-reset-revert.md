---
title: "git reset / git revert"
category: git
layer: intermediate
last_verified: 2026-03-07
status: current
related: [git-log, git-stash, git-commit]
---

## git reset / git revert

שתי דרכים לבטל שינויים — עם הבדל קריטי ביניהן.

---

## git reset — בטל מקומית

מה זה עושה: מזיז את HEAD אחורה בהיסטוריה.

### שימוש
```bash
git reset HEAD~1                  # בטל commit אחרון (שמור קוד)
git reset HEAD~1 --soft           # בטל commit, השאר staged
git reset HEAD~1 --hard           # בטל commit + מחק קוד ⚠️
git reset HEAD [קובץ]             # הסר קובץ מ-staging
```

### דוגמאות
```bash
# שכחת משהו בcommit האחרון
git reset HEAD~1
# עכשיו הקוד שלך — ולא committed
git add forgotten-file.js
git commit -m "feat: add login (with all files)"

# הסר קובץ שלא התכוונת לstage
git reset HEAD .env.local
```

⚠️ `--hard` מוחק קוד לצמיתות. בלתי הפיך.
⚠️ אל תעשה reset אחרי push — זה ישבור היסטוריה לאחרים.

---

## git revert — בטל בבטוח (לאחר push)

מה זה עושה: יוצר commit חדש שמבטל commit ישן — לא מוחק היסטוריה.

### שימוש
```bash
git revert [hash]                 # בטל commit ספציפי
git revert HEAD                   # בטל הcommit האחרון
```

### דוגמה
```bash
# מצא את ה-hash
git log --oneline
# a3f9b12 feat: broken feature  ← רוצים לבטל את זה
# b7e2d01 fix: good fix

git revert a3f9b12
# Git יוצר commit חדש: "Revert: feat: broken feature"
git push origin main
```

💡 הכלל הפשוט:
- לפני push → `git reset`
- אחרי push → `git revert`

→ קשור ל: git-log, git-commit, git-push
