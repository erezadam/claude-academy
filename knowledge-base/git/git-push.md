---
title: "git push"
category: git
layer: basic
last_verified: 2026-03-07
status: current
related: [git-pull, git-commit, git-remote]
---

## git push

מה זה עושה: שולח commits מקומיים לשרת (GitHub/GitLab).

### שימוש
```bash
git push                          # push לbranch הנוכחי
git push origin [branch]          # push מפורש
git push -u origin [branch]       # push + הגדר כברירת מחדל
git push origin --tags            # שלח גם tags
```

### דוגמאות
```bash
# פעם ראשונה על branch חדש
git push -u origin feature/login

# אחרי זה — פשוט
git push

# גיבוי מהיר
git add . && git commit -m "backup" && git push
```

💡 `-u` = "upstream" — מגדיר את הקישור בין הbranch המקומי לרחוק. צריך רק פעם אחת לbranch חדש.

⚠️ NEVER: `git push --force` על main — זה מוחק היסטוריה לכולם.
✅ מותר: `git push --force-with-lease` על feature branch שלך בלבד.

→ קשור ל: git-pull, git-commit, git-remote
