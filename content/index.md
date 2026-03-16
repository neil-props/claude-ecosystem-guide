---
title: Claude Ecosystem Guide
slug: index
order: 0
description: A comprehensive guide to the Claude Code ecosystem
section: root
---

# Claude Ecosystem Guide

Welcome to the comprehensive guide to the Claude Code ecosystem. This site covers all the extension points and configuration options available in Claude Code, helping you understand which tools to use and how to set them up.

## Extension Points

Explore the 10 core extension points that make Claude Code customizable:

- [MCP Servers and Connectors](topics/mcp.html) - Connect Claude to external tools and data sources
- [Skills](topics/skills.html) - Teach Claude reusable patterns and capabilities
- [Plugins](topics/plugins.html) - Extend Claude Code with third-party integrations
- [Hooks](topics/hooks.html) - Run scripts at key lifecycle events
- [Agents](topics/agents.html) - Create specialized AI workflows
- [Projects and CLAUDE.md](topics/projects.html) - Configure project-level behavior
- [Connectors](topics/connectors.html) - Connect Claude to external services
- [Commands](topics/commands.html) - Define reusable prompt shortcuts
- [Memory](topics/memory.html) - Manage Claude's persistent context
- [Settings](topics/settings.html) - Control Claude Code configuration at every level

## Quick Start

Here is an example `.mcp.json` configuration that connects Claude to a filesystem server:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {}
    }
  }
}
```

## About This Guide

This guide is built from markdown source files and generates static HTML with syntax highlighting and copy-to-clipboard code blocks. No frameworks, no client-side rendering -- just fast, accessible HTML.
