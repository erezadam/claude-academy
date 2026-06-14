---
title: "Channels — הזרמת אירועים חיצוניים לתוך session פעיל"
category: claude-code
layer: intermediate
last_verified: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/channels
related: ["slash-mcp", "scheduled-tasks", "slash-remote-desktop"]
---

Channels הם שרתי MCP שדוחפים אירועים לתוך session של Claude Code הפועל, כדי ש-Claude יגיב לדברים שקורים בזמן שאתם לא ליד הטרמינל. ניתן להפנות תוצאות CI, הודעות צ'אט ואירועי monitoring אל Claude — והוא יטפל בהם ב-session הפתוח שכבר יש לכם.

## מה זה עושה / למה זה שימושי

בניגוד לאינטגרציות שפותחות session חדש בענן או מצפות ל-polling, האירוע מגיע ל-session שכבר פתוח — עם כל הקבצים, ה-context וה-tools שכבר טעונים. Channels יכולים להיות דו-כיוניים: Claude קורא את האירוע ומשיב דרך אותו channel, כמו גשר צ'אט.

ערוצים נתמכים (research preview): **Telegram**, **Discord**, ו-**iMessage**.

Channels דורשים Claude Code v2.1.80 ומעלה, ואימות דרך claude.ai או API key של Console — הם אינם זמינים ב-Amazon Bedrock, Google Vertex AI או Microsoft Foundry.

## איך משתמשים

**שלב 1 — התקנת plugin של ה-channel:**

```text
/plugin install telegram@claude-plugins-official
```

**שלב 2 — הפעלת session עם channel:**

```bash
claude --channels plugin:telegram@claude-plugins-official
```

ניתן להעביר כמה plugins מופרדים ברווח.

**שלב 3 — ביצוע pairing:** שלחו הודעה ל-bot שלכם. הוא מחזיר קוד pairing. בתוך Claude Code:

```text
/telegram:access pair <code>
```

לאחר ה-pairing, נעלו את הגישה כך שרק החשבון שלכם יוכל לשלוח הודעות:

```text
/telegram:access policy allowlist
```

## Demo מקומי — Fakechat

לבדיקת Channels בלי חיבור לשירות חיצוני, ניתן להשתמש ב-fakechat — demo מובנה שמריץ ממשק צ'אט ב-localhost:

```text
/plugin install fakechat@claude-plugins-official
```

```bash
claude --channels plugin:fakechat@claude-plugins-official
```

פתחו `http://localhost:8787`, הקלידו הודעה — והיא תגיע ל-session שלכם ב-Claude Code.

## אבטחה

כל channel שומר allowlist של שולחים מאושרים. ב-Telegram וב-Discord מתבצע pairing כדי להוסיף את מזהה השולח ל-allowlist. ב-iMessage, שליחה לעצמכם עוקפת את המנגנון אוטומטית; להוספת אנשי קשר אחרים:

```text
/imessage:access allow +972501234567
```

## הגדרות ארגוניות

ב-Team וב-Enterprise, Channels חסומים כברירת מחדל עד שאדמין יפעיל אותם. מנהלים יכולים להגדיר אילו plugins מותרים:

```json
{
  "channelsEnabled": true,
  "allowedChannelPlugins": [
    { "marketplace": "claude-plugins-official", "plugin": "telegram" }
  ]
}
```
