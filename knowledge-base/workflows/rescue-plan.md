---
title: "קלוד שבר לי משהו — מסלול החילוץ"
category: workflows
layer: basic
last_verified: 2026-07-29
last_reviewed: 2026-07-29
status: needs-review
source_url: https://code.claude.com/docs/en/checkpointing
source_url_extra: https://git-scm.com/docs/git-status https://git-scm.com/docs/git-diff https://git-scm.com/docs/git-revert https://git-scm.com/docs/git-reset https://git-scm.com/docs/git-stash https://git-scm.com/docs/git-log
related: [trust-and-verify, slash-rewind, git-reset-revert, git-stash]
mission: code
level: beginner
type: recipe
tool: both
origin: official
timeMinutes: 7
---

## קלוד שבר לי משהו — מסלול החילוץ

נשום. כמעט כל מצב הפיך. בחר את הענף שמתאר אותך ולך צעד-צעד.

---

## ענף 1: עוד לא עשיתי commit

הדרך הקצרה. Claude Code שומר נקודות שחזור לאורך הסשן.

```
/rewind
```

נפתח תפריט. בחר נקודה מלפני השבירה. אפשר לשחזר קוד, שיחה, או שניהם.

קיצור: לחיצה כפולה על Escape (כששורת הקלט ריקה) פותחת את אותו תפריט.

סייג חשוב: נקודות השחזור עוקבות רק אחרי עריכות שקלוד עשה בכלי העריכה שלו. קבצים ששונו בפקודות טרמינל (מחיקה, העברה, סקריפט) לא משוחזרים כאן — אם ה-rewind לא החזיר הכול, המשך לענפי ה-git למטה.

זהו. אם הקוד חזר לעבוד — סיימת.

---

## ענף 2: כבר עשיתי commit

יש שתי דרכים. ההבדל חשוב.

**revert — הבטוח.** יוצר commit חדש שמבטל את הקודם. ההיסטוריה נשמרת. זו ברירת המחדל שלך, ותמיד נכונה אם כבר דחפת (push):

```bash
git log --oneline
git revert <hash-of-bad-commit>
```

**reset — המוחק.** מעלים את ה-commit כאילו לא היה. רק אם ה-commit אצלך בלבד, לא נדחף לאף אחד:

```bash
git reset --hard HEAD~1
```

לא בטוח איזה? ‏revert. תמיד אפשר לנקות היסטוריה אחר כך; אי אפשר להחזיר עבודה של אחרים שנדרסה.

---

## ענף 3: לא בטוח מה בכלל קרה

אל תפעל עדיין. קודם תסתכל.

```bash
git status
```

מראה אילו קבצים השתנו.

```bash
git diff
```

מראה מה בדיוק השתנה בהם. קרא. עכשיו אתה יודע באיזה ענף אתה: השינויים לא קומטו → ענף 1. קומטו → ענף 2. חלק מהשינויים דווקא טובים → ענף 4.

---

## ענף 4: רוצה לשמור חלק מזה

השינויים מעורבבים — יש שם גם דברים טובים. שים הכול בצד:

```bash
git stash
```

הקוד חזר למצב הנקי האחרון. השינויים לא נמחקו — הם שמורים בצד. כשתרצה אותם בחזרה:

```bash
git stash pop
```

עכשיו אפשר להחזיר אותם בבת אחת, או לבחור מהם ידנית את החלקים הטובים.

---

## אחרי החילוץ

שני הרגלים מונעים את הפעם הבאה: קרוא את ה-diff לפני שממשיכים, ו-commit קטן אחרי כל יחידת עבודה שלמה — כך שלענף 1 תמיד יהיה לאן לחזור. עוד על זה: [מתי לסמוך ומתי לבדוק](/a/trust-and-verify).
