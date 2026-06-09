---
title: "בניית סוכן ב-Claude Code — מדריך מקצה לקצה לפי ההמלצות הרשמיות"
category: guides
layer: advanced
last_verified: 2026-06-09
status: current
source_url: https://code.claude.com/docs/en/best-practices
related: [claude-md-guide, slash-plan, slash-permissions, slash-compact-clear, skills, slash-mcp, sub-agents, slash-hooks, plugins-guide, worktrees, slash-goal, slash-rewind, slash-context-cost]
badge: new
---

## בניית סוכן ב-Claude Code — מדריך מקצה לקצה לפי ההמלצות הרשמיות

Claude Code הוא סביבת עבודה אגנטית, לא צ'אט. בניגוד לצ'אטבוט שעונה ומחכה, הוא קורא קבצים, מריץ פקודות, מבצע שינויים ועובד על בעיה לבד — בזמן שאתה צופה, מכוון, או עוזב. "בניית סוכן" כאן לא אומרת לכתוב קוד של סוכן מאפס; היא אומרת **להגדיר את Claude Code** (CLAUDE.md, skills, subagents, hooks, MCP) ולעבוד בלולאה האגנטית כפי ש-Anthropic ממליצה. כל ההמלצות במדריך נגזרות מאילוץ אחד: חלון ההקשר מתמלא מהר, והביצועים יורדים ככל שהוא מתמלא.

מה זה עושה: נותן נתיב מבוסס-תיעוד להפעיל את Claude Code כסוכן אמין — מהגדרת הסביבה, דרך לולאת חקירה → תכנון → מימוש → אימות, ועד סקייל למספר סשנים במקביל. כל שלב מצמצם סוג כשל ספציפי. כל ההמלצות כאן הן רשמיות, מתוך התיעוד החי של Anthropic; אין כאן כלי צד-שלישי.

---

## חלק 1 — האילוץ המרכזי: חלון ההקשר

חלון ההקשר מחזיק את **כל** השיחה: כל הודעה, כל קובץ שנקרא, כל פלט של פקודה. סשן דיבאג בודד או חקירה של codebase יכולים לצרוך עשרות אלפי טוקנים בקלות.

זה משנה את כל מה שאחריו, כי ביצועי המודל יורדים ככל שהחלון מתמלא. כשהוא מתקרב למלא, Claude עלול "לשכוח" הוראות מוקדמות ולשגות יותר. לכן ניהול ההקשר הוא **המשאב החשוב ביותר לנהל** — וכל שאר ההמלצות במדריך הזה הן, בעצם, דרכים שונות להגן עליו.

המסקנה המעשית: התייחס לטוקנים כמו לתקציב. אל תיתן לשיחה אחת לגרור משימות לא קשורות, אל תיתן לחקירה לרוץ בלי גבול, ואל תיתן ל-CLAUDE.md להתנפח. הסעיפים הבאים מפרטים איך.

---

## חלק 2 — תן ל-Claude דרך לאמת את עצמו

זה העיקרון האגנטי החשוב ביותר. Claude עוצר כשהעבודה "נראית גמורה". בלי בדיקה שהוא יכול להריץ בעצמו, "נראית גמורה" הוא האות היחיד — ואתה הופך ללולאת האימות: כל טעות מחכה שאתה תבחין בה.

תן לו משהו שמחזיר pass/fail, והלולאה נסגרת לבד. Claude עובד, מריץ את הבדיקה, קורא את התוצאה, ומתקן עד שהיא עוברת. הבדיקה היא כל דבר שמחזיר אות שניתן לקריאה בתוך השיחה: סוויטת טסטים, exit code של build, linter, סקריפט שמשווה פלט ל-fixture, או צילום מסך שמושווה לעיצוב.

### ארבע רמות שער — כמה חזק הבדיקה חוסמת את הסיום

| רמת שער | איך מגדירים | מתי מתאים |
|---|---|---|
| **בתוך פרומפט אחד** | מבקשים מ-Claude להריץ ולתקן באותה הודעה | כל משימה, כאן ועכשיו |
| **לאורך סשן (`/goal`)** | מעריך נפרד בודק את התנאי אחרי כל תור; Claude ממשיך עד שהוא מתקיים | עבודה ארוכה עם מצב-סיום מדיד |
| **שער דטרמיניסטי (Stop hook)** | סקריפט רץ בסוף כל תור וחוסם סיום עד שהוא עובר | אכיפה שחייבת לקרות, בלי יוצא מן הכלל |
| **חוות דעת שנייה (verification subagent)** | סוכן בהקשר טרי מנסה להפריך את התוצאה | מי שעשה את העבודה אינו מי שמעריך אותה |

