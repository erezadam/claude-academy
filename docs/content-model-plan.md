# תוכנית מודל תוכן — שיוך mission / level / type (מבוסס-תוכן)

נוצר 2026-07-29. השיוך נעשה ע"י קריאת כותרת+פתיחה+סעיף ראשון של כל מאמר לפי הרובריקה למטה — לא לפי תיקייה. **טרם נכתב ל-frontmatter — ממתין לאישור.** timeMinutes ייגזר מאורך הטקסט (מאושר), origin לפי קיום מקור רשמי (מאושר).

## התפלגות mission (מבחן בריאות: 5 ≤ n ≤ 25)

| mission | מאמרים | מבחן |
|---|---|---|
| daily | 34 | ❌ חריגה |
| code | 26 | ❌ חריגה |
| advanced | 18 | ✓ |
| automate | 11 | ✓ |
| spec | 7 | ✓ |
| start | 0 | ❌ חריגה |

## רובריקה
```
# רובריקת שיוך mission / level / type — claude-academy

## mission — לפי כוונת המאמר, לא לפי תיקייה. בחר את הראשון שמתאים:
1. start — נועד למי שמעולם לא השתמש בכלי: התקנה, ריצה ראשונה, מושגי-יסוד שבלעדיהם אי-אפשר להתחיל.
2. spec — הגדרת ידע ותיעוד לפרויקט: CLAUDE.md, אפיון, מסמכי פרויקט, prompts לתיעוד.
3. automate — הפעלת Claude בלי אדם בלולאה: תזמון, cron, /loop, routines, hooks, headless, CI, watchdogs.
4. advanced — הרחבת יכולות הפלטפורמה: skills, plugins, MCP, sub-agents, agent-teams, sandboxing, ארכיטקטורות מרובות-סוכנים, remote-control.
5. code — עבודה על קוד עצמה: כתיבה, code-review, debug, git, worktrees, checkpoints של קוד.
6. daily — ניהול שוטף של סשן ועבודה יומיומית: סשנים, קונטקסט, עלות, קיצורים, הגדרות, מודלים, permissions, חיפוש.

## level — beginner אם אפשר לפעול לפי המאמר בלי שום ידע מוקדם (לא לפי "כמה הנושא קשה"). advanced אם דורש שליטה בכלי + מושגים מרובים. אחרת intermediate. אל תירש layer בעיוורון.

## type — reference: טבלת/רשימת פקודות-דגלים שמיועדת לשליפה. recipe: תהליך צעד-אחר-צעד לתרחיש מוגדר. guide: הסבר מושגי רציף. מאמר git- שהוא מדריך עומק אינו reference — שפוט לפי התוכן.
```

## הטבלה המלאה (96 מאמרים)

