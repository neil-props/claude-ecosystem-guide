---
title: MCP Servers and Connectors
slug: mcp
order: 1
description: The Model Context Protocol connects Claude to external tools and data sources
color: "#fb923c"
section: topics
---

# MCP Servers and Connectors

## Overview

The Model Context Protocol (MCP) is the primary way to connect Claude Code to external tools, APIs, and data sources. MCP servers expose capabilities that Claude can discover and invoke during conversations, from reading databases to calling REST APIs to interacting with cloud services.

MCP supports three transport types: stdio (local processes), SSE (server-sent events), and streamable HTTP for remote servers.

## Quick Example

Configure an MCP server in your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Coming Soon

Full content including setup guides, transport comparisons, authentication patterns, and building custom MCP servers will be added in Phases 2-4.
