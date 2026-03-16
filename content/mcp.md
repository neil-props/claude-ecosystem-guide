---
title: MCP Servers and Connectors
slug: mcp
order: 1
description: The Model Context Protocol connects Claude to external tools and data sources
color: "#fb923c"
section: topics
---

# MCP Servers and Connectors

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

The Model Context Protocol (MCP) is an open standard based on JSON-RPC 2.0 that connects Claude to external tools, APIs, and data sources. Think of it as the "USB-C of AI" -- a universal connector that works across Claude Code, Claude Chat, and Claude Cowork.

MCP was created by Anthropic, donated to the Linux Foundation's Agentic AI Foundation (AAIF) in December 2025, and is co-founded with Block and OpenAI, with backing from Google, Microsoft, and AWS. It is vendor-neutral: the same MCP server works with Claude, ChatGPT, Gemini, and other AI clients. The protocol has reached 97M+ monthly SDK downloads.

In Claude Chat, MCP integrations are called **Connectors** -- there are 50+ pre-built, one-click integrations available. In Claude Code, they are configured via CLI or `.mcp.json` config files.

MCP servers expose three types of capabilities:

- **Tools** -- actions Claude can invoke (query a database, send a message)
- **Resources** -- data Claude can read (file contents, API responses)
- **Prompts** -- reusable templates for common interactions

## How It Works

An MCP server exposes tools via JSON-RPC over a transport layer. Claude discovers available tools at session start (or on-demand via Tool Search) and calls them as needed, with results flowing back into the conversation context.

MCP supports three transport types:

| Transport | Use Case | Details |
|-----------|----------|---------|
| **stdio** | Local processes | Server runs as a child process. Most common for dev tools. Fast, no network overhead. |
| **Streamable HTTP** | Remote servers | HTTP-based transport for cloud-hosted servers. Current recommended standard for remote MCP. |
| **SSE** | Legacy remote | Server-sent events. Still functional but being superseded by streamable HTTP. Use streamable HTTP for new projects. |

**Streamable HTTP** is the current standard for remote MCP servers. It replaced SSE as the recommended transport and offers better reliability and broader infrastructure compatibility. SSE remains supported for backward compatibility but new remote servers should use streamable HTTP.

The **MCP Apps extension** (Nov 2025, co-developed with OpenAI) enables MCP servers to render interactive UIs via sandboxed HTML iframes inside AI clients.

### In Claude Code

Configure MCP servers via CLI or config files:

```bash
# Add a local stdio server
claude mcp add my-server -- npx @example/mcp-server

# Add a remote HTTP server
claude mcp add --transport http my-api https://api.example.com/mcp

# With environment variables
claude mcp add my-db -- npx @example/postgres-mcp \
  --env DB_URL=postgresql://localhost/mydb
```

MCP servers in Claude Code have **4 scopes** with clear precedence:

| Scope | Location | Visibility |
|-------|----------|------------|
| **Managed** | `managed-mcp.json` (system-level) | Organization-wide, admin-controlled |
| **Project** | `.mcp.json` (repo root) | Shared with team via git |
| **User** | `~/.claude.json` | All your projects, personal |
| **Local** | `~/.claude.json` (per-project) | Private to you, per-project (default) |

Precedence: Subagent > Project > User > Managed.

Agents can declare their own MCP servers in frontmatter, scoped to that agent's context only.

**Tool Search** auto-defers tool loading when MCP tools exceed 10% of context window. Configure with `ENABLE_TOOL_SEARCH=auto:N` where N is the threshold count.

**Manage servers:**

```bash
claude mcp list           # Show configured servers
claude mcp remove my-db   # Remove a server
```

### In Claude Chat

In Claude Chat, MCP integrations are called **Connectors**:

1. Go to **Settings > Connectors** (or claude.ai/settings/connectors)
2. Browse the 50+ available connectors
3. Click "Connect" and authorize the service
4. The connector's tools become available in all conversations

Popular connectors include Jira, Confluence, Slack, Asana, Linear, Sentry, Intercom, Zapier, and Google Workspace.

**Interactive Apps** (Jan 2026+) extend connectors further -- live app interfaces (Slack, Figma, Asana, Canva, Box, Clay) embed directly inside Claude Chat conversations via the MCP Apps extension.

### In Claude Cowork

- Connectors configured in the **Customize** menu
- Bundled within plugins (e.g., Salesforce connector in the Sales plugin)
- Users control which connectors are active and whether internet access is allowed

## When to Use MCP

