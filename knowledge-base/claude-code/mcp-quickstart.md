---
title: "חיבור שרתי MCP — מדריך מהיר"
category: claude-code
last_verified: 2026-09-27
status: needs-review
source_url: https://code.claude.com/docs/en/mcp-quickstart
related: [mcp-connect, slash-mcp]
mission: daily
level: intermediate
type: recipe
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-09-27T12:00:00+03:00"
pathOrder: 32
---

MCP (Model Context Protocol) מאפשר ל-Claude Code להשתמש בכלים מחוץ לסט המובנה — כמו חיפוש בטראקר, שאילתת מסד נתונים, או שליטה בדפדפן. הכלים מגיעים משרתי MCP שרצים על המחשב שלך או כשירותים מאוחסנים.

## מה זה עושה

שרת MCP מוסיף לClaude Code כלים חדשים שהמודל יכול לקרוא להם בזמן עבודה. דוגמאות: חיפוש ב-Sentry, ניווט בדפדפן עם Playwright, שאילתות ב-Linear. כל שרת נרשם עם שם שבוחרים, וכלי השרת מסומנים באותו שם בפלט של Claude.

שרתי MCP קיימים בשני סוגים:

- **שרת HTTP מאוחסן** — מתחבר לשירות רץ ב-URL נתון
- **שרת stdio מקומי** — Claude Code מפעיל תהליך על המחשב (למשל דרך `npx`)

## איך משתמשים

### שלב 1 — הוספת שרת

מחוץ לסשן Claude (בטרמינל רגיל):

```bash
claude mcp add --transport http claude-code-docs https://code.claude.com/docs/mcp
```

הפירוט:
- `claude mcp add` — רושם שרת
- `--transport http` — שרת מאוחסן ב-URL
- `claude-code-docs` — שם לבחירתך
- `https://code.claude.com/docs/mcp` — כתובת השרת

לשרת stdio מקומי (למשל Playwright לבדיקות דפדפן):

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

הסימן `--` מפריד בין שם השרת לפקודה שClaude Code יפעיל.

### שלב 2 — בדיקת חיבור

```bash
claude mcp list
```

| סטטוס | משמעות |
| --- | --- |
| `✔ Connected` | מוכן לשימוש |
| `! Needs authentication` | נדרשת כניסה דרך הדפדפן |
| `✘ Failed to connect` | השרת לא הגיב |
| `⏸ Pending approval` | שרת של פרויקט שטרם אישרת |

### שלב 3 — שימוש בסשן

```bash
claude
```

```
Use the claude-code-docs server to look up what MCP_TIMEOUT does
```

Claude יציין בפלט שלו את שם השרת ליד כל קריאה לכלי.

## היכן נשמרת ההגדרה

| סקופ | קובץ | זמינות |
| --- | --- | --- |
| `local` (ברירת מחדל) | `~/.claude.json`, תחת הפרויקט הנוכחי | רק אתה, רק פרויקט זה |
| `user` | `~/.claude.json`, בראש הקובץ | רק אתה, כל הפרויקטים |
| `project` | `.mcp.json` בשורש הפרויקט | כל הצוות (לאחר commit) |

```bash
# שרת שיעבוד בכל הפרויקטים שלך
claude mcp add --scope user --transport http claude-code-docs https://code.claude.com/docs/mcp

# שרת לכל הצוות (מחייב commit של .mcp.json)
claude mcp add --scope project --transport http claude-code-docs https://code.claude.com/docs/mcp
```

## הסרת שרת

```bash
claude mcp remove claude-code-docs
```

## פתרון בעיות נפוצות

**שרת stdio איטי בהפעלה** — ברירת המחדל היא 30 שניות. הגדל עם:

```bash
MCP_TIMEOUT=60000 claude
```

**שרת לא מופיע** — `claude mcp list` מריץ מהתיקייה הנוכחית. שרת בסקופ `local` מוגדר לפרויקט שבו הוספת אותו בלבד.

**שרת מחובר אך אין כלים** — ייתכן שחסר משתנה סביבה (כמו API key). הוסף עם `--env KEY=value` בפקודת `mcp add`.
