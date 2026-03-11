---
title: "המדריך המלא לבניית Skills ל-Claude"
category: guides
layer: advanced
last_verified: 2026-03-08
status: current
source_url: https://www.facebook.com/share/p/IwY2xjawQeFt1leHRuA2FlbQIxMABicmlkETFYMVpJZ2tRV0hibHFGU1Y3c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHo4vP3ehCzx6anUplTOCNgH75pDS8NFvEY34HjoNSKBqLFakBPEjjtiQbLHs_aem_EqWqeI4G9g1zVpaslrIg4w
related: [slash-commands-all, claude-md-guide]
badge: new
author: "דניאל נחמיה"
---

## המדריך המלא לבניית Skills ל-Claude: מתכנון ועד הפצה

מה זה עושה: מדריך מקיף לבניית Skills ל-Claude — מתכנון ומבנה קבצים, דרך כתיבת הוראות, ועד בדיקות, אופטימיזציה והפצה.

---

### מה זה Skill?

Skill הוא תיקיית קבצים שמלמדת את Claude איך לטפל במשימות ותהליכי עבודה ספציפיים. במקום לכתוב פרומפט ארוך בכל פעם מחדש, Skill מאגד את ההוראות, הסקריפטים והתבניות — ו-Claude יודע מתי להפעיל אותם אוטומטית.

```
my-skill/
├── SKILL.md          # הוראות (חובה)
├── scripts/          # קוד הפעלה (אופציונלי)
│   └── validate.py
├── references/       # תיעוד נוסף (אופציונלי)
│   └── api-docs.md
└── assets/           # תבניות, אייקונים (אופציונלי)
    └── template.html
```

**מתי Skills מועילים:** תהליכי עבודה חוזרים — יצירת דפי נחיתה, מחקר בשיטתיות קבועה, כתיבת מסמכים בסגנון הארגון, תיאום תהליכים מרובי-שלבים.

---

### עקרונות ליבה — Progressive Disclosure

Skills משתמשים במערכת תלת-שכבתית שממזערת צריכת טוקנים:

| שכבה | מתי נטען | מה כולל |
|-------|----------|---------|
| YAML Frontmatter | תמיד ב-System Prompt | מספיק כדי ש-Claude ידע מתי להשתמש ב-Skill |
| גוף ה-SKILL.md | כש-Claude חושב שזה רלוונטי | ההוראות המלאות |
| קבצים מקושרים | כשצריך ספציפית | תיעוד, תבניות, סקריפטים |

**עקרונות נוספים:**

- **Composability** — Claude יכול לטעון מספר Skills בו-זמנית. ה-Skill שלכם צריך לעבוד טוב לצד skills אחרים
- **Portability** — Skills עובדים זהה ב-Claude.ai, Claude Code וב-API

---

### Skills + MCP: השילוב המנצח

| MCP (Connectivity) | Skills (Knowledge) |
|---------------------|-------------------|
| מחבר את Claude לשירות שלכם | מלמד את Claude איך להשתמש בשירות |
| גישה בזמן אמת לנתונים וכלים | לוכד Best Practices ותהליכי עבודה |
| **מה** Claude יכול לעשות | **איך** Claude צריך לעשות את זה |

---

### תכנון — התחילו מתרחישי שימוש

לפני שכותבים שורת קוד, זהו 2-3 תרחישי שימוש קונקרטיים:

```
Use Case: Project Sprint Planning

Trigger: User says "help me plan this sprint"
         or "create sprint tasks"

Steps:
  1. Fetch current project status (via MCP)
  2. Analyze team velocity and capacity
  3. Suggest task prioritization
  4. Create tasks with proper labels

Result: Fully planned sprint with tasks created
```

**שלוש קטגוריות של Skills:**

1. **יצירת מסמכים ואסטים** — מסמכים, מצגות, אפליקציות, עיצובים, קוד
2. **אוטומציית תהליכים** — תהליכים מרובי-שלבים עם מתודולוגיה עקבית
3. **העשרת MCP** — הוספת ידע תהליכי מעל כלי MCP קיימים

---

### דרישות טכניות

**כללים קריטיים:**

| כלל | הסבר |
|------|-------|
| שם הקובץ חייב להיות `SKILL.md` | Case-sensitive — לא SKILL.MD, לא skill.md |
| שם תיקייה ב-kebab-case | ✅ `notion-project-setup` ❌ `Notion Project Setup` |
| לא לכלול README.md | כל התיעוד ב-SKILL.md או ב-references/ |
| אסור תגיות XML ב-Frontmatter | הוא מופיע ב-System Prompt — סיכון הזרקה |
| אסור "claude" או "anthropic" בשם | שמות שמורים |

