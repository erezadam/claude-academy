---
title: "פתיחת פרויקט חדש עם Claude Code"
category: workflows
layer: basic
last_verified: 2026-05-30
status: current
---

## פתיחת פרויקט חדש עם Claude Code

השלבים המומלצים להקמת פרויקט חדש מאפס עם Claude Code.

### השלבים

```bash
# 1. אתחול
/init

# 2. ערוך את CLAUDE.md שנוצר
/memory

# 3. הגדר Git
git init
git add .
git commit -m "chore: initial setup"

# 4. חבר ל-GitHub
git remote add origin [URL]
git push -u origin main
```
