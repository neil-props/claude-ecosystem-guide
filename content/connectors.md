---
title: Connectors
slug: connectors
order: 7
description: Connect Claude Code to external services and data platforms
color: "#fbbf24"
section: topics
---

# Interactive Apps

## Overview

Interactive Apps are live application interfaces embedded directly inside Claude Chat conversations. Built on the MCP Apps extension (co-developed with Anthropic and OpenAI, Nov 2025), these render sandboxed HTML iframes that let you interact with external apps -- Slack, Figma, Asana, Canva, and more -- without leaving Claude.

> **Naming note:** In Claude Chat settings, MCP server connections are called "Connectors" (covered in the [MCP](mcp.html) page). The Interactive Apps extension point described here is specifically about embedded UI applications within conversations -- a distinct capability built on top of the MCP Apps protocol extension.

Interactive Apps are available in Claude Chat only (claude.ai web interface). They are not available in Claude Code or Claude Cowork.

## How It Works

### In Claude Chat

The MCP Apps extension enables MCP servers to render interactive UIs via sandboxed iframes inside the Claude Chat interface. The interaction is bidirectional:

1. Claude invokes an Interactive App through the MCP Apps protocol
2. The app renders as a sandboxed HTML iframe within the conversation
3. You interact with the embedded app (browse files, send messages, view designs)
4. Claude can read from and write to the embedded app
5. Results from your interactions flow back into the conversation context

**Available Interactive Apps (Jan 2026+):**

| App | Capability |
|-----|-----------|
| **Slack** | Read and send messages in channels |
| **Figma** | View and discuss designs inline |
| **Asana** | Manage tasks and projects |
| **Canva** | Create and edit designs directly |
| **Box** | Browse and manage files |
| **Clay** | CRM and prospecting |

To use Interactive Apps, the corresponding connector must be enabled in **Settings > Connectors** (or claude.ai/settings/connectors).

### MCP Apps Extension

The MCP Apps extension was introduced in November 2025 and co-developed with OpenAI. It extends the MCP protocol so that MCP servers can:

- Render interactive HTML UIs inside AI client interfaces
- Use sandboxed iframes for security isolation
- Enable bidirectional communication between the AI and the embedded app

This is an ecosystem-level capability -- the same MCP Apps standard works across Claude, ChatGPT, and other supporting AI clients.

## Configuration

Interactive Apps require no special configuration beyond enabling the relevant connector:

1. Go to **Settings > Connectors** in Claude Chat
2. Find the service you want (Slack, Figma, Asana, etc.)
3. Click **Connect** and authorize the service
4. The Interactive App becomes available in conversations automatically

For Cowork, connectors (including those that power Interactive Apps) are configured in the **Customize** menu and may be bundled within plugins. Users control which connectors are active and whether internet access is allowed.

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

## Related

- [MCP](mcp.html) -- The protocol layer that powers both Connectors and Interactive Apps
- [Plugins](plugins.html) -- Plugins can bundle connector configs alongside skills and agents
- [Projects](projects.html) -- Combine Interactive Apps with Projects for persistent workflow context
