---
title: "Skills — הרחבת יכולות Claude Code"
category: claude-code
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/skills
related: [plugins-guide, sub-agents, slash-commands]
---

## Skills

Skills מרחיבים את מה ש-Claude יכול לעשות. יוצרים קובץ `SKILL.md` עם הוראות, ו-Claude מוסיף אותו לערכת הכלים שלו. Claude משתמש ב-skill כשהוא רלוונטי, או שאפשר להפעיל אותו ישירות עם `/skill-name`.

כדאי ליצור skill כשאתם מוצאים את עצמכם מדביקים שוב ושוב את אותן הוראות, checklist, או תהליך רב-שלבי לתוך השיחה — או כשחלק מ-CLAUDE.md גדל להיות תהליך ולא עובדה. בשונה מתוכן ב-CLAUDE.md, גוף ה-skill נטען רק כשמשתמשים בו, כך שחומר עזר ארוך כמעט לא עולה דבר עד שצריך אותו.

Skills של Claude Code עוקבים אחר תקן Agent Skills הפתוח, שעובד על פני כמה כלי AI. Claude Code מרחיב את התקן עם תכונות נוספות כמו שליטה בהפעלה, הרצה ב-subagent, והזרקת context דינמי.

## מה זה עושה / למה זה שימושי

Skill הוא דרך לארוז ידע או תהליך קבוע ולתת ל-Claude לטעון אותו בדיוק כשצריך. שם התיקייה הופך לפקודה שמקלידים, וה-`description` עוזר ל-Claude להחליט מתי לטעון את ה-skill אוטומטית.

**הערה חשובה — Custom commands מוזגו לתוך skills.** קובץ ב-`.claude/commands/deploy.md` ו-skill ב-`.claude/skills/deploy/SKILL.md` שניהם יוצרים `/deploy` ועובדים באותו אופן. קבצים קיימים ב-`.claude/commands/` ממשיכים לעבוד. Skills מוסיפים תכונות אופציונליות: תיקייה לקבצי תמיכה, frontmatter לשליטה במי שמפעיל אותם, והיכולת של Claude לטעון אותם אוטומטית כשהם רלוונטיים.

יש שני סוגי תוכן עיקריים. **Reference content** מוסיף ידע ש-Claude מיישם על העבודה הנוכחית (קונבנציות, דפוסים, מדריכי סגנון, ידע תחומי), והוא רץ inline לצד ה-context של השיחה. **Task content** נותן ל-Claude הוראות צעד-אחר-צעד לפעולה ספציפית כמו deployment, commit, או יצירת קוד — לרוב פעולות שתרצו להפעיל ישירות עם `/skill-name`.

## איך משתמשים

המקום שבו שומרים skill קובע מי יכול להשתמש בו. תיקייה `~/.claude/skills/` היא אישית וזמינה בכל הפרויקטים; תיקייה `.claude/skills/` בתוך פרויקט שייכת לפרויקט בלבד.

הדוגמה הבאה יוצרת skill שמסכם שינויים לא-מקומיטים ומסמן כל דבר מסוכן. שלב ראשון — יצירת תיקיית ה-skill בתיקיית ה-skills האישית:

```bash
mkdir -p ~/.claude/skills/summarize-changes
```

שלב שני — כתיבת `SKILL.md`. כל skill צריך קובץ `SKILL.md` עם שני חלקים: YAML frontmatter בין סימני `---` שמסביר ל-Claude מתי להשתמש ב-skill, ותוכן markdown עם ההוראות ש-Claude עוקב אחריהן כשה-skill רץ. שמרו את התוכן הבא ל-`~/.claude/skills/summarize-changes/SKILL.md`:

```yaml
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points, then list any risks you notice such as missing error handling, hardcoded values, or tests that need updating. If the diff is empty, say there are no uncommitted changes.
```

