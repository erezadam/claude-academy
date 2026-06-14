---
title: "Fast Mode — תגובות Opus מהירות יותר"
category: claude-code
layer: basic
last_verified: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/fast-mode
related: ["slash-fast-vim", "slash-model", "slash-context-cost"]
---

Fast Mode הוא תצורה מהירה של Claude Opus — עד 2.5x מהיר יותר תמורת מחיר גבוה יותר לכל token. מפעילים אותו עם `/fast` כשיש צורך במהירות לעבודה אינטראקטיבית כמו iteration מהיר או debugging בזמן אמת, ומכבים כשמחיר חשוב יותר מ-latency.

## מה זה עושה / למה זה שימושי

Fast Mode אינו מודל אחר — הוא משתמש ב-Claude Opus עם תצורת API שמעדיפה מהירות. האיכות והיכולות זהות, רק התגובות מגיעות מהר יותר. נתמך ב-Opus 4.8, 4.7 ו-4.6.

Fast Mode זמין דרך Anthropic API, claude.ai, ו-Console בלבד. אינו זמין ב-Bedrock, Vertex AI, Foundry. דורש usage credits מופעלים.

## איך משתמשים

**Toggle בתוך session:**

```text
/fast
```

לחיצה ראשונה מפעילה — מופיע אייקון `↯` ליד ה-prompt. לחיצה שנייה מכבה (נשארים על Opus). לחזרה למודל אחר: `/model`.

**הגדרה קבועה:**

```json
{
  "fastMode": true
}
```

## עלות

| מודל | קלט (MTok) | פלט (MTok) |
|:--|:--|:--|
| Opus 4.8 | $10 | $50 |
| Opus 4.7 ו-4.6 | $30 | $150 |

בפעם הראשונה שמפעילים Fast Mode ב-conversation, משלמים את המחיר המלא על כל ה-context הקיים. עדיף להפעיל מתחילת ה-session.

## מתי להשתמש

**Fast Mode מתאים ל:**
- Iteration מהיר על שינויי קוד
- Debug sessions בזמן אמת
- עבודה בלחץ זמן

**מצב רגיל מתאים ל:**
- משימות אוטונומיות ארוכות
- CI/CD pipelines
- עומסי עבודה רגישים לעלות

## Fast Mode לעומת Effort Level

| הגדרה | אפקט |
|:--|:--|
| Fast Mode | אותה איכות מודל, latency נמוך, עלות גבוהה |
| Effort level נמוך | פחות זמן חשיבה, מהיר יותר, איכות נמוכה יותר במשימות מורכבות |

ניתן לשלב את השניים: Fast Mode עם effort level נמוך למקסימום מהירות.

## rate limits

Fast Mode על Opus 4.8, 4.7 ו-4.6 חולק את אותו pool. כשמגיעים למגבלה:
- Fast Mode עובר אוטומטית למהירות רגילה
- האייקון `↯` מאפיר כדי לסמן cooldown
- לאחר cooldown, Fast Mode מופעל מחדש אוטומטית
