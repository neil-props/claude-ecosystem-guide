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

MCP servers are configured via `.mcp.json` (project and user scope) and `managed-mcp.json` (enterprise). Use `${ENV_VAR}` syntax for secrets so each developer uses their own tokens.

Quick example -- a project-shared `.mcp.json` checked into git:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

For organization-wide enforcement, use `managed-mcp.json` with `allowedMcpServers` and `deniedMcpServers` arrays to control which servers are permitted.

For the complete `.mcp.json` and `managed-mcp.json` schemas with all fields, types, and validation rules, see the **Reference** tab.

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

### How to Set Up an MCP Server (stdio)

Use stdio transport for local MCP servers that run as child processes. This is the most common setup for development tools.

#### Prerequisites

- Claude Code installed and working (`claude --version`)
- Node.js 18+ installed (for npx-based servers)
- A GitHub personal access token (for this example)

#### Step 1: Add a Server via CLI

Add the GitHub MCP server, which gives Claude access to GitHub tools (search repos, read issues, create PRs):

```bash
claude mcp add github-server -- npx @modelcontextprotocol/server-github
```

Claude Code will prompt you to set the required `GITHUB_TOKEN` environment variable. You can also pass it inline:

```bash
claude mcp add github-server \
  --env GITHUB_TOKEN=ghp_your_token_here \
  -- npx @modelcontextprotocol/server-github
```

#### Step 2: Verify the Server Is Registered

```bash
claude mcp list
```

You should see `github-server` listed with its command and status.

#### Step 3: Share with Your Team via `.mcp.json`

Create a `.mcp.json` file at your repository root so every team member gets the same MCP servers automatically:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

The `${GITHUB_TOKEN}` syntax means each developer uses their own token from their local environment. Check this file into git -- secrets stay local.

#### Step 4: Test in a Claude Code Session

Start a Claude Code session and ask Claude to use a GitHub tool:

```
> Find open issues labeled "bug" in our repository
```

Claude will discover the GitHub MCP tools and use them to search issues.

#### Verify It Works

- `claude mcp list` shows the server with status "connected" or "available"
- In a Claude Code session, Claude can invoke GitHub tools without errors
- Team members who clone the repo and have `GITHUB_TOKEN` set can use the same server

#### Troubleshooting

- **Server not appearing:** Run `claude mcp list` to check registration. If missing, re-add with `claude mcp add`.
- **"Command not found" error:** Ensure Node.js and npx are in your PATH. Try running the command manually: `npx @modelcontextprotocol/server-github`.
- **Environment variables not resolving:** Variables use `${VAR}` syntax in `.mcp.json`. Ensure the variable is exported in your shell (`export GITHUB_TOKEN=ghp_...`).
- **Server timing out:** Some servers take a few seconds to start. If Claude reports a timeout, try again -- the server may need to download dependencies on first run.

---

### How to Set Up an MCP Server (SSE/Streamable HTTP)

Use HTTP transport for remote MCP servers hosted on a URL. Streamable HTTP is the current standard, replacing the older SSE transport.

#### Prerequisites

- Claude Code installed and working
- A remote MCP server URL (provided by the server operator)
- An auth token if the server requires authentication

#### Step 1: Add a Remote Server

```bash
claude mcp add --transport http analytics-server https://mcp.example.com/analytics
```

The `--transport http` flag tells Claude Code this is a remote server using streamable HTTP.

#### Step 2: Add with Authentication Headers

If the server requires authentication, pass headers:

```bash
claude mcp add --transport http \
  --header "Authorization: Bearer ${ANALYTICS_TOKEN}" \
  analytics-server https://mcp.example.com/analytics
```

Or in `.mcp.json` for team sharing:

```json
{
  "mcpServers": {
    "analytics": {
      "type": "http",
      "url": "https://mcp.example.com/analytics",
      "headers": {
        "Authorization": "Bearer ${ANALYTICS_TOKEN}"
      }
    }
  }
}
```

#### Step 3: Verify the Connection

```bash
claude mcp list
```

Confirm the server appears and Claude can reach the remote URL.

#### Verify It Works

- `claude mcp list` shows the server with its URL
- In a Claude Code session, Claude can call tools provided by the remote server
- No connection timeout or authentication errors in the output

> [!NOTE]
> **Streamable HTTP vs SSE:** Streamable HTTP is the current standard for remote MCP. If you encounter documentation referencing SSE, the same servers generally support streamable HTTP. Use `--transport http` for new setups.

---

### How to Configure MCP Authentication

MCP servers often need credentials to access external services. Claude Code supports several authentication methods.

#### Step 1: Environment Variable Expansion in `.mcp.json`

