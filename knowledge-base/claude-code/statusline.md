---
title: "שורת סטטוס מותאמת אישית ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-07-04
status: needs-review
source_url: https://code.claude.com/docs/en/statusline
related: [slash-config, keybindings, sessions]
---

שורת הסטטוס היא פס הניתן להתאמה אישית בתחתית Claude Code. היא מריצה כל סקריפט מעטפת שתגדיר, מקבלת נתוני סשן JSON דרך stdin ומציגה את מה שהסקריפט מדפיס.

## מה זה עושה / למה זה שימושי

שורת הסטטוס שימושית כשרוצים מבט-על מתמיד על שימוש בחלון ההקשר, עלות הסשן, ענף git, שם המודל או כל מידע אחר. היא מתעדכנת אוטומטית לאחר כל הודעת עוזר, אחרי `/compact`, בשינוי מצב הרשאות ובהחלפת vim mode. שורת הסטטוס מוצגת בשורה נפרדת מעל הסמלים המובנים בתחתית — היא אינה מחליפה אותם.

## איך משתמשים

**הגדרה עם פקודה** — הריצו `/statusline` עם תיאור בשפה טבעית:

```text
/statusline show model name and context percentage with a progress bar
```

Claude Code יצור את הסקריפט ב-`~/.claude/` ויעדכן את ההגדרות אוטומטית.

**הגדרה ידנית** — הוסיפו שדה `statusLine` ל-settings (`~/.claude/settings.json`):

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2
  }
}
```

ניתן גם להשתמש בפקודת shell מוטמעת עם `jq`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "jq -r '\"[\\(.model.display_name)] \\(.context_window.used_percentage // 0)% context\"'"
  }
}
```

## שדות אופציונליים

| שדה | תיאור | ברירת מחדל |
| :--- | :--- | :--- |
| `padding` | ריווח אופקי נוסף (בתווים) | `0` |
| `refreshInterval` | הרצה מחדש כל N שניות (מינימום 1), לנתונים זמן-מבוססים | לא מוגדר |
| `hideVimModeIndicator` | הסתר את הטקסט המובנה `-- INSERT --` | `false` |

## בניית סקריפט שורת סטטוס — שלב אחר שלב

Claude Code שולח JSON עם נתוני הסשן לסקריפט דרך stdin. הסקריפט קורא את ה-JSON, מחלץ את הנתונים הרצויים ומדפיס טקסט ל-stdout.

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

echo "[$MODEL] ${DIR##*/} | ${PCT}% context"
```

שמרו את הסקריפט ב-`~/.claude/statusline.sh` והפכו אותו לניתן הרצה:

```bash
chmod +x ~/.claude/statusline.sh
```

## נתונים זמינים

Claude Code שולח את שדות ה-JSON הבאים לסקריפט:

| שדה | תיאור |
| :--- | :--- |
| `model.id`, `model.display_name` | מזהה ושם המודל הנוכחי |
| `workspace.current_dir` | תיקיית העבודה הנוכחית |
| `workspace.project_dir` | תיקייה שממנה הופעל Claude Code |
| `workspace.repo.host/owner/name` | פרטי ה-repository מה-origin remote |
| `cost.total_cost_usd` | עלות משוערת של הסשן בדולרים |
| `cost.total_duration_ms` | זמן כולל מאז תחילת הסשן (ms) |
| `context_window.used_percentage` | אחוז חלון ההקשר בשימוש |
| `context_window.context_window_size` | גודל חלון ההקשר המרבי בטוקנים |
| `context_window.total_input_tokens` | מספר טוקני קלט בחלון הנוכחי |
| `rate_limits.five_hour.used_percentage` | אחוז מגבלת rate limit של 5 שעות (למנויי Claude.ai) |
| `session_id` | מזהה ייחודי של הסשן |
| `session_name` | שם מותאם שהוגדר עם `--name` או `/rename` |
| `version` | גרסת Claude Code |
| `vim.mode` | מצב vim הנוכחי כשvim mode פעיל |
| `output_style.name` | שם סגנון הפלט הנוכחי |
| `pr.number`, `pr.url` | מספר ו-URL של ה-PR הפתוח לענף הנוכחי |

## גודל התצוגה לפי מסוף

Claude Code מגדיר את משתני הסביבה `COLUMNS` ו-`LINES` לפני הרצת הסקריפט, כך שניתן להשתמש בהם לחישוב רוחב נכון (דורש v2.1.153 ומעלה). אין להשתמש ב-`tput cols` כי stdin מופנה ל-pipe.

## השבתת שורת הסטטוס

הריצו `/statusline` ובקשו למחוק: `/statusline delete`. לחלופין, הסירו ידנית את שדה `statusLine` מקובץ settings.json.
