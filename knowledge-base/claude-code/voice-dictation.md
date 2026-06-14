---
title: "Voice Dictation — הכתבה קולית לטרמינל"
category: claude-code
layer: basic
last_verified: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/voice-dictation
related: ["keyboard-shortcuts", "slash-config"]
---

Voice Dictation מאפשר לדבר במקום להקליד ב-CLI של Claude Code. הדיבור מתומלל בזמן אמת לתוך שורת הקלט, כך שאפשר לשלב קול והקלדה באותה הודעה. מפעילים עם `/voice` ואז מחזיקים מקש תוך כדי דיבור, או לוחצים פעמיים.

## מה זה עושה / למה זה שימושי

Dictation דורש אימות דרך claude.ai — הוא אינו זמין עם API key ישיר, Bedrock, Vertex AI, Foundry, או כשארגון עם HIPAA מופעל. הוא גם לא עובד בסביבות מרוחקות כמו Claude Code on the web או SSH.

התמלול מותאם למינוח פיתוח — מונחים כמו `regex`, `OAuth`, `JSON` ו-`localhost` מזוהים נכון, ושם הפרויקט ו-branch ה-git הנוכחיים מוספים כרמזים לזיהוי אוטומטית.

## איך משתמשים

הפעלה:

```text
/voice
```

בפעם הראשונה Claude Code מריץ בדיקת מיקרופון. ב-macOS מופיע dialog הרשאות לטרמינל.

| פקודה | אפקט |
|:--|:--|
| `/voice` | toggle הפעלה/כיבוי, שומר את המצב הנוכחי |
| `/voice hold` | מצב hold (מחזיקים מקש לאורך הדיבור) |
| `/voice tap` | מצב tap (לוחצים פעם אחת להתחיל, פעם שנייה לשלוח) |
| `/voice off` | כיבוי |

**מצב Hold (ברירת מחדל):** מחזיקים `Space`, מדברים, ומשחררים להוספת התמליל לקלט.

```
> refactor the auth middleware to ▮
  # hold Space, speak "use the new token validation helper"
> refactor the auth middleware to use the new token validation helper▮
```

**מצב Tap:** לוחצים `Space` להתחיל, מדברים, לוחצים שוב — Claude Code מוסיף את התמליל ושולח אוטומטית (אם יש לפחות 3 מילים).

## הגדרות קבועות

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

## שפה

Dictation משתמש בהגדרת `language` שקובעת גם את שפת תגובות Claude. ברירת המחדל: אנגלית. שינוי:

```json
{
  "language": "hebrew"
}
```

שפות נתמכות כוללות: עברית, ערבית, אנגלית, צרפתית, גרמנית, יפנית, ספרדית ועוד 14 שפות נוספות.

## שינוי מקש הדיבור

מקש ברירת המחדל הוא `Space`. לשינוי, ערכו `~/.claude/keybindings.json`:

```json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "meta+k": "voice:pushToTalk",
        "space": null
      }
    }
  ]
}
```