| מאמר | mission | level | type | נימוק |
|---|---|---|---|---|
| claude-code/advisor | daily | intermediate | guide | בחירת מודל מייעץ בסשן שוטף |
| claude-code/auto-mode-config | daily | advanced | reference | reference להגדרות הרשאות auto mode |
| claude-code/channels | automate | intermediate | recipe | אירועים נכנסים בלי אדם בלולאה |
| claude-code/checkpointing | code | beginner | guide | החזרת שינויי קוד, ללא ידע מוקדם |
| claude-code/chrome-integration | advanced | beginner | guide | הרחבת יכולות בדפדפן, הפעלה פשוטה |
| claude-code/claude-md-guide | daily | intermediate | guide | שיטות עבודה וניהול קונטקסט בסשן |
| claude-code/cli-flags | automate | advanced | reference | טבלת דגלים ל-headless ו-CI |
| claude-code/computer-use | advanced | intermediate | guide | הרחבת יכולות לשליטה במסך |
| claude-code/costs | daily | intermediate | guide | ניהול עלות שוטף של סשנים |
| claude-code/fast-mode | daily | beginner | guide | תצורת מודל יומיומית, toggle פשוט |
| claude-code/headless | automate | intermediate | guide | הרצה בלי אינטראקציה ב-CI וסקריפטים |
| claude-code/keybindings | daily | beginner | recipe | התאמת קיצורים צעד-אחר-צעד בהגדרות |
| claude-code/keyboard-shortcuts | daily | beginner | reference | טבלאות קיצורים לשליפה מהירה |
| claude-code/memory | spec | beginner | guide | CLAUDE.md וזיכרון — ידע פרויקט |
| claude-code/model-config | daily | beginner | reference | טבלת aliases ובחירת מודל לשליפה |
| claude-code/output-styles | daily | intermediate | guide | התאמת התנהגות סשן דרך settings |
| claude-code/permission-modes | daily | intermediate | guide | הסבר מושגי על מצבי הרשאה |
| claude-code/plugins-guide | advanced | intermediate | recipe | quickstart ליצירת plugin שלב-אחר-שלב |
| claude-code/remote-control | advanced | beginner | recipe | remote-control, שלבי הפעלה פשוטים |
| claude-code/sandboxing | advanced | intermediate | guide | sandboxing — הסבר מושגי והגדרה |
| claude-code/sessions | daily | beginner | guide | ניהול שיחות והמשכיות יומיומית |
| claude-code/skills | advanced | intermediate | guide | הרחבת יכולות עם skills, מושגי |
| claude-code/slash-agents | advanced | intermediate | reference | כרטיס פקודה תמציתי ל-subagents |
| claude-code/slash-code-review | code | intermediate | guide | סקירת קוד — הסבר והבהרות |
| claude-code/slash-commands-all | daily | beginner | reference | טבלת כל הפקודות לשליפה מהירה |
| claude-code/slash-compact-clear | daily | beginner | guide | הסבר מושגי על ניהול context בסשן |
| claude-code/slash-config | daily | beginner | reference | רשימת הגדרות וקטגוריות לשליפה |
| claude-code/slash-context-cost | daily | beginner | guide | ניטור context ועלות סשן שוטף |
| claude-code/slash-diff-copy | daily | beginner | guide | צפייה בשינויים והעתקה בסשן יומיומי |
| claude-code/slash-doctor | daily | intermediate | guide | אבחון תצורה; דורש הבנת skills |
| claude-code/slash-export-resume | daily | beginner | guide | שמירה והמשך סשנים — ניהול שוטף |
| claude-code/slash-extra-usage-privacy | daily | beginner | guide | מכסות ופרטיות — הגדרות שימוש שוטפות |
| claude-code/slash-fast-vim | daily | beginner | reference | רשימת מצבי תצוגה ופלט קצרים |
| claude-code/slash-fork-rename-exit | daily | beginner | guide | ניהול סשנים — פיצול, שם, יציאה |
| claude-code/slash-goal | automate | intermediate | guide | עבודה עצמאית עד תנאי, בלי אדם |
| claude-code/slash-hooks | automate | intermediate | guide | hooks אוטומטיים — הסבר עם דוגמאות JSON |
| claude-code/slash-init | spec | beginner | recipe | יצירת CLAUDE.md עם צעדי המשך |
| claude-code/slash-login-logout-usage | daily | beginner | reference | חשבון ומכסות — פקודות קצרות לשליפה |
| claude-code/slash-mcp | advanced | intermediate | guide | חיבור MCP servers מרחיב יכולות |
| claude-code/slash-memory | spec | beginner | guide | ניהול זיכרון CLAUDE.md ותיעוד ידע |
| claude-code/slash-model | daily | beginner | guide | בחירת מודל לפי משימה ועלות |
| claude-code/slash-permissions | daily | intermediate | reference | תצורת הרשאות — דוגמאות settings לשליפה |
| claude-code/slash-plan | daily | beginner | guide | מצב תכנון — שליטה בהתנהגות הסשן |
| claude-code/slash-pr-security | code | intermediate | guide | סקירת PR ואבטחת קוד לפני commit |
| claude-code/slash-remote-desktop | advanced | intermediate | guide | remote-control ואינטגרציות חיצוניות |
| claude-code/slash-review | code | beginner | guide | code review על שינויים לפני commit |
| claude-code/slash-rewind | code | beginner | guide | checkpoints וחזרה אחורה בקוד |
| claude-code/slash-security-sandbox | advanced | intermediate | guide | sandboxing והרצה מבודדת — יכולת פלטפורמה |
| claude-code/slash-skills-plugin | advanced | intermediate | reference | פקודות ניהול skills ו-plugins לשליפה |
| claude-code/slash-stats-insights | daily | beginner | reference | פקודות סטטיסטיקה ומידע לשימוש שוטף |
| claude-code/slash-terminal-keybindings | daily | beginner | reference | פקודות התאמת טרמינל וקיצורים |
| claude-code/slash-todos | daily | beginner | reference | פקודת צפייה במשימות סשן |
| claude-code/statusline | daily | intermediate | guide | הסבר פיצ'ר הגדרות עם בניית סקריפט |
| claude-code/sub-agents | advanced | intermediate | guide | הסבר מושגי על סוכנים ייעודיים |
| claude-code/voice-dictation | daily | beginner | guide | הסבר פיצ'ר הכתבה קולית בסשן |
| git/git-add | code | beginner | reference | רשימת פקודות staging בסיסיות |
| git/git-branch | code | beginner | reference | פקודות ניהול ענפים לשליפה |
| git/git-checkout | code | beginner | reference | פקודות מעבר ענפים לשליפה |
| git/git-commit | code | beginner | reference | טבלת פרמטרים ודוגמאות commit |
| git/git-diff | code | beginner | reference | רשימת וריאציות diff לשליפה |
| git/git-init | code | beginner | reference | פקודת יצירת repo בסיסית |
| git/git-log | code | beginner | reference | דגלי log שימושיים לשליפה |
| git/git-merge | code | intermediate | reference | פקודות merge וטיפול ב-conflicts |
| git/git-pull | code | beginner | reference | פקודות משיכה מהשרת לשליפה |
| git/git-push | code | beginner | reference | פקודות שליחה לשרת לשליפה |
| git/git-remote | code | beginner | reference | פקודות ניהול remotes וחיבור |
| git/git-reset-revert | code | intermediate | reference | פקודות ביטול עם הבחנה קריטית |
| git/git-stash | code | intermediate | reference | פקודות stash ותרחישי שימוש |
| git/git-status | code | beginner | reference | פקודת מצב בסיסית לשליפה |
| git/git-tag | code | intermediate | reference | פקודות תיוג גרסאות לשליפה |
| guides/agency-agents | advanced | advanced | guide | ספריית סוכנים מרחיבה את הפלטפורמה |
| guides/building-agents-guide | advanced | advanced | guide | הסבר מושגי רציף להגדרת סוכן |
| guides/building-skills | advanced | advanced | guide | מדריך מקיף לבניית skills |
| guides/debug-your-config | daily | intermediate | guide | אבחון הגדרות, קונטקסט וטעינת קבצים |
| guides/hooks-guide | automate | intermediate | guide | hooks — פעולות דטרמיניסטיות אוטומטיות |
| guides/large-codebases | daily | intermediate | guide | ניהול קונטקסט והגדרות בקוד-בייס גדול |
| guides/ultrareview | code | intermediate | guide | סקירת קוד עמוקה — עבודה על קוד |
| project-docs/codeatlas | spec | beginner | recipe | פרומפט מוכן ליצירת מסמך תיעוד |
| project-docs/lessons | spec | beginner | recipe | פרומפט לתיעוד החלטות ולקחים |
| project-docs/vibeview | spec | beginner | recipe | פרומפט ליצירת מפת קבצים לפרויקט |
| scheduling/cron-tools | automate | intermediate | reference | רשימת כלי cron לשליפה מהירה |
| scheduling/desktop-scheduled-tasks | automate | beginner | recipe | צעדים ליצירת משימה מתוזמנת מקומית |
| scheduling/routines | automate | intermediate | guide | הסבר מושגי על אוטומציה בענן |
| scheduling/scheduled-tasks | automate | intermediate | guide | הסבר תזמון בתוך session והשוואות |
| scheduling/slash-loop | automate | beginner | reference | טבלאות שימוש, יחידות ומגבלות /loop |
| workflows/agent-teams | advanced | advanced | guide | תיאום מרובה-סוכנים, מושגים מרובים |
| workflows/agent-view | daily | intermediate | guide | ניהול שוטף של סשנים ברקע |
| workflows/artifacts | daily | beginner | guide | שיתוף פלט סשן — עבודה יומיומית |
| workflows/claude-code-new-project | spec | beginner | recipe | צעדי /init ו-CLAUDE.md לפרויקט חדש |
| workflows/code-review-workflow | code | beginner | recipe | צעדים קצרים לסקירת קוד |
| workflows/debug-with-claude | code | beginner | recipe | צעדים לאיתור ותיקון באגים |
| workflows/dynamic-workflows | advanced | advanced | guide | תזמור סוכנים בסקריפט — מתקדם |
| workflows/git-flow-basics | code | beginner | recipe | צעדי git מלאים לתרחיש מוגדר |
| workflows/parallel-agents | advanced | advanced | guide | השוואה מושגית בין גישות מרובות-סוכנים |
| workflows/ultraplan | code | intermediate | guide | תכנון וביצוע שינויי קוד בענן |
| workflows/worktrees | code | intermediate | guide | בידוד git לסשנים — עבודת קוד |