השורה `` !`git diff HEAD` `` משתמשת בהזרקת context דינמי: Claude Code מריץ את הפקודה ומחליף את השורה בפלט שלה לפני ש-Claude רואה את תוכן ה-skill, כך שההוראות מגיעות עם ה-diff הנוכחי כבר מוטמע.

שלב שלישי — בדיקה. אפשר לתת ל-Claude להפעיל את ה-skill אוטומטית על ידי שאלה שמתאימה ל-`description` (למשל "What did I change?"), או להפעיל ישירות:

```text
/summarize-changes
```

## מבנה תיקיית Skill

כל skill הוא תיקייה שבה `SKILL.md` הוא נקודת הכניסה. שאר הקבצים אופציונליים ומאפשרים לבנות skills חזקים יותר:

```text
my-skill/
├── SKILL.md           # הוראות ראשיות (חובה)
├── template.md        # תבנית ש-Claude ממלא
├── examples/
│   └── sample.md      # פלט לדוגמה שמראה את הפורמט הצפוי
└── scripts/
    └── validate.sh    # script ש-Claude יכול להריץ
```

הקובץ `SKILL.md` מכיל את ההוראות הראשיות והוא חובה. קבצים אחרים יכולים להיות תבניות למילוי, פלטים לדוגמה, scripts להרצה, או חומר עזר מפורט. כדאי להפנות לקבצי התמיכה מתוך `SKILL.md` כדי ש-Claude יידע מה כל קובץ מכיל ומתי לטעון אותו. כך `SKILL.md` נשאר ממוקד, וחומר עזר גדול נטען רק כשצריך אותו. ההמלצה היא לשמור את `SKILL.md` מתחת ל-500 שורות ולהעביר חומר עזר מפורט לקבצים נפרדים.

## מיקום Skills — מי יכול להשתמש

| מיקום | נתיב | חל על |
|:--|:--|:--|
| Enterprise | ראו managed settings | כל המשתמשים בארגון |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | כל הפרויקטים שלכם |
| Project | `.claude/skills/<skill-name>/SKILL.md` | הפרויקט הזה בלבד |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | היכן שה-plugin מופעל |

כששמות זהים בין רמות: enterprise גובר על personal, ו-personal גובר על project. Skills של plugin משתמשים ב-namespace בצורת `plugin-name:skill-name`, כך שאינם יכולים להתנגש עם רמות אחרות. אם קיים גם skill וגם command באותו שם — ה-skill גובר.

Claude Code עוקב אחר תיקיות ה-skills ומזהה שינויים בזמן ריצה: הוספה, עריכה או הסרה של skill תחת `~/.claude/skills/`, ה-`.claude/skills/` של הפרויקט, או `.claude/skills/` בתוך תיקייה שנוספה דרך `--add-dir`, נכנסת לתוקף בתוך ה-session הנוכחי בלי restart. יצירת תיקיית skills ברמה עליונה שלא הייתה קיימת כשה-session התחיל מחייבת הפעלה מחדש של Claude Code.

## שדות Frontmatter

מעבר לתוכן ה-markdown, אפשר להגדיר התנהגות באמצעות שדות YAML frontmatter בין סימני `---`:

```yaml
---
name: my-skill
description: What this skill does
disable-model-invocation: true
allowed-tools: Read Grep
---

Your skill instructions here...
```

כל השדות אופציונליים. רק `description` מומלץ כדי ש-Claude יידע מתי להשתמש ב-skill. השדות העיקריים:

