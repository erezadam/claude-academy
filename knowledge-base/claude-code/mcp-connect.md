---
title: "חיבור Claude Code לכלים חיצוניים עם MCP"
published: "2026-08-01T12:00:00+03:00"
category: claude-code
layer: intermediate
last_verified: 2026-08-01
status: needs-review
source_url: https://code.claude.com/docs/en/mcp
related: [slash-mcp, plugins-guide, channels, sub-agents]
mission: advanced
pathOrder: 20
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 4
---

Claude Code יכול להתחבר למאות כלים ומקורות נתונים חיצוניים דרך MCP — פרוטוקול פתוח לאינטגרציות AI. כשמחברים שרת MCP, קלוד יכול לקרוא ולפעול על אותו מערכת ישירות, במקום לעבוד ממה שמדביקים לו ידנית.

## מה זה עושה / למה זה שימושי

עם שרתי MCP מחוברים, אפשר לבקש מקלוד:

- לממש פיצ'ר מתוך כרטיס ב-JIRA ולפתוח PR ב-GitHub
- לבדוק Sentry ו-Statsig כדי לנתח שימוש בפיצ'ר
- לשאול שאלות על מסד נתונים PostgreSQL ישירות
- לעדכן תבניות email לפי עיצובים חדשים ב-Figma
- להגיב לאירועים חיצוניים: שרת MCP יכול לפעול כ-[channel](channels) שדוחף הודעות לתוך הסשן כשמגיעים אירועים מ-Telegram, Discord, או webhook

## איך מוסיפים שרת

### שרת HTTP מרוחק (מומלץ)

```bash
# תחביר
claude mcp add --transport http <שם> <url>

# דוגמה: חיבור ל-Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# עם Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### שרת stdio מקומי

שרתי stdio רצים כתהליכים מקומיים. מתאימים לכלים שצריכים גישה ישירה למערכת, או לסקריפטים מותאמים.

```bash
# תחביר — שימו לב ל--- שמפריד בין אפשרויות claude לבין הפקודה של השרת
claude mcp add --env AIRTABLE_API_KEY=YOUR_KEY --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

קלוד Code מגדיר `CLAUDE_PROJECT_DIR` בסביבת השרת להצביע לשורש הפרויקט, כך שהשרת יכול לפתור נתיבים ללא תלות בספריית העבודה הנוכחית.

### שרת SSE (מיושן)

```bash
claude mcp add --transport sse <שם> <url>
```

שרתי SSE עדיין נתמכים אך מומלץ לעבור ל-HTTP.

### שרת WebSocket

מתאים לחיבורים דו-כיוניים מתמשכים. מוגדר דרך `claude mcp add-json`:

```bash
claude mcp add-json events-server \
  '{"type":"ws","url":"wss://mcp.example.com/socket","headers":{"Authorization":"Bearer YOUR_TOKEN"}}'
```

## ניהול שרתים

```bash
# רשימת כל השרתים המוגדרים
claude mcp list

# פרטים על שרת ספציפי
claude mcp get notion

# הסרת שרת
claude mcp remove notion
```

בתוך סשן Claude Code, `/mcp` מציג את מצב כל השרתים, כולל ספירת הכלים לכל שרת מחובר.

## היכן מאוחסנות ההגדרות

| מיקום | טווח | שימוש |
| :--- | :--- | :--- |
| `~/.claude.json` | שרתים אישיים (כלל הפרויקטים) | `claude mcp add --scope user` |
| `.mcp.json` (שורש הפרויקט) | שרתים לצוות | ניתן לקמיט |
| הגדרות מנוהלות | ארגון | אדמין |

שרתים מ-`.mcp.json` דורשים אישור workspace trust לפני שמחברים אותם. לאישור: הריצו `claude` בתיקיית הפרויקט וקבלו את תיבת הדו-שיח.

## היררכיית עדיפויות

כשאותו שם שרת מוגדר במספר מקומות, עדיפות: מקומי (`settings.local.json`) > פרויקט (`.mcp.json`) > משתמש (`~/.claude.json`).

## אבטחה

אל תחברו שרתים לא מהימנים. שרתים שמושכים תוכן חיצוני עלולים לחשוף לסיכון של prompt injection. לפני חיבור שרת בדקו את הקוד שלו וקראו את מדיניות ה-[אבטחה](https://code.claude.com/docs/en/security) של Claude Code.
