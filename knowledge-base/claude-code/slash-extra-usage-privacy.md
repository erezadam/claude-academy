---
title: "/usage-credits, /privacy-settings — מכסות ופרטיות"
category: claude-code
layer: intermediate
last_verified: 2026-07-29
status: current
source_url: https://code.claude.com/docs/en/commands
related: [slash-login-logout-usage, slash-config]
badge: new
---

## /usage-credits (בעבר: /extra-usage), /privacy-settings — מכסות ופרטיות

פקודות לניהול שימוש מעבר למכסה והגדרות פרטיות.

---

## /usage-credits — שימוש נוסף

מה זה עושה: מגדיר שימוש נוסף בעת הגעה למגבלות המכסה.

```bash
/usage-credits
```

### מה קורה
- כשמגיעים למכסה החודשית — Claude Code מאט או נעצר
- עם `/usage-credits` אפשר להגדיר המשך שימוש מעבר למכסה
- חיוב נוסף לפי שימוש

### מתי להשתמש
- כשהמכסה נגמרה ואתה באמצע פרויקט דחוף
- כשרוצים להבטיח רציפות עבודה

---

## /privacy-settings — הגדרות פרטיות

מה זה עושה: ניהול הגדרות פרטיות — מה נשמר, מה נשלח, מה מוצפן.

```bash
/privacy-settings
```

### זמינות
- **Pro/Max plans בלבד**

### מה אפשר להגדיר
- האם sessions נשמרים בענן
- האם קוד נשלח לאימון
- הגדרות data retention

> קשור ל: /usage, /config, /login
