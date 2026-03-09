---
title: "/login, /logout, /usage"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/doctor, /cost, /config]
---

## /login, /logout, /usage — חשבון ומכסות

---

## /login — כניסה / החלפת חשבון

```
/login
```

מה עושה: מחדש token שפג תוקף, או עובר לחשבון אחר.

### מתי צריך
```
/doctor מראה: "Authentication: ❌ Invalid token"
→ הרץ /login מיד
```

---

## /logout — יציאה

```
/logout
```

מה עושה: מתנתק מהחשבון הנוכחי.

מתי: החלפת חשבון, סיום עבודה על מחשב משותף.

---

## /usage — מכסה חודשית

```
/usage
```

מה עושה: מציג כמה מהמכסה החודשית השתמשת.

### פלט
```
> /usage

Plan: Claude Max
Period: March 2026

Usage: 68% of monthly limit
████████████░░░░░░░░ 68%

Resets: April 1, 2026 (24 days)
```

### הבדל: /cost לעומת /usage

| פקודה | מה מציגה |
|--------|-----------|
| `/cost` | עלות session **נוכחי** בדולרים |
| `/usage` | אחוז מהמכסה החודשית של ה-plan |

💡 בדוק `/usage` בסוף החודש — אם קרוב ל-100% שקול לחכות.

💡 אם `/doctor` מדווח על token פג — `/login` תמיד פותר.

→ קשור ל: /doctor, /cost
