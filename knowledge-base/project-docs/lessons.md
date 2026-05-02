---
title: "LESSONS.md - יומן החלטות וכאבים"
category: project-docs
layer: basic
last_verified: 2026-05-01
status: current
related: [vibeview, codeatlas]
---

## LESSONS.md - יומן החלטות וכאבים

מה זה עושה: מתעד החלטות ארכיטקטוניות, באגים שחזרו, ומלכודות שהקוד למד בדרך הקשה. הקובץ שמונע מ-Claude Code לחזור על אותן טעויות. משך: 10-20 דקות.

### הפרומפט

```
# יצירת LESSONS.md

צור LESSONS.md - יומן החלטות וכאבים. למה עשינו ככה,
ולמה לא לחזור על טעויות.

## איסוף מידע

### Git
git log --oneline -100
git log --grep="fix" --grep="bug" --grep="regression" -i --oneline -50
git log --grep="revert" -i --oneline -20

### דוקומנטציה
- CLAUDE.md - "iron rules"?
- CHANGELOG.md - regressions
- lessons-learned/, post-mortems/, decisions/, adr/

### בקוד
grep -rn "TODO\|FIXME\|HACK\|⚠️\|WARNING\|DO NOT\|IMPORTANT"
grep -rn "regression\|broke\|fixed\|workaround" --include="*.md"

## מבנה הקובץ
🔴 כללי ברזל - אסור לשבור
🟡 החלטות ארכיטקטוניות
🟠 Regressions - באגים שחזרו
⚠️ מלכודות נפוצות
🔧 חלקים שבירים בקוד (3-5 הכי קריטיים)
📚 לקחים חוצי-דומיינים

לכל פריט: מה + למה + מה קרה כשנשבר

## כללים
✅ iron rules מ-CLAUDE.md
✅ באגים שתוקנו ביותר מ-commit אחד
✅ regressions מתועדים
❌ typos, סטיילינג, dependencies רגילים
❌ ניחושים

אל תמציא לקחים. אין ראיות = אל תכתוב.

## אחרי שסיימת
1. כמה לקחים בכל קטגוריה
2. דפוסים? ("5 מתוך 7 regressions ב-state")
3. פרויקט בן פחות משבועיים? - תגיד במפורש
4. סקציה ריקה - מחק
5. רק LESSONS.md
```

### מתי להשתמש
- ✅ כן — בפרויקט שיש בו היסטוריית git משמעותית (חודש+)
- ✅ כן — אחרי באג חמור או regression שחזר
- ✅ כן — לפני שמצטרף מפתח חדש לפרויקט עם היסטוריה
- ❌ לא — בפרויקט בן פחות משבועיים (אין מספיק ראיות)

### פלט מצופה
קובץ `LESSONS.md` בשורש הפרויקט עם 6 קטגוריות (🔴 🟡 🟠 ⚠️ 🔧 📚). כל לקח: מה + למה + מה קרה כשנשבר. סקציה ריקה — נמחקת.

→ קשור ל: vibeview, codeatlas
