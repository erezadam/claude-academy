---
title: "Routines — אוטומציה בענן עם Claude Code"
category: scheduling
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/routines
related: [scheduled-tasks, dynamic-workflows, /schedule]
---

Routine הוא קונפיגורציית Claude Code שמורה: prompt, repository אחד או יותר, וסט connectors — ארוז פעם אחת ומופעל אוטומטית. Routines רצים על תשתית ענן מנוהלת של Anthropic, ולכן הם ממשיכים לפעול גם כשהלפטופ סגור. הם מעמידים את Claude Code על טייס אוטומטי: ריצה לפי לוח זמנים, ריצה בתגובה לקריאת API, או ריצה בתגובה לאירועי GitHub.

Routines נמצאים בתצוגה מקדימה למחקר (research preview) — ההתנהגות, המגבלות ופני ה-API עשויים להשתנות. הם זמינים בתוכניות Pro, Max, Team ו-Enterprise, כשאפשרות Claude Code on the web מופעלת.

## מה זה עושה / למה זה שימושי

routine יחיד יכול לשלב מספר טריגרים, ויש שלושה סוגים. **Scheduled** רץ בקצב חוזר — שעתי, יומי, ימי חול או שבועי — או פעם אחת בזמן עתידי ספציפי. **API** מופעל לפי דרישה על ידי שליחת HTTP POST לנקודת קצה ייחודית לכל routine, עם bearer token. **GitHub** רץ אוטומטית בתגובה לאירועי repository כגון pull requests או releases.

לדוגמה, routine ל-review של PR יכול לרוץ לילי, להיות מופעל מסקריפט deploy, וגם להגיב לכל PR חדש — הכל ב-routine אחד.

הטבלה הבאה מסכמת תרחישי שימוש מהמקור, כשכל אחד משלב סוג טריגר עם עבודה שמתאימה ל-routines: לא מפוקחת, ניתנת לחזרה, וקשורה לתוצאה ברורה.

| תרחיש | טריגר | מה ה-routine עושה |
|---|---|---|
| תחזוקת backlog | scheduled (כל לילת עבודה) | קורא issues שנפתחו מאז הריצה האחרונה דרך connector, מדביק תוויות, מקצה בעלים לפי אזור הקוד, ומפרסם סיכום ל-Slack |
| טריאז' התראות | API | כלי הניטור קורא לנקודת הקצה כשסף שגיאה נחצה ומעביר את גוף ההתראה כ-`text`; ה-routine מושך stack trace, מתאם עם commits אחרונים, ופותח draft PR עם תיקון מוצע וקישור חזרה להתראה |
| review קוד מותאם | GitHub (`pull_request.opened`) | מפעיל את ה-checklist של הצוות, משאיר הערות inline לאבטחה, ביצועים וסגנון, ומוסיף הערת סיכום |
| אימות deploy | API | ה-pipeline של CD קורא לנקודת הקצה אחרי כל deploy בפרודקשן; ה-routine מריץ בדיקות עשן, סורק לוגים לאיתור רגרסיות, ומפרסם go/no-go לערוץ ה-release |
| Docs drift | scheduled (שבועי) | סורק PRs שמוזגו מאז הריצה האחרונה, מסמן תיעוד שמפנה ל-APIs שהשתנו, ופותח PRs לעדכון מול ה-repository של התיעוד |
| Library port | GitHub (`pull_request.closed`, מסונן ל-PRs שמוזגו) | מעביר את השינוי ל-SDK מקביל בשפה אחרת ופותח PR תואם, ושומר על שתי הספריות מסונכרנות |

## איך משתמשים

אפשר ליצור routine מהרשת בכתובת `claude.ai/code/routines`, מאפליקציית Desktop, או מה-CLI עם `/schedule`. כל שלושת הממשקים כותבים לאותו חשבון ענן — routine שנוצר באחד מהם מופיע מיד באחרים. באפליקציית Desktop בוחרים **Routines** בסרגל הצד, ואז **New routine**, ובוחרים **Remote**; בחירה ב-**Local** יוצרת Desktop scheduled task שרץ על המכונה המקומית במקום בענן.

