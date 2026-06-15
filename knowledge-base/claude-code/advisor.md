---
title: "Advisor — ייעוץ ממודל חזק יותר באמצע משימה"
category: claude-code
layer: intermediate
last_verified: 2026-06-14
created: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/advisor
related: ["slash-model", "sub-agents", "slash-fast-vim"]
---

כלי ה-Advisor מאפשר ל-Claude להתייעץ עם מודל חזק יותר ברגעי החלטה קריטיים — לפני שמתחייבים לגישה, כשנתקעים בשגיאה חוזרת, או לפני שמצהירים שמשימה הושלמה. ה-Advisor מקבל את כל השיחה כולל קריאות הכלים ותוצאותיהן, ומחזיר הנחיה ש-Claude מיישם לפני שממשיך.

## מה זה עושה / למה זה שימושי

ה-Advisor מתאים למשימות ארוכות ורב-שלביות שבהן רוב התורות שגרתיים, אך איכות התכנון קובעת את התוצאה: refactoring גדול, debugging שבו שגיאה חוזרת, ומשימות שכדאי לבדוק לפני שמסיימים. הוא מוסיף פחות ערך במשימות קצרות או כשכל תור דורש את המודל החזק ביותר — שם עדיף פשוט להחליף מודל עם `/model`.

ה-Advisor רץ בצד השרת של Anthropic כ-server tool ואינו זמין ב-Amazon Bedrock, Google Vertex AI או Microsoft Foundry.

## איך משתמשים

מגדירים Advisor בשלוש דרכים:

**`/advisor` בתוך session** — פותח picker עם המודלים הזמינים, או מקבל מודל ישירות:

```text
/advisor opus
```

הבחירה נשמרת ב-`advisorModel` ב-user settings ומתמשכת בין sessions.

**הגדרה ב-settings** — להגדרת ברירת מחדל ללא פתיחת session:

```json
{
  "advisorModel": "opus"
}
```

**דגל `--advisor`** — להגדרת Advisor לsession בודד בלי לשנות את ה-settings:

```bash
claude --advisor opus
```

לכיבוי ה-Advisor: `/advisor off`

## מודלים נתמכים

| מודל ראשי | Advisors מקובלים |
|:--|:--|
| Haiku 4.5 | Fable, Opus, Sonnet |
| Sonnet 4.6 | Fable, Opus, Sonnet |
| Opus 4.6 ומעלה | Fable, Opus (גרסה שווה או גבוהה מהמודל הראשי) |
| Fable 5 | Fable בלבד |

השילוב הנפוץ: Sonnet כמודל ראשי + Opus כ-Advisor — Sonnet מטפל בעבודה השוטפת ומעביר ל-Opus נקודות תכנון, כשלים עמומים ובדיקות סיום.

## עלות וביצועים

כל קריאה ל-Advisor שולחת את כל השיחה למודל ה-Advisor, ולכן צורכת tokens בתעריפי אותו מודל. Claude קורא ל-Advisor בנקודות החלטה ולא בכל תור, כך שצמד Sonnet + Opus עולה בדרך כלל פחות מהרצת Opus לאורך כל ה-session.

כשה-Advisor פעיל, ה-transcript מציג שורת `Advising` עם שם מודל ה-Advisor. לאחר שהתוצאה חוזרת, אפשר ללחוץ `Ctrl+O` כדי לפתוח ולקרוא את ההנחיה המלאה.

## כיבוי מלא

לכיבוי כלי ה-Advisor לגמרי כולל הפקודה `/advisor` והדגל `--advisor`:

```bash
CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1
```
