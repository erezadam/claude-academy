---
title: "תזמון משימות בתוך Session — /loop וכלי Cron"
category: scheduling
layer: intermediate
last_verified: 2026-05-30
created: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/scheduled-tasks
related: ["routines", "dynamic-workflows", "/loop"]
---

## תזמון משימות בתוך Session

תזמון בתוך session מאפשר ל-Claude להריץ מחדש prompt באופן אוטומטי על interval. המנגנון בנוי סביב הסקיל המובנה `/loop` וסביב כלי cron שClaudeמפעיל מאחורי הקלעים. השתמש בו כדי לפקח על deploy, לשמור על PR (babysit), לחזור ולבדוק build ממושך, או להזכיר לעצמך לעשות משהו מאוחר יותר באותו session.

הדגש המרכזי: tasks הם **session-scoped** — הם חיים בשיחה הנוכחית ונעצרים כשמתחילים שיחה חדשה. חידוש עם `--resume` או `--continue` מחזיר כל task שעוד לא פג: task חוזר שנוצר ב-7 הימים האחרונים, או task חד-פעמי שזמן הירי שלו עוד לא עבר. לתזמון ששורד באופן עצמאי, ללא תלות ב-session, יש להשתמש ב-Routines, ב-Desktop scheduled task, או ב-GitHub Actions.

תזמון משימות דורש Claude Code בגרסה v2.1.72 ומעלה. ניתן לבדוק את הגרסה עם `claude --version`.

---

## מה זה עושה / למה זה שימושי

המנגנון נועד למקרים שבהם רוצים ש-Claude יחזור על פעולה שוב ושוב כל עוד ה-session פתוח, בלי שתצטרך להקליד מחדש את אותו prompt בכל פעם. דוגמאות אופייניות: polling אחרי deploy, בדיקת מצב CI, טיפול חוזר ב-PR, או תזכורת חד-פעמית למועד מסוים.

חשוב להבדיל בין שלוש גישות שונות. כדי **להגיב לאירועים** ברגע שהם קורים במקום לבצע polling, ה-CI יכול לדחוף את הכשל ישירות לתוך ה-session (ראה Channels). כדי לשמור על session שעובד תור אחר תור עד שתנאי מתקיים — במקום על interval — קיים `/goal`. תזמון בתוך session (`/loop` וכלי cron) מתאים ל-polling מהיר תוך כדי השיחה.

### השוואת אפשרויות תזמון

Claude Code מציע שלוש דרכים לתזמן עבודה חוזרת או חד-פעמית. הטבלה משווה ביניהן:

| | Cloud (Routines) | Desktop | /loop |
|:--|:--|:--|:--|
| רץ על | ענן Anthropic | המחשב שלך | המחשב שלך |
| דורש מחשב פועל | לא | כן | כן |
| דורש session פתוח | לא | לא | כן |
| נשמר בין הפעלות מחדש | כן | כן | משוחזר ב-`--resume` אם לא פג |
| גישה לקבצים מקומיים | לא (clone טרי) | כן | כן |
| שרתי MCP | connectors מוגדרים per task | קבצי config ו-connectors | יורש מה-session |
| בקשות הרשאה | לא (רץ אוטונומית) | ניתן להגדיר per task | יורש מה-session |
| תזמון מותאם | דרך `/schedule` ב-CLI | כן | כן |
| interval מינימלי | שעה | דקה | דקה |

הכלל המנחה: השתמש ב-**cloud tasks** לעבודה שצריכה לרוץ אמין בלי המחשב שלך. השתמש ב-**Desktop tasks** כשנדרשת גישה לקבצים וכלים מקומיים. השתמש ב-**`/loop`** ל-polling מהיר תוך כדי session.

---

## איך משתמשים

הסקיל המובנה `/loop` הוא הדרך המהירה ביותר להריץ prompt על repeat כל עוד ה-session פתוח. גם ה-interval וגם ה-prompt אופציונליים, ומה שמספקים קובע איך ה-loop מתנהג:

