---
title: "Code Review — תהליך סקירת קוד"
category: workflows
layer: basic
last_verified: 2026-05-30
status: current
origin: original
mission: code
level: intermediate
type: recipe
tool: claude-code
timeMinutes: 2
last_reviewed: 2026-05-30
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
