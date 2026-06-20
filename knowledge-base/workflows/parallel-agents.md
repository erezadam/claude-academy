---
title: "הרצת Agents במקביל — השוואת גישות"
category: workflows
layer: intermediate
last_verified: 2026-06-20
status: needs-review
source_url: https://code.claude.com/docs/en/agents
related: [sub-agents, agent-view, dynamic-workflows, worktrees, agent-teams]
---

Claude Code מציע כמה גישות להרצת משימות מקביליות. כל גישה מתאימה לתרחיש אחר, ובחירה נכונה חוסכת טוקנים ומשפרת תוצאות.

## מה זה עושה / למה זה שימושי

כשמשימה גדולה מדי לשיחה בודדת, או כשחלקים שונים יכולים לרוץ בו-זמנית, ניתן לפצל את העבודה בין כמה agents. כל גישה שונה ברמת התיאום הנדרשת ובמי שמנהל את העבודה.

## איך משתמשים

### השוואת הגישות

| גישה | מה מקבלים | מתי להשתמש |
| :--- | :--------- | :---------- |
| [Subagents](/en/sub-agents) | עובדים בתוך session אחד, מדווחים תוצאות | משימת צד שתציף את ה-context בתוצאות |
| [Agent View](/en/agent-view) | מסך אחד לניהול sessions ברקע (`claude agents`) | כמה משימות עצמאיות לניטור מרחוק |
| [Agent Teams](/en/agent-teams) | כמה sessions עם shared task list ותקשורת ישירה | Claude מפצל פרויקט ומתאם workers |
| [Dynamic Workflows](/en/workflows) | script שמריץ subagents רבים ואוכף cross-check | עבודה גדולה מדי לניהול turn-by-turn |

### בחירת גישה לפי שאלות מנחות

**מי מתאם את העבודה?**
- Claude מאציl ואוסף בתוך שיחה אחת → **Subagents**
- אתה מחלק משימות עצמאיות ובודק מאוחר → **Agent View**
- Claude מתכנן, מאציl ומפקח על קבוצה → **Agent Teams** (ניסיוני)
- script מחזיק את התכנית במקום שיקול דעת בתור → **Dynamic Workflows**

**האם העובדים צריכים לתקשר זה עם זה?**
- לא — Subagents ו-Agent View מספיקים
- כן — Agent Teams (teammates שולחים הודעות ישירות)

**האם המשימות נוגעות באותם קבצים?**
- כן — השתמש ב-[Worktrees](/en/worktrees) לבידוד git

### בדיקת סטטוס עבודה מקבילה

```bash
# sessions ברקע
claude agents

# subagents בתוך session
/agents

# עבודות ב-background בתוך session
/tasks

# dynamic workflows
/workflows
```

## כלים משלימים

- **[Worktrees](/en/worktrees)** — כל session מקבל git checkout נפרד, כך שלא עורכים אותם קבצים. Agent View מעביר כל session ל-worktree אוטומטית.
- **[`/batch`](/en/commands)** — skill שמחלק שינוי גדול ל-5 עד 30 subagents עם worktree isolation, כל אחד פותח PR.

## עלות

הרצת כמה sessions או subagents מכפילה שימוש בטוקנים. ראו [Costs](/en/costs) לפרטים על מגבלות ותמחור.
