---
title: "חיוב בקשות מסווג Auto Mode"
category: claude-code
last_verified: 2026-09-19
status: needs-review
source_url: https://code.claude.com/docs/en/auto-mode-classifier-billing
related: ["auto-mode-config", "permission-modes", "slash-goal"]
mission: daily
level: intermediate
type: guide
tool: claude-code
origin: official
timeMinutes: 2
published: "2026-09-19T12:00:00+03:00"
pathOrder: 31
---

ב-[auto mode](/docs/en/permission-modes#eliminate-prompts-with-auto-mode), מסווג בודק בטיחות של פעולות כמו פקודות shell ובקשות רשת לפני שהן מתבצעות. מגרסה 2.1.278, Claude Code מבקש מהשרת לבצע את הבדיקות הללו כחלק מבקשות המודל של הסשן — ואינו גובה עליהן תשלום נפרד. כשהשרת אינו מצליח להגיע לסשן, Claude Code חוזר למסווג שלו עצמו, ובקשות אלו מחויבות כרגיל. לפני הפעולה הראשונה שנבדקת כך, Claude Code מחזיק את הפעולה ומציג הודעה.

## מה זה עושה / למה זה שימושי

כאשר Claude Code אינו יכול להשתמש בבדיקות השרת, הוא מציג הודעה זו:

```text
We're changing auto mode to no longer charge for classifier requests in Claude Code.
However, this session isn't eligible.
```

auto mode ממשיך לפעול — ובקשות המסווג מחויבות כרגיל, כמו לפני השינוי. ההודעה מופיעה פעם אחת בכל סשן שחוזר לשימוש במסווג המקומי.

## מי רואה את ההודעה

Claude Code 2.1.278 ומעלה מבקש בדיקות שרת כברירת מחדל ב:

- תוכניות Enterprise ומשתמשי Claude API
- Amazon Bedrock, Google Cloud's Agent Platform ו-Microsoft Foundry

תוכניות Pro, Max ו-Team **לעולם לא** יראו את ההודעה.

לבדיקת מצב הסשן:

```text
/status
```

בשורה **Auto mode server**: הערך `Enabled` = בדיקות שרת פעילות; `Disabled` = הסשן חזר למסווג מקומי.

## איך משתמשים

**לאחר שמופיעה ההודעה:**

- **Enter** — ממשיך; שאר הסשן משתמש במסווג המקומי ומחויב כרגיל
- **Esc / Ctrl+C** — מבטל את הפעולה הנוכחית; הסשן נשאר ב-auto mode

**לביטול בקשות שרת מראש** (למשל כשעובדים דרך gateway שאינו תומך):

```bash
export CLAUDE_CODE_AUTO_MODE_SERVER=0
```

ניתן גם להגדיר ב-settings.json תחת מפתח `env`. כשהמשתנה מוגדר, Claude Code לעולם לא מבקש בדיקות שרת — והודעה זו לא תופיע.

## הסיבה הנפוצה ביותר

Gateway או proxy בין Claude Code לבין ה-API שמסנן כותרות בקשות, מוחק שדות בתשובות (כגון `safeguard_results`), או כותב מחדש מזהי tool-use — גורם לכך שהשרת לא מקבל את הבקשה לבדיקה. כשהסיבה היא gateway, ההודעה תציין אותו בשמו.

אם אין gateway בנתיב וההודעה מופיעה, פנה לתמיכה דרך `/feedback`.
