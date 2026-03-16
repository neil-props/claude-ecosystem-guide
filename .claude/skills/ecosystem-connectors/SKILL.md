---
name: ecosystem-connectors
description: Knowledge about Connectors and Interactive Apps in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Connectors and Interactive Apps

## Overview

Interactive Apps are live application interfaces embedded directly inside Claude Chat conversations. Built on the MCP Apps extension (co-developed by Anthropic and OpenAI, Nov 2025), they render sandboxed HTML iframes that let you interact with external apps -- Slack, Figma, Asana, Canva, and more -- without leaving Claude.

In Claude Chat settings, MCP server connections are called "Connectors." Interactive Apps are a specific type of connector that also renders an embedded UI within the conversation.

**How Connectors differ from MCP in Claude Code:** Connectors are pre-built, one-click MCP integrations available in Claude Chat and Cowork. In Claude Code, you configure MCP servers directly via CLI or `.mcp.json`. In Claude Chat, you click "Connect" and authorize. Interactive Apps go further by rendering visual UI inside the conversation.

Interactive Apps are available in Claude Chat only (claude.ai web interface). Not available in Claude Code or Cowork.

## Available Interactive Apps

| Category | Apps | Capability |
|----------|------|-----------|
| **Communication** | Slack | Read and send messages in channels |
| **Design** | Figma, Canva | View/edit designs inline |
| **Project Management** | Asana | Manage tasks and projects |
| **File Management** | Box | Browse and manage files |
| **CRM** | Clay | CRM and prospecting |

50+ additional standard connectors (Google Drive, Notion, Jira, Linear, etc.) provide tool access without embedded UI.

## How Interactive Apps Work

1. Claude invokes an Interactive App through the MCP Apps protocol
2. The app renders as a sandboxed HTML iframe within the conversation
3. You interact with the embedded app (browse files, send messages, view designs)
4. Claude can read from and write to the embedded app
5. Results flow back into the conversation context

Enable connectors in **Settings > Connectors** (claude.ai/settings/connectors).

## When to Use

- **Use Connectors in Claude Chat** -- instant, one-click access to external tools without configuration
- **Use Interactive Apps** -- when tasks benefit from visual context (reviewing Figma designs, browsing Slack)
- **Use raw MCP in Claude Code** -- when you need more control, custom server config, or terminal-based workflow
- **Don't use Interactive Apps** -- for data-heavy integrations (databases, large APIs); use standard MCP instead

## Key Decision: Connectors vs MCP

Connectors are the managed, hosted version of MCP for Claude Chat. MCP in Claude Code is self-configured. Choose based on interface: Chat users get Connectors automatically; Code users configure MCP servers directly.

## Common Pitfalls

1. **Expecting Interactive Apps in Claude Code** -- They are Chat-only; use MCP servers in Code
2. **Confusing Connectors with Interactive Apps** -- All Interactive Apps are Connectors, but most Connectors don't render embedded UI
3. **Data-heavy use** -- Interactive Apps are for visual context, not bulk data operations
