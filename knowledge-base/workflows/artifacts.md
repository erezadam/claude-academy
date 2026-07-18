---
title: "Artifacts — שיתוף פלט session כעמוד חי ואינטראקטיבי"
category: workflows
layer: basic
last_verified: 2026-07-18
status: needs-review
source_url: https://code.claude.com/docs/en/artifacts
related: [mcp, skills, dynamic-workflows]
---

Artifact הוא עמוד אינטרנט חי שClaude Code מפרסם מה-session שלך לURL פרטי ב-claude.ai. פותחים אותו בדפדפן, והוא מתעדכן במקומו כשה-session ממשיך. ניתן לשתף אותו עם עמית מצד הכותרת של העמוד.

## מה זה עושה / למה זה שימושי

Artifact הוא הדרך הנכונה לשתף פלט שטקסט טרמינל אינו המדיה המתאימה עבורו — פלט שקל יותר לצפות בו ולהתעסק איתו מאשר לקרוא שורה אחרי שורה. Claude בונה את העמוד מכל מה שה-session יכול לגשת אליו, כולל הcodebase ונתונים שנשלפו דרך MCP servers מחוברים.

דוגמאות לשימוש:

- עצירת reviewer דרך PR עם diff מוסבר ומאוייר
- רינדור dashboard מנתונים שה-session כבר שלף
- הצגת כמה אפשרויות עיצוב/מימוש זו לצד זו להשוואה
- ציר זמן חקירה שמתמלא בזמן שמשימה ארוכה רצה
- שליחת לינק לעמית במקום הדבקת פלט ל-Slack
- לוח מחוונים שמושך נתונים חיים דרך MCP connectors בכל פתיחה

Artifact אינו אפליקציה — הוא עמוד בודד ללא backend, לכן לא יכול לאחסן קלט טפסים או לשרת מספר routes. הדרך היחידה לשלוף נתונים מחוץ לעמוד בזמן צפייה היא קריאת MCP connectors.

## דרישות זמינות

| דרישה | פרטים |
| :---- | :----- |
| Plan | Pro, Max, Team, או Enterprise |
| אימות | כניסה לחשבון claude.ai באמצעות `/login` (לא API key, gateway token, Bedrock, Vertex, או Foundry) |
| ספק מודל | Anthropic API בלבד |
| Surface | CLI של Claude Code (v2.1.183 ומעלה), אפליקציית Desktop (v1.13576.0 ומעלה), או Claude Tag sessions |

## איך משתמשים

### יצירת artifact

Claude עשוי לפרסם artifact מיוזמתו כשהפלט מתאים לעמוד, או שאפשר לבקש ישירות:

```text
Make an artifact that walks through this PR with the diff annotated inline.
```

```text
Build a dashboard artifact of last week's deploy failures by service and keep it updated as you investigate.
```

Claude כותב את העמוד לקובץ HTML או Markdown בפרויקט, ואז מפרסם. לפני פרסום artifact חדש, Claude Code יבקש אישור. לחץ **Yes** — Claude ידפיס את ה-URL ויפתח את הדפדפן לעמוד החדש.

לפתיחה מחדש של ה-artifact האחרון מהטרמינל:

```bash
Ctrl+]
```

לביטול פתיחת דפדפן אוטומטית:

```bash
export CLAUDE_CODE_ARTIFACT_AUTO_OPEN=0
```

### עדכון artifact

בקש מClaude לתקן את העמוד, או תן לו לפרסם מחדש כשמשימה ארוכה מתקדמת:

```text
Add a per-region breakdown below the summary chart and republish.
```

כל מי שהעמוד פתוח אצלו רואה את העדכון במקומו. כל פרסום הופך לגרסה, ומפקד **Share** בכותרת העמוד מאפשר לבחור איזו גרסה הצופים רואים.

לעדכון artifact מsession אחר, תן ל-Claude את ה-URL:

```text
Update https://claude.ai/code/artifact/5fbea6f3-... with today's numbers.
```

### שיתוף artifact

artifact חדש גלוי רק לך. פתח אותו בדפדפן והשתמש בפקד **Share** בכותרת:

- **בתוך הארגון**: ב-Team ו-Enterprise ניתן להעניק גישה לאנשים ספציפיים או לכולם בארגון. הצופים חייבים להיות מחוברים ל-claude.ai כחברי הארגון.
- **שיתוף ציבורי**: ב-Pro ו-Max, קישור ציבורי הוא הדרך היחידה לשתף. ב-Team ו-Enterprise, שיתוף ציבורי מנוטרל כברירת מחדל עד שמנהל מפעיל אותו.
- **הרשאת עריכה**: ב-Team ו-Enterprise ניתן להפוך שותף ל-editor — הם מפרסמים גרסאות חדשות מה-session שלהם ע"י מתן ה-URL לClaude.

## נתונים חיים דרך MCP connectors

artifact יכול לקרוא MCP connectors בכל פעם שמישהו פותח אותו, כך שהעמוד מציג נתונים עדכניים ולא snapshot מה-session שבנה אותו. דורש Claude Code v2.1.209 ומעלה, וזמין ב-Pro, Max, Team ו-Enterprise.

```text
Build a dashboard artifact of our open pull requests that pulls the live list through my GitHub connector when the page loads.
```

Claude מצהיר אילו connectors העמוד עשוי לקרוא כחלק מהפרסום. בכל פתיחה:

- הקריאה רצה דרך חשבון הצופה — שני אנשים יכולים לראות נתונים שונים לפי הגישה שלהם
- claude.ai מבקש אישור לפני הקריאה הראשונה
- פעולות עם תופעות לוואי (כמו פרסום הודעה) רצות תחת חשבון הצופה

artifact עם MCP connectors לא ניתן לשיתוף ציבורי בשום plan.

## מגבלות עמוד

| מגבלה | השפעה |
| :----- | :----- |
| ללא בקשות חיצוניות | CSP חוסמת scripts, stylesheets ו-fetch מכל host אחר; CSS וJavaScript מוטמעים inline. MCP connectors הם החריג — claude.ai מבצע את הקריאה מטעם העמוד |
| ללא backend | עמוד סטטי בלבד — לא יכול לשמור נתוני טפסים; הדרך היחידה לנתונים חיצוניים היא MCP connectors |
| עמוד בודד | links יחסיים לא עובדים; Claude משתמש ב-anchors פנים-עמוד |
| סוגי קבצים | רק `.html`, `.htm`, או `.md` |
| גודל מרונדר | עד 16 MiB |

## השבתת artifacts

| שיטה | הגדרה |
| :---- | :----- |
| קובץ settings | `"disableArtifact": true` |
| משתנה סביבה | `CLAUDE_CODE_DISABLE_ARTIFACT=1` |
| כלל הרשאה | הוסף `Artifact` ל-`permissions.deny` |

## ניהול artifacts לארגון

בעלי Plan של Team ו-Enterprise שולטים ב-artifacts דרך [claude.ai admin settings](https://claude.ai/admin-settings/claude-code). ניתן להפעיל/להשבית artifacts (כולל connector calls בנפרד), לקבוע מדיניות שמירה, ולסקור את ה-audit log תחת סוגי אירועים `claude_artifact_*`.
