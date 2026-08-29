---
title: "חלון ההקשר — מה נטען ומתי"
category: guides
last_verified: 2026-08-29
status: needs-review
source_url: https://code.claude.com/docs/en/context-window
related: ["prompt-caching", "memory", "sub-agents", "skills"]
mission: spec
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 5
published: "2026-08-29T12:00:00+03:00"
pathOrder: 8
---

חלון ההקשר הוא הזיכרון הפעיל של Claude Code בסשן. בכל תור נשלחת מחדש לשרת כל ההיסטוריה — system prompt, קבצים שנקראו, שיחה עד כה, והודעתך החדשה. להבין מה נטען ומתי עוזר למנוע הפתעות: תורים איטיים, context שמתמלא מהר, או הוראות שלא מגיעות ל-subagent.

## מה נטען בתחילת כל סשן

לפני שכותבים את המשפט הראשון, Claude Code כבר טען שכבה של תוכן. הסדר: תוכן שמשתנה לעתים רחוקות קודם, תוכן שמשתנה הרבה אחרון.

| שכבה | תוכן | מה Claude רואה |
| :--- | :--- | :--- |
| System prompt | הוראות ליבה, הגדרות כלים, פורמט תגובות | לא מוצג לך |
| Auto memory (MEMORY.md) | 200 שורות ראשונות (או 25KB) מה-MEMORY.md | לא מוצג לך |
| Environment info | תיקיית עבודה, פלטפורמה, shell, OS, ענף git וסטטוס | לא מוצג לך |
| MCP tools (deferred) | שמות כלי MCP בלבד — schemas נטענים לפי דרישה | לא מוצג לך |
| Skill descriptions | שורה אחת לכל skill זמין | לא מוצג לך |
| `~/.claude/CLAUDE.md` | העדפות גלובליות | לא מוצג לך |
| Project CLAUDE.md | הוראות פרויקט | לא מוצג לך |

**System prompt** (~4,200 טוקנים) — הוראות ליבה להתנהגות, שימוש בכלים, ופורמט תגובות. תמיד נטען ראשון. לא ניתן לראות אותו ישירות.

**Auto memory** (~680 טוקנים) — הסמארטפון של Claude בין סשנים: פקודות build שלמד, דפוסים שזיהה, טעויות להימנע. 200 השורות הראשונות של `MEMORY.md` נטענות לתוך ה-context. ניתן להשבית עם `autoMemoryEnabled: false` בהגדרות, או דרך `/memory`.

**MCP tools** — שמות הכלים מרשומים כדי ש-Claude ידע מה זמין. ה-schemas המלאים נשארים deferred כברירת מחדל ונטענים לפי דרישה דרך tool search. שרת שמתחבר או מתנתק באמצע סשן לא מבטל את המטמון (כלים deferred). ניתן לשנות עם `ENABLE_TOOL_SEARCH=auto` או `ENABLE_TOOL_SEARCH=false`.

**Skill descriptions** (~450 טוקנים) — שורה אחת לכל skill כדי ש-Claude ידע מה ניתן להפעיל. תוכן מלא נטען רק כשהskill מופעל בפועל. Skills עם `disable-model-invocation: true` אינם ברשימה — הם לא נטענים לcContext כלל עד שאתם מפעילים אותם ידנית עם `/שם`. בניגוד לשאר תוכן ה-startup, רשימה זו **אינה** מוזרקת מחדש אחרי `/compact` — רק skills שהפעלתם בפועל נשמרים.

**CLAUDE.md** — קובץ ההעדפות הגלובלי נטען יחד עם קובץ ה-CLAUDE.md של הפרויקט. כשיש סתירה, הוראות ברמת הפרויקט גוברות. שמרו אותו מתחת ל-200 שורות; תוכן ארוך יותר נטען במלואו אך עשוי להפחית את ההיצמדות.

## מה מתווסף במהלך הסשן

**קריאות קבצים** — כשClaude קורא קובץ, תוכנו נוסף ל-context. אתם רואים בטרמינל "Read auth.ts" אך לא את ה-2,400 הטוקנים של תוכן הקובץ. קריאות קבצים הן הגורם הדומיננטי לגדילת ה-context. כדי לצמצם: היו ספציפיים בבקשות, ואצלו מחקר ל-subagent.

**חוקים (rules) עם paths** — חוק ב-`.claude/rules/` עם frontmatter `paths:` נטען רק כש-Claude קורא קובץ שמתאים ל-glob. אתם רואים הודעת "Loaded" בטרמינל, לא את תוכן החוק. כך חוקי testing נטענים רק כש-Claude עובד על קבצי test.

**Hook output** — רק ה-JSON עם `hookSpecificOutput.additionalContext` שמוחזר מ-hook נכנס ל-context. stdout רגיל ביציאה 0 נשמר רק ב-debug log.

**Output של Claude** — כל ניתוח וכל עריכה שClaude כותב הם גם חלק מה-context וגם מה שמוצג לכם בטרמינל.

## Subagents — context מבודד לחלוטין

כשClaude מאציל משימה ל-subagent, ה-subagent מקבל context window **טרי ונפרד**. הוא לא רואה את היסטוריית השיחה שלכם, לא את ה-skills שהפעלתם, ולא את הקבצים שClaude כבר קרא.

Context התחלתי של subagent כולל: system prompt קצר משלו + environment, CLAUDE.md של הפרויקט, MCP וskills, ו-task message שClaude כתב. Explore ו-Plan מדלגים על CLAUDE.md ו-git status לחיסכון בcontext.

**רק סיכום הSubagent חוזר** — לדוגמה: subagent קרא 6,100 טוקנים של קבצים ומחזיר סיכום של 420 טוקנים. החיסכון ב-context הראשי הוא האבחנה המרכזית בין subagent לקריאת קבצים ישירה.

## /compact — מה קורה

`/compact` מחליף את השיחה בסיכום מובנה. לאחר כן:

- system prompt, environment ו-CLAUDE.md נטענים מחדש
- skills: רק אלה שהפעלתם נשמרים (עד 5,000 טוקנים לskill)
- skill descriptions **אינן** מוזרקות מחדש — skills שלא הופעלו חוזרים להיות invisible
- path-scoped rules שנוגעות לקבצים שנקראו מחדש נטענות מחדש

זהו תור יקר אחד ואחריו cache prefix חדש שנבנה.

## עקרון המבנה

Claude Code מסדר בקשות כך שתוכן יציב (system prompt, CLAUDE.md) בא לפני תוכן משתנה (conversation). שינוי בכל מקום ב-prefix מחייב עיבוד מחדש של כל מה שאחריו — לכן שינויי מודל, effort, MCP ו-plugin באמצע סשן ארוך עולים יותר.
