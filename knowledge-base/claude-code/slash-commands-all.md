---
title: "כל פקודות Claude Code — מדריך מרכזי"
category: claude-code
layer: basic
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-init, slash-memory, slash-doctor, slash-compact-clear]
---

## כל פקודות Claude Code — טבלת מרכז

עדכני לינואר 2026. Claude Code v1.0.33+ — מעל 20 פקודות.

---

### קטגוריה א': אתחול והגדרה

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/init` | מייצר CLAUDE.md מניתוח הפרויקט | פרויקט חדש |
| `/config` | ממשק הגדרות — permissions, מודל, עיצוב | הגדרה ראשונית |
| `/memory` | עריכת CLAUDE.md — זיכרון קבוע | הוספת כללים |
| `/model` | מעבר בין מודלים בתוך session | לפי מורכבות המשימה |
| `/permissions` | ניהול הרשאות כלים | אבטחה |

---

### קטגוריה ב': ניהול Context

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/clear` | מחיקת כל השיחה — CLAUDE.md נשמר | מעבר משימה |
| `/compact [הוראה]` | דחיסה 60-70% עם שמירת הקשר | context > 80% |
| `/context` | צפייה בשימוש context window | בדיקה שוטפת |
| `/cost` | עלות session נוכחי בדולרים | ניטור |
| `/usage` | מכסה חודשית של ה-plan | בסוף חודש |

---

### קטגוריה ג': ניווט ושליטה

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/rewind` | חזרה לנקודה קודמת — קוד ו/או שיחה | ניסוי שנכשל |
| `/export [filename]` | ייצוא השיחה לקובץ / clipboard | תיעוד |
| `/resume` | חזרה לsession קודם | המשך עבודה |
| `/add-dir [path]` | הוספת תיקייה נוספת להקשר | monorepo |

---

### קטגוריה ד': כלים ואינטגרציות

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/mcp` | ניהול MCP servers | אינטגרציות |
| `/ide` | חיבור ל-IDE (VS Code, JetBrains) | הגדרה |
| `/install-github-app` | התקנת GitHub Actions | CI/CD |
| `/hooks` | ניהול automation hooks | workflows |
| `/agents` | ניהול subagents | משימות מקבילות |
| `/bashes` | ניהול background tasks | תהליכים ארוכים |

---

### קטגוריה ה': אבחון וחשבון

| פקודה | מה עושה | מתי |
|--------|---------|-----|
| `/doctor` | אבחון מלא של הסביבה | בעיות, עדכונים |
| `/login` | החלפת חשבון / חידוש token | token פג |
| `/logout` | התנתקות | סיום עבודה |
| `/bug` | דיווח bug לAnthropic | בעיה שחוזרת |
| `/help` | רשימת כל הפקודות | תמיד |

---

### קטגוריה ו': Skills (מאוחד עם Commands ב-2026)

| פקודה | מה עושה |
|--------|---------|
| `/[שם-skill]` | הפעלת skill מותאם אישית |
| `/new-project` | this skill — פרויקט חדש |
| `/backup` | this skill — גיבוי מהיר |
| `/checklist` | this skill — בדיקה לפני commit |
| `/new-feature` | this skill — פיצ'ר חדש |
| `/status` | this skill — מצב הפרויקט |

---

### קיצורי מקלדת חשובים

| קיצור | פעולה |
|-------|--------|
| `Esc + Esc` | /rewind — checkpoint אחורה |
| `Shift + Tab` | מעבר בין מצבים: רגיל → auto-accept → plan mode |
| `Ctrl + C` | ביטול פעולה נוכחית |
| `Ctrl + G` | פתח עורך חיצוני |
| `Ctrl + B` | הרץ בbackground |
| `# [טקסט]` | שמור זיכרון מהיר ל-CLAUDE.md |
| `@ [path]` | הכנס קובץ לcontext |
| `! [command]` | הרץ bash ישירות |

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

---

**מקור רשמי:** https://code.claude.com/docs/en/slash-commands
