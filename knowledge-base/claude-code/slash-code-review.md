---
title: "code-review/ — סקירת קוד בטרמינל"
category: claude-code
layer: intermediate
last_verified: 2026-05-28
status: current
related: [slash-commands-all, claude-md-guide]
source_url: "https://code.claude.com/docs/en/code-review"
badge: new
---

## code-review/

מה זה עושה: מריץ סקירת קוד על ה-diff הנוכחי בתוך סשן Claude Code — מאתר באגים לוגיים, בעיות correctness, edge-cases שבורים ו-regressions, ויכול לפרסם את הממצאים כהערות inline ב-Pull Request.

```bash
# סקירה מקומית של ה-diff הנוכחי (פלט לטרמינל)
/code-review

# סקירה + פרסום הממצאים כהערות inline ב-PR
/code-review --comment
```

## מה הפקודה עושה בפועל

מריצים /code-review בתוך סשן Claude Code פעיל, והיא סוקרת את ה-diff הנוכחי שלך מקומית — בלי להתקין שום GitHub App. הפוקוס הוא correctness: באגים שישברו production, לא העדפות עיצוב או כיסוי טסטים חסר. הממצאים מסומנים לפי חומרה, וברירת המחדל מסננת ממצאים שמתחת לרף ביטחון של 80 (ניתן לכוונון). אפשר להריץ אותה ברמת effort נבחרת.

הדגל --comment לוקח את אותה סקירה ומפרסם אותה כהערות inline על שורות הקוד הרלוונטיות ב-PR. בלי הדגל — הפלט נשאר בטרמינל בלבד.

## מקומית מול מנוהל — שתי דרכים שונות

חשוב לא לבלבל בין הפקודה המקומית לבין שירות Code Review המנוהל של אנתרופיק. אלה שני דברים נפרדים:

| | הפקודה המקומית /code-review | שירות Code Review המנוהל |
|---|---|---|
| איך מפעילים | בתוך סשן Claude Code | GitHub App + טריגר על PR/push@claude review |
| איפה רץ | אצלך, על ה-diff הנוכחי | על תשתית אנתרופיק, fleet של agents במקביל |
| זמינות | בכל סשן Claude Code | research preview, ל-Team/Enterprise בלבד |
| עלות | מול ה-usage הרגיל שלך | מחויב בנפרד, ~$15–25 לסקירה |
| פלט | טרמינל (או --comment ל-PR) | הערות inline + check run אוטומטי |

לרוב מפתח יחיד שעובד בטרמינל — הפקודה המקומית היא מה שרלוונטי לפני פתיחת PR.

## שתי טעויות שרצות ברשת

### אין דגל --fix

פוסטים ויראליים מציגים code-review --fix כאילו הוא מיישם תיקונים אוטומטית אחרי הסקירה. אין דגל כזה. הדגל המתועד היחיד הוא --comment. הפקודה מדווחת על באגים; אם אתה רוצה שיתוקנו, אתה מבקש מקלוד לתקן אחרי שהסקירה הציגה אותם — זו פעולה רגילה בסשן, לא flag.

### simplify הוא לא פקודה חדשה

טעות נפוצה שנייה: שמייצגים את /simplify כפקודה חדשה, "משולבת עם code-review". ההפך הוא הנכון — /simplify הוא השם הישן של /code-review, ששונה לפני גרסה v2.1.147. זו אותה פקודה בדיוק, לא פיצ'ר נפרד ולא חדש.

## להכוונת הסקירה

בשירות המנוהל אפשר לעצב מה מסומן דרך שני קבצים בריפו: CLAUDE.md (הקשר פרויקט כללי — הפרות חדשות שלו מסומנות כ-nit) וREVIEW.md (הוראות ייעודיות לסקירה בלבד, שמוזרקות בעדיפות הגבוהה ביותר — שם מגדירים מה נחשב חמור, אילו נתיבים לדלג עליהם, וכמה nits לפרסם).

## מתי להשתמש

הזמן הטבעי הוא לפני פתיחת PR או לפני commit — מריצים /code-review בטרמינל כדי לתפוס באגי correctness מוקדם, כשהם הכי זולים לתיקון. זה משאיר את הסקירה בתוך לולאת הפיתוח הפנימית שלך, במקום לחכות לסקירה אחרי שה-PR כבר פתוח.

## מקורות

התיעוד הרשמי: [Code Review — Claude Code Docs](https://code.claude.com/docs/en/code-review). שם מצוין במפורש שהפקודה המקומית /code-review נקראה /simplify עד גרסה v2.1.147, שהדגל הוא --comment, ושהפוקוס הוא correctness.

הגדרות הפקודה ורף הביטחון 80: ה-[README של פלאגין code-review](https://github.com/anthropics/claude-code/blob/main/plugins/code-review/README.md) בריפו הרשמי anthropics/claude-code.

אומת לאחרונה: 2026-05-28.