Routines רצים אוטונומית כ-sessions מלאים של Claude Code בענן: אין בורר מצב הרשאות ואין prompts אישור במהלך ריצה. ה-session יכול להריץ פקודות shell, להשתמש ב-skills שנשמרו ב-repository המשובט, ולקרוא ל-connectors שכללת. מה שה-routine יכול להגיע אליו נקבע על ידי ה-repositories שבחרת והגדרת ה-branch-push שלהם, גישת הרשת ומשתני הסביבה של ה-environment, וה-connectors שכללת. מומלץ לצמצם כל אחד מאלה למה שה-routine באמת צריך.

Routines שייכים לחשבון claude.ai האישי שלך. הם אינם משותפים עם חברי צוות, והם נספרים כנגד מכסת הריצות היומית של חשבונך. כל פעולה שה-routine מבצע דרך זהות ה-GitHub המחוברת או דרך connectors מופיעה כפעולה שלך: commits ו-PRs נושאים את משתמש ה-GitHub שלך, והודעות Slack, כרטיסי Linear ופעולות connector אחרות משתמשות בחשבונות המקושרים שלך.

### יצירה מ-CLI

הרצת `/schedule` בכל session יוצרת routine מתוזמן באופן שיחתי. אפשר גם להעביר תיאור ישירות — ל-routine חוזר או ל-routine חד-פעמי. Claude עובר על אותו מידע שטופס הרשת אוסף, ואז שומר את ה-routine לחשבון.

```text
/schedule daily PR review at 9am
```

```text
/schedule clean up feature flag in one week
```

`/schedule` ב-CLI יוצר routines מתוזמנים בלבד. כדי להוסיף טריגר API או GitHub, יש לערוך את ה-routine ברשת ב-`claude.ai/code/routines`.

ה-CLI תומך גם בניהול routines קיימים: `/schedule list` להצגת כל ה-routines, `/schedule update` לשינוי אחד, ו-`/schedule run` להפעלתו מיד.

### טריגר scheduled

טריגר scheduled מריץ את ה-routine בקצב חוזר, או פעם אחת בזמן עתידי. בוחרים תדירות מוגדרת-מראש במקטע **Select a trigger**: hourly, daily, weekdays או weekly. הזמנים מוזנים באזור הזמן המקומי שלך ומומרים אוטומטית, כך שה-routine רץ בשעת השעון הזו ללא קשר למיקום תשתית הענן.

ריצות עשויות להתחיל כמה דקות אחרי הזמן המתוזמן בגלל stagger. ההיסט עקבי לכל routine.

עבור אינטרבל מותאם כמו כל שעתיים או הראשון לכל חודש, בוחרים את ה-preset הקרוב ביותר בטופס, ואז מריצים `/schedule update` ב-CLI כדי להגדיר ביטוי cron ספציפי. האינטרבל המינימלי הוא שעה אחת; ביטויים שרצים בתדירות גבוהה יותר נדחים.

### ריצה חד-פעמית

לוח חד-פעמי מפעיל את ה-routine פעם אחת בזמן ספציפי — להזכיר לעצמך משהו בהמשך השבוע, לפתוח PR ניקיון אחרי שהרצה מסתיימת, או להתחיל משימת המשך כששינוי upstream נוחת. אחרי שה-routine נורה הוא משבית את עצמו אוטומטית, וה-UI ברשת מסמן אותו כ-**Ran**. כדי להריץ שוב, יש לערוך את ה-routine ולהגדיר זמן חד-פעמי חדש.

יוצרים ריצה חד-פעמית מה-CLI על ידי תיאור הזמן בשפה טבעית. Claude פותר את הביטוי מול הזמן הנוכחי ומאשר את ה-timestamp המוחלט לפני שמירה.

```text
/schedule tomorrow at 9am, summarize yesterday's merged PRs
```

```text
/schedule in 2 weeks, open a cleanup PR that removes the feature flag
```

אותה המרה מקומית-ל-UTC כמו בלוחות חוזרים חלה גם על timestamps חד-פעמיים. ריצות חד-פעמיות אינן נספרות כנגד מכסת הריצות היומית; הן צורכות את צריכת המנוי הרגילה כמו כל session אחר.

### טריגר API

טריגר API נותן ל-routine נקודת קצה HTTP ייעודית. שליחת POST לנקודת הקצה עם ה-bearer token של ה-routine מתחילה session חדש ומחזירה כתובת session. משתמשים בזה כדי לחבר את Claude Code למערכות התראות, pipelines של deploy, כלים פנימיים, או כל מקום שבו אפשר לבצע בקשת HTTP מאומתת.

