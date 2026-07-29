נוצר ע"י skill:architecture ב-2026-07-29 · commit b053f73

# ARCHITECTURE — האקדמיה של קלוד

## TL;DR

אתר תוכן סטטי-ברובו בעברית (RTL) שמלמד עבודה עם Claude Code. Next.js קורא בזמן build קורפוס של 102 מאמרי Markdown מ-`knowledge-base/`, ממודלים ב-frontmatter (משימה, רמה, סוג, כלי, מקור), ומגיש אותם בציר של שש "משימות" בשפת הקורא. מנוע התוכן כפול: זרימה ידנית (triage → publish → PR) וזרימה אוטומטית שבועית (GitHub Actions → auto-merge על build ירוק + שער אימות-מקור דטרמיניסטי → watchdog יומי).

## Stack

| שכבה | טכנולוגיה | גרסה (מ-package.json) |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React / React DOM | 19.2.3 |
| שפה | TypeScript | ^5 |
| עיצוב | Tailwind CSS (v4, `@theme` tokens) | ^4 |
| פרסינג תוכן | gray-matter (frontmatter) | ^4.0.3 |
| מונה צפיות | @upstash/redis | ^1.38.0 |
| אנליטיקס | @vercel/analytics | ^2.0.1 |
| CI/אוטומציה | GitHub Actions (Node 20/22) | 4 workflows |

סקריפטים: `dev` / `build` / `start` / `lint` בלבד (אין סקריפט test או typecheck ב-package.json).

## מפת תיקיות

```
claude-academy/
├── app/                    # App Router — routes, layout, globals.css (53 שורות טוקנים)
│   ├── a/[slug]/           # עמוד מאמר בכתובת שטוחה
│   ├── m/[mission]/        # עמוד משימה (אחד משש)
│   ├── start/ guides/ tools/ commands-list/  # עמודי ציר הניווט
│   ├── wizard/ optout/ admin/                # אשף אפיון, אופט-אאוט, אדמין
│   ├── api/                # admin/login, admin/logout, views
│   └── article/ category/  # ריקות (רק .DS_Store) — הוחלפו ב-redirects
├── components/             # 7 קומפוננטות (CommandsTable 284ש', MarkdownContent 204ש', SearchBar, SiteNav, ViewCounter, WhatsNew, CopyButton)
├── lib/                    # 3 קבצים: knowledge.ts (304ש'), admin.ts (22ש'), seo.ts (15ש')
├── knowledge-base/         # 102 מאמרי .md בשש קטגוריות:
│   ├── claude-code/ (60)  git/ (15)  workflows/ (12)
│   └── guides/ (7)  scheduling/ (5)  project-docs/ (3)
├── data/changelog.json     # פיד "מה חדש" (328 שורות) — פלט חובה של הסריקה השבועית
├── scripts/                # 6: verify-sources.mjs (291ש'), audit-frontmatter.ts, staleness-report.mjs, write-frontmatter.mjs, stop-gate.sh, test-verify-sources.sh
├── tests/gate/             # 5 מקרי בוחן ל-verify-sources + README
├── .github/workflows/      # verify-corpus, staleness-report, weekly-academy-update (147ש'), weekly-update-watchdog (141ש')
├── .claude/
│   ├── skills/             # architecture, triage, publish
│   └── academy-update-spec.md  # ה-spec של העדכון השבועי (72 שורות)
├── source-exceptions.json  # חריגי allowlist מנומקים (כרגע רשומה אחת: github.com)
├── docs/content-model-plan.md
└── public/design-gallery/  # גלריית עיצוב סטטית
```

## נקודות כניסה

**Routes (Next.js):**
- `/` — עמוד הבית (`app/page.tsx`)
- `/a/[slug]` — מאמר, כתובת שטוחה; `notFound()` אם ה-slug לא קיים
- `/m/[mission]` — עמוד משימה
- `/start`, `/guides`, `/tools`, `/commands-list` — ציר הניווט (SiteNav מציג 4 פריטים: התחלה, מדריכים, פקודות, כלים)
- `/wizard`, `/optout`, `/admin`
- SEO: `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`

**Redirects (next.config.ts):** `/article/:category/:slug` → `/a/:slug` (308); `/category/git|scheduling|project-docs` → `/m/code|automate|spec`; `/category/:slug` → `/guides`; `/project-wizard.html` → `/wizard`.

**API routes:** `POST /api/admin/login`, `/api/admin/logout` (cookie `admin_auth`, טוקן מ-`lib/admin.ts`); `/api/views` — מונה INCR אטומי ב-Upstash Redis (`academy:home:views`).

