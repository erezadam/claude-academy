---
title: "Worktrees — סשנים מקבילים מבודדים ב-git"
category: workflows
layer: intermediate
last_verified: 2026-06-06
created: 2026-06-06
status: needs-review
source_url: https://code.claude.com/docs/en/worktrees
related: ["sub-agents", "dynamic-workflows", "agent-view"]
---

`--worktree` מפעיל כל סשן של Claude Code ב-git worktree נפרד, כך שעריכות בסשן אחד לא נוגעות בקבצים של סשן מקביל.

## מה זה עושה / למה זה שימושי

git worktree הוא ספריית עבודה נפרדת עם ענף משלה, החולקת אותו היסטוריית repository ורמוט עם ה-checkout הראשי. הפעלת Claude Code בכל worktree מאפשרת, לדוגמה, לבנות feature בטרמינל אחד תוך כדי תיקון bug בשני — בלי שיתנגשו.

## איך משתמשים

### הפעלת Claude ב-worktree

```bash
claude --worktree feature-auth
```

יוצר worktree תחת `.claude/worktrees/feature-auth/` על ענף `worktree-feature-auth`. לסשן שני מבודד:

```bash
claude --worktree bugfix-123
```

ללא שם, Claude מייצר שם אוטומטי:

```bash
claude --worktree
```

הוסיפו `.claude/worktrees/` ל-`.gitignore` כדי שתכנים לא יופיעו כ-untracked files בעותק הראשי.

### בחירת ענף בסיס

ברירת המחדל היא `origin/HEAD` (ענף ברירת המחדל מהרמוט). לשינוי ב-`settings.json`:

```json
{
  "worktree": {
    "baseRef": "head"
  }
}
```

`"head"` מעתיק מה-HEAD המקומי הנוכחי, כולל commits לא-pushed ועבודה בפרוגרס.

לפתיחת worktree מ-Pull Request ספציפי:

```bash
claude --worktree "#1234"
```

### העתקת קבצים gitignored לworktrees

worktree הוא checkout טרי, כך שקבצים כמו `.env` אינם קיימים בו. צרו `.worktreeinclude` בשורש הפרויקט:

```text
.env
.env.local
config/secrets.json
```

קבצים שמתאימים לתבנית וגם gitignored יועתקו אוטומטית לכל worktree חדש.

### בידוד Subagents עם worktrees

הוסיפו `isolation: worktree` ל-frontmatter של subagent מותאם, או בקשו מ-Claude "use worktrees for your agents". כל subagent מקבל worktree זמני שמוסר אוטומטית בסיום ללא שינויים.

### ניקוי אוטומטי

בעת יציאה מסשן worktree:

- **ללא שינויים**: הworktree והענף מוסרים אוטומטית
- **עם שינויים**: Claude שואל אם לשמור או להסיר

### ניהול ידני

```bash
# יצירת worktree על ענף חדש
git worktree add ../project-feature-a -b feature-a

# יצירת worktree מענף קיים
git worktree add ../project-bugfix bugfix-123

# הפעלת Claude ב-worktree
cd ../project-feature-a && claude

# רשימת worktrees
git worktree list

# הסרת worktree
git worktree remove ../project-feature-a
```

אחרי יצירה ידנית, אתחלו את סביבת הפיתוח בתוך הworktree: התקנת תלויות, הגדרת venv וכדומה.