| מה מספקים | דוגמה | מה קורה |
|:--|:--|:--|
| interval ו-prompt | `/loop 5m check the deploy` | ה-prompt רץ על תזמון קבוע |
| prompt בלבד | `/loop check the deploy` | ה-prompt רץ על interval שClaudeבוחר בכל iteration |
| interval בלבד, או כלום | `/loop` | רץ ה-prompt תחזוקה המובנה, או `loop.md` אם קיים |

ניתן גם להעביר command אחר כ-prompt, למשל `/loop 20m /review-pr 1234`, כדי להריץ מחדש workflow ארוז בכל iteration.

### /loop על interval קבוע

כשמספקים interval, Claude ממיר אותו לביטוי cron, מתזמן את ה-job, ומאשר את הקצב ואת ה-Job ID:

```text
/loop 5m check if the deployment finished and tell me what happened
```

ה-interval יכול להוביל את ה-prompt כ-token בודד כמו `30m`, או לבוא אחריו כפסוקית כמו `every 2 hours`. היחידות הנתמכות: `s` לשניות, `m` לדקות, `h` לשעות, ו-`d` לימים.

שניות מעוגלות כלפי מעלה לדקה הקרובה, כי ל-cron יש רזולוציה של דקה. interval שלא ממופה לשלב cron נקי, כגון `7m` או `90m`, מעוגל ל-interval הקרוב שכן מתאים, ו-Claude מציין מה נבחר.

### /loop על interval דינמי

כשמשמיטים את ה-interval, Claude בוחר אחד דינמית במקום לרוץ על תזמון cron קבוע. לאחר כל iteration הוא בוחר עיכוב בין דקה לשעה בהתאם למה שצפה: המתנות קצרות כשbuild מסתיים או PR פעיל, המתנות ארוכות כשאין שום דבר ממתין. העיכוב הנבחר והסיבה לו מודפסים בסוף כל iteration.

```text
/loop check whether CI passed and address any review comments
```

כשמבקשים תזמון `/loop` דינמי, Claude עשוי להשתמש בכלי Monitor ישירות. Monitor מריץ סקריפט ברקע ומזרים בחזרה כל שורת פלט, מה שמייתר polling ולעיתים יעיל יותר ב-tokens ומגיב יותר מהרצה חוזרת של prompt על interval.

loop שמתוזמן דינמית מופיע ברשימת ה-tasks המתוזמנים כמו כל task אחר, כך שניתן להציג או לבטל אותו באותה דרך. כללי ה-jitter לא חלים עליו, אבל תוקף שבעת הימים כן: ה-loop מסתיים אוטומטית שבעה ימים אחרי שהתחלת אותו.

על Bedrock, ‏Vertex AI ו-Microsoft Foundry, ‏prompt ללא interval רץ על תזמון קבוע של 10 דקות במקום זאת.

### /loop עם prompt תחזוקה מובנה

כשמשמיטים את ה-prompt, Claude משתמש ב-prompt תחזוקה מובנה במקום אחד שאתה מספק. בכל iteration הוא עובר על הבאים, לפי הסדר: ממשיך כל עבודה לא גמורה מהשיחה; מטפל ב-PR של הענף הנוכחי — הערות review, ‏CI שנכשל, ו-merge conflicts; ומריץ passes לניקוי כגון ציד באגים או פישוט כשאין שום דבר אחר ממתין.

```text
/loop
```

Claude לא יוזם יוזמות חדשות מחוץ ל-scope הזה, ופעולות בלתי הפיכות כגון push או מחיקה מתבצעות רק כשהן ממשיכות משהו שה-transcript כבר אישר.

`/loop` ריק רץ על interval דינמי. הוסף interval, למשל `/loop 15m`, כדי להריץ אותו על תזמון קבוע. על Bedrock, ‏Vertex AI ו-Microsoft Foundry, ‏`/loop` ללא prompt מדפיס את הודעת השימוש במקום להריץ את ה-prompt התחזוקה.

### התאמת ה-prompt המובנה עם loop.md

קובץ `loop.md` מחליף את ה-prompt התחזוקה המובנה בהוראות משלך. הוא מגדיר prompt ברירת-מחדל יחיד עבור `/loop` ריק, לא רשימה של tasks נפרדים, והוא נעלם בכל פעם שאתה מספק prompt בשורת הפקודה. כדי לתזמן prompts נוספים לצידו, השתמש ב-`/loop <prompt>` או בקש מ-Claude ישירות.

