---
title: "ניהול עלויות ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-07-11
status: needs-review
source_url: https://code.claude.com/docs/en/costs
related: ["slash-login-logout-usage", "sessions", "sub-agents", "skills"]
---

Claude Code גובה לפי צריכת טוקנים ב-API. עלות ממוצעת בפרישות enterprise היא כ-13 דולר למפתח ליום פעיל, ו-150–250 דולר למפתח לחודש, כאשר 90% מהמשתמשים נמצאים מתחת ל-30 דולר ליום פעיל.

## מה זה עושה / למה זה שימושי

כלי המעקב המובנים ב-Claude Code חושפים את מקורות הצריכה ומאפשרים לצמצם עלויות ללא פגיעה בפרודוקטיביות, דרך ניהול הקשר, בחירת מודל מתאים, והגדרת hooks לעיבוד מקדים.

## איך משתמשים

### מעקב עלויות עם `/usage`

פקודת `/usage` מציגה סטטיסטיקות צריכת טוקנים לסשן הנוכחי:

```
/usage
```

הבלוק Session בראש המסך מציג עלות משוערת, משך זמן API ו-wall-clock, ושינויי קוד. **הסכום הוא הערכה מקומית** — לחיוב מדויק ראו את דף Usage ב-Claude Console.

בתוכניות Pro, Max, Team ו-Enterprise, `/usage` גם מציג פירוט לפי skills, subagents, plugins ושרתי MCP בודדים, כאחוז מהסך הכולל. לחצו `d` או `w` למעבר בין 24 שעות ל-7 ימים.

### ניהול עלויות לצוותים

כשמשתמשים ב-Claude API, ניתן להגדיר workspace spend limits בקונסולה. ניתן גם להגדיר כמה טוקנים לדקה (TPM) לכל workspace — המלצות לפי גודל צוות:

| גודל צוות | TPM למשתמש | RPM למשתמש |
| --- | --- | --- |
| 1–5 | 200k–300k | 5–7 |
| 5–20 | 100k–150k | 2.5–3.5 |
| 20–50 | 50k–75k | 1.25–1.75 |
| 50–100 | 25k–35k | 0.62–0.87 |
| 100–500 | 15k–20k | 0.37–0.47 |
| 500+ | 10k–15k | 0.25–0.35 |

## הפחתת צריכת טוקנים

### נהלו הקשר באופן פעיל

- **נקו בין משימות**: `/clear` מתחיל מחדש כשעוברים למשימה שאינה קשורה. הקשר ישן מבזבז טוקנים על כל הודעה עוקבת.
- **הוסיפו הוראות compaction**: `/compact Focus on code samples and API usage` מספר ל-Claude מה לשמור בסיכום.

```
/compact Focus on code samples and API usage
```

ניתן גם להגדיר ב-CLAUDE.md:

```markdown
# Compact instructions
When you are using compact, please focus on test output and code changes
```

### בחרו מודל מתאים

Sonnet מטפל ברוב משימות הקודינג ועולה פחות מ-Opus. שמרו את Opus להחלטות אדריכלות מורכבות. החליפו מודל בסשן עם `/model`, או הגדירו ברירת מחדל ב-`/config`. לsubagents עם משימות פשוטות:

```yaml
model: haiku
```

### צמצמו overhead של שרתי MCP

הגדרות כלי MCP נדחות כברירת מחדל — רק שמות הכלים נכנסים להקשר, עד שקוד Claude משתמש בכלי ספציפי. הפעילו `/context` לראות מה תופס מקום.

- העדיפו כלי CLI כשזמינים: `gh`, `aws`, `gcloud`, `sentry-cli` יעילים יותר מבחינת טוקנים כי לא מוסיפים listing כלים.
- השביתו שרתים שאינם בשימוש דרך `/mcp`.

### הגדירו hooks ו-skills להפחתת עיבוד

Hook `PreToolUse` יכול לסנן נתונים לפני שקוד Claude רואה אותם. לדוגמה, hook שמסנן פלט בדיקות להצגת כישלונות בלבד — מקטין הקשר מעשרות אלפי טוקנים למאות.

Skill עם תיאור אדריכלות פרויקט חוסך לקוד Claude קריאת קבצים מרובים כדי להבין את המבנה.

### agent teams

[Agent teams](/en/agent-teams) מפעילות מספר מופעי Claude Code — כל אחד עם חלון הקשר משלו. לשמירה על עלויות:

- השתמשו ב-Sonnet לחברי הצוות
- שמרו על צוותים קטנים
- השביתו חברי צוות כשעבודתם הסתיימה
- Agent teams מושבתות כברירת מחדל; הפעילו עם `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` ב-`settings.json`
