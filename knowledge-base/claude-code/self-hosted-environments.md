---
title: "סביבות Self-Hosted — הרצת Sessions של Claude Code בתשתית שלכם"
category: claude-code
last_verified: 2026-08-08
status: needs-review
source_url: https://code.claude.com/docs/en/self-hosted-environments
related: [routines, remote-control, headless, channels]
mission: advanced
level: advanced
type: guide
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-08-08T12:00:00+03:00"
pathOrder: 21
---

סביבה self-hosted מאפשרת להפעיל sessions של Claude Code on the web על תשתית שהארגון שלכם מפעיל, במקום על תשתית Anthropic. המפתחים ממשיכים לפתוח sessions מ-claude.ai, מהאפליקציה הניידת, מהטרמינל עם `claude --cloud` ומ-routines — אבל הביצוע קורה בתוך הרשת הפנימית שלכם.

## מה זה עושה / למה זה שימושי

כש-session רץ ב-cloud כברירת מחדל, הוא מבצע על תשתית Anthropic ואינו יכול לגשת לשירותים פנימיים. סביבה self-hosted מזיזה את הביצוע פנימה לרשת שלכם:

- **גישה לרשת פנימית** — sessions מגיעים לשירותים, מסדי נתונים ורגיסטריים פנימיים ללא חשיפתם לאינטרנט
- **כלים מותאמים** — ניתן להתקין מראש קומפיילרים, SDKs ו-CLIs פנימיים ב-runner image כך שכל session מתחיל מוכן
- **שליטה בתאימות** — checkouts של repositories, build artifacts וקבצים שה-session יוצר נשארים על machines שאתם שולטים בהם

**הגבלות:** בבטא ציבורי על תוכניות Team ו-Enterprise בלבד, וכבוי כברירת מחדל. לא זמין לארגונים עם Zero Data Retention. inference של המודל ממשיך לעבור דרך ה-Anthropic API בלבד — לא ניתן לנתב דרך Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry או LLM gateway.

## איך זה עובד

לכל סביבה שלושה חלקים עיקריים:

| מושג | תיאור |
|:--|:--|
| Environment | יעד בעל שם שנוצר ב-claude.ai admin settings. מקבץ runners. |
| Runner | תהליך שרץ על ה-host שלכם. מקבל sessions מהתור ומפעיל אותם. |
| Session | משימת Claude Code אחת שה-developer הפעיל. |

כש-developer פותח cloud session ובוחר את הסביבה שלכם, ה-control plane של Anthropic שם את ה-session בתור הסביבה. Runner פנוי תובע את ה-session, עושה clone ל-repository, ומפעיל תהליך Claude Code על ה-host שלכם.

כל החיבורים **יוצאים** מהרשת שלכם — Anthropic לעולם לא מתחבר פנימה. ה-runner מבצע polling ל-`api.anthropic.com` לעבודה חדשה. תהליך ה-session שומר stream ל-`api.anthropic.com` עבור inference ו-git.

## מחזור חיי Runner

ה-session הראשון שה-runner תובע **נועל** אותו לחשבון המשתמש שהפעיל אותו. ה-runner ממשיך לרוץ sessions עד לקיבולת שהוגדרה (`--capacity`) עבור אותו חשבון בלבד — כך checkouts של קוד לעולם לא מתערבבים בין משתמשים.

כש-runner סיים את כל ה-sessions הפעילים שלו, הוא יוצא (בהגדרות ברירת המחדל). כך ה-orchestrator שלכם יכול להפעיל אותו מחדש עם דיסק נקי, מוכן לשרת כל חשבון.

ה-runner תומך גם ב-autoscaling: אם תפעילו orchestrator מובנה, הוא מפעיל runners לפי דרישה כש-sessions מתמרנים לתור, וה-runner יוצא מעצמו כשהעבודה מסתיימת.

## מה נשאר על התשתית שלכם

Checkouts של repositories, build artifacts, secrets וקבצים שה-session יוצר נשארים על ה-machines שהקצאתם. השיחה עצמה — prompts, תגובות ותוצאות כלים — עוברת ל-`api.anthropic.com` עבור inference של המודל. Anthropic שומר transcript ה-session כך שניתן לחדש אותו ממכשיר אחר.

## הגדרה ראשונית

1. פתחו **Claude Code on the web** לארגון (דרישה מוקדמת).
2. בדף **Cloud environments** ב-claude.ai admin settings, הפעילו **Allow self-hosted environments**.
3. צרו environment חדש — הממשק מציג **environment key** פעם אחת בלבד.
4. התקינו Claude Code על ה-hosts שלכם והפעילו runner עם ה-environment ID ו-key שקיבלתם.

עקבו אחר [Quickstart](https://code.claude.com/docs/en/self-hosted-environments-quickstart) להפעלה מלאה. לפריסה לייצור — hardening, git credentials, Kubernetes — ראו [Deploy to production](https://code.claude.com/docs/en/self-hosted-environments-deploy).
