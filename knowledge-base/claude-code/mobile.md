---
title: "Claude Code במובייל — ניהול Sessions מהטלפון"
category: claude-code
last_verified: 2026-09-05
status: needs-review
source_url: https://code.claude.com/docs/en/mobile
related: [remote-control, sessions, claude-code-on-the-web]
mission: daily
level: beginner
type: guide
tool: claude-code
origin: official
timeMinutes: 3
published: "2026-09-05T12:00:00+03:00"
pathOrder: 28
---

אפליקציית Claude לאייפון ואנדרואיד היא **לקוח** ל-sessions של Claude Code — לא סביבה שמריצה קוד. מהטלפון ניגשים לשלושה סוגי sessions: sessions בענן, sessions מקומיים דרך Remote Control, ו-Dispatch דרך אפליקציית Desktop.

## התקנה

1. התקינו את אפליקציית Claude מ-[App Store](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) או [Google Play](https://play.google.com/store/apps/details?id=com.anthropic.claude).
2. היכנסו עם אותו חשבון claude.ai שמשתמשים בו ל-Claude Code.
3. פתחו את לשונית **Code** בתפריט הניווט.

להצגת קוד QR להורדה מ-session פעיל:

```text
/mobile
```

(`/ios` ו-`/android` עושים את אותו הדבר.)

## שלוש דרכי עבודה מהמובייל

| שיטה | מתחבר ל | מתי להשתמש |
| :--- | :--- | :--- |
| Claude Code on the web | Session בענן (תשתית Anthropic) | המאגר ב-GitHub, המשימה ממשיכה גם כשהטלפון נכבה |
| Remote Control | Session מקומי על המחשב שלכם | צריכים גישה לקבצים מקומיים, כלים או MCP servers |
| Dispatch | Desktop app על המחשב | רוצים לשלוח משימה ולתת ל-Desktop להחליט איך להריץ (Pro/Max בלבד) |

אם המחשב יהיה כבוי — השתמשו ב-cloud sessions, שממשיכים לרוץ בענן. Remote Control ו-Dispatch דורשים שהמחשב יישאר פעיל.

## Sessions בענן מהמובייל

ב-Cloud sessions בוחרים מאגר וענף, מתארים את המשימה ושולחים. ה-session ממשיך גם אחרי שסוגרים את האפליקציה. Sessions מסונכרנים בין מכשירים: משימה שהתחלתם במחשב נמצאת ממתינה בטלפון.

להגדרת סביבת ה-cloud session ולחיבור GitHub, ראו [web quickstart](/docs/en/web-quickstart).

## Remote Control מהמובייל

Remote Control מחבר את האפליקציה ל-session של Claude Code שרץ על המחשב שלכם. ה-execution וגישה לקבצים נשארים מקומיים.

הפעלת Remote Control:

```bash
claude remote-control
```

או מתוך session פעיל: `/remote-control`. לאחר מכן פתחו את לשונית Code באפליקציה ובחרו את ה-session מהרשימה.

**קבצים מצורפים מהמובייל:**
- **תמונות** — Claude רואה אותן ישירות ושומר אותן ב-`~/.claude/uploads/`
- **קבצים אחרים** — Claude Code מוריד אותם למחשב ומעביר אותם כ-`@` file references

## התראות Push

כשRemote Control פעיל, Claude יכול לשלוח Push Notifications לטלפון — למשל כשמשימה ארוכה מסתיימת או כשצריך החלטה. ניתן גם לבקש ב-prompt:

```text
notify me when the tests finish
```

## מגבלות

- **פקודות local-only**: `/plugin`, `/resume` ופקודות דומות לא עובדות מהאפליקציה
- **מצבי הרשאה**: ב-cloud sessions — Accept edits, Plan, Auto. ב-Remote Control — Manual, Accept edits, Plan. Bypass permissions לא זמין מהאפליקציה
- **Dispatch**: דורש תוכנית Pro או Max
