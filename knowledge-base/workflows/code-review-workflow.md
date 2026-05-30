---
title: "Code Review — תהליך סקירת קוד"
category: workflows
layer: basic
last_verified: 2026-05-30
status: current
---

## Code Review — תהליך סקירת קוד

איך לעשות סקירת קוד יעילה עם Git ו-Claude Code.

### השלבים

```bash
# 1. ראה מה השתנה
git diff develop...feature/my-feature

# 2. בקש מ-Claude לסקור
"תסקור את השינויים ב-PR הזה"

# 3. בדוק נקודות קריטיות
git log --oneline develop..feature/my-feature
```