**Use MCP when:**
- You need Claude to interact with external tools, APIs, or data sources
- You want a standardized, vendor-neutral integration that works across AI clients
- You need team-shared tool configurations (via `.mcp.json` in your repo)
- You are building integrations that should work across Claude Code, Chat, and Cowork

**Don't use MCP when:**
- A simple [Skill](skills.html) with instructions would suffice -- skills are lighter weight and don't require running a server process
- You only need to teach Claude a process or pattern (use a skill instead)
- You need deterministic automation at lifecycle events (use [Hooks](hooks.html) instead)

**MCP vs other extension points:**
- **MCP vs Skills:** MCP provides *tools* (actions and data); Skills provide *instructions* (knowledge and processes). They complement each other -- a skill might instruct Claude on *when* to use an MCP tool.
- **MCP vs Plugins:** Plugins can *bundle* MCP server configs alongside skills and agents. MCP is the protocol; plugins are the distribution mechanism.

## Configuration

### Project-shared `.mcp.json`

Check this into git so the whole team shares the same MCP servers:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "${DATABASE_URL}" }
    }
  }
}
```

Use `${ENV_VAR}` syntax for secrets -- each developer sets their own tokens locally.

### Organization-wide enforcement

Use `managed-mcp.json` (pushed via MDM, Chef, Puppet, Ansible):

```json
{
  "mcpServers": { },
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverUrl": "https://*.yourcompany.com/*" }
  ],
  "deniedMcpServers": [
    { "serverCommand": "npx untrusted-*" }
  ]
}
```

### Authentication

MCP supports OAuth 2.0, custom auth headers, and environment variable expansion (`${MY_TOKEN}`). For pre-enriched contacts via linked services, read from the link first to save API quota.

## Best Practices

- Let Claude use **all your tools** via MCP -- Slack, BigQuery, Sentry, CRM, etc.
- In Chat, use **Connectors** (one-click setup). In Code, use `.mcp.json`.
- Use Tool Search when MCP tools exceed 10% of context to avoid bloat.
- For team-shared configs, use `.mcp.json` at the repo root with `${ENV_VAR}` syntax for secrets.
- Remove unused MCP servers (`claude mcp remove`) to keep context lean.
- Use streamable HTTP transport for remote servers, stdio for local processes.
- ZoomInfo, HubSpot, Salesforce, and 50+ services have pre-built Chat connectors.

## Common Questions

**What is MCP and why should my team care about it?**
MCP is a vendor-neutral open standard that connects AI models to external tools. It was donated to the Linux Foundation in Dec 2025 and is backed by Google, Microsoft, AWS, and OpenAI. The same MCP server works across Claude, ChatGPT, and other AI clients, so your integrations are future-proof.

**How do I install and configure an MCP server in Claude Code?**
Use the CLI: `claude mcp add my-server -- npx @example/mcp-server`. For team-wide sharing, create a `.mcp.json` at the repo root (checked into git) with `${ENV_VAR}` syntax for secrets. Each developer sets their own tokens locally.

**How do I debug MCP connection issues?**
Start with `claude mcp list` to check server status. Test the server command manually (`npx @example/mcp-server`) to see errors. Common issues: missing env vars (API tokens), timeout on slow server startup, and using deprecated SSE transport instead of streamable HTTP.

**How do I share MCP configurations across my team?**
Use a project-level `.mcp.json` file checked into git with `${ENV_VAR}` syntax for secrets. Add setup instructions to your project onboarding docs. For org-wide enforcement, use `managed-mcp.json` pushed via MDM.

**How do I build a custom MCP server?**
Use the TypeScript SDK (`@modelcontextprotocol/sdk`) or any of the SDKs available in Python, Go, Rust, Java, and C#. A minimal server defines tools with JSON schemas and handles tool calls. Test locally with `claude mcp add my-server -- node ./my-server.js`.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

> [!INFO]
> Step-by-step guides for MCP are coming in Phase 4.

Planned guides:
- How to set up an MCP server (stdio transport) -- _coming soon_
- How to set up an MCP server (SSE/streamable HTTP transport) -- _coming soon_
- How to configure MCP authentication -- _coming soon_
- How to build your own MCP server -- _coming soon_

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

> [!INFO]
> Detailed reference specs for MCP are coming in Phase 4.

Planned references:
- MCP config schema (.mcp.json format, all fields) -- _coming soon_
- Environment variables reference -- _coming soon_

  </div>
</div>

## Related

- [Skills](skills.html) -- Skills provide instructions, MCP provides tools; they complement each other
- [Plugins](plugins.html) -- Plugins can bundle MCP server configs alongside skills and agents
- [Connectors](connectors.html) -- Interactive Apps built on MCP in Claude Chat