Claude מחפש את הקובץ בשני מיקומים ומשתמש בראשון שהוא מוצא:

| נתיב | scope |
|:--|:--|
| `.claude/loop.md` | רמת פרויקט. גובר כששני הקבצים קיימים. |
| `~/.claude/loop.md` | רמת משתמש. חל בכל פרויקט שלא מגדיר משלו. |

הקובץ הוא Markdown רגיל ללא מבנה נדרש. כתוב אותו כאילו הקלדת את ה-prompt של `/loop` ישירות. הדוגמה הבאה שומרת על ענף release תקין:

```markdown
Check the `release/next` PR. If CI is red, pull the failing job log,
diagnose, and push a minimal fix. If new review comments have arrived,
address each one and resolve the thread. If everything is green and
quiet, say so in one line.
```

עריכות ל-`loop.md` נכנסות לתוקף ב-iteration הבא, כך שניתן ללטש את ההוראות בזמן ש-loop רץ. כשאין `loop.md` באף מיקום, ה-loop נופל בחזרה ל-prompt התחזוקה המובנה. שמור על הקובץ תמציתי: תוכן מעבר ל-25,000 בייט נחתך.

### עצירת loop

כדי לעצור `/loop` בזמן שהוא ממתין ל-iteration הבא, לחץ `Esc`. זה מנקה את ה-wakeup הממתין כך שה-loop לא יורה שוב. tasks שתזמנת על ידי בקשה ישירה מ-Claude אינם מושפעים מ-`Esc` ונשארים במקום עד שתמחק אותם.

במצב self-paced (interval דינמי), Claude יכול גם לסיים את ה-loop בעצמו על ידי אי-תזמון ה-wakeup הבא ברגע שה-task הושלם באופן מוכח. loops על interval קבוע ממשיכים לרוץ עד שתעצור אותם או עד שיעברו שבעה ימים.

---

## תזכורת חד-פעמית

לתזכורות חד-פעמיות, תאר מה אתה רוצה בשפה טבעית במקום להשתמש ב-`/loop`. Claude מתזמן task יחיד-ירי שמוחק את עצמו אחרי שהוא רץ:

```text
remind me at 3pm to push the release branch
```

```text
in 45 minutes, check whether the integration tests passed
```

Claude מקבע את זמן הירי לדקה ושעה ספציפיות באמצעות ביטוי cron, ומאשר מתי הוא יורה.

---

## ניהול tasks מתוזמנים

בקש מ-Claude בשפה טבעית להציג או לבטל tasks, או התייחס לכלים שמתחת ישירות:

```text
what scheduled tasks do I have?
```

```text
cancel the deploy check job
```

מתחת למכסה המנוע, Claude משתמש בכלים הבאים:

| כלי | תכלית |
|:--|:--|
| `CronCreate` | תזמון task חדש. מקבל ביטוי cron בן 5 שדות, ה-prompt להרצה, והאם הוא חוזר או יורה פעם אחת. |
| `CronList` | הצגת כל ה-tasks המתוזמנים עם ה-IDs, התזמונים וה-prompts שלהם. |
| `CronDelete` | ביטול task לפי ID. |

לכל task מתוזמן יש ID בן 8 תווים שניתן להעביר ל-`CronDelete`. ‏session יכול להחזיק עד 50 tasks מתוזמנים בו-זמנית.

---

## איך tasks מתוזמנים רצים

ה-scheduler בודק כל שנייה אם יש tasks שהגיע זמנם ומכניס אותם לתור בעדיפות נמוכה. ‏prompt מתוזמן יורה בין התורים שלך, לא באמצע תגובה של Claude. אם Claude עסוק כשמגיע זמן task, ה-prompt ממתין עד שהתור הנוכחי מסתיים.

כל הזמנים מפורשים לפי אזור הזמן המקומי שלך. ביטוי cron כמו `0 9 * * *` משמעו 9 בבוקר במקום שבו אתה מריץ את Claude Code, לא UTC.

### Jitter