כל רמה מחליפה מעט הקמה תמורת פחות תשומת-לב נדרשת ממך. גרסת הפרומפט עובדת על כל משימה כבר היום; `/goal` ו-Stop hook הם מה שמאפשר לריצה לא-מפוקחת להסתיים נכון בלעדיך.

הכלל החותך: **תמיד דרוש ראיה** — פלט הטסט, הפקודה ותוצאתה, או צילום מסך — לא הצהרת הצלחה. לבדוק ראיה מהיר יותר מאשר להריץ מחדש את האימות בעצמך, וזה עובד גם לסשנים שלא צפית בהם.

ראה [slash-goal](/article/claude-code/slash-goal) להגדרת תנאי סיום לסשן, [slash-hooks](/article/claude-code/slash-hooks) לשער דטרמיניסטי, ו-[sub-agents](/article/claude-code/sub-agents) לחוות דעת שנייה בהקשר טרי.

---

## חלק 3 — חקור → תכנן → ממש → commit

אל תיתן ל-Claude לקפוץ ישר לקוד; תקבל פתרון מהיר לבעיה הלא נכונה. הזרימה הרשמית המומלצת מפרידה בין מחקר ותכנון לבין מימוש, ונשענת על Plan Mode.

### 1. חקור (Plan Mode)

Claude קורא קבצים ועונה על שאלות בלי לבצע שום שינוי.

```txt
read /src/auth and understand how we handle sessions and login.
also look at how we manage environment variables for secrets.
```

### 2. תכנן (Plan Mode)

מבקשים תוכנית מימוש מפורטת. `Ctrl+G` פותח את התוכנית בעורך הטקסט לעריכה ידנית לפני ש-Claude ממשיך.

```txt
I want to add Google OAuth. What files need to change?
What's the session flow? Create a plan.
```

### 3. ממש (Default Mode)

יוצאים מ-Plan Mode ונותנים ל-Claude לכתוב — תוך אימות מול התוכנית שלו.

```txt
implement the OAuth flow from your plan. write tests for the
callback handler, run the test suite and fix any failures.
```

### 4. Commit

```txt
commit with a descriptive message and open a PR
```

מתי לדלג על התכנון: לטעות קטנה וברורה — typo, שורת log, שינוי שם משתנה — תן ל-Claude לבצע ישירות. תכנון שווה את התקורה כשאתה לא בטוח בגישה, כשהשינוי נוגע בכמה קבצים, או כשהקוד לא מוכר לך. אם אתה יכול לתאר את ה-diff במשפט אחד, דלג על התוכנית. פירוט מלא על מצב התכנון ב-[slash-plan](/article/claude-code/slash-plan).

---

## חלק 4 — תן הקשר ספציפי בפרומפט

Claude יכול להסיק כוונה, אבל לא לקרוא מחשבות. ככל שההוראות מדויקות יותר, כך תזדקק לפחות תיקונים.

- **מקד את המשימה** — איזה קובץ, איזה תרחיש, ומה העדפות הטסטים. במקום "add tests for foo.py" — "write a test for foo.py covering the edge case where the user is logged out. avoid mocks."
- **הצבע על מקורות** — הפנה את Claude למקום שיענה. במקום לשאול "למה ה-API מוזר" — "look through ExecutionFactory's git history and summarize how its api came to be".
- **הפנה לדפוסים קיימים** — "look at how existing widgets are implemented... HotDogWidget.php is a good example. follow the pattern".
- **תאר את הסימפטום** — מה קורה, איפה זה כנראה יושב, ומה "מתוקן" אומר. למשל: "users report that login fails after session timeout. check the auth flow in src/auth/... write a failing test that reproduces the issue, then fix it".

תוכן עשיר נכנס לפרומפט בכמה דרכים: `@` להפניית קבצים (Claude קורא אותם לפני שהוא עונה), הדבקת תמונות וצילומי מסך ישירות, מתן URLs לתיעוד (עם allowlist ב-`/permissions` לדומיינים תכופים), ו-pipe של נתונים ישירות:

```bash
cat error.log | claude
```

פרומפט מעורפל דווקא מועיל כשאתה בשלב חקירה ויכול להרשות לעצמך לתקן תוך כדי — למשל "what would you improve in this file?" יכול להעלות דברים שלא חשבת לשאול עליהם.