טריגרי API נוספים ל-routine קיים מהרשת — ה-CLI אינו יכול כרגע ליצור או לבטל tokens. בטופס Edit routine גוללים למקטע **Select a trigger**, לוחצים **Add another trigger**, ובוחרים **API**. ה-modal מציג את ה-URL ופקודת curl לדוגמה. מעתיקים את ה-URL, לוחצים **Generate token** ומעתיקים את ה-token מיד — ה-token מוצג פעם אחת בלבד ואינו ניתן לאחזור מאוחר יותר, ולכן יש לאחסן אותו במקום מאובטח. כל routine מחזיק token משלו, מוגבל להפעלת אותו routine בלבד; לסבב או לבטל, חוזרים לאותו modal ולוחצים **Regenerate** או **Revoke**.

שולחים בקשת POST לנקודת הקצה `/fire` עם ה-bearer token בכותרת `Authorization`. גוף הבקשה מקבל שדה `text` אופציונלי להקשר ספציפי לריצה, כמו גוף התראה או לוג כושל, המועבר ל-routine לצד ה-prompt השמור. הערך הוא טקסט חופשי ואינו מנותח: אם שולחים JSON או payload מובנה אחר, ה-routine מקבל אותו כמחרוזת מילולית.

```bash
curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_01ABCDEFGHJKLMNOPQRSTUVW/fire \
  -H "Authorization: Bearer sk-ant-oat01-xxxxx" \
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"text": "Sentry alert SEN-4521 fired in prod. Stack trace attached."}'
```

בקשה מוצלחת מחזירה גוף JSON עם מזהה ה-session החדש וה-URL:

```json
{
  "type": "routine_fire",
  "claude_code_session_id": "session_01HJKLMNOPQRSTUVWXYZ",
  "claude_code_session_url": "https://claude.ai/code/session_01HJKLMNOPQRSTUVWXYZ"
}
```

פותחים את ה-URL בדפדפן כדי לצפות בריצה בזמן אמת, לבחון שינויים, או להמשיך את השיחה ידנית. נקודת הקצה `/fire` יוצאת תחת כותרת ה-beta `experimental-cc-routine-2026-04-01`; צורות הבקשה והתשובה, מגבלות הקצב וסמנטיקת ה-token עשויות להשתנות בזמן שהפיצ'ר בתצוגה מקדימה. נקודת הקצה `/fire` זמינה למשתמשי claude.ai בלבד ואינה חלק מ-API של Claude Platform.

### טריגר GitHub

טריגר GitHub מתחיל session חדש אוטומטית כשאירוע תואם מתרחש ב-repository מחובר. כל אירוע תואם מתחיל session משלו — שני עדכוני PR מייצרים שני sessions עצמאיים. במהלך ה-research preview, אירועי webhook של GitHub כפופים למגבלות שעתיות לכל routine ולכל חשבון; אירועים מעבר למגבלה נזרקים עד שהחלון מתאפס.

טריגרי GitHub מוגדרים מה-UI ברשת בלבד. בטופס Edit routine גוללים ל-**Select a trigger**, לוחצים **Add another trigger**, ובוחרים **GitHub event**. ה-Claude GitHub App חייב להיות מותקן על ה-repository — הגדרת הטריגר מבקשת להתקין אותו אם הוא לא מותקן עדיין. שימו לב: הרצת `/web-setup` ב-CLI מעניקה גישה ל-repository עבור שיבוט, אך אינה מתקינה את ה-Claude GitHub App ואינה מאפשרת מסירת webhooks. לבסוף בוחרים את ה-repository, אירוע מתוך הרשימה הנתמכת, ומסננים אופציונליים.

טריגרי GitHub יכולים להירשם לאחת משתי קטגוריות האירועים שבטבלה. בכל קטגוריה אפשר לבחור action ספציפי, כמו `pull_request.opened`, או להגיב לכל ה-actions בקטגוריה.

| אירוע | מתרחש כאשר |
|---|---|
| Pull request | PR נפתח, נסגר, מוקצה, מתויג, מסונכרן, או מעודכן בדרך אחרת |
| Release | release נוצר, פורסם, נערך, או נמחק |

### סינון pull requests

מסננים מצמצמים אילו PRs מתחילים session חדש. כל תנאי הסינון חייבים להתקיים כדי שה-routine יופעל. שדות הסינון הזמינים:

