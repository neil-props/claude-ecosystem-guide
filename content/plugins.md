---
title: Plugins
slug: plugins
order: 3
description: Extend Claude Code with third-party integrations and capabilities
color: "#a78bfa"
section: topics
---

# Plugins

## Overview

Plugins extend Claude Code's functionality through third-party integrations. Unlike MCP servers which provide tools Claude can invoke, plugins modify Claude Code's behavior itself -- adding new commands, UI elements, or workflow integrations. Plugins are distributed as npm packages and configured in project or user settings.

Plugins are best suited for workflow-level integrations that affect how you interact with Claude Code, rather than what Claude can do.

## Quick Example

Install and configure a plugin in your settings:

```json
{
  "plugins": {
    "claude-plugin-jira": {
      "enabled": true,
      "config": {
        "instance": "your-org.atlassian.net",
        "project": "PROJ"
      }
    }
  }
}
```

## Coming Soon

Full content including plugin architecture, manifest format, development guide, and plugin vs MCP comparison will be added in Phases 2-4.
