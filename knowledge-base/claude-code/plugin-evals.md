---
title: "בדיקת פלאגינים עם evals"
category: claude-code
last_verified: 2026-09-12
status: needs-review
source_url: https://code.claude.com/docs/en/plugin-evals
related: [plugins-guide, skills, building-skills]
mission: advanced
level: advanced
type: guide
tool: claude-code
origin: official
timeMinutes: 4
published: "2026-09-12T12:00:00+03:00"
pathOrder: 22
---

`claude plugin eval` מריץ את הפלאגין שלך מול חבילת מקרי-בדיקה ומדרג את התוצאות. כל מקרה הוא פרומפט מציאותי ואחד או יותר graders — בדיקות עבור/נכשל על מה ש-Claude הפיק.

## מה זה עושה / למה זה שימושי

כלי ה-evals מאפשר למדוד כמה בצורה אמינה הפלאגין שלך מכוון את Claude לתוצאה הנכונה, לזהות רגרסיות כשמשנים את הפלאגין או כשמשתמש בגרסת מודל חדשה, ולהשוות ביצועים מול בסיס ללא פלאגין כלל. מתאים לבודקים ולצוותים שרוצים לשלב בדיקות פלאגין ב-CI.

**דרישות**: Claude Code v2.1.269 ומעלה, ספריית פלאגין עם קובץ `plugin.json` או `.claude-plugin/plugin.json`. כל ריצת eval ושיפוט llm הן קריאות מודל אמיתיות שנספרות כנגד מכסת השימוש.

## איך משתמשים

### שלב 1 — יצירת חבילת ה-eval

מהשורש של הפלאגין:

```bash
claude plugin eval init
```

פקודה זו פותחת סשן Claude Code אינטראקטיבי. Claude קורא את הפלאגין, שואל על התוצאה הרצויה, מציע פרומפטים ומעצב graders, ואז כותב ספריית `evals/` עם מקרי הבדיקה. בצאתך מהסשן עם `/exit` — החבילה מוכנה.

לחלופין ניתן לבקש מ-Claude בסשן קיים: "הרץ `claude plugin eval init`".

### שלב 2 — הרצת החבילה

```bash
claude plugin eval .
```

כל מקרה רץ שלוש פעמים עם הפלאגין (arm WITH) ושלוש פעמים בלעדיו (arm W/OUT). ריצה אחת של מקרה אחד = שש ריצות סה"כ.

### שלב 3 — קריאת הסיכום

```text
CASE        WITH  W/OUT Δ      RUNS COST    NOTES
first-case  1.00  0.33  +0.67  6    $0.41

1 case(s) · mean Δ +0.67 · 74s · $0.41
Report: /Users/you/my-plugin/evals/results/2026-09-10T17-02-11-482Z/report.html
```

- `WITH` — ציון מקרה עם הפלאגין
- `W/OUT` — ציון ללא פלאגין
- `Δ` — התרומה של הפלאגין (חיובי = הפלאגין עזר)
- `COST` — הערכת עלות לפי תעריף פומבי

## מבנה הקבצים

```text
my-plugin/
├── .claude-plugin/plugin.json
├── skills/...
└── evals/
    ├── first-case/
    │   ├── prompt.md          # frontmatter: הגבלות ריצה; גוף: הפרומפט
    │   ├── graders/
    │   │   ├── criteria.md    # grader: rubric לשיפוט LLM
    │   │   └── skill-fired.md # grader: האם הסקיל הופעל
    │   └── case.yaml          # אופציונלי: שדות context.*
    └── results/               # נכתב בכל ריצה; הוסף ל-.gitignore
```

## סוגי graders

| סוג | מה הוא בודק | עלות |
| :--- | :--- | :--- |
| `regex` | תבנית regex על תגובת Claude | ללא |
| `tool_used` | האם כלי מסוים הופעל | ללא |
| `tool_order` | סדר הפעלת כלים | ללא |
| `file_exists` | האם קובץ נוצר | ללא |
| `llm` | שיפוט מודל שני לפי rubric | קריאת מודל |
| `baseline` | השוואה ישירה ל-arm ללא פלאגין | קריאת מודל |

## כתיבת מקרה ידנית

ליצירת שלד ריק בלי הרצה:

```bash
claude plugin eval init --bare first-case
```

**`prompt.md`** — הפרומפט שClaude מקבל, עם הגבלות ב-frontmatter:

```markdown
---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

כתוב לי commit message לשינוי הזה: שיניתי את getUser ל-fetchUser.
```

**grader מסוג `tool_used`** — לבדוק שהסקיל אכן הופעל:

```markdown
---
type: tool_used
tool: Skill
input_match: '"skill"\s*:\s*"(?:[\w-]+:)?your-skill-name"'
---
```

**grader מסוג `llm`** — שיפוט לפי rubric:

```markdown
---
type: llm
---

PASS if the response contains a clear commit message.
FAIL if the response is missing or off-topic.
```

## איטרציה מהירה

להרצת מקרה בודד עם ריצה אחת, ללא השוואה לבסיס:

```bash
claude plugin eval . --case <case-name> --runs 1 --ablation none
```

## הרצה ב-CI

לבדיקה אוטומטית בכשל כשהציון יורד מתחת לסף:

```bash
claude plugin eval . --threshold 0.8 --trust-plugin
```

- `--threshold 0.8` — מקרה שציונו WITH נמוך מ-0.8 גורם ל-exit code `1`, מה שמפיל שלב CI.
- `--trust-plugin` — מדלג על בקשת האמון הראשונה כדי שה-job לא יתקע בהמתנה לאישור.
- `--model <model>` — מנעול מודל למניעת בלבול בין שדרוג מודל לרגרסיה של הפלאגין.