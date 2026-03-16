---
title: Claude Ecosystem Guide
slug: index
order: 0
description: A comprehensive guide to the Claude Code ecosystem
section: root
---

<span class="eyebrow eyebrow-turquoise">Reference Guide</span>

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

## Design System

The following showcase demonstrates all Props design system components. Toggle between dark and light themes using the sidebar toggle to verify both modes.

### Buttons

<div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.5rem 0;">
  <a class="btn btn-primary" href="#">Primary</a>
  <a class="btn btn-secondary" href="#">Secondary</a>
  <a class="btn btn-outline" href="#">Outline</a>
  <a class="btn btn-ghost" href="#">Ghost</a>
  <a class="btn btn-icterine" href="#">Icterine</a>
</div>

### Badges

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.5rem 0;">
  <span class="badge badge-turquoise">Turquoise</span>
  <span class="badge badge-icterine">Icterine</span>
  <span class="badge badge-oxford">Oxford</span>
  <span class="badge badge-dot badge-success">Active</span>
  <span class="badge badge-dot badge-warning">Beta</span>
  <span class="badge badge-dot badge-info">Info</span>
</div>

### Cards

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
  <div class="card">
    <div class="card-title">MCP Servers</div>
    <div class="card-body">Connect Claude to external tools and data sources using the Model Context Protocol.</div>
  </div>
  <div class="card">
    <div class="card-title">Custom Skills</div>
    <div class="card-body">Teach Claude new capabilities with markdown-based skill files and frontmatter.</div>
  </div>
</div>

### Callouts

> [!INFO]
> This is an info callout for general information.

> [!TIP]
> This is a tip callout for helpful suggestions.

> [!WARNING]
> This is a warning callout for important caveats.

> [!DANGER]
> This is a danger callout for critical warnings.

### Tabs

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">
    <p>Conceptual overview content would appear here, explaining what a feature is and when to use it.</p>
  </div>
  <div class="tab-panel" data-tab-panel="howto">
    <p>Step-by-step guide content would appear here, walking through setup and configuration.</p>
  </div>
  <div class="tab-panel" data-tab-panel="reference">
    <p>Technical reference content would appear here, documenting schemas, fields, and validation rules.</p>
  </div>
</div>

### Eyebrow Labels

<div style="display: flex; gap: 1.5rem; margin: 1.5rem 0;">
  <span class="eyebrow eyebrow-turquoise">Feature</span>
  <span class="eyebrow eyebrow-icterine">New</span>
  <span class="eyebrow eyebrow-oxford">Reference</span>
</div>