| מסנן | מתאים |
|---|---|
| Author | שם המשתמש ב-GitHub של מחבר ה-PR |
| Title | טקסט כותרת ה-PR |
| Body | טקסט תיאור ה-PR |
| Base branch | ה-branch שה-PR מכוון אליו |
| Head branch | ה-branch שממנו ה-PR מגיע |
| Labels | התוויות שהוחלו על ה-PR |
| Is draft | האם ה-PR במצב טיוטה |
| Is merged | האם ה-PR מוזג |

כל מסנן מזווג שדה עם אופרטור: equals, contains, starts with, is one of, is not one of, או matches regex. האופרטור `matches regex` בודק את ערך השדה כולו, לא תת-מחרוזת בתוכו. כדי להתאים כותרת שמכילה `hotfix`, כותבים `.*hotfix.*`; בלי ה-`.*` המקיף, המסנן מתאים רק לכותרת שהיא בדיוק `hotfix`. להתאמת תת-מחרוזת מילולית ללא תחביר regex, משתמשים ב-`contains`.

## ניהול routines

לחיצה על routine ברשימה פותחת את דף הפרטים שלו. הדף מציג את ה-repositories, ה-connectors, ה-prompt, הלו"ז, ה-API tokens, טריגרי ה-GitHub, ורשימת ריצות העבר. לחיצה על ריצה כלשהי פותחת אותה כ-session מלא, שבו אפשר לראות מה Claude עשה, לבחון שינויים, ליצור PR, או להמשיך את השיחה.

חשוב: סטטוס ירוק ברשימת הריצות פירושו שה-session התחיל ויצא ללא שגיאת תשתית. הוא אינו אומר שהמשימה ב-prompt הצליחה. יש לפתוח את הריצה ולקרוא את ה-transcript כדי לוודא מה Claude באמת עשה. בקשות רשת חסומות, כלי connector חסרים, וכשלים ברמת המשימה כולם מופיעים שם, ולא במחוון הסטטוס.

מדף הפרטים אפשר ללחוץ **Run now** כדי להתחיל ריצה מיד, להשתמש ב-toggle במקטע **Repeats** כדי להשהות או לחדש את הלו"ז, ללחוץ על אייקון העיפרון כדי לפתוח **Edit routine** ולשנות שם, prompt, repositories, environment, connectors או טריגרים, או ללחוץ על אייקון המחיקה כדי להסיר את ה-routine. sessions קודמים שנוצרו על ידי ה-routine נשארים ברשימת ה-sessions.

### Repositories והרשאות branch

Routines צריכים גישת GitHub לשיבוט repositories. כשיוצרים routine מה-CLI עם `/schedule`, Claude בודק אם החשבון מחובר ל-GitHub ומבקש להריץ `/web-setup` אם לא. כל repository שמוסיפים משובט בכל ריצה, ו-Claude מתחיל מה-branch ברירת המחדל של ה-repository אלא אם ה-prompt מציין אחרת.

כברירת מחדל, Claude יכול לדחוף רק ל-branches עם תחילית `claude/`. זה מונע מ-routines לשנות בטעות branches מוגנים או ארוכי-טווח. כדי להסיר את ההגבלה ל-repository ספציפי, מפעילים **Allow unrestricted branch pushes** עבורו בעת יצירה או עריכה.

### Connectors

Routines יכולים להשתמש ב-MCP connectors המחוברים שלך לקריאה וכתיבה לשירותים חיצוניים בכל ריצה — לדוגמה, routine שמטפל בבקשות תמיכה עשוי לקרוא מ-Slack וליצור issues ב-Linear. Connectors הם ה-claude.ai integrations שעל החשבון שלך. שרתי MCP שהוספת מקומית ב-CLI עם `claude mcp add` נשמרים על המכונה ולא על חשבון claude.ai, ולכן אינם מופיעים ברשימת ה-connectors; כדי להשתמש באחד מהם ב-routine, יש להוסיף אותו כ-connector ב-`claude.ai/customize/connectors`, או להצהיר עליו ב-`.mcp.json` מחויב כך שיהיה חלק מה-repository המשובט.

ביצירת routine כל ה-connectors המחוברים נכללים כברירת מחדל. יש להסיר את אלה שאינם נחוצים כדי להגביל אילו כלים זמינים ל-Claude בריצה. Claude יכול להשתמש בכל כלי מ-connector שנכלל, כולל כתיבות, בלי לבקש אישור במהלך הריצה.