**מבנה ה-YAML Frontmatter:**

```yaml
---
name: project-sprint-planner
description: >
  Plans and creates sprint tasks in Linear.
  Use when user says "plan this sprint",
  "create sprint tasks", or "organize backlog".
license: MIT
compatibility: "Requires Linear MCP server"
metadata:
  author: YourCompany
  version: 1.0.0
  mcp-server: linear
---
```

| שדה | חובה? | הערות |
|------|--------|-------|
| name | כן | kebab-case, תואם לשם התיקייה |
| description | כן | עד 1024 תווים, חייב לכלול מה ומתי |
| license | לא | MIT, Apache-2.0 וכד׳ |
| compatibility | לא | דרישות סביבה (1-500 תווים) |
| metadata | לא | author, version, mcp-server |

---

### כתיבת SKILL.md מעולה

**שדה ה-Description — הכי חשוב.** הוא קובע אם Claude יטען את ה-Skill. המבנה המנצח:

`[מה ה-Skill עושה] + [מתי להשתמש] + [יכולות מפתח]`

**דוגמאות טובות:**

- "מנהל תהליכי Linear כולל תכנון ספרינטים, יצירת משימות ומעקב סטטוס. השתמש כשמשתמש מזכיר ״sprint״, ״Linear tasks״, ״project planning״"
- "מנתח קבצי עיצוב מ-Figma ומייצר תיעוד Handoff למפתחים. השתמש כשמשתמש מעלה קבצי .fig"

**דוגמאות גרועות:**

- "עוזר עם פרויקטים" — כללי מדי
- "יוצר מערכות תיעוד מרובות-עמודים מתוחכמות" — חסרים טריגרים

**תבנית מומלצת:**

```markdown
---
name: your-skill
description: [What + When + Key capabilities]
---

# Your Skill Name

## Instructions

### Step 1: [First Major Step]
Clear explanation of what happens.

### Step 2: [Second Step]
(Add more steps as needed)

## Examples

**Example 1: [common scenario]**
User says: "Set up a new marketing campaign"
Actions:
1. Fetch existing campaigns via MCP
2. Create new campaign with parameters
Result: Campaign created with confirmation link

## Troubleshooting

**Error:** [Common error message]
**Cause:** [Why it happens]
**Solution:** [How to fix]
```

**Best Practices:**

- ספציפיות: `"הרץ python scripts/validate.py --input {filename}"` במקום "תאמת את הנתונים"
- טיפול בשגיאות: כללו הוראות ברורות לכל שגיאה נפוצה
- הפנייה לקבצים: "לפני כתיבת שאילתות, עיין ב-`references/api-patterns.md`"
- שמרו SKILL.md ממוקד, העבירו תיעוד מפורט ל-references/

---

### בדיקות ואיטרציה

**בדיקות הפעלה (Triggering Tests):**

✅ צריך להפעיל:
- "Help me set up a new workspace"
- "I need to create a project"

❌ לא צריך להפעיל:
- "What's the weather?"
- "Help me write Python code"

**השוואת ביצועים:**

| מדד | בלי Skill | עם Skill |
|------|----------|---------|
| הודעות | 15 הלוך-חזור | 2 שאלות הבהרה |
| שגיאות API | 3 | 0 |
| טוקנים | 12,000 | 6,000 |

**Pro Tip:** עבדו על משימה בודדת מאתגרת עד שקלוד מצליח, ואז חלצו את הגישה המנצחת ל-Skill.

---

### הפצה ושיתוף

**התקנה:**

1. הורדת תיקיית ה-Skill (או שכפול מ-GitHub)
2. דחיסה ל-ZIP (אם נדרש)
3. העלאה ל-Claude.ai דרך Settings → Capabilities → Skills, או הנחה בתיקיית Skills של Claude Code

**Skills ברמת ארגון (מדצמבר 2025):**

- פריסה אוטומטית לכל ה-Workspace
- עדכונים אוטומטיים לכל המשתמשים
- ניהול מרכזי

**Skills ב-API:**

- `/v1/skills` endpoint לניהול
- הוספה לבקשות Messages API דרך `container.skills`
- שילוב עם Claude Agent SDK

---

### חמש תבניות עיצוב מנצחות