**Workflows:** weekly-academy-update (שבת 06:17 UTC), weekly-update-watchdog (יומי 07:41), verify-corpus (שני 06:17), staleness-report (חודשי, 1 בחודש 06:23). כולם עם `workflow_dispatch`.

## שכבות

1. **UI** — `components/` + עמודי `app/`. אפס ערכי עיצוב בקומפוננטות — הכל מטוקנים.
2. **דומיין** — `lib/knowledge.ts` הוא הליבה: טעינת הקורפוס, טיפוסי המודל, ברירות-מחדל בטוחות, `MISSION_META`/`MISSION_ORDER`, ופיד "מה חדש". `lib/seo.ts` ו-`lib/admin.ts` קטנים ונקודתיים.
3. **תוכן** — `knowledge-base/` (מקור האמת) + `data/changelog.json` + `source-exceptions.json`.
4. **אוטומציה** — `.github/workflows/` + `scripts/` + `.claude/skills/` + `.claude/academy-update-spec.md`.

**מודל התוכן (frontmatter, נאכף ב-lib/knowledge.ts):** `mission` (start/daily/code/automate/spec/advanced), `level` (beginner/intermediate/advanced), `type` (guide/reference/recipe), `tool` (claude-code/git/both), `origin` (official/original), `timeMinutes`, `pathOrder`, `next`, `prerequisites`, ושני חותמי-זמן מופרדים בכוונה: `last_verified` (אוטומטי — מתי אומתו הפקודות מול המקור) ו-`last_reviewed` (ידני בלבד — מתי אדם קרא ואימת טענות; מתיישן, וזה תפקידו). ערך לא-חוקי נופל לברירת-מחדל (`pick()`); `mission` נגזר מהקטגוריה כשחסר.

## זרימות נתונים

**זרימת עמוד:** build → `lib/knowledge.ts` קורא את כל `knowledge-base/*/*.md` עם gray-matter → עמודים סטטיים ב-`/a/[slug]` ו-`/m/[mission]` → `MarkdownContent` מרנדר. צד-לקוח: `ViewCounter` פונה ל-`/api/views` (Redis).

**הזרימה הנכנסת (pull) — פריט שהמשתמש מזין:**
`skill:triage` (בחינה בלבד — האם הפריט שווה מאמר; לא כותב ולא פותח PR) → **אישור אנושי** → `skill:publish` (כותב לפי academy-update-spec.md, מריץ אימות מול המקור, פותח PR של תוכן) → מיזוג ידני. הבקרה האנושית כאן כפולה: גם על הוורדיקט וגם על ה-PR.

**ה-pipeline השבועי (push) — אוטונומי:**
`weekly-academy-update` (שבת) מריץ סוכן Claude לפי `academy-update-spec.md`: curl למקורות הרשמיים (llms.txt, changelog) → אינדקס dedup לפי `source_url` מנורמל → סיווג NEW/CHANGED → כתיבת מאמרים + עדכון `data/changelog.json` → PR → **auto-merge** (`gh pr merge --squash --delete-branch`) רק אחרי build ירוק ושער אימות-מקור. `weekly-update-watchdog` (יומי) מאתר PR תקוע, מריץ עליו build + `verify-sources.mjs`, וממזג או חוסם עם תגובה מנומקת ב-PR. concurrency מונע ריצות מקבילות. אין בקרה אנושית לפני מיזוג — הבקרה היא שערים דטרמיניסטיים + fact-check אנושי בדיעבד.

**נקודת המפגש:** שתי הזרימות כותבות לאותו `knowledge-base/`, באותו מודל frontmatter ותחת אותו שער `verify-sources`. ההבדל: pull — אדם מאשר לפני; push — מכונה ממזגת, אדם בודק אחרי.

**שער verify-sources (scripts/verify-sources.mjs, 291 שורות):** מחלץ מזהים טכניים מקטעי code בלבד (flags ארוכים, פקודות slash, משתני סביבה, מפתחות-קונפיג מנוקדים) ומאמת שהם מופיעים מילולית ב-`source_url` (וב-`source_url_extra` — עמודי תיעוד נוספים מופרדים ברווח). allowlist של hosts רשמיים בלבד (הגנת SSRF); חריגה מותרת רק דרך רשומה מנומקת עם תאריך recheck ב-`source-exceptions.json`. `origin: original` פטור מהשער. ריצה מוצלחת מחתימה `last_verified` להיום. 5 מקרי בוחן ב-`tests/gate/` מריצים דרך `test-verify-sources.sh`.

## גבולות ותלויות