---

## חלק 5 — הגדר את הסביבה

זה היסוד. כמה צעדי הקמה הופכים את Claude Code ליעיל בהרבה בכל הסשנים. לכל מנגנון יש כרטיס ייעודי — כאן רק ההסבר התהליכי הקצר.

### CLAUDE.md — הקשר קבוע

קובץ ש-Claude קורא בתחילת **כל** שיחה. הרץ `/init` כדי לייצר בסיס מהמבנה של הפרויקט, ואז זקק לאורך זמן. שמור אותו קצר וקריא — קובץ נפוח גורם ל-Claude **להתעלם** מההוראות האמיתיות, כי הן נבלעות ברעש. הקובץ תומך ב-import עם תחביר `@path/to/file`.

| ✅ כלול | ❌ אל תכלול |
|---|---|
| פקודות bash שאי אפשר לנחש | כל מה ש-Claude יודע לבד מקריאת הקוד |
| חוקי סגנון ששונים מברירת המחדל | מוסכמות שפה סטנדרטיות |
| הוראות והעדפות טסטים | תיעוד API ארוך (קשר לדוקס במקום) |
| נוהל repo (שמות branch, מוסכמות PR) | מידע שמשתנה תכופות |
| החלטות ארכיטקטורה ספציפיות לפרויקט | תיאור קובץ-אחר-קובץ של ה-codebase |

פירוט מלא, מיקומי הקבצים וסדר הטעינה ב-[claude-md-guide](/article/claude-code/claude-md-guide).

### הרשאות — כמה פחות הפרעות

יש שלוש דרכים לצמצם אישורים בלי לאבד שליטה: **auto mode** (מודל מסווג נפרד חוסם רק את מה שנראה מסוכן — הסלמת הרשאות, תשתית לא מוכרת, פעולות מונחות-תוכן עוין), **allowlist** של כלים בטוחים דרך `/permissions`, ו-`/sandbox` לבידוד ברמת מערכת ההפעלה. ראה [slash-permissions](/article/claude-code/slash-permissions).

### כלי CLI — הדרך החסכונית-בהקשר לשירותים חיצוניים

אמור ל-Claude להשתמש ב-`gh`, `aws`, `gcloud`, `sentry-cli` וכדומה. זו הדרך החסכונית ביותר בטוקנים לעבוד מול שירותים חיצוניים. Claude גם לומד כלים שאינו מכיר: "Use 'foo-cli --help' to learn the tool, then solve A, B, C".

### MCP servers — חיבור מערכות

```bash
claude mcp add
```

מחבר את Claude ל-Notion, Figma, מסד נתונים, issue tracker ועוד, כך שיוכל לקרוא ולפעול ישירות במקום שתעתיק נתונים לצ'אט. ראה [slash-mcp](/article/claude-code/slash-mcp).

### Hooks — אכיפה דטרמיניסטית

סקריפטים שרצים אוטומטית בנקודות מוגדרות בלולאה. בניגוד ל-CLAUDE.md שהוא **מייעץ**, hooks הם **דטרמיניסטיים** ומבטיחים שהפעולה תקרה. Claude יכול לכתוב אותם בשבילך:

```txt
Write a hook that runs eslint after every file edit
```

ראה [slash-hooks](/article/claude-code/slash-hooks).

### Skills — ידע ותהליכים חוזרים

קובצי `SKILL.md` בתיקיית `.claude/skills/` שמרחיבים את הידע של Claude בתחום, צוות, או פרויקט. Claude מפעיל אותם אוטומטית כשהם רלוונטיים, או שאתה מפעיל ידנית עם `/skill-name`. בניגוד ל-CLAUDE.md, גוף ה-skill נטען רק כשהוא בשימוש — כך שחומר עזר ארוך כמעט לא עולה הקשר עד שצריך אותו. ראה [skills](/article/claude-code/skills).

### Subagents — עוזרים בהקשר משלהם

עוזרים מתמחים ב-`.claude/agents/`, כל אחד רץ בחלון הקשר משלו עם סט כלים והרשאות משלו. מצוינים למשימות שקוראות הרבה קבצים — החקירה קורית בהקשר הנפרד שלהם ולא מזהמת את השיחה הראשית. ראה [sub-agents](/article/claude-code/sub-agents).

### Plugins — חבילות מוכנות

```txt
/plugin
```

