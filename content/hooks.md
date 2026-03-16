---
title: Hooks
slug: hooks
order: 4
description: Run custom scripts at key lifecycle events in Claude Code
color: "#f87171"
section: topics
---

# Hooks

## Overview

Hooks let you run scripts at specific points in Claude Code's lifecycle -- before a command runs, after a file is edited, or when a conversation starts. Hooks are configured in your project's settings and execute shell commands or scripts, making them ideal for enforcing project conventions, running linters, or triggering external workflows.

Hooks are the lightest-weight extension point: no SDK, no protocol, just shell commands triggered at the right time.

## Quick Example

Configure a pre-commit hook in `.claude/settings.json`:

```json
{
  "hooks": {
    "pre-commit": {
      "command": "npm run lint && npm test",
      "description": "Run linting and tests before committing"
    }
  }
}
```

## Coming Soon

Full content including all hook types, execution order, error handling, and hook vs skill comparison will be added in Phases 2-4.
