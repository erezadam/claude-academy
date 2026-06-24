---
title: "Remote Control — שליטה מרחוק ב-Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-06-20
status: needs-review
source_url: https://code.claude.com/docs/en/remote-control
related: [sessions, channels, slash-remote-desktop]
---

Remote Control מאפשר להמשיך session של Claude Code שרץ על המחשב שלך מכל מכשיר — דפדפן, טלפון, או טאבלט — דרך [claude.ai/code](https://claude.ai/code) או אפליקציית Claude.

## מה זה עושה / למה זה שימושי

Session ממשיך לרוץ מקומית על המחשב שלך, כולל גישה ל-filesystem, MCP servers, וקונפיגורציה. הממשק ב-web ובמובייל הוא רק חלון לתוך אותו session מקומי. ניתן לשלוח הודעות מהטרמינל, הדפדפן, והטלפון בו-זמנית — השיחה מסונכרנת.

**דרישות:** מנוי Pro / Max / Team / Enterprise (לא API key). ב-Team ו-Enterprise נדרש admin לאפשר Remote Control בהגדרות.

## איך משתמשים

### הפעלה מהטרמינל

```bash
# Server mode — ממתין לחיבורים
claude remote-control

# Session אינטראקטיבי עם remote enabled
claude --remote-control

# Session קיים — הפיכתו לremote
/remote-control
```

לאחר ההפעלה, מוצג URL לחיבור. ניתן ללחוץ `Space` להצגת QR code לסריקה מהטלפון.

### אפשרויות Server Mode

| דגל | תיאור |
| :-- | :----- |
| `--name "My Project"` | שם מותאם אישית לsession |
| `--spawn worktree` | כל חיבור חדש מקבל git worktree נפרד |
| `--spawn session` | מצב single-session — מסרב לחיבורים נוספים |
| `--capacity <N>` | מספר sessions מקסימלי (ברירת מחדל: 32) |

### חיבור ממכשיר אחר

- **URL** — פתח את כתובת הsession בכל דפדפן
- **QR Code** — סרוק עם אפליקציית Claude
- **[claude.ai/code](https://claude.ai/code)** — מצא את הsession ברשימה לפי שם

### הפעלה אוטומטית

הפוך Remote Control לפעיל בכל session:

```text
/config → Enable Remote Control for all sessions → true
```

## הפעלת התראות Push לטלפון

Remote Control תומך בשליחת push notifications לטלפון כשמשימה ארוכה מסתיימת:

1. התקן את אפליקציית Claude (iOS / Android)
2. היכנס עם אותו חשבון
3. אשר הרשאת notifications
4. הפעל את אפשרויות ה-Push ב-`/config`

| אפשרות ב-`/config` | מתי שולח התראה |
| :-- | :-- |
| **Push when Claude decides** | התראות יזומות שהמודל מחליט לשלוח |
| **Push when actions required** | כשנדרש אישור או פעולה ממך |

## אבטחה

הsession שולח רק HTTPS outbound ולא פותח פורטים נכנסים. כל תעבורה עוברת דרך Anthropic API על TLS. ה-session ממשיך לרוץ מקומית על המחשב שלך — שום דבר לא עובר לענן.

## הגבלות

- session אחד ל-process (מחוץ ל-server mode)
- ה-process המקומי חייב להישאר פעיל
- Ultraplan מנתק Remote Control (שניהם משתמשים בממשק claude.ai/code)
- פקודות אינטראקטיביות כמו `/plugin` ו-`/resume` זמינות בטרמינל בלבד