| תבנית | שימוש | דוגמה |
|--------|--------|-------|
| Sequential Workflow | תהליכים מרובי-שלבים בסדר ספציפי | Onboard New Customer |
| Multi-MCP Coordination | תהליכים חוצי שירותים | Design-to-Dev Handoff |
| Iterative Refinement | איכות שמשתפרת עם חזרות | יצירת דו"ח + בדיקת איכות |
| Context-Aware Tool Selection | אותה מטרה, כלים שונים לפי הקשר | Smart File Storage |
| Domain-Specific Intelligence | ידע מומחה מעבר לכלים | Financial Compliance |

---

### פתרון בעיות נפוצות

| בעיה | סיבה | פתרון |
|-------|-------|--------|
| "Could not find SKILL.md" | שם קובץ לא מדויק | ודאו SKILL.md (case-sensitive) עם `ls -la` |
| "Invalid frontmatter" | בעיית פורמט YAML | ודאו `---` בתחילה ובסוף, מרכאות סגורות, רווח אחרי `:` |
| Skill לא מופעל | Description כללי / חסרים טריגרים | שאלו: "When would you use the [skill] skill?" — תקנו לפי מה שחסר |
| Skill מופעל עבור שאילתות לא רלוונטיות | Scope רחב מדי | הוסיפו Negative Triggers, היו ספציפיים יותר |
| הוראות לא מבוצעות | ארוכות/עמומות/קבורות | קצרו, שימו קריטי בראש, כתבו סקריפטי ולידציה |
| ביצועים נפגעים | הקשר גדול מדי | שמרו מתחת ל-5,000 מילים, העבירו לreferences/, עד 20-50 Skills פעילים |

---

### דוגמאות מעשיות

**Skill לניהול קמפיינים:**

```yaml
---
name: campaign-manager
description: >
  Creates and manages marketing campaigns.
  Use when user says "create campaign",
  "launch new campaign", "plan campaign Q4",
  or asks about ad budget allocation.
metadata:
  author: agency-il
  mcp-server: linear, google-sheets
---
```

**Skill לכתיבת תוכן SEO:**

```yaml
---
name: seo-content-writer
description: >
  Writes SEO-optimized blog posts in Hebrew.
  Use when user asks to "write a blog post",
  "create article", "SEO content", or "כתוב מאמר".
---
```

**Skill ל-Onboarding לקוחות:**

```yaml
---
name: client-onboarding
description: >
  End-to-end client onboarding workflow.
  Use when user says "onboard new client",
  "new customer setup", "לקוח חדש".
  Coordinates Notion, Gmail, and Calendar.
metadata:
  mcp-server: notion, gmail, google-calendar
---
```

---

### שאלות ותשובות

**כמה זמן לוקח לבנות Skill ראשון?**
15-30 דקות עם ה-skill-creator המובנה. הטריק — להתמקד בתרחיש שימוש אחד ספציפי.

**האם אפשר בלי MCP?**
כן. Skills של קטגוריה 1 (יצירת מסמכים ואסטים) עובדים עם היכולות המובנות של Claude בלבד.

**כמה Skills בו-זמנית?**
אין מגבלה רשמית. Anthropic ממליצים להעריך אם יש יותר מ-20-50 ולשקול חבילות של Skills קשורים.

**מה ההבדל מ-GPTs?**
Skills הם תיקיות קבצים עם Progressive Disclosure, תמיכה ב-MCP, ניידות בין פלטפורמות ועבודה ב-API. GPTs הם פתרון סגור ל-ChatGPT בלבד.

**מה הקשר ל-CLAUDE.md?**
CLAUDE.md הוא קובץ זיכרון ברמת הפרויקט — כללים קבועים. Skills הם חבילות הוראות ניידות שנטענות לפי הקשר.

---

### צ׳קליסט מהיר

**לפני שמתחילים:** זוהו תרחישי שימוש, כלים (מובנים או MCP), מבנה תיקיות.

**בזמן פיתוח:** תיקייה ב-kebab-case, SKILL.md קיים, Frontmatter עם שדות חובה, Description כולל מה + מתי, בלי תגיות XML, הוראות ברורות.

**לפני העלאה:** בדיקת הפעלה (נטען בזמן הנכון), בדיקת לא-הפעלה (לא נטען סתם), בדיקות פונקציונליות, דחיסה ל-ZIP.

> מקור: מאמר מאת דניאל נחמיה, מבוסס על המדריך הרשמי של Anthropic — מרץ 2026
