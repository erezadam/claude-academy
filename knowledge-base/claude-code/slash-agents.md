---
title: "/agents"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/mcp, /bashes, /todos]
---

## /agents

מה זה עושה: מנהל subagents — instances נפרדות של Claude שעובדות במקביל עם context window נפרד.

### שימוש
```
/agents
```

### מה זה subagent
```
Session ראשי
  └── Subagent A: בודק אבטחה ב-src/auth/
  └── Subagent B: כותב tests ל-API
  └── Subagent C: מעדכן תיעוד

כל subagent = context window נפרד = לא "גונב" tokens מהsession הראשי
```

### מתי להשתמש
- ✅ משימות ארוכות שיאכלו את כל הcontext
- ✅ מחקר — "בדוק את כל הdocs ותסכם לי"
- ✅ עבודה מקבילית על חלקים שונים
- ❌ tasks פשוטים — overhead מיותר

### הפעלת subagent בprompt
```
"שלח subagent שיקרא את כל קבצי ה-tests
ויסכם מה מכוסה ומה חסר — בלי לשנות כלום"
```

### /bashes — tasks שרצים ברקע
```
/bashes    ← רשימת כל התהליכים הפעילים
```

💡 Subagents הם הפתרון ל-context ארוך — הם עובדים בנפרד ומחזירים רק את הסיכום.

💡 לimport context: `Ctrl+B` — הרץ task ברקע בלי לעצור את השיחה.

→ קשור ל: /bashes, /todos, /context
