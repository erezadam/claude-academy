---
title: "/compact ו-/clear"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/context, /cost, /rewind]
---

## /compact ו-/clear — ניהול Context Window

שתי פקודות לניהול הזיכרון של session — עם הבדל קריטי ביניהן.

---

## /compact — דחיסה עם שמירת הקשר

מה זה עושה: מסכם את השיחה ומפחית tokens ב-60-70% — בלי לאבד את ההקשר.

### שימוש
```
/compact
/compact "focus on the auth refactor"    ← עם הוראת דגש
```

### מה קורה
```
לפני: 120,000 tokens
אחרי: ~40,000 tokens (68% חיסכון)

מה נשמר: החלטות מרכזיות, קוד שנכתב, errors שנפתרו
מה אובד: פרטים קטנים, ניסיונות שנכשלו, שאלות ותשובות
```

### מתי להשתמש
- ✅ context usage > 80% ואתה באמצע משימה
- ✅ session ארוך שרוצים להמשיך
- ✅ כשהאיכות מתחילה לרדת אבל ההקשר עדיין נחוץ

```bash
# תהליך מומלץ לפני compaction
/cost      # ראה כמה tokens יש
/compact "focus on the payment feature"
/context   # אמת שהדחיסה עבדה
```

⚠️ כל compaction הוא lossy — פרטים נאבדים. שתי דחיסות בsession = המשימה גדולה מדי.

---

## /clear — איפוס מלא

מה זה עושה: מוחק את כל השיחה ומתחיל session נקי. CLAUDE.md נשאר.

### שימוש
```
/clear
```

### מה קורה
```
✓ כל השיחה נמחקת (100% פינוי tokens)
✓ CLAUDE.md נשאר טעון
✓ קבצי הפרויקט לא נגעו
✗ ה-context של מה שעשית — נמחק לגמרי
```

### מתי להשתמש
- ✅ מעבר למשימה שונה לחלוטין
- ✅ תחילת יום עבודה חדש
- ✅ אחרי שתי תיקונות שלא עבדו — נקה ותתחיל מחדש
- ✅ כשאיכות התגובות יורדת אחרי 20+ exchanges

```bash
# מעבר בין משימות
/cost          # שמור תיעוד של מה עשית
/clear         # נקה
# עכשיו תתחיל משימה חדשה
```

---

## /clear לעומת /compact — מתי מה

| מצב | המלצה |
|-----|--------|
| עוברים למשימה אחרת | `/clear` |
| אמצע משימה, context מלא | `/compact` |
| איכות ירדה, משימה זהה | `/compact "focus on X"` |
| איכות ירדה, משימה שונה | `/clear` |
| ברירת מחדל | `/clear` — פחות מסוכן |

💡 כלל אצבע: **ברירת מחדל = /clear**. השתמש ב-/compact רק כשאתה חייב לשמור הקשר ספציפי.

💡 `/compact "focus on X"` — ה-focus instruction קובע מה נשמר. השתמש בו תמיד.

→ קשור ל: /context, /cost, /rewind
