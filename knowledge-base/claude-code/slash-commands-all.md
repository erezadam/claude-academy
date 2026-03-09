---
title: "כל פקודות Claude Code — מדריך מרכזי"
category: claude-code
layer: basic
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-init, slash-memory, slash-doctor, slash-compact-clear]
---

## כל פקודות Claude Code — טבלת מרכז

עדכני למרץ 2026. Claude Code v2.1.70+ — מעל 50 פקודות.

---

### קטגוריה א': ניהול סשן (Session Management)

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/clear` | מחיקת כל השיחה — CLAUDE.md נשמר. מילות מפתח: `/reset`, `/new` | מעבר משימה |
| `/compact [הוראה]` | דחיסה 60-70% עם שמירת הקשר | context > 80% |
| `/resume [id/שם]` | ממשיך session קודם. מילת מפתח: `/continue` | המשך עבודה |
| `/fork [שם]` | מפצל שיחה לסשן נפרד מהנקודה הנוכחית | ניסוי מקבילי |
| `/rename [שם]` | שינוי שם הסשן הנוכחי | סדר |
| `/rewind` | חזרה לנקודה קודמת — קוד ו/או שיחה. מילת מפתח: `/checkpoint` | ניסוי שנכשל |
| `/exit` | יציאה מ-Claude Code. מילת מפתח: `/quit` | סיום |

---

### קטגוריה ב': מידע ודיאגנוסטיקה

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/cost` | שימוש ב-tokens ועלות הסשן | ניטור |
| `/usage` | מגבלות plan ושימוש נוכחי | בסוף חודש |
| `/context` | ויזואליזציה של שימוש ב-context window | בדיקה שוטפת |
| `/status` | גרסה, מודל, חשבון וסטטוס חיבור | אבחון |
| `/doctor` | בדיקת תקינות ההתקנה | בעיות |
| `/help` | רשימת כל הפקודות הזמינות | תמיד |
| `/stats` | ויזואליזציה של שימוש יומי והיסטוריית סשנים | סטטיסטיקות |
| `/diff` | שינויים פתוחים ו-diff לפי תורות | לפני commit |
| `/export [שם קובץ]` | ייצוא שיחה לקובץ טקסט או clipboard | תיעוד |
| `/copy` | העתקת תגובה אחרונה ל-clipboard | שיתוף |
| `/release-notes` | changelog מלא | אחרי עדכון |
| `/insights` | ניתוח וסיכום סשנים קודמים | סקירה שבועית |

---

### קטגוריה ג': שליטה במודל ומצבים

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/model [שם]` | מעבר בין מודלים: opus / sonnet / haiku | לפי מורכבות |
| `/fast [on/off]` | מצב מהיר — אותו מודל, פלט מהיר יותר | מהירות |
| `/plan` | מצב תכנון — Claude מציע לפני ביצוע | משימות גדולות |
| `/vim` | מעבר בין Vim לעריכה רגילה | משתמשי Vim |
| `/output-style [סגנון]` | סגנון פלט: Default / Explanatory / Learning | לפי צורך |
| `/theme` | ערכת צבעים | עיצוב |

---

### קטגוריה ד': הגדרות והרשאות

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/config` | ממשק הגדרות. מילת מפתח: `/settings` | הגדרה ראשונית |
| `/permissions` | הרשאות כלים. מילת מפתח: `/allowed-tools` | אבטחה |
| `/init` | אתחול פרויקט עם CLAUDE.md | פרויקט חדש |
| `/memory` | עריכת CLAUDE.md | הוספת כללים |
| `/login` | חיבור לחשבון Anthropic | token פג |
| `/logout` | התנתקות | סיום |
| `/hooks` | ניהול lifecycle hooks | אוטומציה |
| `/agents` | ניהול subagents מותאמים | משימות מקבילות |
| `/skills` | רשימת skills זמינות | גילוי |
| `/mcp` | ניהול חיבורי MCP servers | אינטגרציות |
| `/plugin` | ניהול plugins — marketplace, התקנה, הסרה | הרחבות |
| `/terminal-setup` | הגדרת קיצורי מקלדת לטרמינל | התקנה |
| `/keybindings` | פתח/צור קובץ keybindings | התאמה |
| `/sandbox` | הפעל/כבה sandbox mode | אבטחה |
| `/extra-usage` | שימוש נוסף בעת הגעה למגבלות | מכסה |
| `/privacy-settings` | הגדרות פרטיות (Pro/Max בלבד) | פרטיות |
| `/statusline` | תצוגת status line בטרמינל | התאמה |

---

