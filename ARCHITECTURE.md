נוצר ע"י skill:architecture ב-2026-07-29 · commit 880a577

# ARCHITECTURE — האקדמיה של קלוד

## TL;DR

אתר לימוד בעברית (RTL) על Claude Code: אפליקציית Next.js סטטית-ברובה שמרנדרת קורפוס של 102 מאמרי Markdown מ-`knowledge-base/`, מאורגנים בשש "משימות" (start / daily / code / automate / spec / advanced). מנוע התוכן כפול: זרימת pull ידנית (triage → publish) וצינור push שבועי אוטומטי (GitHub Actions) שסורק את התיעוד הרשמי, כותב מאמרים במודל תוכן מלא, ומתמזג ל-main רק אחרי build ירוק ושער אימות-מקורות על הקורפוס כולו. "הצעד הבא" בכל מאמר לימוד מחושב ב-build מ-`mission`+`pathOrder` — מקור אמת אחד, בלי שדה `next` שמור (PR ‏#57).

## Stack

| שכבה | טכנולוגיה | גרסה |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React / React DOM | 19.2.3 |
| שפה | TypeScript | ^5 |
| עיצוב | Tailwind CSS (‏@tailwindcss/postcss) | ^4 |
| פרסינג תוכן | gray-matter | ^4.0.3 |
| מונה צפיות | @upstash/redis | ^1.38.0 |
| אנליטיקס | @vercel/analytics | ^2.0.1 |
| Lint | ESLint + eslint-config-next | ^9 / 16.1.6 |
| CI/CD | GitHub Actions | 4 workflows |

סקריפטים ב-`package.json`: `dev`, `build`, `start`, `lint`.

## מפת תיקיות

```
claude-academy/
├── app/                    # App Router — 13 עמודים + 3 API routes
├── components/             # 7 קומפוננטות שיתופיות (1,000 שורות עם page/layout הראשיים)
│   ├── CommandsTable.tsx   # 307 ש' — טבלת הפקודות (מיון נגיש במקלדת)
│   ├── MarkdownContent.tsx # 187 ש' — רנדור ה-Markdown המאושר בלבד
│   └── SearchBar, SiteNav, ViewCounter, WhatsNew, CopyButton
├── lib/                    # שכבת דומיין — 3 קבצים (368 שורות)
│   ├── knowledge.ts        # 331 ש' — מודל המאמר, טעינה, getNextArticle
│   ├── seo.ts              # 15 ש'
│   └── admin.ts            # 22 ש'
├── knowledge-base/         # 102 מאמרי Markdown בשש תיקיות:
│   ├── claude-code/  60    ├── git/          15
│   ├── workflows/    12    ├── guides/        7
│   ├── scheduling/    5    └── project-docs/  3
├── data/changelog.json     # פיד "מה חדש" — מתעדכן בכל ריצה שבועית עם NEW/CHANGED
├── scripts/                # 7 סקריפטים: verify-sources.mjs (296 ש'), impact-scan.mjs (56 ש'),
│                           # staleness-report.mjs, write-frontmatter.mjs, audit-frontmatter.ts,
│                           # stop-gate.sh, test-verify-sources.sh
├── tests/gate/             # 5 קבצי fixture לשער האימות (README + 4 מקרי קצה)
├── .github/workflows/      # 4: weekly-academy-update (163 ש'), weekly-update-watchdog (142 ש'),
│                           # verify-corpus (33 ש'), staleness-report (35 ש')
├── .claude/skills/         # 3 סקילים: triage (44 ש'), publish (50 ש'), architecture (54 ש')
├── .claude/academy-update-spec.md  # 115 ש' — ה-spec המחייב של הצינור השבועי
├── source-exceptions.json  # חריג allowlist יחיד (github.com, ‏recheck: 2026-10-29)
├── public/design-gallery/  # 50 קבצים
└── docs/content-model-plan.md
```

סה"כ 33 קבצי TS/TSX ב-`app/`+`components/`+`lib/`.

## נקודות כניסה

**עמודים (app/):** `/` (page.tsx, ‏120 ש' — פתיח עם `text-hero`), `/a/[slug]` (240 ש' — עמוד מאמר), `/m/[mission]` (130 ש' — עמוד משימה), `/wizard` (1,167 ש'), `/start`, `/guides`, `/tools`, `/commands-list`, `/admin`, `/optout`. בנוסף `layout.tsx`, ‏`sitemap.ts`, ‏`robots.ts`, ‏`manifest.ts`, ‏`opengraph-image.tsx`.

**API routes:** `/api/views` (מונה צפיות ב-Upstash Redis, ‏`Redis.fromEnv()`), `/api/admin/login`, `/api/admin/logout`.

**סקריפטים:** `verify-sources.mjs` (שער המקורות; בלי ארגומנטים = הקורפוס המלא), `impact-scan.mjs` (סריקת השפעת גרסאות), `staleness-report.mjs`, ‏`write-frontmatter.mjs`, ‏`audit-frontmatter.ts`.

**Workflows:** weekly-academy-update (‏cron ‏`17 6 * * SAT`), weekly-update-watchdog (יומי `41 7 * * *`), verify-corpus (‏`17 6 * * 1`, לפני הריצה השבועית), staleness-report (חודשי `23 6 1 * *`). כולם עם `workflow_dispatch`.

## שכבות

- **UI** — `components/` + עמודי `app/`. רנדור בלבד; אין גישה ל-fs מחוץ ל-lib.
- **דומיין** — `lib/knowledge.ts` הוא הלב: טיפוס `Article` ‏(mission/level/type/tool/origin/pathOrder/nextOverride/prerequisites), טעינה עם ברירות מחדל בטוחות (`MISSION_BY_CATEGORY`), ו-`getNextArticle`. ‏`lib/admin.ts` (סשן אדמין), `lib/seo.ts`.
- **תוכן** — `knowledge-base/` (frontmatter במודל התוכן) + `data/changelog.json`.
- **אוטומציה** — `.github/workflows/` + `scripts/` + `.claude/skills/` + ה-spec ב-`.claude/academy-update-spec.md`.

## זרימות נתונים

### חישוב "הצעד הבא" (PR ‏#57)
`next` אינו נשמר כשדה frontmatter. ‏`getNextArticle` ‏(lib/knowledge.ts:66) מחשב אותו ב-build: ‏`next_override` מנצח (חריגים בין-משימתיים בלבד); אחרת — המאמר הבא באותה `mission` לפי מיון `pathOrder` ‏(שורה 61: `sort((a,b) => (a.pathOrder ?? 999) - (b.pathOrder ?? 999))`); לאחרון במשימה אין next (העמוד מקשר לעמוד המשימה); ל-reference אין next כלל. `pathOrder` קיים ב-71 מאמרי לימוד (31 מאמרי reference מחוץ לשרשרת, לפי ה-spec — reference בלי mission ובלי pathOrder). מאמר חדש נכנס בסוף המשימה שלו: max+1.

### הזרימה הנכנסת (pull) — פריט שהמשתמש מזין
skill:triage (בחינה בלבד, לא כותב תוכן) → verdict → אישור אנושי → skill:publish כותב את המאמר ופותח PR של תוכן → מיזוג ידני. הבקרה האנושית מלאה: אדם מחליט גם על הקבלה וגם על המיזוג.

### ה-pipeline השבועי (push) — אוטומטי
weekly-academy-update.yml (שבת 06:17 UTC): איסוף מקורות רשמיים ב-curl → אינדקס dedup לפי `source_url` מנורמל → סיווג NEW/CHANGED → מיפוי קטגוריה → כתיבת קבצים עם **frontmatter מלא של מודל התוכן** (mission, level, type, tool, origin, timeMinutes, pathOrder, related, status: needs-review) לפי `.claude/academy-update-spec.md`. **אסור בהחלט לכתוב `last_reviewed`** — השדה ידני ("אדם קרא ואימת טענות"); מאמר אוטומטי נולד בלעדיו ומוצג באתר עם התג "נוצר אוטומטית — טרם נסקר" (app/a/[slug]/page.tsx:202). בהמשך ה-workflow: `impact-scan.mjs --versions 3` שכותב/מעדכן issue ‏"סריקת השפעה" (שורות 122–127), שער אימות-מקורות על **הקורפוס המלא** — "מאמר חדש לא ימוזג על ריקבון קיים" — ואז auto-merge ‏(squash + מחיקת ענף) רק על build ירוק + שער עובר; כישלון שער מגיב על ה-PR וחוסם.

weekly-update-watchdog.yml (יומי): מגלה ריצה שבועית שלא קרתה/נתקעה, ומריץ גם הוא את `verify-sources.mjs` על הקורפוס המלא (שורה 85) לפני מיזוג. התראות כשל — GitHub-native (בלי SMTP).

שתי הזרימות נפגשות ב-`knowledge-base/`: ה-pull עם אדם בכל צומת, ה-push עם אדם רק בדיעבד (תג "טרם נסקר" + תור התיישנות + verify-corpus שבועי).

## גבולות ותלויות

- **חיצוניות:** GitHub Actions (כל האוטומציה), מקורות תוכן רק מ-allowlist ‏(`ALLOWED_HOSTS` ב-verify-sources.mjs: ‏code.claude.com, docs.claude.com, docs.anthropic.com, platform.claude.com, git-scm.com; השוואת hostname מדויקת, https בלבד — הגנת SSRF), Upstash Redis (מונה צפיות, degrade חינני כשאין env), Vercel (hosting + analytics).
- **חריגי allowlist:** `source-exceptions.json` — רשומה מחייבת `reason` + `recheck` בפורמט תאריך; **recheck שפג מפיל את השער** (verify-sources.mjs:205) — אין "חריג לנצח". כרגע חריג יחיד (github.com למאמר agency-agents, עד 2026-10-29).
- **פנימיים:** UI קורא תוכן רק דרך `lib/knowledge.ts`; הצינור השבועי כותב רק ב-scope (claude-code, scheduling, workflows, guides, project-docs — לא git), לא נוגע ב-mission/pathOrder/origin/last_reviewed של קבצים קיימים, ולא יוצר קטגוריות.

## צמתים קריטיים (SPOF)

1. **lib/knowledge.ts** (331 ש') — כל טעינת תוכן, הטקסונומיה, וחישוב next עוברים בו.
2. **.claude/academy-update-spec.md** (115 ש') — ה"חוקה" של הסוכן השבועי; שגיאה בו מוכפלת בכל ריצה.
3. **scripts/verify-sources.mjs** (296 ש') — השער היחיד בין תוכן אוטומטי ל-main.
4. **weekly-academy-update.yml + weekly-update-watchdog.yml** — צמד ה-auto-merge; באג בהם ממזג ל-main בלי אדם.
5. **מוסכמת slug שטוחה** (`/a/<slug>`) — התנגשות slug בין קטגוריות היא התנגשות URL אמיתית; נבדקת ידנית בצינור (`uniq -d`).

## החלטות ארכיטקטוניות

- **next מחושב, לא שמור** (#57): `mission`+`pathOrder` כמקור אמת יחיד; `next_override` לחריגים בלבד. מבטל דריפט של שרשראות ידניות.
- **טקסונומיית משימות בשפת הקורא** ("להתחיל מאפס", "לעבוד יומיום"…) — לא בשם הכלי; reference מוחרג מהמשימות אל טבלת הפקודות.
- **הפרדת `last_verified` (אוטומטי) מ-`last_reviewed` (ידני)** — התיישנות מכוונת: מאמר אוטומטי נשאר "טרם נסקר" עד שאדם חותם.
- **שער על הקורפוס המלא, לא על ה-diff** — בשני מסלולי המיזוג האוטומטי; ריקבון קיים חוסם תוכן חדש.
- **allowlist מקורות + חריגים עם תפוגה** — תוכן רק מתיעוד רשמי; כל חריגה מתועדת ופגת-תוקף.
- **Auto-merge עם watchdog** — self-healing: הריצה השבועית לא תלויה בזמינות אדם, והכשל מדווח ב-GitHub-native.
- **תוכן כקבצי Markdown ב-git** — אין DB לתוכן; ה-PR הוא יחידת הביקורת.

## פערים וסיכונים

- **אין בדיקות אוטומטיות ל-lib/knowledge.ts** — `tests/gate/` מכסה רק את שער המקורות; `getNextArticle` והטעינה לא מכוסים (סקריפט `test` אף לא קיים ב-package.json).
- **איכות תוכן אוטומטי** — שער המקורות בודק טענות מול המקור, לא הזיה סמנטית; הביקורת האנושית בדיעבד (ר' זיכרון: הלוזינציות עוברות את שער ה-build).
- **`app/wizard/page.tsx` בן 1,167 שורות** — קובץ עמוד יחיד גדול פי ~5 מכל השאר; מועמד לפירוק.
- **תלות ב-cron של GitHub** — ריצות schedule ידועות כמתעכבות/נבלעות; ה-watchdog מפצה אך גם הוא cron.
- **31 מאמרי reference בלי pathOrder לפי-תכן** — תקין, אבל מאמר לימוד שנשמט לו pathOrder ייפול לסוף המיון (‏`?? 999`) בשקט, בלי אזהרת build.
- **מונה הצפיות תלוי env של Upstash** — נכשל בשקט (by design), אין ניטור על היעדר הנתונים.


## חוב ידוע — לא לתקן בהמצאה
(סעיף זה נכתב בהוראת הבעלים 2026-07-31; בעת regeneration של המסמך ע"י
skill:architecture יש להעתיקו כלשונו — הוא הכרעת-מוצר, לא ממצא recon.)

- **‏image חסר ב-JSON-LD של מאמרים** — במכוון. תמונת OG פר-מאמר תיעשה יחד
  עם הטמעת הפונט העברי ב-opengraph-image, בחבילת הפייסבוק. אין להוסיף
  תמונה גנרית בינתיים.
- **‏author.url חסר** — במכוון. אין דף מחבר להצביע עליו; החוב ייסגר ביום
  שדף המחבר ייכתב. אין להמציא כתובת.
