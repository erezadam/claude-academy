---
title: "הגדרת הטרמינל לעבודה עם Claude Code"
category: guides
last_verified: 2026-08-23
status: needs-review
source_url: https://code.claude.com/docs/en/terminal-config
related: [fullscreen, keybindings, slash-terminal-keybindings]
mission: daily
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 3
published: "2026-08-23T12:00:00+03:00"
pathOrder: 28
---

Claude Code עובד בכל טרמינל ללא הגדרה מוקדמת. עמוד זה מיועד למקרים שבהם משהו ספציפי אינו מתנהג כצפוי — מ-Shift+Enter שמגיש במקום להוסיף שורה ועד ריצוד מסך ותמיכה ב-tmux.

## Shift+Enter להוספת שורה חדשה

Enter מגיש את ההודעה. לשורה חדשה בלי הגשה: `Ctrl+J`, או `\` ולאחר מכן Enter. שתי האפשרויות עובדות בכל טרמינל ללא הגדרה.

ב-Shift+Enter, התמיכה תלויה בטרמינל:

| טרמינל | Shift+Enter |
| :--- | :--- |
| Ghostty, Kitty, iTerm2, WezTerm, Warp, Apple Terminal, Windows Terminal | עובד ללא הגדרה |
| VS Code, Cursor, Devin Desktop, Alacritty, Zed | הפעל `/terminal-setup` פעם אחת |
| gnome-terminal, JetBrains IDEs | לא זמין — השתמש ב-`Ctrl+J` |

הפקודה `/terminal-setup` כותבת את ה-keybindings הדרושים לקובץ ההגדרות של הטרמינל. הרץ אותה ישירות בטרמינל המארח (לא בתוך tmux).

## מקש Option ב-macOS

חלק מקיצורי Claude Code משתמשים ב-Option, כגון Option+Enter לשורה חדשה. ברוב הטרמינלים ב-macOS, Option אינו נשלח כ-modifier כברירת מחדל. ההגדרה משתנה לפי טרמינל:

| טרמינל | הגדרה |
| :--- | :--- |
| Apple Terminal | Settings → Profiles → Keyboard → "Use Option as Meta Key" |
| iTerm2 | Settings → Profiles → Keys → Left/Right Option key → "Esc+" |
| VS Code | `"terminal.integrated.macOptionIsMeta": true` בהגדרות |

עבור Ghostty, Kitty וטרמינלים אחרים — חפש הגדרת Option-as-Alt או Option-as-Meta בקובץ ההגדרות.

## התראה בסיום משימה

כשקלוד מסיים משימה או עוצר לבקשת הרשאה ואתה אינך בטרמינל, נשלחת התראה. ב-Ghostty, Kitty ו-iTerm2 נשלחת התראת שולחן עבודה אוטומטית. בטרמינלים אחרים, הגדר `preferredNotifChannel` להפעלת פעמון:

```json
{
  "preferredNotifChannel": "terminal_bell"
}
```

לצליל מותאם, הוסף Notification hook בהגדרות:

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [{ "type": "command", "command": "afplay /System/Library/Sounds/Glass.aiff" }]
      }
    ]
  }
}
```

## הגדרת tmux

בתוך tmux, שני דברים נשברים כברירת מחדל: Shift+Enter מגיש במקום להוסיף שורה, והתראות ושורת ההתקדמות אינן מגיעות לטרמינל החיצוני. הוסף לקובץ `~/.tmux.conf`:

```bash
set -g allow-passthrough on
set -s extended-keys on
set -as terminal-features 'xterm*:extkeys'
```

לאחר מכן הפעל: `tmux source-file ~/.tmux.conf`

## עריכה עם vim mode

Claude Code כולל מצב עריכה בסגנון Vim לתיבת הקלט. הפעל דרך `/config` → Editor mode, או על ידי הגדרת `editorMode` בקובץ ההגדרות:

```json
{
  "editorMode": "vim"
}
```

המצב תומך בחלק מה-motions וה-operators של NORMAL ו-VISUAL: ניווט `hjkl`, בחירה `v`/`V`, ופעולות `d`/`c`/`y`. Enter עדיין מגיש גם במצב INSERT — השתמש ב-`o` או `O` במצב NORMAL, או `Ctrl+J`, להוספת שורה.

## ריצוד ועמדת גלילה

אם המסך מהבהב או עמדת הגלילה קופצת בזמן עבודת קלוד, עבור למצב מסך מלא:

```text
/tui fullscreen
```

ראה את המאמר על [מצב מסך מלא](fullscreen) לפרטים.
