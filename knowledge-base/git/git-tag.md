---
title: "git tag"
category: git
layer: intermediate
last_verified: 2026-03-07
status: current
related: [git-log, git-push, git-commit]
---

## git tag

מה זה עושה: מסמן נקודה ספציפית בהיסטוריה — בדרך כלל גרסה.

### שימוש
```bash
git tag                           # רשימת tags
git tag v1.0.0                    # tag פשוט
git tag -a v1.0.0 -m "תיאור"     # tag עם הודעה (מומלץ)
git push origin --tags            # שלח tags לשרת
git tag -d v1.0.0                 # מחק tag מקומי
```

### תהליך תיוג גרסה
```bash
# 1. וודא שאתה על main ועדכני
git switch main
git pull origin main

# 2. צור tag עם הודעה
git tag -a v1.2.0 -m "גרסה 1.2.0 — הוספת dashboard"

# 3. שלח לGitHub
git push origin --tags
```

### Semantic Versioning
```
v[MAJOR].[MINOR].[PATCH]

v1.0.0 → גרסה ראשונה יציבה
v1.1.0 → פיצ'ר חדש (לא שובר)
v1.1.1 → תיקון באג קטן
v2.0.0 → שינוי שובר תאימות
```

💡 `-a` (annotated tag) שומר תאריך, כותב, והודעה — תמיד עדיף על tag פשוט.

→ קשור ל: git-log, git-push, git-commit