| שדה | תיאור |
|:--|:--|
| `name` | שם תצוגה ברשימות skills. ברירת מחדל: שם התיקייה. |
| `description` | מה ה-skill עושה ומתי להשתמש בו. Claude משתמש בזה כדי להחליט מתי להפעיל. הטקסט המשולב של `description` ו-`when_to_use` נחתך ב-1,536 תווים. |
| `when_to_use` | context נוסף למתי Claude צריך להפעיל, כמו ביטויי טריגר או דוגמאות. נספר לתוך מכסת 1,536 התווים. |
| `argument-hint` | רמז שמוצג ב-autocomplete לגבי הארגומנטים הצפויים, למשל `[issue-number]`. |
| `arguments` | ארגומנטים מיקומיים בעלי שם להחלפת `$name` בתוכן. |
| `disable-model-invocation` | `true` מונע מ-Claude לטעון אוטומטית את ה-skill. מתאים ל-workflows שרוצים להפעיל ידנית עם `/name`. ברירת מחדל: `false`. |
| `user-invocable` | `false` מסתיר מתפריט ה-`/`. מתאים לידע רקע שמשתמשים לא צריכים להפעיל ישירות. ברירת מחדל: `true`. |
| `allowed-tools` | כלים ש-Claude יכול להשתמש בהם בלי לבקש אישור כשה-skill פעיל. |
| `disallowed-tools` | כלים שמוסרים מ-pool הכלים של Claude כל עוד ה-skill פעיל. ההגבלה מתבטלת בהודעה הבאה. |
| `model` | מודל לשימוש כשה-skill פעיל; ההחלפה חלה עד סוף ה-turn הנוכחי. |
| `effort` | רמת effort כשה-skill פעיל. אפשרויות: `low`, `medium`, `high`, `xhigh`, `max`. |
| `context` | `fork` להרצה ב-context של subagent מפוצל. |
| `agent` | סוג ה-subagent לשימוש כש-`context: fork` מוגדר. |
| `hooks` | hooks שמתוחמים למחזור החיים של ה-skill. |
| `paths` | תבניות glob שמגבילות מתי ה-skill מופעל אוטומטית — רק בעבודה עם קבצים שמתאימים לתבניות. |
| `shell` | shell עבור פקודות `` !`command` `` ב-skill. `bash` (ברירת מחדל) או `powershell`. |

## שליטה במי שמפעיל את ה-skill

כברירת מחדל גם אתם וגם Claude יכולים להפעיל כל skill. שני שדות frontmatter מאפשרים להגביל זאת. הגדרת `disable-model-invocation: true` משאירה רק לכם את היכולת להפעיל — מתאים ל-workflows עם תופעות לוואי כמו `/commit`, `/deploy`, או `/send-slack-message`, שלא רוצים ש-Claude יחליט להריץ. הגדרת `user-invocable: false` משאירה רק ל-Claude את ההפעלה — מתאים לידע רקע שאינו פעולה משמעותית עבור המשתמש.

| Frontmatter | אתם יכולים להפעיל | Claude יכול להפעיל | מתי נטען ל-context |
|:--|:--|:--|:--|
| (ברירת מחדל) | כן | כן | התיאור תמיד ב-context, ה-skill המלא נטען בהפעלה |
| `disable-model-invocation: true` | כן | לא | התיאור לא ב-context, ה-skill המלא נטען כשאתם מפעילים |
| `user-invocable: false` | לא | כן | התיאור תמיד ב-context, ה-skill המלא נטען בהפעלה |

## הזרקת Context דינמי

התחביר `` !`<command>` `` מריץ פקודות shell לפני שתוכן ה-skill נשלח ל-Claude. הפלט של הפקודה מחליף את ה-placeholder, כך ש-Claude מקבל נתונים אמיתיים ולא את הפקודה עצמה. זהו preprocessing, לא משהו ש-Claude מריץ — Claude רואה רק את התוצאה הסופית.

ה-skill הבא מסכם pull request על ידי שליפת נתוני PR חיים עם ה-GitHub CLI:

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

