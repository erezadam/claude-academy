---
title: "סגנונות פלט ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-07-04
status: needs-review
source_url: https://code.claude.com/docs/en/output-styles
related: [memory, skills, permission-modes, slash-config]
---

סגנונות פלט משנים את אופן התגובה של Claude, לא את מה שהוא יודע. הם מוסיפים הוראות לפרומפט המערכת ומגדירים תפקיד, טון ופורמט פלט.

## מה זה עושה / למה זה שימושי

השתמש בסגנון פלט כשאתה ממשיך לנסח אותו אותו פרומפט בכל פנייה לשם קבלת טון או פורמט מסוים, או כשאתה רוצה שClaude יפעל בתפקיד שאינו מהנדס תוכנה. סגנון פלט מוסיף את ההוראות לפרומפט המערכת ומאפשר לבחור האם לשמור את הוראות ההנדסה המובנות של Claude Code.

שמור את הוראות ההנדסה כשאתה משנה את אופן התקשורת אך עדיין כותב קוד. השמט אותן כשClaude לא עושה הנדסת תוכנה כלל — כמו עוזר כתיבה או אנליסט נתונים.

## סגנונות מובנים

סגנון ה-**Default** הוא הפרומפט המובנה, המיועד לסיוע יעיל במשימות הנדסת תוכנה.

שלושה סגנונות מובנים נוספים:

- **Proactive**: Claude מבצע מיד, עושה הנחות סבירות ומעדיף פעולה על פני תכנון. זו הנחיה חזקה יותר מ-auto mode, ועובד ללא שינוי מצב ההרשאה — כך שבקשות ההרשאה ממשיכות להופיע.
- **Explanatory**: מספק "Insights" חינוכיים בין משימות ההנדסה. מסביר בחירות מימוש ותבניות ב-codebase.
- **Learning**: מצב שיתופי ולמידה בעשייה שבו Claude מבקש ממך לתרום חלקי קוד קטנים. Claude מוסיף `TODO(human)` בקוד שלך לפריטים שעליך לממש.

## איך משתמשים

**בחירת סגנון**: הרץ `/config` ובחר **Output style**. הבחירה נשמרת ב-`.claude/settings.local.json` ברמת הפרויקט המקומי.

**הגדרה ישירה בקובץ settings**:

```json
{
  "outputStyle": "Explanatory"
}
```

סגנון הפלט הוא חלק מהפרומפט המערכת, שClaude Code קורא פעם אחת בתחילת הסשן. שינויים נכנסים לתוקף אחרי `/clear` או בסשן חדש.

## יצירת סגנון פלט מותאם אישית

סגנון פלט מותאם הוא קובץ Markdown: frontmatter לmeta-data, ואז ההוראות להוספה לפרומפט המערכת.

**מיקומי שמירה**:
- משתמש: `~/.claude/output-styles`
- פרויקט: `.claude/output-styles`
- מדיניות מנוהלת: `.claude/output-styles` בתוך ספריית הגדרות מנוהלת

**דוגמה — סגנון שמוביל כל הסבר עם דיאגרמה**:

```markdown
---
name: Diagrams first
description: Lead every explanation with a diagram
keep-coding-instructions: true
---

When explaining code, architecture, or data flow, start with a Mermaid diagram showing the structure, then explain in prose.

## Diagram conventions

Use `flowchart TD` for control flow and `sequenceDiagram` for request paths. Keep diagrams under 15 nodes.
```

## שדות frontmatter

| שדה | מטרה | ברירת מחדל |
| :--- | :--- | :--- |
| `name` | שם הסגנון, אם שונה משם הקובץ | שם הקובץ |
| `description` | תיאור המוצג בבורר `/config` | ללא |
| `keep-coding-instructions` | שמור את הוראות ההנדסה המובנות | `false` |
| `force-for-plugin` | לפלאגינים: החל סגנון זה אוטומטית כשהפלאגין מופעל | `false` |

## כיצד סגנונות פלט עובדים

- כל סגנון מוסיף הוראות מותאמות לסוף הפרומפט המערכת.
- כל סגנון מפעיל תזכורות ל-Claude לדבוק בהוראות לאורך השיחה.
- סגנונות מותאמים משמיטים את הוראות ההנדסה המובנות של Claude Code (scope, comments, verify) אלא אם `keep-coding-instructions: true`.

שימוש בטוקנים: הוספת הוראות לפרומפט המערכת מגדילה את טוקני הקלט, אם כי prompt caching מפחית את העלות לאחר הבקשה הראשונה. הסגנונות Explanatory ו-Learning מייצרים תגובות ארוכות יותר מ-Default.

## השוואה לתכונות קשורות

| תכונה | כיצד פועלת | מתי להשתמש |
| :--- | :--- | :--- |
| סגנונות פלט | משנה את הפרומפט המערכת | רוצה תפקיד, טון או פורמט שונה בכל פנייה |
| CLAUDE.md | מוסיף הודעת משתמש אחרי הפרומפט המערכת | Claude תמיד יידע את מוסכמות הפרויקט |
| `--append-system-prompt` | מוסיף לפרומפט המערכת ללא הסרה | תוספת חד-פעמית להפעלה בודדת |
| Agents | מריץ תת-סוכן עם פרומפט, מודל וכלים משלו | עוזר ממוקד למשימה מוגדרת |
| Skills | טוען הוראות ספציפיות-למשימה בקריאה | תהליך עבודה לשימוש חוזר |
