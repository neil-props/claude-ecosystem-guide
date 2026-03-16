---
title: Connectors
slug: connectors
order: 7
description: Connect Claude Code to external services and data platforms
color: "#fbbf24"
section: topics
---

# Interactive Apps

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Interactive Apps are live application interfaces embedded directly inside Claude Chat conversations. Built on the MCP Apps extension (co-developed by Anthropic and OpenAI, Nov 2025), these render sandboxed HTML iframes that let you interact with external apps -- Slack, Figma, Asana, Canva, and more -- without leaving Claude.

> **Naming note:** In Claude Chat settings, MCP server connections are called "Connectors" (covered in the [MCP](mcp.html) page). The Interactive Apps extension point described here is specifically about embedded UI applications within conversations -- a distinct capability built on top of the MCP Apps protocol extension.

**How Connectors differ from MCP in Claude Code:** Connectors are pre-built, one-click MCP integrations available in Claude Chat and Cowork -- they are the managed, hosted version of what MCP does in Claude Code. In Claude Code, you configure MCP servers directly via CLI or `.mcp.json`. In Claude Chat, you just click "Connect" and authorize the service. Interactive Apps go a step further by rendering visual UI inside the conversation.

Interactive Apps are available in Claude Chat only (claude.ai web interface). They are not available in Claude Code or Claude Cowork.

### Available Interactive Apps

The MCP Apps extension enables a growing catalog of embedded applications:

| Category | Apps | Capability |
|----------|------|-----------|
| **Communication** | Slack | Read and send messages in channels |
| **Design** | Figma, Canva | View designs inline, create and edit directly |
| **Project Management** | Asana | Manage tasks and projects |
| **File Management** | Box | Browse and manage files |
| **CRM** | Clay | CRM and prospecting |

Additional connectors for productivity and data services (Google Drive, Notion, Confluence, Jira, Linear, and 50+ more) are available as standard MCP connectors in Claude Chat -- they provide tool access without embedded UI.

## How It Works

### In Claude Chat

The MCP Apps extension enables MCP servers to render interactive UIs via sandboxed iframes inside the Claude Chat interface. The interaction is bidirectional:

1. Claude invokes an Interactive App through the MCP Apps protocol
2. The app renders as a sandboxed HTML iframe within the conversation
3. You interact with the embedded app (browse files, send messages, view designs)
4. Claude can read from and write to the embedded app
5. Results from your interactions flow back into the conversation context

To use Interactive Apps, the corresponding connector must be enabled in **Settings > Connectors** (or claude.ai/settings/connectors).

### MCP Apps Extension

The MCP Apps extension was introduced in November 2025 and co-developed with OpenAI. It extends the MCP protocol so that MCP servers can:

- Render interactive HTML UIs inside AI client interfaces
- Use sandboxed iframes for security isolation
- Enable bidirectional communication between the AI and the embedded app

This is an ecosystem-level capability -- the same MCP Apps standard works across Claude, ChatGPT, and other supporting AI clients.

## When to Use Connectors

- **Use Connectors in Claude Chat** when you want instant, one-click access to external tools without any configuration
- **Use Interactive Apps** when your task benefits from visual context -- reviewing Figma designs, browsing Slack conversations, managing Asana tasks
- **Use raw MCP in Claude Code** when you need more control, custom server configuration, or are working in a terminal-based workflow
- **Don't use Interactive Apps** for data-heavy integrations (databases, large APIs) -- use standard MCP Connectors or MCP servers instead

> [!TIP]
> **Consider alternatives:** If you need more control or custom server configuration, consider [MCP](mcp.html) servers directly. If you want to bundle integrations with other capabilities, consider [Plugins](plugins.html). For a detailed comparison, see [MCP vs Plugin vs Connector](comparisons.html).

## Best Practices

- Use Interactive Apps for tasks that benefit from visual context -- reviewing Figma designs, browsing Slack conversations, managing Asana tasks
- Combine Interactive Apps with Chat Projects for persistent workflow context
- For data-heavy integrations (databases, APIs), use standard MCP Connectors instead of Interactive Apps
- Remember that Interactive Apps are Chat-only -- for Code and Cowork, use MCP servers and Connectors directly

## Common Questions

**How do I use Figma or Slack inside a Claude conversation?**
Interactive Apps in Claude Chat embed live app interfaces directly in your conversation. Go to Settings > Connectors, enable the Figma or Slack connector, authorize it, and the embedded app will appear when relevant during your conversations. Built on the MCP Apps extension.

**What is the difference between Connectors and Interactive Apps?**
"Connectors" in Claude Chat settings refers to MCP server connections that give Claude access to external tools (covered in the MCP page). Interactive Apps are a specific type of connector that also renders an embedded UI within the conversation -- you can see and interact with the app (Figma, Slack, Asana) directly in the chat.

**Are Interactive Apps available in Claude Code or Cowork?**
No, Interactive Apps are currently available only in Claude Chat (claude.ai web interface). Claude Code uses MCP servers configured via CLI or `.mcp.json`. Cowork uses connectors configured in the Customize menu, bundled within plugins.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

Interactive Apps and Connectors are managed through the **Claude Chat web interface** (claude.ai), not through CLI configuration. To enable a connector:

1. Go to **Settings > Connectors** in Claude Chat (or visit claude.ai/settings/connectors)
2. Find the connector you want (Figma, Slack, Asana, etc.)
3. Click **Connect** and authorize the service

No CLI setup or config files are needed -- Connectors are one-click integrations.

**Looking for tool server setup in Claude Code?** Connectors are the managed equivalent of MCP servers. For adding tool servers to Claude Code via CLI or `.mcp.json`, see the [MCP How-To guides](mcp.html).

<!-- end howto -->

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

Connectors are configured through the Claude Chat UI and do not have a CLI config schema. They are pre-built, hosted MCP integrations managed by Anthropic.

### Available Interactive Apps

Interactive Apps render embedded UI within Claude Chat conversations:

| App | Category | Capability |
|-----|----------|-----------|
| Figma | Design | View and edit designs inline |
| Canva | Design | Create and edit visual content |
| Slack | Communication | Read and send messages |
| Asana | Project Management | Manage tasks and projects |
| Box | File Management | Browse and manage files |
| Clay | CRM | CRM and prospecting |

### Standard Connectors

50+ additional connectors provide tool access without embedded UI, including Google Drive, Notion, Confluence, Jira, Linear, HubSpot, Salesforce, and more. These are enabled the same way -- through **Settings > Connectors** in Claude Chat.

For CLI-based tool server configuration in Claude Code, see the [MCP Reference](mcp.html).

  </div>
</div>

## Related

- [MCP](mcp.html) -- The protocol layer that powers both Connectors and Interactive Apps
- [Plugins](plugins.html) -- Plugins can bundle connector configs alongside skills and agents
- [Projects](projects.html) -- Combine Interactive Apps with Projects for persistent workflow context
