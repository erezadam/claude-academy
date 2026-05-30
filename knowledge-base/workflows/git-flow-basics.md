---
title: "Git Flow — תהליך עבודה בסיסי"
category: workflows
layer: basic
last_verified: 2026-05-30
status: current
---

## Git Flow — תהליך עבודה בסיסי

איך לעבוד עם branches בצוות — מ-feature branch ועד merge.

### השלבים

```bash
# 1. צור branch חדש מ-develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. עבוד ושמור
git add .
git commit -m "feat: add new feature"

# 3. שלח ל-remote
git push -u origin feature/my-feature

# 4. פתח Pull Request ב-GitHub

# 5. אחרי אישור — merge ונקה
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```
