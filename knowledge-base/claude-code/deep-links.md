---
title: "Deep Links — פתיחת סשן Claude Code מלינק"
category: claude-code
last_verified: 2026-08-22
status: needs-review
source_url: https://code.claude.com/docs/en/deep-links
related: [headless, skills, sessions]
mission: daily
level: intermediate
type: recipe
tool: claude-code
origin: official
timeMinutes: 3
published: "2026-08-22T12:00:00+03:00"
pathOrder: 26
---

Deep link הוא כתובת `claude-cli://` שפותחת Claude Code בחלון טרמינל חדש. הכתובת יכולה להכיל ספריית עבודה ופרומפט מוכן מראש.

## מה זה עושה / למה זה שימושי

כאשר לוחצים על deep link, מערכת ההפעלה מזהה את הקידומת `claude-cli://` ומפעילה את Claude Code — בדומה לאופן שבו `mailto:` פותח את לקוח הדואר. Claude Code נפתח בספרייה שהלינק ציין, והפרומפט שבלינק מועתק לשורת הקלט — אבל **לא נשלח עד שלוחצים Enter**.

שימושים נפוצים:

- **Runbook תקריות**: שלב בעמוד הטיפול שפותח Claude Code ב-repo הרלוונטי עם פרומפט חקירה
- **התראות ו-dashboards**: לינק בהתרעת ניטור שפותח סשן חקירה מוכן
- **Onboarding**: קישור ב-README שפותח את הפרויקט עם פרומפט הכוונה ראשוני
- **כשלי CI**: התראה שממלאת מראש את שם ה-job הכושל

הפרומפט תמיד נבדק על ידי המשתמש לפני שנשלח. Claude Code מציג שורת אזהרה `Prompt from an external link` עד שהפרומפט נשלח או מנוקה.

## איך משתמשים

### מבנה הלינק

כל deep link מתחיל ב-`claude-cli://open`, עם פרמטרים אופציונליים:

| פרמטר | תיאור |
| :---- | :---- |
| `q` | טקסט לפרומפט (URL-encoded). מקסימום 5,000 תווים. |
| `cwd` | נתיב מוחלט לספריית עבודה. |
| `repo` | מזהה GitHub בפורמט `owner/name`. Claude Code פותר לנתיב של clone מקומי. |

אם מועברים גם `cwd` וגם `repo`, ה-`cwd` גובר.

**דוגמה — לינק לחקירת deploy כושל:**

```text
claude-cli://open?repo=acme/payments&q=Investigate%20the%20failed%20deploy%20of%20payments-api.%0ACheck%20recent%20commits%20to%20main%20and%20the%20last%20successful%20build.
```

לחיצה על הלינק פותחת חלון טרמינל חדש, Claude Code מתחיל בתוך ה-clone המקומי של `acme/payments`, ושורת הקלט ממולאת בפרומפט המפוענח.

### שיבוץ לינק ב-Runbook

```markdown
## שיעור גבוה של שגיאות 5xx

1. אשר את ההתרעה ב-PagerDuty.
2. [פתח Claude Code ב-repo](claude-cli://open?repo=acme/web-gateway&q=5xx%20rate%20is%20elevated.%20Check%20recent%20deploys%20and%20error%20logs%20from%20the%20last%2030%20minutes.)
3. פרסם ממצאים ראשוניים ב-#incident.
```

**שים לב**: GitHub (README, issues, wikis) חוסם כתובות `claude-cli://` ומציג רק את הטקסט. בסביבות כאלה, שמור את הלינק בבלוק קוד כדי שהמשתמש יוכל להעתיקו.

### פתיחת לינק מ-shell

```bash
# macOS
open "claude-cli://open?repo=acme/payments&q=review%20open%20PRs"

# Linux
xdg-open "claude-cli://open?repo=acme/payments&q=review%20open%20PRs"
```

```powershell
# Windows PowerShell
Start-Process "claude-cli://open?repo=acme/payments&q=review%20open%20PRs"
```

## רישום ה-handler

Claude Code רושם את ה-handler `claude-cli://` עם מערכת ההפעלה כאשר שולחים את הפרומפט הראשון בסשן אינטרקטיבי. אין פקודת התקנה נפרדת.

| פלטפורמה | מיקום ה-handler |
| :-------- | :--------------- |
| macOS | `~/Applications/Claude Code URL Handler.app` |
| Linux | `claude-code-url-handler.desktop` תחת `$XDG_DATA_HOME/applications` |
| Windows | `HKEY_CURRENT_USER\Software\Classes\claude-cli` |

כדי לבטל רישום, הגדר `disableDeepLinkRegistration` ל-`"disable"` ב-`settings.json`.

## הבדל בין `cwd` ל-`repo`

השתמש ב-`cwd` כשכולם שמרו את הפרויקט באותו נתיב מוחלט (למשל devcontainer תקני).

השתמש ב-`repo` כשהלינק משותף ולכל אחד יש clone במיקום שונה. Claude Code עוקב אחר הנתיב שבו הרצת `claude` לאחרונה בתוך ה-repository ופותר את ה-slug לאותו נתיב.