**חיצוניות:** GitHub Actions + gh CLI (כל האוטומציה); code.claude.com/docs (מקור התוכן היחיד המורשה, פלוס חריגים מנומקים); Upstash Redis (מונה צפיות — נטען מ-env, לא בקוד); Vercel (hosting + analytics); `SITE_URL` מ-env ב-`lib/seo.ts`.

**פנימיים:** UI תלוי רק ב-`lib/`; `lib/knowledge.ts` תלוי רק ב-fs + gray-matter; הסקריפטים ב-Node טהור ללא תלות ב-Next; ה-workflows תלויים בסקריפטים וב-spec אך לא בקוד האפליקציה. תוכן חוצה את הגבול רק דרך frontmatter.

## צמתים קריטיים (SPOF)

- **`lib/knowledge.ts` (304 שורות)** — כל טעינת התוכן, הטקסונומיה והברירות-מחדל בקובץ אחד. באג בו משבית את כל האתר.
- **`.claude/academy-update-spec.md` (72 שורות)** — פרומפט-הפעלה של הסוכן השבועי; שגיאה בו מייצרת תוכן שגוי שממוזג אוטומטית.
- **`scripts/verify-sources.mjs`** — השער היחיד בין תוכן-סוכן ל-main; עקיפה או באג בו = הלוצינציות בפרודקשן (התקלה ההיסטורית של `sandbox.credentials`).
- **`weekly-academy-update.yml` + `weekly-update-watchdog.yml`** — זוג תלוי-הדדית; אם שניהם נשמטים (cron delays) אין עדכון ואין התרעה מלבד ה-issue fallback.
- **`app/globals.css`** — מקור האמת היחיד לכל טוקני העיצוב.
- **מפתחות frontmatter** — שינוי שם שדה שובר גם את האתר וגם את הסקריפטים (120 מופעי `source_url_extra`/`last_reviewed` בקורפוס).

## החלטות ארכיטקטוניות

1. **תוכן כ-Markdown בגיט, לא DB** — כל שינוי תוכן הוא PR עם diff, מה שמאפשר שערים דטרמיניסטיים ו-audit מלא.
2. **כתובות שטוחות `/a/[slug]`** — הקטגוריה ירדה מה-URL; המבנה הישן משומר ב-308 redirects. הקטגוריות נשארו כתיקיות ארגון בלבד.
3. **ציר ניווט של משימות, לא כלים** — שש משימות בשפת מצב-הקורא (`MISSION_META`), עם fallback מקטגוריה למשימה כשה-frontmatter חסר.
4. **build ירוק ≠ תוכן נכון** — לכן שער מילוני נפרד (verify-sources) שמאמת מזהים טכניים מול המקור, עם גבול מוצהר (לא בודק פרוזה/דוגמאות) כדי להימנע מ-false positives.
5. **הפרדת `last_verified` מ-`last_reviewed`** — אימות מכונה מתרענן אוטומטית; ביקורת אנושית מתיישנת בכוונה ומזינה את staleness-report.
6. **טוקני עיצוב ב-`@theme` אחד** — פלטה מצומצמת (ink/accent/action/verified/stale/rule), סקאלה 30/22/17/15, אפס ערכים קשיחים בקומפוננטות.
7. **סקילים בהפרדת סמכויות** — triage בוחן, publish כותב, architecture מתעד; כולם ידניים בלבד (`disable-model-invocation`).
8. **פתיחות מבוקרת של האוטומציה** — auto-merge כן, אבל רק דרך שערים + concurrency lock + watchdog, וכשל השער מדווח כתגובת PR במקום מיזוג.

## פערים וסיכונים

- **אין בדיקות אוטומטיות לאפליקציה** — `tests/gate/` מכסה רק את שער האימות; אין unit/e2e ל-lib או ל-UI, ואין `typecheck` ב-scripts.
- **אימות מילוני בלבד** — השער מוודא שמזהים קיימים במקור, לא שהטענות נכונות; הלוצינציה פרוזאית עדיין עוברת auto-merge (מכאן הצורך ב-fact-check אנושי בדיעבד).
- **תלות ב-cron של GitHub** — שתי שכבות (שבועי + watchdog) מגדרות עיכובים, אבל שמיטה כפולה עדיין אפשרית.
- **חריג ה-allowlist דורש משמעת** — `source-exceptions.json` נושא תאריך recheck (2026-10-29) שאין מנגנון שאוכף אותו.
- **שאריות** — `app/article/` ו-`app/category/` ריקות (רק `.DS_Store`), ותיקיית `skills/` בשורש ריקה; ראוי לנקות.
- **מונה הצפיות** — מפתח Redis גלובלי יחיד ללא הגנת קצב ברמת הקוד.
