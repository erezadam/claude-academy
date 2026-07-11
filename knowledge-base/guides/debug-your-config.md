---
title: "לאבחן תצורה שלא עובדת"
category: guides
layer: intermediate
last_verified: 2026-07-11
status: needs-review
source_url: https://code.claude.com/docs/en/debug-your-config
related: ["hooks-guide", "slash-doctor", "slash-hooks", "slash-mcp", "slash-config"]
---

כשקוד Claude Code מתעלם מהוראה שכתבתם, או שפיצ'ר שהגדרתם לא מופיע, הסיבה הנפוצה ביותר היא אחת משלוש: הקובץ לא נטען, נטען ממיקום שונה ממה שציפיתם, או שקובץ אחר דרס אותו. המדריך הזה מסביר כיצד לבדוק מה Claude Code בפועל טען.

## מה זה עושה / למה זה שימושי

כלי האבחון המובנים ב-Claude Code חושפים בדיוק מה נמצא בחלון ההקשר, אילו הגדרות בתוקף, ואיזה hooks פועלים — בלי לנחש. זה חוסך זמן ניפוי שגיאות משמעותי.

## איך משתמשים

### ראו מה נטען להקשר

פקודת `/context` מציגה את כל מה שתופס מקום בחלון ההקשר של הסשן הנוכחי: פרומפט מערכת, קובצי CLAUDE.md, skills, subagents, כלי MCP, והודעות שיחה.

```
/context
```

לפירוט לפי קטגוריה, השתמשו בפקודות הייעודיות:

| פקודה | מציגה |
| :--- | :--- |
| `/memory` | קובצי CLAUDE.md וכללים שנטענו, כולל auto-memory |
| `/skills` | skills זמינים ממקורות project, user ו-plugin |
| `/hooks` | הגדרות hooks פעילות |
| `/mcp` | שרתי MCP מחוברים וסטטוסם |
| `/permissions` | כללי allow ו-deny שבתוקף |
| `/doctor` | בדיקת תקינות: הגדרות לא-תקינות, extensions לא-בשימוש, שמות subagent כפולים, עם הצעות לתיקון |
| `/debug [תיאור]` | מפעיל לוג debug לסשן ומבקש מ-Claude לאבחן |
| `/status` | מקורות הגדרות פעילים, כולל managed settings |

אם קובץ CLAUDE.md חסר מ-`/memory`, בדקו את המיקום שלו מול [כיצד קובצי CLAUDE.md נטענים](/en/memory#how-claude-md-files-load). קובצי CLAUDE.md בתת-תיקיות נטענים רק כשקוד Claude קורא קובץ מאותה תיקייה עם כלי Read — לא בתחילת הסשן.

### בדקו הגדרות שמוזגו

הגדרות מוזגות ממספר scopes: managed, user, project, local. ה-scope הקרוב ביותר דורס את הרחוק. הפעילו `/doctor` לאיתור קבצי הגדרות לא-תקינים, כפילויות, ו-extensions שאינם בשימוש — ו-Claude מציע תיקונים שמתבצעים רק אחרי אישורכם.

```bash
# בדיקה ממסוף בלי לפתוח סשן
claude doctor
```

לפני גרסה 2.1.205, `/doctor` פתח מסך diagnostics בקריאה בלבד. מגרסה 2.1.205 ואילך זהו checkup מלא עם יכולת תיקון.

### בדקו שרתי MCP

הפעילו `/mcp` לצפייה בכל שרת מוגדר, סטטוס החיבור שלו, ואם אישרתם אותו לפרויקט הנוכחי. שרתים ב-scope של project ב-`.mcp.json` דורשים אישור חד-פעמי — אם הדחיתם את ההנחיה, השרת נשאר מנוטרל.

אם שרת מחובר אך מציג אפס כלים, בחרו **Reconnect** מ-`/mcp`. אם האפס נמשך:

```bash
claude --debug mcp
```

### בדקו hooks

הפעילו `/hooks` לרשימת כל hook שרשום לסשן הנוכחי, מקובץ לפי אירוע. אם hook שהגדרתם לא מופיע — הוא לא נקרא כלל: hooks מוגדרים תחת המפתח `"hooks"` בקובץ settings, לא בקובץ עצמאי.

בעיות נפוצות ב-matcher:

```json
// שגוי — מערך לא נתמך כ-matcher
"matcher": ["Edit", "Write"]

// נכון — מחרוזת עם | כמפריד
"matcher": "Edit|Write"
```

שמות כלים הם case-sensitive ומתחילים באות גדולה: `Bash`, `Edit`, `Write`, `Read`.

לצפייה בהערכת hooks בזמן אמת:

```bash
claude --debug hooks
```

### בדיקה על תצורה נקייה

גרסה 2.1.169 ואילך תומכת ב-`--safe-mode` שמשבית את כל ההתאמות: CLAUDE.md, skills, plugins, hooks, שרתי MCP, פקודות ו-agents מותאמים. אימות ו-permissions רגילות עובדים.

```bash
claude --safe-mode
```

אם הבעיה נעלמת ב-safe mode, אחד מהמשטחים האלה הוא הגורם. אם נמשכת, נסו סשן על תצורה ריקה לגמרי:

```bash
cd /tmp && CLAUDE_CONFIG_DIR=/tmp/claude-clean claude
```

הסשן הנקי לא טוען הגדרות משתמש, hooks, שרתי MCP, plugins, או memory. Managed settings עדיין חלות.

## גורמים נפוצים

| תסמין | גורם | פתרון |
| :--- | :--- | :--- |
| Hook לא מופעל | matcher הוא מערך JSON במקום מחרוזת | השתמשו במחרוזת עם `\|`, לדוגמה `"Edit\|Write"` |
| Hook לא מופעל | שם כלי באותיות קטנות, למשל `"bash"` | שמות כלים הם case-sensitive: `Bash`, `Edit`, `Write` |
| Hooks מוגדרים בקובץ עצמאי | אין קובץ hooks עצמאי לפרויקט/משתמש | הגדירו hooks תחת המפתח `"hooks"` ב-`settings.json` |
| ערך ב-settings.json נראה מתעלמים ממנו | אותו מפתח מוגדר ב-`settings.local.json` | `settings.local.json` דורס `settings.json` |
| Skill לא מופיע ב-`/skills` | קובץ skill ב-`.claude/skills/name.md` ולא בתיקייה | השתמשו בתיקייה עם `SKILL.md` בפנים: `.claude/skills/name/SKILL.md` |
| CLAUDE.md בתת-תיקייה לא מורגש | קבצים אלה נטענים לפי דרישה, לא בתחילת הסשן | נטענים כשקוד Claude קורא קובץ מאותה תיקייה עם Read |
| שרת MCP ב-`.mcp.json` לא נטען | הקובץ נמצא תחת `.claude/` | `.mcp.json` של פרויקט חייב להיות בשורש ה-repo |
| שרת MCP נטען אך ללא כלים | הנחיית האישור החד-פעמית נדחתה | הפעילו `/mcp` ואשרו |

## המלצות קשורות

לעיון מלא בכל משטח תצורה ראו:

- **[CLAUDE.md](/en/memory)**: איך קובצי memory נטענים וכיצד לכתוב הוראות אפקטיביות
- **[הגדרות](/en/settings)**: סדר עדיפות scopes ורשימת מפתחות
- **[Hooks reference](/en/hooks)**: שמות אירועים, payload-ים, ופורמט `--debug hooks`
- **[MCP](/en/mcp)**: הגדרת שרתים, אישור, ופלט `/mcp`
