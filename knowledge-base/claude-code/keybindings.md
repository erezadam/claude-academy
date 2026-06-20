---
title: "Keybindings — התאמת קיצורי מקלדת"
category: claude-code
layer: basic
last_verified: 2026-06-20
status: needs-review
source_url: https://code.claude.com/docs/en/keybindings
related: [slash-terminal-keybindings, interactive-mode, slash-fast-vim]
---

Claude Code תומך בהתאמה אישית של קיצורי מקלדת דרך קובץ `~/.claude/keybindings.json`. ניתן לכרוך פעולות למקשים אחרים, לבטל קיצורים קיימים, ולהגדיר chord sequences.

## מה זה עושה / למה זה שימושי

מפתחים שרגילים לקיצורים ספציפיים ממחרוזים כמו vim, emacs, או IDE מועדף יכולים למפות את אותם קיצורים גם ב-Claude Code, במקום ללמוד מיפויים חדשים.

## איך משתמשים

פתח את קובץ הקונפיגורציה:

```text
/keybindings
```

### מבנה הקובץ

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null
      }
    }
  ]
}
```

- הגדר `context` לאיזור שבו הכריכה פעילה
- הגדר מקש לפעולה `namespace:action`
- הגדר `null` לביטול קיצור קיים

**שינויים נכנסים לתוקף מיידית** — אין צורך לאתחל.

## Contexts עיקריים

| Context | תיאור |
| :------ | :----- |
| `Global` | פעיל בכל מקום |
| `Chat` | שורת הקלט הראשית |
| `Autocomplete` | תפריט השלמה אוטומטית |
| `Confirmation` | דיאלוגי אישור והרשאות |
| `Transcript` | צפייה ב-transcript |
| `Scroll` | גלילה ב-fullscreen mode |

## פעולות עיקריות

### App (Global)

| פעולה | ברירת מחדל |
| :----- | :---------- |
| `app:interrupt` | Ctrl+C |
| `app:exit` | Ctrl+D |
| `app:toggleTodos` | Ctrl+T |
| `app:toggleTranscript` | Ctrl+O |

### Chat

| פעולה | ברירת מחדל |
| :----- | :---------- |
| `chat:submit` | Enter |
| `chat:newline` | Ctrl+J |
| `chat:externalEditor` | Ctrl+G |
| `chat:cycleMode` | Shift+Tab |
| `chat:stash` | Ctrl+S |
| `chat:fastMode` | Meta+O |
| `task:background` | Ctrl+B |

## תחביר מקשים

```text
ctrl+k          Control + K
shift+tab       Shift + Tab
meta+p          Option + P (macOS) / Alt + P
ctrl+shift+c    כמה modifiers
ctrl+k ctrl+s   Chord (לחץ ברצף)
```

**אות גדולה** מרמזת על Shift: `K` = `shift+k`.

## ביטול קיצורים

```json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+s": null
      }
    }
  ]
}
```

## מקשים שלא ניתן לשנות

| קיצור | סיבה |
| :----- | :---- |
| Ctrl+C | עצירה — hardcoded |
| Ctrl+D | יציאה — hardcoded |
| Ctrl+M | זהה ל-Enter בטרמינלים |

## אימות

Claude Code מאמת את הקובץ ומציג אזהרות עבור:
- JSON לא תקין
- שמות context שגויים
- קונפליקט עם קיצורים reserved
- קיצורים כפולים

הרץ `/doctor` לצפייה בכל האזהרות הקשורות ל-keybindings.
