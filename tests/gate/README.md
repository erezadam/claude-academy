# בדיקות שער אימות-המקור

`bash scripts/test-verify-sources.sh` — מריץ את השער על ה-fixtures כאן ובודק
קודי-יציאה. כל fixture מקבע התנהגות שנקבעה אחרי אירוע אמיתי:

- `path-segment-not-command.md` — `/path/to/x` הוא רכיב נתיב, לא פקודת slash;
  המאתר לא מחלץ אותו (הבאג שנמצא ב-sessions.md, בדיקה 1 של פאזה 1).
- `substring-flag-rejected.md` — `--continu` לא מאומת ע"י `--continue` (התאמת
  טוקן מלא, PR ‎#49).
- `url-segment-not-verification.md` — טוקן שמופיע במקור רק כסגמנט URL
  (`/en/memory`) אינו נחשב מאומת — נעילת ההתנהגות שנבדקה מול 15 מועמדי ה-C1.
- `git-scm-host-allowed.md` — git-scm.com ב-allowlist (הכרעת מדיניות).
- `origin-original-skipped.md` — `origin: original` פטור מהשער בהודעה גלויה.
