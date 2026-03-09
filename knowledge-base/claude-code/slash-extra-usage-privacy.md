---
title: "/extra-usage, /privacy-settings — מכסות ופרטיות"
category: claude-code
layer: intermediate
last_verified: 2026-03-09
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [slash-login-logout-usage, slash-config]
badge: new
---

## /extra-usage, /privacy-settings — מכסות ופרטיות

פקודות לניהול שימוש מעבר למכסה והגדרות פרטיות.

---

## /extra-usage — שימוש נוסף

מה זה עושה: מגדיר שימוש נוסף בעת הגעה למגבלות המכסה.

```bash
/extra-usage
```

### מה קורה
- כשמגיעים למכסה החודשית — Claude Code מאט או נעצר
- עם `/extra-usage` אפשר להגדיר המשך שימוש מעבר למכסה
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
