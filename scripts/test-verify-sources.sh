#!/bin/bash
# בדיקות התנהגות של שער אימות-המקור. ר' tests/gate/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."
FAIL=0

expect() { # expect <0|1> <fixture> <תיאור>
  local want="$1" f="tests/gate/$2" desc="$3"
  node scripts/verify-sources.mjs "$f" > /dev/null 2>&1
  local got=$?
  if [ "$got" = "$want" ]; then
    echo "✓ $desc"
  else
    echo "✗ $desc (expected exit $want, got $got)"
    FAIL=1
  fi
}

expect 0 path-segment-not-command.md "רכיב נתיב (/path/to/x) אינו מחולץ כפקודה"
expect 1 substring-flag-rejected.md "--continu אינו מאומת ע\"י --continue"
expect 1 url-segment-not-verification.md "טוקן שקיים רק כסגמנט URL אינו מאומת"
expect 0 git-scm-host-allowed.md "git-scm.com מותר ב-allowlist"
expect 0 origin-original-skipped.md "origin: original פטור מהשער"

exit $FAIL