### קטגוריה ה': תזמון ולולאות — חדש מרץ 2026!

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/loop [interval] [prompt]` | תזמון משימה חוזרת. יחידות: s/m/h/d או cron | ניטור, CI |
| `CronCreate` | כלי פנימי — יצירת job מתוזמן | אוטומטי |
| `CronList` | רשימת כל המשימות הפעילות + Job IDs | ניהול |
| `CronDelete [job-id]` | ביטול משימה לפי ID | ניקוי |

**דוגמאות:**
```bash
/loop 5m check deploy status
/loop 0 9 * * * summarize merged PRs
/loop 1h scan for security vulnerabilities
```
**מגבלות:** session-scoped, פג תוקף אחרי 3 ימים, מקסימום 50 משימות.

---

### קטגוריה ו': Code Review ו-PR

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/review [מספר PR]` | סקירת PR — איכות, נכונות, אבטחה | code review |
| `/pr-comments [PR]` | תגובות מ-GitHub PR | מעקב |
| `/security-review` | סריקת אבטחה לשינויים ממתינים | לפני commit |
| `/install-github-app` | Claude כ-reviewer אוטומטי | CI/CD |

---

### קטגוריה ז': תיקיות ואינטגרציות

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/add-dir [נתיב]` | הוספת תיקייה נוספת לסשן | monorepo |
| `/ide` | ניהול אינטגרציות IDE | הגדרה |
| `/chrome` | אינטגרציה עם Chrome | web debugging |
| `/remote-control` | סשן נגיש מ-claude.ai. מילת מפתח: `/rc` | עבודה מרחוק |
| `/desktop` | המשך סשן ב-Desktop. מילת מפתח: `/app` | ממשק גרפי |
| `/tasks` | רשימת background tasks שרצים | ניטור |
| `/feedback` | משוב לאנתרופיק. מילת מפתח: `/bug` | דיווח |

---

### קטגוריה ח': קיצורי מקלדת

| קיצור | פעולה |
|-------|--------|
| `Escape` | ביטול generation נוכחי |
| `Escape × 2` | Rewind / סיכום |
| `Ctrl+C` | יציאה (פעמיים) |
| `Ctrl+R` | חיפוש בהיסטוריית פרומפטים |
| `Ctrl+T` | הצג/הסתר רשימת משימות |
| `Shift+Tab` | מחזור בין מצבים: Auto-Accept / Plan / Normal |
| `Ctrl+O` | Verbose output |
| `Ctrl+B` | Background — הרץ ברקע |
| `Ctrl+G` | פתח עורך טקסט חיצוני |
| `Alt+P` | החלף מודל בלי לנקות פרומפט |
| `Alt+T` | הפעל/כבה extended thinking |
| `Ctrl+K` | מחק עד סוף שורה |
| `Ctrl+U` | מחק שורה שלמה |
| `# [טקסט]` | שמור זיכרון ל-CLAUDE.md |
| `@ [path]` | הכנס קובץ לcontext |
| `! [command]` | הרץ bash ישירות |

---

### קטגוריה ט': דגלי CLI

| דגל | תיאור |
|-----|--------|
| `claude -p "query"` | Headless — הדפס תוצאה וצא |
| `--output-format json` | פלט JSON עם metadata |
| `--output-format stream-json` | פלט JSON בסטרימינג |
| `--append-system-prompt "..."` | הוסף הנחיות מערכת |
| `--system-prompt "..."` | החלף system prompt לחלוטין |
| `--allowedTools "..."` | הגבל כלים זמינים |
| `--dangerously-skip-permissions` | דלג אישורים — אוטומציה בלבד |
| `--resume [id]` | המשך session ב-headless |
| `--agents [json]` | הגדר subagents inline |
| `--from-pr [number]` | פתח session מקושר ל-PR |

---

### קטגוריה י': Skills (מאוחד עם Commands ב-2026)

| פקודה | מה עושה |
|--------|---------|
| `/[שם-skill]` | הפעלת skill מותאם אישית |
| `/new-project` | skill — פרויקט חדש |
| `/backup` | skill — גיבוי מהיר |
| `/checklist` | skill — בדיקה לפני commit |
| `/new-feature` | skill — פיצ'ר חדש |
| `/status` | skill — מצב הפרויקט |

---

### workflows מומלצים

**תחילת יום:**
```
/status → /cost → התחל לעבוד
```

**session ארוך:**
```
/cost → /compact "focus on X" → /context
```

**משהו לא עובד:**
```
/doctor → /login → /config
```

**סיום session:**
```
/cost → /memory [תעד מה למדת] → /clear
```

**ניסוי מסוכן:**
```
Esc+Esc [checkpoint] → נסה → אם נכשל: /rewind
```

**ניטור CI:**
```
/loop 5m check deploy status → CronList → CronDelete [job-id]
```

---

**מקור רשמי:** https://code.claude.com/docs/en/slash-commands