מדפדפים ב-marketplace ומתקינים חבילות שמאגדות skills, hooks, subagents ו-MCP servers ביחידה אחת. ראה [plugins-guide](/article/claude-code/plugins-guide).

---

## חלק 6 — נהל את הסשן

השיחות ב-Claude Code עקביות והפיכות. נצל זאת לטובתך.

### תקן מוקדם

- `Esc` — עוצר את Claude באמצע פעולה; ההקשר נשמר, אז אפשר לכוון מחדש.
- `Esc + Esc` או `/rewind` — פותח תפריט שחזור למצב קוד/שיחה קודם. ראה [slash-rewind](/article/claude-code/slash-rewind).
- "undo that" — Claude מבטל את השינויים שלו.
- `/clear` — מאפס הקשר בין משימות לא קשורות.

אם תיקנת את Claude יותר מפעמיים על אותו עניין בסשן אחד, ההקשר כבר מזוהם בניסיונות כושלים. `/clear` ופרומפט טוב יותר כמעט תמיד עדיפים על סשן ארוך עם תיקונים מצטברים.

### נהל הקשר אגרסיבית

- `/clear` — מאפס לגמרי בין משימות. ראה [slash-compact-clear](/article/claude-code/slash-compact-clear).
- `/compact <הוראות>` — עיבוי ממוקד, למשל `/compact Focus on the API changes`.
- `/btw` — שאלת צד שהתשובה עליה לא נכנסת להיסטוריית השיחה, כך שתוכל לבדוק פרט בלי להגדיל הקשר.
- מעקב שוטף אחרי צריכה ב-[slash-context-cost](/article/claude-code/slash-context-cost).

### Subagents לחקירה

```txt
use subagents to investigate how our authentication system handles token
refresh, and whether we have any existing OAuth utilities I should reuse
```

הסוכן חוקר בהקשר נפרד ומחזיר סיכום בלבד, ושומר את השיחה הראשית נקייה למימוש.

### Checkpoints

כל פרומפט יוצר checkpoint אוטומטי. דרך `/rewind` אפשר לשחזר שיחה בלבד, קוד בלבד, או את שניהם — וה-checkpoints נשמרים בין סשנים. שים לב: זה "undo מקומי" לשינויים של Claude בלבד, **לא תחליף ל-git**.

### המשך שיחות

```bash
claude --continue
claude --resume
```

`--continue` ממשיך את הסשן האחרון, `--resume` בוחר מרשימה. תן שמות תיאוריים עם `/rename` (למשל `oauth-migration`) והתייחס לסשנים כמו ל-branches — לכל זרם עבודה הקשר עקבי משלו.

---

## חלק 7 — אוטומציה וסקייל

אחרי שאתה יעיל עם Claude אחד, אפשר להכפיל פלט עם סשנים מקבילים, מצב לא-אינטראקטיבי ודפוסי fan-out.

### מצב לא-אינטראקטיבי

`claude -p "prompt"` מריץ את Claude בלי סשן — מתאים ל-CI, pre-commit hooks וסקריפטים. הפורמטים `--output-format json` או `stream-json` מאפשרים לנתח את הפלט תכנותית.

```bash
claude -p "List all API endpoints" --output-format json
```

### כמה סשנים במקביל

- **Worktrees** — checkouts מבודדים ב-git כך שהעריכות לא מתנגשות. ראה [worktrees](/article/workflows/worktrees).
- **אפליקציית הדסקטופ** — ניהול ויזואלי של כמה סשנים מקומיים, כל אחד ב-worktree משלו.
- **Claude Code on the web** — סשנים על תשתית ענן מנוהלת ב-VMs מבודדים.
- **Agent teams** — תיאום אוטומטי בין סשנים עם רשימת משימות משותפת והודעות (ניסיוני, כבוי כברירת מחדל).

### דפוס Writer/Reviewer

סשן אחד כותב, סשן שני בהקשר טרי סוקר. הקשר טרי מפחית הטיה כלפי הקוד שזה עתה נכתב, כי הסוקר לא ראה את ההיגיון שהוביל לשינוי.

### Fan-out על פני קבצים

למיגרציה גדולה — לולאה על `claude -p` לכל קובץ, עם `--allowedTools` לתיחום הרשאות בריצה לא-מפוקחת.

```bash
for file in $(cat files.txt); do
  claude -p "Migrate $file from React to Vue. Return OK or FAIL." \
    --allowedTools "Edit,Bash(git commit *)"
done
```