כדי להימנע ממצב שבו כל ה-sessions פוגעים ב-API באותו רגע על השעון, ה-scheduler מוסיף offset דטרמיניסטי לזמני הירי. ‏tasks חוזרים יורים עד 30 דקות אחרי הזמן המתוזמן (או עד חצי מה-interval, ל-tasks שרצים בתדירות גבוהה מאשר כל שעה) — job שעתי שמתוזמן ל-`:00` עשוי לירות בכל מקום עד `:30`. ‏tasks חד-פעמיים שמתוזמנים לראש או לאמצע השעה יורים עד 90 שניות מוקדם.

ה-offset נגזר מ-ID של ה-task, ולכן אותו task תמיד מקבל את אותו offset. אם תזמון מדויק חשוב, בחר דקה שאינה `:00` או `:30`, למשל `3 9 * * *` במקום `0 9 * * *`, וה-jitter של חד-פעמי לא יחול.

### תוקף שבעה ימים

tasks חוזרים פגים אוטומטית 7 ימים אחרי היצירה. ה-task יורה פעם אחרונה ואז מוחק את עצמו. זה מגביל כמה זמן loop שנשכח יכול לרוץ. אם נדרש task חוזר שיחזיק זמן רב יותר, בטל וצור אותו מחדש לפני שהוא פג, או השתמש ב-Routines או ב-Desktop scheduled tasks לתזמון עמיד.

---

## עזר לביטויי cron

‏`CronCreate` מקבל ביטויי cron סטנדרטיים בני 5 שדות: `minute hour day-of-month month day-of-week`. כל השדות תומכים ב-wildcards (`*`), ערכים בודדים (`5`), צעדים (`*/15`), טווחים (`1-5`), ורשימות מופרדות בפסיק (`1,15,30`).

| דוגמה | משמעות |
|:--|:--|
| `*/5 * * * *` | כל 5 דקות |
| `0 * * * *` | כל שעה בראש השעה |
| `7 * * * *` | כל שעה בדקה ה-7 |
| `0 9 * * *` | כל יום ב-9 בבוקר מקומי |
| `0 9 * * 1-5` | ימי חול ב-9 בבוקר מקומי |
| `30 14 15 3 *` | 15 במרץ ב-2:30 אחה"צ מקומי |

‏day-of-week משתמש ב-`0` או `7` ליום ראשון ועד `6` לשבת. תחביר מורחב כמו `L`, ‏`W`, ‏`?`, וכינויים בשמות כגון `MON` או `JAN` אינו נתמך. כששדה day-of-month ושדה day-of-week מוגבלים שניהם, תאריך מתאים אם אחד מהשדות מתאים — זה עוקב אחר סמנטיקת vixie-cron הסטנדרטית.

---

## כיבוי תזמון משימות

הגדר `CLAUDE_CODE_DISABLE_CRON=1` בסביבה כדי לכבות את ה-scheduler לחלוטין. כלי ה-cron ו-`/loop` הופכים ללא זמינים, וכל task שכבר תוזמן מפסיק לירות.

---

## מגבלות

לתזמון session-scoped יש אילוצים מובנים. ‏tasks יורים רק כל עוד Claude Code רץ ונמצא במצב idle — סגירת הטרמינל או יציאה מה-session עוצרת את הירי. אין catch-up לירות שהוחמצו: אם זמן ה-task עובר בזמן ש-Claude עסוק בבקשה ממושכת, הוא יורה פעם אחת כשClaudeמתפנה, לא פעם לכל interval שהוחמץ. התחלת שיחה חדשה מנקה את כל ה-tasks ה-session-scoped; חידוש עם `claude --resume` או `claude --continue` משחזר tasks שלא פגו (חוזרים בתוך שבעה ימים מהיצירה, וחד-פעמיים שזמנם עוד לא עבר), אך משימות Background Bash ו-monitor לעולם אינן משוחזרות בחידוש.

ל-automation מבוסס cron שצריך לרוץ ללא השגחה, האפשרויות הן Routines (רצות על תשתית מנוהלת של Anthropic לפי תזמון, קריאת API, או אירועי GitHub), ‏GitHub Actions (טריגר `schedule` ב-CI), ו-Desktop scheduled tasks (רצות מקומית על המחשב שלך).
