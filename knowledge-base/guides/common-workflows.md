---
title: "תהליכי עבודה נפוצים עם Claude Code"
category: guides
last_verified: 2026-09-05
status: needs-review
source_url: https://code.claude.com/docs/en/common-workflows
related: [sessions, worktrees, sub-agents, headless, prompting-basics]
mission: daily
level: beginner
type: guide
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-09-05T12:00:00+03:00"
pathOrder: 30
---

מדריך קצר לתבניות הפרומפטים ולתהליכי העבודה הנפוצים ביותר עם Claude Code — ממחקר בסיס קוד ועד הגשת PR. לכל אחד דוגמאות שניתן להריץ.

## ## תבניות פרומפט לפי משימה

### הבנת בסיס קוד חדש

```text
give me an overview of this codebase
explain the main architecture patterns used here
what are the key data models?
how is authentication handled?
```

התחילו בשאלות רחבות ואז צמצמו. בקשו מ-Claude מפת מושגים של ה-domain.

### איתור ותיקון באגים

```text
I'm seeing an error when I run npm test
suggest a few ways to fix the @ts-ignore in user.ts
update user.ts to add the null check you suggested
```

ספקו את הפקודה לשחזור הבאג עם ה-stack trace. ציינו אם הבאג לסירוגין.

### ריפקטורינג

```text
find deprecated API usage in our codebase
suggest how to refactor utils.js to use modern JavaScript features
refactor utils.js to use ES2024 features while maintaining the same behavior
run tests for the refactored code
```

בקשו ריפקטורינג בצעדים קטנים ונבדקים. בקשו מ-Claude להסביר את היתרונות.

### כתיבת טסטים

```text
find functions in NotificationsService.swift that are not covered by tests
add tests for the notification service
add test cases for edge conditions in the notification service
run the new tests and fix any failures
```

Claude בודק את קבצי הטסטים הקיימים ומתאים את הסגנון, הפריימוורק ודפוסי ה-assertion.

### יצירת Pull Request

```text
summarize the changes I've made to the authentication module
create a pr
enhance the PR description with more context about the security improvements
```

ניתן גם לבקש "create a pr for my changes" ישירות. לאחר הגשה, `claude --from-pr 1234` פותח בורר sessions מסוננים לפי ה-PR.

### תיעוד

```text
find functions without proper JSDoc comments in the auth module
add JSDoc comments to the undocumented functions in auth.js
check if the documentation follows our project standards
```

ציינו את סגנון התיעוד הנדרש (JSDoc, docstrings, וכד') ובקשו דוגמאות.

---

## המשך שיחות ממושכות

כשמשימה נמשכת כמה ישיבות, המשיכו מנקודת העצירה:

```bash
claude --continue
```

ממשיך את ה-session האחרון בתיקייה הנוכחית. השתמשו ב-`claude --resume` לבחירה מרשימה, או `/resume` מתוך session פעיל.

## עבודה מקבילה עם Worktrees

עבדו על פיצ'ר בטרמינל אחד בזמן ש-Claude מתקן באג בטרמינל אחר, בלי שהשינויים יתנגשו:

```bash
claude --worktree feature-auth
```

כל [git worktree](https://git-scm.com/docs/git-worktree) הוא checkout נפרד בענף משלו.

## תכנון לפני עריכה

לשינויים שרוצים לסקור לפני ביצוע, עברו ל-plan mode. Claude קורא קבצים ומציע תוכנית — ללא עריכות עד שאתם מאשרים:

```bash
claude --permission-mode plan
```

ניתן גם ללחוץ `Shift+Tab` בתוך session פעיל עד שסרגל הסטטוס מציג `⏸ plan mode on`.

## האצלת מחקר ל-Subagents

חקירה של בסיס קוד גדול ממלאת את ההקשר בקריאות קבצים. האצילו כדי שרק הממצאים יחזרו:

```text
use a subagent to investigate how our auth system handles token refresh
```

ה-subagent קורא קבצים בחלון ההקשר שלו ומחזיר סיכום.

## הרצה בתוך סקריפטים

להרצה לא-אינטראקטיבית ב-CI, hooks או batch processing:

```bash
git log --oneline -20 | claude -p "summarize these recent commits"
```
