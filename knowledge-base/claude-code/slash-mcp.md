---
title: "/mcp"
category: claude-code
layer: intermediate
last_verified: 2026-03-07
status: current
source_url: https://code.claude.com/docs/en/slash-commands
related: [/config, /permissions]
---

## /mcp

מה זה עושה: מנהל חיבורים ל-MCP servers — שרתים שמרחיבים את יכולות Claude Code.

### שימוש
```
/mcp
```

### מה זה MCP
Model Context Protocol — תקן שמאפשר ל-Claude Code לדבר עם כלים חיצוניים:
- GitHub — קרא issues, פתח PRs
- Slack — שלח הודעות
- Jira — נהל tasks
- PostgreSQL — שאל בסיסי נתונים
- Figma — קרא designs

### תפריט /mcp
```
> /mcp

Connected servers:
  ✅ github-mcp      (15 tools)
  ✅ postgres-mcp    (8 tools)
  ❌ slack-mcp       (not responding)

Options:
  [A] Add server
  [R] Remove server
  [T] Test connection
  [V] View available tools
```

### הוספת MCP server
```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
```

### פקודות MCP
אחרי חיבור, הפקודות מופיעות אוטומטית:
```
/mcp__github__list_prs
/mcp__github__create_issue "כותרת" 
/mcp__postgres__query "SELECT * FROM users"
```

💡 MCP servers = superpower של Claude Code. GitHub MCP לבד חוסך שעות.

⚠️ אל תשים API keys בקוד — השתמש ב-environment variables.

→ קשור ל: /config, /permissions
