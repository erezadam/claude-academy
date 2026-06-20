---
title: "Agent Teams — תיאום קבוצות של Claude Code"
category: workflows
layer: intermediate
last_verified: 2026-06-20
status: needs-review
source_url: https://code.claude.com/docs/en/agent-teams
related: [sub-agents, dynamic-workflows, agent-view, worktrees]
---

Agent Teams מאפשרים לתאם כמה instances של Claude Code שעובדים יחד. session אחד משמש כ-Lead שמאצil משימות, ומשתתפים (teammates) עובדים באופן עצמאי — כל אחד עם context window משלו — ויכולים לתקשר ישירות אחד עם השני.

## מה זה עושה / למה זה שימושי

בשונה מ-[subagents](/en/sub-agents) שמדווחים רק ל-agent הראשי, teammates משתפים רשימת משימות ומתכתבים ישירות. זה שימושי כשהעבודה מחייבת חקירה מקבילה, ניתוח מזוויות שונות, או עבודה על מודולים בלתי תלויים בו-זמנית.

**מקרי שימוש מתאימים:**
- Code review מקבילי: כל teammate בודק היבט אחר (אבטחה, ביצועים, כיסוי בדיקות)
- חקירת באג עם השערות מתחרות
- פיצ'ר גדול שנפרש על frontend, backend ובדיקות

**לא מתאים ל:** משימות עוקבות, עריכת אותו קובץ, או עבודה פשוטה שסוכן יחיד יסיים מהר יותר.

## איך מפעילים

Agent Teams מושבת ברירת מחדל. להפעלה, הגדר:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## איך משתמשים

לאחר ההפעלה, פשוט תאר את המשימה בשפה טבעית:

```text
Spawn three teammates to review PR #142:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Claude יפצל את העבודה, יוצר teammates, וישתמש ב-shared task list לתיאום.

**שיטת חקירה עם השערות מתחרות:**

```text
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories.
```

## ניווט ושליטה

ב-in-process mode (ברירת מחדל), ה-teammates מופיעים בפאנל מתחת לשורת הקלט:

| מקש | פעולה |
| :--- | :----- |
| `↑` / `↓` | בחירת teammate |
| `Enter` | פתיחת ה-transcript של ה-teammate |
| `Escape` | עצירת הריצה הנוכחית |
| `x` על teammate | עצירת teammate |
| `Ctrl+T` | הצגת/הסתרת task list |

## הגדרת Split Panes

```json
{
  "teammateMode": "auto"
}
```

אפשרויות: `"in-process"` (ברירת מחדל), `"auto"` (split panes עם tmux/iTerm2), `"tmux"`.

## השוואה: Teammates לעומת Subagents

| | Subagents | Agent Teams |
| :--- | :--- | :--- |
| **תקשורת** | מדווחים רק לסוכן הראשי | מתכתבים ישירות אחד עם השני |
| **תיאום** | הסוכן הראשי מנהל הכל | Shared task list עם self-coordination |
| **עלות** | נמוכה יחסית | גבוהה יותר (כל teammate = context משלו) |
| **מתי** | משימות ממוקדות עם תוצאה ברורה | עבודה שדורשת שיתוף ממצאים |

## מגבלות ידועות

Agent Teams הם ניסיוני. מגבלות עיקריות:
- `/resume` ו-`/rewind` לא משחזרים teammates (in-process)
- teammates לא יכולים לספון teammates משלהם
- split panes דורש tmux או iTerm2 (לא נתמך ב-VS Code Terminal)
- session אחד = קבוצה אחת בלבד