### Environments וגישת רשת

כל routine רץ ב-cloud environment שמבקר גישת רשת, משתני סביבה וסקריפטי setup. ה-routine יורש את מדיניות הרשת של ה-environment בכל ריצה. סביבת ה-**Default** משתמשת בגישת רשת **Trusted**: רשימת ההיתר ברירת המחדל של package registries, APIs של ספקי ענן, container registries ודומיינים נפוצים לפיתוח נגישה, אך דומיינים שרירותיים אינם. בקשות יוצאות למארחים אחרים נכשלות עם `403` ו-`x-deny-reason: host_not_allowed`. תעבורת MCP connector מנותבת דרך שרתי Anthropic, ולכן ה-connectors שמוסיפים עובדים בלי להוסיף את המארחים שלהם ל-Allowed domains.

כדי לאפשר דומיינים נוספים, פותחים **Edit routine**, בוחרים את אייקון הענן עם שם ה-environment, פותחים את הגדרות ה-environment, ובדיאלוג **Update cloud environment** משנים את **Network access** ל-**Custom** ומזינים דומיינים ב-**Allowed domains**. מסמנים **Also include default list of common package managers** כדי לשמור את רשימת ההיתר ברירת המחדל לצד הדומיינים המותאמים, או בוחרים **Full** לגישה בלתי מוגבלת. לוחצים **Save changes**, והמדיניות החדשה חלה מהריצה הבאה.

## שימוש ומגבלות

Routines צורכים שימוש מנוי כמו sessions אינטראקטיביים. בנוסף למגבלות המנוי הרגילות, יש מכסה יומית על כמות הריצות שיכולות להתחיל לכל חשבון. אפשר לראות את הצריכה הנוכחית ואת הריצות היומיות הנותרות ב-`claude.ai/code/routines` או ב-`claude.ai/settings/usage`.

כשה-routine מגיע למכסה היומית או למגבלת השימוש של המנוי, ארגונים שהפעילו usage credits יכולים להמשיך להריץ routines ב-metered overage. בלי usage credits, ריצות נוספות נדחות עד שהחלון מתאפס. ריצות חד-פעמיות פטורות ממכסת הריצות היומית, אך צורכות את שימוש המנוי הרגיל.

אדמינים של Team ו-Enterprise יכולים להשבית routines לכל החברים בעזרת ה-toggle של Routines ב-`claude.ai/admin-settings/claude-code`. כשהאפשרות מושבתת, routines קיימים מפסיקים לרוץ והחברים אינם יכולים ליצור חדשים.

## פתרון תקלות

### `/schedule` מחזיר "Unknown command"

ה-CLI מסתיר את `/schedule` כשאחת מהדרישות שלו אינה מתקיימת. הסיבה היא בדרך כלל אחת מהבאות. אתה מאומת עם Console API key או ספק ענן כמו Bedrock, Vertex או Foundry — `/schedule` דורש התחברות מנוי claude.ai; אם `ANTHROPIC_API_KEY` או `ANTHROPIC_AUTH_TOKEN` מוגדר ב-shell, או `apiKeyHelper` מוגדר ב-`settings.json`, יש להסיר אותו תחילה. סיבה אחרת: `DISABLE_TELEMETRY`, `DO_NOT_TRACK`, `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` או `DISABLE_GROWTHBOOK` מוגדר ב-shell או בבלוק `env` של `settings.json` — אלה משביתים שליפת feature-flags ש-`/schedule` תלוי בה. סיבה נוספת: אתה בתוך session של Claude Code on the web — במקרה זה נהל routines מה-UI ברשת. ולבסוף: גרסת ה-CLI ישנה מ-v2.1.81 — יש להריץ `claude update`.

בכל מקרה אפשר ליצור ולנהל routines ב-`claude.ai/code/routines` ללא קשר לאופן שבו ה-CLI מוגדר.

### "Routines are disabled by your organization's policy"

האדמין של Team או Enterprise כנראה כיבה את ה-toggle של **Routines** ב-`claude.ai/admin-settings/claude-code`. זו הגדרת ארגון בצד השרת, ולכן אי אפשר לעקוף אותה מהקונפיגורציה המקומית. יש לפנות לאדמין ולבקש שיפעיל routines לארגון.