הרץ קודם על 2-3 קבצים, חדד את הפרומפט לפי מה שמשתבש, ואז הפעל על הסט המלא. פירוט המצב הלא-אינטראקטיבי ב-[headless](https://code.claude.com/docs/en/headless).

### Auto mode לריצה רציפה

```bash
claude --permission-mode auto -p "fix all lint errors"
```

מודל מסווג ברקע בודק כל פקודה לפני הרצה, חוסם הסלמת הרשאות ותשתית לא מוכרת ומאפשר לעבודה שגרתית להמשיך בלי אישורים.

### סקירה אדוורסרית

subagent בהקשר טרי סוקר את ה-diff מול PLAN.md ומדווח פערים:

```txt
Use a subagent to review the rate limiter diff against PLAN.md. Check that
every requirement is implemented, the listed edge cases have tests, and
nothing outside the task's scope changed. Report gaps, not style preferences.
```

הזהר: סוקר שהתבקש למצוא פערים כמעט תמיד ימצא משהו, גם כשהעבודה תקינה — וזה מוביל ל-over-engineering. בקש ממנו רק פערים שפוגעים בנכונות או בדרישות, והתייחס לשאר כאופציונלי.

---

## חלק 8 — מלכודות נפוצות

- **"סשן כיור המטבח"** — מתחילים במשימה אחת, שואלים משהו לא קשור, חוזרים לראשונה, וההקשר מלא במידע לא רלוונטי. תיקון: `/clear` בין משימות.
- **תיקון חוזר ונשנה** — מתקנים, עדיין שגוי, מתקנים שוב, וההקשר מזוהם בגישות כושלות. תיקון: אחרי שני תיקונים כושלים — `/clear` ופרומפט התחלתי טוב יותר שמשלב את מה שלמדת.
- **CLAUDE.md נפוח** — אם הוא ארוך מדי, Claude מתעלם מחצי ממנו כי חוקים חשובים אובדים ברעש. תיקון: גזום ללא רחם; מה ש-Claude כבר עושה נכון בלי ההוראה — מחק או הפוך ל-hook.
- **פער trust-then-verify** — Claude מייצר מימוש משכנע שלא מטפל ב-edge cases. תיקון: תמיד ספק אימות (טסטים, סקריפטים, צילומי מסך). אם אי אפשר לאמת — אל תשלח.
- **חקירה אינסופית** — מבקשים "לחקור" משהו בלי לתחם, ו-Claude קורא מאות קבצים וממלא את ההקשר. תיקון: תחם בצמצום, או השתמש ב-subagents כך שהחקירה לא תאכל את ההקשר הראשי.

---

## סיום — פתח אינטואיציה

הדפוסים האלה הם נקודות פתיחה, לא חוקי ברזל. לפעמים נכון **לתת** להקשר להצטבר, כי אתה עמוק בבעיה אחת וההיסטוריה יקרה. לפעמים נכון לדלג על תכנון, כי המשימה חקרנית. לפעמים פרומפט מעורפל בכוונה הוא בדיוק הנכון, כי אתה רוצה לראות איך Claude מפרש את הבעיה לפני שאתה מצמצם אותה.

שים לב למה שעובד. כשהפלט מצוין — שים לב למה עשית: מבנה הפרומפט, ההקשר שנתת, המצב שהיית בו. כשהוא מתקשה — שאל למה. עם הזמן תפתח אינטואיציה ששום מדריך לא לוכד.

---

## מקורות רשמיות

כל הכתובות אומתו מול התיעוד החי של Anthropic בתאריך הבדיקה.

- שיטות עבודה מומלצות: https://code.claude.com/docs/en/best-practices
- מצבי הרשאה / Plan Mode: https://code.claude.com/docs/en/permission-modes
- CLAUDE.md וזיכרון: https://code.claude.com/docs/en/memory
- Hooks: https://code.claude.com/docs/en/hooks
- Skills: https://code.claude.com/docs/en/skills
- Subagents: https://code.claude.com/docs/en/sub-agents
- MCP: https://code.claude.com/docs/en/mcp
- Plugins: https://code.claude.com/docs/en/plugins
- Worktrees: https://code.claude.com/docs/en/worktrees
- `/goal`: https://code.claude.com/docs/en/goal
- Checkpointing: https://code.claude.com/docs/en/checkpointing
- מצב לא-אינטראקטיבי: https://code.claude.com/docs/en/headless
- Agent teams: https://code.claude.com/docs/en/agent-teams
- Building Effective AI Agents (מחקר): https://www.anthropic.com/research/building-effective-agents
