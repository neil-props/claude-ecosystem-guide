---
name: ecosystem-mcp
description: Knowledge about MCP (Model Context Protocol) in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# MCP (Model Context Protocol)

## Overview

MCP is an open standard (JSON-RPC 2.0) connecting Claude to external tools, APIs, and data sources. Created by Anthropic, donated to the Linux Foundation's Agentic AI Foundation (Dec 2025), co-founded with Block and OpenAI. Vendor-neutral -- the same MCP server works with Claude, ChatGPT, Gemini, and other AI clients.

In Claude Chat, MCP integrations are called **Connectors** (50+ pre-built). In Claude Code, they are configured via CLI or `.mcp.json`.

## Three Capabilities

- **Tools** -- actions Claude can invoke (query DB, send message, create PR)
- **Resources** -- data Claude can read (file contents, API responses)
- **Prompts** -- reusable templates for common interactions

## Transport Types

| Transport | Use Case | Notes |
|-----------|----------|-------|
| **stdio** | Local processes | Most common for dev tools. Fast, no network. |
| **Streamable HTTP** | Remote servers | Current standard for remote MCP. Replaced SSE. |
| **SSE** | Legacy remote | Still works but superseded. Use streamable HTTP for new projects. |

## Configuration

### CLI Setup

```bash
# Add local stdio server
claude mcp add my-server -- npx @example/mcp-server

# Add remote HTTP server
claude mcp add --transport http my-api https://api.example.com/mcp

# With environment variables
claude mcp add my-db --env DB_URL=postgresql://localhost/mydb -- npx @example/postgres-mcp

# Manage servers
claude mcp list
claude mcp remove my-db
```

### .mcp.json (Project-Level)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "analytics": {
      "type": "http",
      "url": "https://mcp.example.com/analytics",
      "headers": { "Authorization": "Bearer ${ANALYTICS_TOKEN}" }
    }
  }
}
```

Use `${ENV_VAR}` syntax for secrets so each developer uses their own tokens. Check this file into git.

### Scope Precedence

| Scope | Location | Visibility |
|-------|----------|------------|
| **Subagent** | Agent frontmatter | Scoped to that agent only |
| **Project** | `.mcp.json` (repo root) | Shared via git |
| **User** | `~/.claude/.mcp.json` | Personal, all projects |
| **Managed** | `managed-mcp.json` | Org-wide, admin-controlled |

### Enterprise: managed-mcp.json

Organization admins control allowed/denied servers:
- `allowedMcpServers` -- whitelist (glob patterns for name, URL, command)
- `deniedMcpServers` -- blocklist (takes priority over allowlist)
- Deployed via MDM (Jamf, Intune) to system-level path

### Tool Search

When MCP tools exceed 10% of context window, Tool Search auto-defers tool loading. Configure with `ENABLE_TOOL_SEARCH=auto:N`.

## When to Use MCP

**Use MCP when:**
- Claude needs to interact with external tools, APIs, or data sources
- You want vendor-neutral integrations across AI clients
- You need team-shared tool configs via `.mcp.json`

**Don't use MCP when:**
- A Skill with instructions would suffice (skills are lighter, no server process)
- You only need to teach Claude a pattern (use a skill)
- You need deterministic automation at events (use Hooks)

## Key Decision: MCP vs Skills

MCP provides *tools* (actions and data). Skills provide *instructions* (knowledge and processes). They complement each other -- a skill can instruct Claude on *when* to use an MCP tool.

## Common Pitfalls

1. **Hardcoded secrets** -- Always use `${ENV_VAR}` syntax in `.mcp.json`, never hardcode tokens
2. **SSE for new servers** -- Use streamable HTTP for all new remote servers, SSE is legacy
3. **Too many servers** -- Remove unused servers (`claude mcp remove`) to keep context lean
