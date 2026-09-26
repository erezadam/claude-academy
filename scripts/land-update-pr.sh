#!/usr/bin/env bash
# מנחית PR עדכון (academy-update/*) ל-main — משותף ל-weekly-academy-update ול-watchdog.
#
# למה זה קיים: ה-branch protection של main דורש שבדיקות החובה verify-full-corpus
# ו-visual-smoke יעברו. הן מתחילות לרוץ רק כשהסוכן פותח את ה-PR, ו-visual-smoke
# לוקחת כמה דקות (playwright + build). המיזוג הישן רץ ~דקה אחרי פתיחת ה-PR, ולכן
# נדחה בכל שבוע ב-"the base branch policy prohibits the merge" (ריצות #30–#34).
# כאן ממתינים לבדיקות החובה, ורק אז ממזגים.
#
# שימוש: land-update-pr.sh <PR_NUM>
#   CLOSE_IF_STALE=1  — PR עם קונפליקט / מאחורי main נסגר (הענף נשמר) במקום להיכשל.
#                       ה-watchdog משתמש בזה כדי ש-PR ישן לא ייתקע אותו לנצח (#87).
#   LAND_TIMEOUT_SEC  — זמן המתנה מרבי לבדיקות (ברירת מחדל 1500 שניות).
# פלט ל-GITHUB_OUTPUT: merged=true או closed=true.
# יציאה: 0 = מוזג או נסגר כמיושן; 1 = בדיקת חובה נכשלה / קונפליקט / timeout.
set -euo pipefail

PR="${1:?usage: land-update-pr.sh <PR_NUM>}"
TIMEOUT_SEC="${LAND_TIMEOUT_SEC:-1500}"
INTERVAL_SEC="${LAND_INTERVAL_SEC:-20}"

out() { if [ -n "${GITHUB_OUTPUT:-}" ]; then echo "$1" >> "$GITHUB_OUTPUT"; fi; }

deadline=$(( $(date +%s) + TIMEOUT_SEC ))

while :; do
  state=$(gh pr view "$PR" --json mergeStateStatus --jq .mergeStateStatus)

  # gh pr checks יוצא בקוד 8 כשיש בדיקות pending ובקוד 1 כשעוד לא דווחו בדיקות —
  # שניהם מצבי המתנה לגיטימיים, לכן לא נותנים ל-set -e להפיל כאן.
  checks=$(gh pr checks "$PR" --required --json name,bucket 2>/dev/null) || true
  [ -n "$checks" ] || checks='[]'
  failed=$(jq -r '[.[] | select(.bucket == "fail" or .bucket == "cancel") | .name] | join(", ")' <<<"$checks")
  pending=$(jq -r '[.[] | select(.bucket == "pending") | .name] | join(", ")' <<<"$checks")
  echo "PR #$PR: mergeStateStatus=$state pending=[$pending] failed=[$failed]"

  if [ -n "$failed" ]; then
    echo "::error::בדיקות חובה נכשלו על PR #$PR: $failed — לא ממזגים."
    exit 1
  fi

  case "$state" in
    CLEAN|HAS_HOOKS|UNSTABLE)
      break
      ;;
    DIRTY|BEHIND)
      # עדכון של הענף עם GITHUB_TOKEN לא מפעיל workflows, כך שבדיקות החובה לא
      # היו רצות על ה-head החדש והמיזוג היה נתקע. סורקים מחדש במקום לתקן.
      if [ "${CLOSE_IF_STALE:-0}" = "1" ]; then
        gh pr comment "$PR" --body "🤖 ה-watchdog סגר את ה-PR הזה: הוא מיושן מול main (mergeStateStatus=$state) ולא ניתן למזג אותו אוטומטית. הענף נשמר לעיון; הסריקה הבאה תזהה מחדש את מה שחסר."
        gh pr close "$PR"
        out "closed=true"
        echo "::warning::PR #$PR מיושן ($state) — נסגר, הענף נשמר."
        exit 0
      fi
      echo "::error::PR #$PR לא ניתן למיזוג (mergeStateStatus=$state) — main השתנה במהלך הריצה. ה-watchdog יטפל."
      exit 1
      ;;
  esac

  if [ "$(date +%s)" -ge "$deadline" ]; then
    echo "::error::פג הזמן (${TIMEOUT_SEC}s) בהמתנה לבדיקות החובה על PR #$PR (state=$state, pending=[$pending])."
    exit 1
  fi
  sleep "$INTERVAL_SEC"
done

gh pr merge "$PR" --squash --delete-branch
out "merged=true"
echo "✅ מוזג PR #$PR ל-main."
