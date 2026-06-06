---
schema: project-card/v1
name: claude-academy
purpose: מאגר ידע בעברית (RTL) על Claude Code ו-Git, שמתעדכן אוטומטית מדי שבוע מהמקורות הרשמיים.
status: active
created: 2026-06-06
last_verified: 2026-06-06

stack:
  language: TypeScript
  framework: Next.js 16 (App Router, Turbopack)
  runtime: Node 20
  key_libs: [react 19, gray-matter, tailwindcss 4]

run:
  prereqs:
    - Node 20
    - npm
  install: npm install
  dev: npm run dev
  build: npm run build
  ports: [3000]
---

## Future-me note
התוכן מתעדכן אוטומטית דרך GitHub Action (`.github/workflows/weekly-academy-update.yml`) שרץ **שבת 06:17 UTC** (לא בתחילת שעה עגולה — כי GitHub משמיט ריצות schedule בשעות עומס; זה מה שקרה ב-6/6/2026). ה-Action קורא את `.claude/academy-update-spec.md`, סורק את המקורות הרשמיים, ו**פותח PR בלבד — לא דוחף ל-main**. כדי שהאתר יתעדכן צריך למזג את ה-PR. התאריך באתר נגזר מ-`last_verified` במאמרים ומ-`data/changelog.json`.

## How to run
1. דרישות: Node 20, npm. התקנה: `npm install`
2. הרצה: `npm run dev` (פורט 3000)
