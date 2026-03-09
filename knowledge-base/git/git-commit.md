---
title: "git commit"
category: git
layer: basic
last_verified: 2026-03-07
claude_code_version: ">=1.0"
source_url: "https://git-scm.com/docs/git-commit"
status: current
related: [git-add, git-push, git-log, git-stash]
---

## git commit

### מה זה עושה
שומר snapshot של השינויים הנוכחיים בהיסטוריית הפרויקט.

### מבנה
```
git commit [-m "הודעה"] [--amend] [--no-edit] [-a]
```

### פרמטרים
| פרמטר | משמעות | חובה? |
|--------|---------|--------|
| `-m "הודעה"` | הודעת commit בשורת הפקודה | מומלץ |
| `--amend` | תיקון ה-commit האחרון | לא |
| `-a` | הוסף אוטומטית כל קובץ עקוב | לא |
| `--no-edit` | שמור הודעה קיימת בעת amend | לא |

### דוגמאות

**בסיסי:**
```bash
# שמירת שינויים עם הודעה ברורה
git commit -m "feat: הוספת מסך התחברות"
```

**פורמט מלא (Conventional Commits):**
```bash
# feat = פיצ'ר חדש
git commit -m "feat: הוספת login עם Google OAuth"

# fix = תיקון באג
git commit -m "fix: תיקון crash בטעינת תמונות"

# docs = תיעוד בלבד
git commit -m "docs: עדכון README עם הוראות התקנה"

# refactor = שינוי מבנה ללא שינוי התנהגות
git commit -m "refactor: פיצול קומפוננטת Header"

# chore = תחזוקה (dependencies, config)
git commit -m "chore: עדכון גרסת React ל-19"
```

**תיקון commit אחרון:**
```bash
# שכחת קובץ? תוסיף אותו ותתקן
git add forgotten-file.js
git commit --amend --no-edit
```

**בתוך Claude Code:**
```
# Claude מבצע commit אוטומטית כשאתה אומר:
"שמור את השינויים"
"תעשה commit עם הודעה: הוספת דף אודות"

# או ישירות:
/git commit -m "feat: הוספת דף אודות"
```

### מתי להשתמש
- ✅ כן — אחרי שיחידת עבודה שלמה ועובדת
- ✅ כן — לפני מעבר לפיצ'ר אחר
- ✅ כן — לפני ניסוי שעלול לשבור דברים
- ❌ לא — אחרי כל שורת קוד
- ❌ לא — כשיש קוד שבור שלא עובד
- ❌ לא — כשיש console.log / debug code שנשאר

### שגיאות נפוצות
```
שגיאה: nothing to commit, working tree clean
סיבה: אין שינויים staged
פתרון: הרץ git add . לפני commit

שגיאה: Please tell me who you are
סיבה: Git לא מוגדר עם שם ואימייל
פתרון: 
  git config --global user.name "השם שלך"
  git config --global user.email "email@example.com"
```

### קשור ל
→ [git add](./git-add.md) — הכנת קבצים לפני commit
→ [git push](./git-push.md) — שליחת commits לשרת
→ [git log](./git-log.md) — צפייה בהיסטוריה
→ [git stash](./git-stash.md) — שמירה זמנית ללא commit

### הערת גרסה
פורמט Conventional Commits (`feat:`, `fix:`) הוא convention — לא חובה טכנית. מומלץ מאוד לעבודת צוות ו-changelogs אוטומטיים.
