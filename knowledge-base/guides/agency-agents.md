---
title: "Agency Agents — ספריית סוכני AI לצוות מקצועי שלם"
category: guides
layer: advanced
last_verified: 2026-03-11
status: current
source_url: https://github.com/msitarzewski/agency-agents
related: [building-skills]
badge: new
---

## Agency Agents — ספריית סוכני AI לצוות מקצועי שלם

מה זה עושה: ספרייה של 120+ סוכני AI מתמחים שמדמים צוות שלם של סוכנות מוצר ופיתוח. כל קובץ הוא "תפקיד מקצועי" שמגדיר איך מודל AI צריך לחשוב ולפעול — במקום לעבוד עם מודל כללי אחד, עובדים עם צוות מומחים.

---

### הרעיון

במקום לבקש מ-AI לעשות הכל כ"עוזר כללי", הגישה של Agency Agents היא:
- כל סוכן = מומחה בתחום ספציפי עם אישיות, תהליכי עבודה, ותוצרים מוגדרים
- הסוכנים מאורגנים בחטיבות כמו ארגון אמיתי
- כל קובץ כולל: תכונות זהות, תהליכי ליבה, תוצרים טכניים עם דוגמאות קוד, ומדדי הצלחה

```bash
# התקנה ל-Claude Code
git clone https://github.com/msitarzewski/agency-agents.git
# העתיקו קבצי סוכנים לתיקיית Claude Code שלכם
# הפעילו סוכן ספציפי בתוך ה-session
```

---

### 12 החטיבות — מה כלול?

| חטיבה | סוכנים | דוגמאות תפקידים |
|--------|--------|-----------------|
| **Engineering** | 16 | Frontend Developer, Backend Architect, AI Engineer, DevOps, Security Engineer, Smart Contract |
| **Design** | 8 | UI Designer, UX Researcher, Brand Guardian, Visual Storyteller, Image Prompt Engineer |
| **Paid Media** | 7 | PPC Strategist, Search Query Analyst, Ad Creative, Programmatic Buyer |
| **Sales** | 8 | Outbound Strategist, Discovery Coach, Deal Strategist, Sales Engineer, Proposal Writer |
| **Marketing** | 18 | Growth Hacker, Content Creator, TikTok/Instagram/Reddit Strategists, SEO |
| **Product** | 4 | Sprint Prioritizer, Trend Researcher, Feedback Synthesizer, Behavioral Nudge Engine |
| **Project Management** | 6 | Studio Producer, Project Shepherd, Senior PM, Jira Workflow Steward |
| **Testing** | 8 | Evidence Collector, Performance Benchmarker, API Tester, Accessibility Auditor |
| **Support** | 6 | Support Responder, Analytics Reporter, Finance Tracker, Compliance Checker |
| **Spatial Computing** | 6 | XR Interface Architect, visionOS Engineer, Immersive Developer |
| **Game Development** | 15+ | Game Designer, Level Designer, Technical Artist, Unity/Unreal Specialists |
| **Specialized** | 16 | Multi-Agent Orchestrator, Blockchain Auditor, Cultural Intelligence Strategist |

---

### איך משתמשים?

**שימוש ישיר ב-Claude Code:**

```bash
# 1. שכפלו את הריפו
git clone https://github.com/msitarzewski/agency-agents.git

# 2. העתיקו סוכן רלוונטי לפרויקט
cp agency-agents/engineering/frontend-developer.md .claude/

# 3. הפעילו ב-session
# Claude יטען את ההוראות ויפעל כמומחה בתחום
```

**שילוב עם כלים נוספים:**

הריפו תומך בכלי AI מרובים דרך סקריפטי המרה:
- **Claude Code** — העתקה ישירה
- **Cursor** — המרה אוטומטית
- **Aider** — סקריפט התקנה
- **Windsurf** — תמיכה מלאה
- **Gemini CLI** — סקריפט התאמה

---

### דוגמאות שימוש מעשיות

**פיתוח אפליקציה:**

```
1. הפעילו את Frontend Developer לבניית ה-UI
2. הפעילו את Backend Architect לתכנון ה-API
3. הפעילו את UX Researcher לבדיקת חוויית משתמש
4. הפעילו את DevOps Automator להגדרת CI/CD
```

**קמפיין שיווקי:**

```
1. הפעילו את Growth Hacker לאסטרטגיה
2. הפעילו את Content Creator לתוכן
3. הפעילו את PPC Strategist לפרסום ממומן
4. הפעילו את Analytics Reporter למעקב
```

**פיתוח משחק:**

```
1. הפעילו את Game Designer לעיצוב המכניקה
2. הפעילו את Level Designer לבניית שלבים
3. הפעילו את Technical Artist לאפקטים ויזואליים
4. הפעילו את Game Audio Engineer לסאונד
```

---

### מה מיוחד בסוכנים האלה?

כל סוכן כולל:

- **אישיות מוגדרת** — סגנון תקשורת ייחודי, לא תבנית גנרית
- **תהליכי עבודה מובנים** — שלבים ברורים עם תוצרים מוגדרים
- **מומחיות תחומית** — ידע ספציפי לתחום, לא הנחיות כלליות
- **מדדי הצלחה** — איך מודדים שהסוכן עשה עבודה טובה
- **דוגמאות קוד** — תוצרים מוכנים לייצור

---

### קישורים

- **GitHub:** [github.com/msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)
- **רישיון:** קוד פתוח
- **תאימות:** Claude Code, Cursor, Aider, Windsurf, Gemini CLI, OpenCode
