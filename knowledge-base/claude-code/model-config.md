---
title: "הגדרת מודל ב-Claude Code"
category: claude-code
layer: basic
last_verified: 2026-07-25
status: needs-review
source_url: https://code.claude.com/docs/en/model-config
related: [fast-mode, slash-model, slash-commands-all]
level: beginner
type: reference
tool: claude-code
origin: official
timeMinutes: 2
last_reviewed: 2026-07-25
---

ב-Claude Code ניתן לבחור מודל ספציפי או alias נוח שמצביע תמיד לגרסה המומלצת. בחירת מודל משפיעה על מהירות, עלות ועומק ה-reasoning.

## מה זה עושה / למה זה שימושי

במקום לזכור מזהי גרסאות מלאים כמו `claude-opus-5`, ניתן להשתמש ב-aliases כמו `opus` או `sonnet` שמעודכנים אוטומטית לגרסה המומלצת עבור הספק שלך. לעומת זאת, לpinning לגרסה ספציפית — עבור שחזור ותוצאות עקביות — משתמשים במזהה המלא.

## Model Aliases

| Alias | התנהגות |
|:--|:--|
| `best` | Fable 5 אם זמין, אחרת Opus האחרון |
| `fable` | Claude Fable 5 — למשימות הארוכות והקשות ביותר |
| `opus` | Opus האחרון — reasoning מורכב |
| `sonnet` | Sonnet האחרון — עבודת קוד יומיומית |
| `haiku` | Haiku — מהיר ויעיל למשימות פשוטות |
| `sonnet[1m]` | Sonnet עם חלון הקשר של 1 מיליון token |
| `opus[1m]` | Opus עם חלון הקשר של 1 מיליון token |
| `opusplan` | Opus בעת תכנון, Sonnet בעת ביצוע |
| `default` | מנקה override ומחזיר למודל המומלץ לחשבון |

הגרסאות שאליהן ה-aliases מצביעים תלויות בספק. ב-Anthropic API: `opus` = Opus 5, `sonnet` = Sonnet 5. ב-Amazon Bedrock ו-Google Cloud: `sonnet` = Sonnet 4.5. Opus 5 דורש Claude Code v2.1.219 ומעלה.

## איך משתמשים

### בחירת מודל בתוך session

```text
/model sonnet
```

```text
/model opus
```

`/model` ללא ארגומנט פותח picker. בתוך ה-picker: `Enter` לשמירה כברירת מחדל, `s` לשינוי עבור ה-session הנוכחי בלבד.

### הפעלה עם מודל ספציפי

```bash
claude --model opus
```

```bash
claude --model claude-opus-5
```

### משתנה סביבה

```bash
export ANTHROPIC_MODEL=sonnet
claude
```

### הגדרות קבועות

```json
{
  "model": "opus"
}
```

### סדר עדיפויות

1. `/model` בתוך session
2. דגל `--model` בהפעלה
3. משתנה סביבה `ANTHROPIC_MODEL`
4. הגדרת `model` ב-settings file

### Claude Fable 5 — מתי ואיך

Fable 5 הוא המודל החזק ביותר ב-Claude Code. להפעלה:

```text
/model fable
```

כדי למקסם את ה-ביצועים שלו:

- **תאר את התוצאה, לא את השלבים** — תן לו לתכנן את הדרך
- **העבר לו בעיות עמומות** — root-cause, debugging, החלטות ארכיטקטורה
- **אל תזכיר לו לבדוק** — הוא מאמת עבודה מעצמו
- **תן משימות גדולות** — מסוגל לסשנים ארוכים בלי לאבד thread

Fable 5 דורש v2.1.170 ומעלה ואינו זמין תחת zero data retention.

## הגבלת בחירת מודל לארגון

מנהלי enterprise יכולים להגדיר `availableModels` ב-managed settings להגבלת המודלים שמשתמשים יכולים לבחור:

```json
{
  "availableModels": ["sonnet", "claude-sonnet-4-5"]
}
```

ה-allowlist חל על `/model`, `--model`, `ANTHROPIC_MODEL`, ו-subagents.
