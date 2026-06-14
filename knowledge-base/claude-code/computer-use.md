---
title: "Computer Use — שליטה במסך ואפליקציות מה-CLI"
category: claude-code
layer: intermediate
last_verified: 2026-06-14
status: needs-review
source_url: https://code.claude.com/docs/en/computer-use
related: ["slash-mcp", "slash-remote-desktop", "slash-security-sandbox"]
---

Computer Use מאפשר ל-Claude לפתוח אפליקציות, לשלוט במסך ולעבוד על המחשב שלכם בדיוק כמו שאדם היה עושה. מה-CLI, Claude יכול לכתוב קוד Swift, לקמפל, להפעיל את האפליקציה, ללחוץ על כל כפתור ולצלם screenshot — הכל באותה שיחה שבה הוא כתב את הקוד.

## מה זה עושה / למה זה שימושי

Computer Use מטפל במשימות שדורשות GUI — כל מה שבדרך כלל הייתם צריכים לעשות ידנית:

- **בניה ואימות של אפליקציות native** — בנה אפליקציית macOS, הפעל אותה ולחץ על כל פקד לפני שפתחת אותה בעצמך.
- **בדיקות UI מקצה לקצה** — הצבע על אפליקציה מקומית ואמור "בדוק את תהליך ה-onboarding". Claude פותח, לוחץ, מצלם screenshot בכל שלב — ללא Playwright וללא test harness.
- **debug של בעיות ויזואליות** — Claude משנה גודל חלון, משחזר את הבאג, מצלם, מתקן CSS ומאמת את התיקון.
- **עבודה עם כלים ללא CLI** — Simulator של iOS, לוחות בקרה של חומרה, אפליקציות קנייניות ללא API.

Computer Use זמין ב-macOS בלבד (CLI), דורש Pro או Max plan וגרסה v2.1.85 ומעלה.

## איך משתמשים

**הפעלה:** בתוך session אינטראקטיבי, הריצו `/mcp`, מצאו את `computer-use` ברשימה ובחרו **Enable**.

בפעם הראשונה שבה Claude מנסה להשתמש במחשב, macOS יבקש שתי הרשאות:

- **Accessibility** — מאפשר ל-Claude ללחוץ, להקליד ולגלול
- **Screen Recording** — מאפשר ל-Claude לראות את המסך

לאחר המתן, אפשר לבקש דברים כמו:

```text
Build the app target, launch it, and click through each tab to make
sure nothing crashes. Screenshot any error states you find.
```

## אישור אפליקציות

הפעלת `computer-use` אינה מעניקה גישה לכל אפליקציה. בפעם הראשונה שבה Claude צריך אפליקציה ספציפית ב-session, מופיעה שאלת אישור בטרמינל. האישור בתוקף לכל ה-session הנוכחי.

אפליקציות עם גישה רחבה מוצגות עם אזהרה נוספת:

| אזהרה | חל על |
|:--|:--|
| שווה ערך לגישת shell | טרמינלים, IDE-ים |
| יכול לקרוא/לכתוב כל קובץ | Finder |
| יכול לשנות הגדרות מערכת | System Settings |

## אופן פעולה

Claude מחזיק נעילה לכל המכונה בזמן השימוש — session אחד בלבד יכול לשלוט במסך בו-זמנית. האפליקציות האחרות נסתרות בזמן שהוא עובד ומשוחזרות אוטומטית כשהוא מסיים.

Screenshot בתקינות של macOS ב-Retina (למשל 3456×2234) מוקטן אוטומטית לכ-1372×887 לפני שנשלח למודל.

לעצירה מיידית: לחצו `Esc` מכל מקום, או `Ctrl+C` בטרמינל.

```text
# דוגמה לשימוש — בדיקת Simulator של iOS
Open the iOS Simulator, launch the app, tap through the onboarding
screens, and tell me if any screen takes more than a second to load.
```