The most common approach -- reference environment variables that each developer sets locally:

```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "DB_PASSWORD": "${DB_PASSWORD}"
      }
    }
  }
}
```

Variables use `${VAR_NAME}` syntax. Claude Code expands them from the developer's shell environment at server startup.

#### Step 2: OAuth 2.0 for Supported Servers

Some MCP servers support OAuth 2.0 authentication. When you add these servers, Claude Code will initiate the OAuth flow automatically:

```bash
claude mcp add --transport http my-saas https://saas.example.com/mcp
```

If the server supports OAuth, Claude Code will open a browser window for authorization. The token is stored securely and refreshed automatically.

#### Step 3: Custom Auth Headers for HTTP Transport

For servers that use API keys or bearer tokens via HTTP headers:

```json
{
  "mcpServers": {
    "api-service": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}",
        "X-Custom-Header": "custom-value"
      }
    }
  }
}
```

#### Step 4: Managed MCP Allowlists (Enterprise)

Organization admins can control which MCP servers are permitted using `managed-mcp.json`:

```json
{
  "mcpServers": {},
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "jira" },
    { "serverUrl": "https://*.yourcompany.com/*" }
  ],
  "deniedMcpServers": [
    { "serverCommand": "npx untrusted-*" }
  ]
}
```

- **`allowedMcpServers`** -- only these servers can be added by users
- **`deniedMcpServers`** -- these servers are blocked even if a user tries to add them
- Both support `serverName`, `serverUrl`, and `serverCommand` matchers with glob patterns

This file is deployed via MDM (Jamf, Intune), Chef, Puppet, or Ansible to a system-level location.

#### Verify It Works

- Servers with env vars: confirm `claude mcp list` shows the server, then test a tool call in a Claude Code session
- OAuth servers: confirm the browser auth flow completes and the server connects
- Managed allowlists: confirm that allowed servers can be added and denied servers are rejected

---

### How to Build Your Own MCP Server

Create a custom MCP server to give Claude access to your own tools, APIs, or data sources.

#### Prerequisites

- Node.js 18+ installed
- TypeScript recommended (but not required)
- Familiarity with JSON Schema for defining tool inputs

#### Step 1: Install the MCP SDK

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
```

#### Step 2: Create the Server

Create `server.js` with a tool definition. This example creates a weather lookup tool:

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0"
});

server.tool(
  "get-weather",
  "Get current weather for a city",
  { city: z.string().describe("City name, e.g. San Francisco") },
  async ({ city }) => {
    // Replace with a real API call in production
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );
    const data = await response.json();
    const current = data.current_condition[0];
    return {
      content: [{
        type: "text",
        text: `Weather in ${city}: ${current.temp_F}°F, ${current.weatherDesc[0].value}`
      }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

> [!NOTE]
> The SDK uses Zod for input validation. Install it with `npm install zod` if not already present.

#### Step 3: Register the Server Locally

```bash
claude mcp add weather-server -- node /absolute/path/to/my-mcp-server/server.js
```

Use an absolute path to the server file so it works from any directory.

#### Step 4: Test in a Claude Code Session

```
> What's the weather in Tokyo?
```

Claude will discover the `get-weather` tool and call your server.

#### Verify It Works

- `claude mcp list` shows `weather-server` with status "connected"
- Claude correctly invokes the `get-weather` tool when asked about weather
- The tool returns formatted results that Claude incorporates into its response

#### Troubleshooting

- **"Cannot find module" error:** Use an absolute path when registering with `claude mcp add`. Relative paths resolve from Claude Code's working directory, not yours.
- **Server crashes on startup:** Test manually with `node server.js` -- it should start and wait for stdio input without errors.
- **Tool not appearing:** Ensure `server.tool()` is called before `server.connect()`. Claude discovers tools at connection time.
- **Type errors in tool inputs:** Check your Zod schema matches what Claude is sending. Add `.describe()` to each field for better tool discovery.

<!-- end howto -->

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

### .mcp.json Config Schema

The `.mcp.json` file configures MCP servers for Claude Code. It supports two scopes based on file location.

#### File Location

| Scope | Path | Purpose |
|-------|------|---------|
| **Project** | `.mcp.json` at repository root | Shared with team via git. Loaded automatically when Claude Code opens the project. |
| **User** | `~/.claude/.mcp.json` | Personal servers available in all projects. Not shared. |

Project-scope servers are loaded first, then user-scope servers. If the same server name appears in both, the project-scope definition takes precedence.

#### Complete Schema Example

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "analytics": {
      "type": "http",
      "url": "https://mcp.example.com/analytics",
      "headers": {
        "Authorization": "Bearer ${ANALYTICS_TOKEN}"
      }
    }
  }
}
```

#### Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `mcpServers` | object | Yes | `{}` | Top-level object containing all server definitions. Keys are server names. |
| `mcpServers.<name>.command` | string | Yes (stdio) | -- | Executable command to run the server. Required for stdio transport. |
| `mcpServers.<name>.args` | string[] | No | `[]` | Arguments passed to the command. |
| `mcpServers.<name>.env` | object | No | `{}` | Environment variables for the server process. Values support `${VAR}` expansion from the host environment. |
| `mcpServers.<name>.type` | string | No | `"stdio"` | Transport type: `"stdio"` for local processes, `"http"` for remote servers. |
| `mcpServers.<name>.url` | string | Yes (http) | -- | Server URL. Required when `type` is `"http"`. |
| `mcpServers.<name>.headers` | object | No | `{}` | HTTP headers sent with requests. Only applicable when `type` is `"http"`. Values support `${VAR}` expansion. |

#### Environment Variable Expansion

Values in `env` and `headers` fields support `${VAR_NAME}` syntax. At server startup, Claude Code replaces these with values from the developer's shell environment.

```json
{
  "env": {
    "API_KEY": "${MY_API_KEY}",
    "DB_HOST": "${DB_HOST:-localhost}"
  }
}
```

If a referenced variable is not set, it resolves to an empty string. The server may fail to start if it requires the variable.

### managed-mcp.json Schema (Enterprise)

The `managed-mcp.json` file lets organization admins control which MCP servers are allowed or denied across all users. It is deployed to a system-level path via MDM or configuration management.

#### Complete Schema

```json
{
  "mcpServers": {
    "company-tools": {
      "command": "npx",
      "args": ["@company/mcp-internal-tools"],
      "env": {
        "COMPANY_TOKEN": "${COMPANY_TOKEN}"
      }
    }
  },
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "jira" },
    { "serverUrl": "https://*.company.com/*" }
  ],
  "deniedMcpServers": [
    { "serverCommand": "npx untrusted-*" },
    { "serverUrl": "http://*" }
  ]
}
```

#### Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `mcpServers` | object | No | `{}` | Organization-provided MCP servers. Same schema as `.mcp.json` servers. Always available to all users. |
| `allowedMcpServers` | array | No | `[]` | Allowlist of permitted servers. If non-empty, only matching servers can be added by users. |
| `allowedMcpServers[].serverName` | string | No | -- | Match by server name (exact or glob pattern). |
| `allowedMcpServers[].serverUrl` | string | No | -- | Match by server URL (glob pattern). |
| `allowedMcpServers[].serverCommand` | string | No | -- | Match by command (glob pattern). |
| `deniedMcpServers` | array | No | `[]` | Denylist of blocked servers. Denied servers cannot be added even if they match the allowlist. |
| `deniedMcpServers[].serverName` | string | No | -- | Match by server name (exact or glob pattern). |
| `deniedMcpServers[].serverUrl` | string | No | -- | Match by server URL (glob pattern). |
| `deniedMcpServers[].serverCommand` | string | No | -- | Match by command (glob pattern). |

#### Validation Rules

- The `mcpServers` object in `managed-mcp.json` follows the same schema as `.mcp.json`
- If `allowedMcpServers` is present and non-empty, it acts as a whitelist -- only matching servers are permitted
- `deniedMcpServers` takes priority over `allowedMcpServers` -- a server matching both is denied
- Glob patterns in matchers use standard glob syntax (`*` matches any characters, `?` matches one character)
- Managed servers (in the `mcpServers` object) are always available regardless of allow/deny rules

#### Scope Precedence

When servers are configured at multiple scopes, Claude Code resolves them in this order (highest priority first):

1. **Subagent** -- servers declared in an agent's frontmatter (scoped to that agent only)
2. **Project** -- `.mcp.json` at repository root
3. **User** -- `~/.claude/.mcp.json`
4. **Managed** -- `managed-mcp.json` (always loaded, cannot be overridden)

For the complete configuration overview, see the **Concept** tab.

### Minimal Example

A single stdio server with no environment variables:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### Full Example with Multiple Servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "my-org"
      }
    },
    "company-api": {
      "type": "http",
      "url": "https://mcp.company.com/tools",
      "headers": {
        "Authorization": "Bearer ${COMPANY_API_TOKEN}"
      }
    }
  }
}
```

  </div>
</div>

## Related

- [Skills](skills.html) -- Skills provide instructions, MCP provides tools; they complement each other
- [Plugins](plugins.html) -- Plugins can bundle MCP server configs alongside skills and agents
- [Connectors](connectors.html) -- Interactive Apps built on MCP in Claude Chat
