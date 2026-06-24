# מנגנון העדכון השבועי — חסין-כשל

מסמך זה מסביר איך עובד העדכון השבועי של Claude Academy, ומה צריך להגדיר פעם אחת
כדי שתקבל מיילים.

## איך זה עובד

שני workflows עובדים יחד כדי שהאתר יתעדכן אוטומטית, בלי תלות במיזוג ידני:

### 1. `weekly-academy-update.yml` — הריצה השבועית
רץ כל **שבת 06:17 UTC** (וגם ידנית דרך *Run workflow*).

1. סוכן Claude קורא את `.claude/academy-update-spec.md`, סורק את התיעוד הרשמי של
   Anthropic, וכותב/מעדכן מאמרים על ענף `academy-update/YYYY-MM-DD` ופותח PR.
2. ה-workflow מאתר את ה-PR, בונה אותו (`npm run build`) כשער איכות.
3. **אם ה-build ירוק — ה-PR מתמזג אוטומטית ל-main** (squash) והאתר מתעדכן.
4. נשלח מייל: הצלחה (מוזג), "אין עדכונים השבוע", או כשל.

> זהו התיקון לכשל ההיסטורי: עד 06/2026 הריצה הייתה "ירוקה" אבל רק פתחה PR שאיש
> לא מיזג, אז האתר נשאר מיושן. עכשיו הריצה עצמה אחראית על המיזוג.

### 2. `weekly-update-watchdog.yml` — מנגנון הבקרה
רץ **כל יום 07:41 UTC**. שכבת ביטחון שמוודאת שהעדכון אכן נחת:

1. **PR תקוע:** אם נשאר PR `academy-update/*` פתוח ולא מוזג — ה-watchdog בונה
   אותו וממזג אותו ל-main. (בדיוק התרחיש שגרם לכשל.)
2. **תקוע מאחור:** אם לא נחתה ריצה שבועית מוצלחת ב-8 הימים האחרונים — ה-watchdog
   מפעיל מחדש את `weekly-academy-update`. כיוון שהוא רץ כל יום, הוא ימשיך לנסות
   **עד שהעדכון יושלם** ויפסיק ברגע שריצה מוצלחת נוחתת בחלון.
3. בכל התערבות (מיזוג PR תקוע / הפעלה מחדש) — נשלח מייל.

## הגדרה חד-פעמית: secrets למייל

המיילים נשלחים דרך Gmail SMTP. צריך להגדיר **שני secrets** ברמת ה-repo. בלעדיהם
ה-workflows ירוצו וימזגו כרגיל — רק לא יישלח מייל (צעדי המייל מדלגים בשקט).

| Secret | ערך |
| :-- | :-- |
| `MAIL_USERNAME` | כתובת ה-Gmail השולחת (למשל `erez1964@gmail.com`) |
| `MAIL_PASSWORD` | **App Password** של Gmail (לא הסיסמה הרגילה) |

### יצירת App Password ב-Gmail
1. הפעל אימות דו-שלבי בחשבון Google: <https://myaccount.google.com/security>
2. צור App Password: <https://myaccount.google.com/apppasswords>
   (בחר אפליקציה "Mail", התקן "Other" בשם `claude-academy`). תקבל 16 תווים.
3. הוסף את שני ה-secrets ל-repo:

```bash
gh secret set MAIL_USERNAME --body "erez1964@gmail.com"
gh secret set MAIL_PASSWORD --body "<16-char-app-password>"
```

או דרך הממשק: **Settings → Secrets and variables → Actions → New repository secret**.

המייל נשלח אל `erez1964@gmail.com` (מוגדר בתוך ה-workflows תחת `to:`).

## הפעלה ידנית ובדיקה
```bash
# הרצת העדכון השבועי עכשיו
gh workflow run weekly-academy-update.yml

# הרצת ה-watchdog עכשיו (יבדוק PR תקוע / תקיעה מאחור)
gh workflow run weekly-update-watchdog.yml

# מעקב
gh run list --workflow=weekly-academy-update.yml --limit 5
```