הצורה ה-inline מזוהה רק כש-`!` מופיע בתחילת שורה או מיד אחרי רווח. לפקודות מרובות שורות אפשר להשתמש בבלוק קוד שנפתח עם ` ```! ` במקום הצורה ה-inline. אפשר לכבות התנהגות זו על ידי הגדרת `"disableSkillShellExecution": true` ב-settings.

## העברת ארגומנטים

גם אתם וגם Claude יכולים להעביר ארגומנטים בהפעלת skill. הארגומנטים זמינים דרך ה-placeholder `$ARGUMENTS`. ה-skill הבא מתקן GitHub issue לפי מספר:

```yaml
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.

1. Read the issue description
2. Understand the requirements
3. Implement the fix
4. Write tests
5. Create a commit
```

כשמריצים `/fix-issue 123`, Claude מקבל "Fix GitHub issue 123 following our coding standards...". אם מפעילים skill עם ארגומנטים אך ה-skill לא כולל `$ARGUMENTS`, Claude Code מוסיף `ARGUMENTS: <your input>` בסוף תוכן ה-skill. לגישה לארגומנט בודד לפי מיקום משתמשים ב-`$ARGUMENTS[N]` או בקיצור `$N` (כך `$0` הוא הארגומנט הראשון).

## Skills מובנים

Claude Code כולל סט skills מובנים הזמינים בכל session, כולל `/code-review`, `/batch`, `/debug`, `/loop`, ו-`/claude-api`. בשונה מרוב הפקודות המובנות שמריצות לוגיקה קבועה, skills מובנים מבוססי-prompt: הם נותנים ל-Claude הוראות מפורטות ונותנים לו לתזמר את העבודה בעזרת הכלים שלו. מפעילים אותם כמו כל skill אחר.

שלושה skills מובנים עובדים יחד כדי להפעיל את האפליקציה ולאמת שינויים מול האפליקציה הפועלת:

| Skill | תפקיד |
|:--|:--|
| `/run` | הפעלה והנעה של האפליקציה כדי לראות שינוי עובד |
| `/verify` | build והרצה של האפליקציה כדי לאמת ששינוי קוד עושה את מה שצריך, בלי נפילה ל-tests או type checks |
| `/run-skill-generator` | מלמד את `/run` ו-`/verify` איך לבנות ולהפעיל את הפרויקט |

`/run` ו-`/verify` עובדים בלי הגדרה — הם מסיקים את ההפעלה מסוג הפרויקט וממה שיש ב-README, `package.json`, או `Makefile`. ההסקה הזו פחות אמינה בפרויקטים שצריכים משהו מעבר להפעלה סטנדרטית (DB, קובץ env, multi-step build). `/run-skill-generator` מתעד את ה"מתכון" במקום: מפעיל את האפליקציה מסביבה נקייה, לוכד מה עבד, ומקמט אותו כ-skill ספציפי לפרויקט ב-`.claude/skills/run-<name>/`.

## שיתוף Skills

אפשר להפיץ skills בהיקפים שונים לפי הקהל. **Project skills** — קומיטים של `.claude/skills/` ל-version control. **Plugins** — תיקיית `skills/` בתוך plugin. **Managed** — פריסה ברמת הארגון דרך managed settings.

## פתרון תקלות

אם Claude לא משתמש ב-skill כשמצופה: בדקו שה-`description` כולל מילות מפתח שמשתמשים יאמרו באופן טבעי; ודאו שה-skill מופיע בתשובה ל-"What skills are available?"; נסחו מחדש את הבקשה כך שתתאים יותר ל-`description`; או הפעילו ישירות עם `/skill-name`.

אם Claude משתמש ב-skill יותר מדי, אפשר להפוך את ה-`description` לספציפי יותר, או להוסיף `disable-model-invocation: true` אם רוצים רק הפעלה ידנית.

תיאורי skills נטענים ל-context כדי ש-Claude יידע מה זמין. כל שמות ה-skills תמיד נכללים, אך אם יש skills רבים, התיאורים מתקצרים כדי להיכנס למכסת התווים. אפשר להריץ `/doctor` כדי לראות אם המכסה עוברת את הגבול ואילו skills מושפעים.
