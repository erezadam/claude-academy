---
title: "Routines — אוטומציה בענן עם Claude Code"
category: scheduling
layer: intermediate
last_verified: 2026-05-30
status: needs-review
source_url: https://code.claude.com/docs/en/routines
related: []
---

## Routines — אוטומציה בענן

Routine הוא קונפיגורציית Claude Code שמורה: prompt, repository אחד או יותר, וסט connectors — ארוז פעם אחת ומופעל אוטומטית. Routines רצים על תשתית ענן של Anthropic, כך שהם ממשיכים לפעול גם כשהלפטופ סגור.

Routines בתצוגה מקדימת (research preview). זמינים בתוכניות Pro, Max, Team ו-Enterprise עם Claude Code on the web.

---

## סוגי Trigger

**Scheduled** — ריצה על קצב חוזר (שעתי, לילי, שבועי) או פעם אחת בזמן עתידי ספציפי.

**API** — טריגר לפי דרישה על ידי שליחת HTTP POST לנקודת קצה ייחודית לכל routine עם bearer token.

**GitHub** — ריצה אוטומטית בתגובה לאירועי repository כגון pull requests או releases.

routine יחיד יכול לשלב מספר טריגרים. לדוגמה: routine לreview PR יכול לרוץ לילי, להיות מופעל ממסמך deploy, וגם להגיב לכל PR חדש.

---

## דוגמאות שימוש

**תחזוקת backlog** — טריגר scheduled רץ בכל לילת עבודה מול issue tracker. הroutine קורא issues שנפתחו מאז הריצה האחרונה, מדביק תוויות, מקצה בעלים ומפרסם סיכום ל-Slack.

**טריאז' התראות** — כלי ניטור קורא לנקודת קצה API של הroutine כשסף שגיאה חוצה. הroutine מושך stack trace, מתאם עם commits אחרונים ופותח draft PR עם תיקון מוצע.

**review קוד מותאם** — טריגר GitHub רץ על `pull_request.opened`. הroutine מפעיל checklist review של הצוות ומשאיר הערות inline.

**אימות deploy** — pipeline CD קורא לנקודת קצה API לאחר כל deploy בproduction. הroutine מריץ בדיקות עשן ומפרסם go/no-go לערוץ release.

---

## יצירת Routine

צור routine מהרשת בכתובת `claude.ai/code/routines`, מאפליקציית Desktop, או מה-CLI עם `/schedule`. כל שלוש הממשקים כותבים לאותו חשבון ענן — routine שנוצר באחד מופיע מיד באחרים.

Routines רצים אוטומטית כ-sessions מלאים של Claude Code בענן: אין בורר מצב הרשאות ואין prompts אישור במהלך ריצה.

**הדגמה בסיסית מ-CLI:**
```text
/schedule
```

הפקודה פותחת wizard ליצירת routine חדש עם prompt, repositories, environment וטריגרים.

---

## מגבלות

- Routine שייך לחשבון claude.ai האישי שלך — לא משותף עם חברי צוות
- ספירה כנגד מכסת ריצות יומית של חשבונך
- ריצות מינימום: שעה אחת עבור טריגר scheduled
- אדמינים של Team ו-Enterprise יכולים להשבית routines לכל חברי הארגון
