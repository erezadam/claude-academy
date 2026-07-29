#!/bin/bash
# Stop hook: לפני סיום תור, מריץ את שער אימות-המקור (verify-sources) על מאמרי
# knowledge-base שהשתנו. אם יש טענה טכנית שאינה מאומתת במקור הרשמי — חוסם את
# הסיום פעם אחת בלבד ומחזיר את הסיבה למודל.
#
# מניעת לולאה: ה-Stop hook מקבל ב-stdin JSON עם השדה stop_hook_active. אם הוא
# כבר true — כלומר כבר חסמנו פעם אחת בתור הזה — יוצאים 0 ומאפשרים לסיים. כך
# החסימה היא push-back יחיד, לא לולאה אינסופית.
set -uo pipefail

INPUT=$(cat)

# push-back פעם אחת בלבד.
if [ "$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

# עוברים לתיקיית הפרויקט (מה-hook input, אחרת נשארים ב-cwd).
DIR="$(printf '%s' "$INPUT" | jq -r '.cwd // empty')"
if [ -n "$DIR" ] && [ -d "$DIR" ]; then cd "$DIR" || true; fi

# אין סקריפט שער — לא חוסמים סיום.
[ -f scripts/verify-sources.mjs ] || exit 0

# ה-hook בודק רק את הקבצים שהשתנו בתור הזה (ריצה ללא ארגומנטים = קורפוס מלא,
# כבד מדי ל-Stop hook). חישוב ה-diff עבר לכאן מהסקריפט עצמו.
CHANGED=$(git diff --name-only --diff-filter=AM origin/main...HEAD -- 'knowledge-base/' 2>/dev/null | grep '\.md$' || true)
if [ -z "$CHANGED" ]; then exit 0; fi

# מריצים את השער. עובר -> מאפשרים סיום. נכשל -> חוסמים פעם אחת (exit 2) והסיבה
# ל-stderr מוחזרת למודל כדי שיתקן את הטענות הלא-מאומתות.
# shellcheck disable=SC2086
if OUT=$(node scripts/verify-sources.mjs $CHANGED 2>&1); then
  exit 0
else
  {
    echo "🚫 שער אימות-מקור נכשל — יש טענות טכניות שאינן מאומתות במקור הרשמי."
    echo "תקן או הסר אותן לפני סיום:"
    echo "$OUT"
  } >&2
  exit 2
fi
