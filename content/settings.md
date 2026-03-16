---
title: Settings
slug: settings
order: 10
description: Control Claude Code configuration at every level
color: "#c084fc"
section: topics
---

# Settings

## Overview

Settings control Claude Code's behavior at multiple levels: global user settings, project settings, and workspace settings. Each level can override the previous one, creating a flexible configuration hierarchy. Settings cover everything from model selection and API keys to tool permissions and output formatting.

Understanding the settings hierarchy is key to configuring Claude Code correctly for different projects and workflows.

## Quick Example

Project-level settings in `.claude/settings.json`:

```json
{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow_file_write": true,
    "allow_bash": true,
    "allowed_tools": ["Read", "Write", "Bash", "Grep", "Glob"]
  },
  "context": {
    "max_tokens": 100000,
    "include_git_diff": true
  }
}
```

## Coming Soon

Full content including all settings fields, inheritance rules, environment variables, and configuration best practices will be added in Phases 2-4.
