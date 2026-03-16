---
name: ecosystem-plugins
description: Knowledge about Plugins in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Plugins

## Overview

Plugins are the **distribution unit** of the Claude ecosystem. They package skills, MCP server configurations, subagent definitions, hooks, slash commands, LSP servers, and default settings into installable bundles. Skills are individual recipes; plugins are complete cookbooks.

Plugins launched January 2026 alongside Claude Cowork. In Cowork, 15+ official plugins exist for knowledge work (Sales, Finance, Legal, Data, Marketing, HR, etc.). In Claude Code, plugins are developer-focused. Plugins are **not available in Claude Chat** -- Chat uses Skills and Connectors directly.

All official plugins are open source at `github.com/anthropics/knowledge-work-plugins` (85+ skills, 69+ slash commands).

## Plugin Anatomy

```
my-plugin/
  .claude-plugin/
    plugin.json       <- Manifest (name, version, description)
  skills/
    deploy/SKILL.md   <- Invoked as /my-plugin:deploy
    review/SKILL.md
  agents/
    qa-bot.md
  hooks/
    hooks.json
  .mcp.json           <- Bundled MCP server configs
  .lsp.json           <- Code intelligence servers
  settings.json       <- Default settings
```

## plugin.json Manifest

Only `name` is required. All paths are relative to plugin root:

```json
{
  "name": "deployment-tools",
  "version": "1.0.0",
  "description": "Deployment automation tools",
  "author": { "name": "Platform Team" },
  "skills": "./skills/",
  "agents": "./agents/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

### Auto-Discovery

When fields are omitted, Claude Code auto-discovers from conventional directories:
- `skills/` -> skill definitions
- `agents/` -> agent files
- `hooks/hooks.json` -> hook config
- `.mcp.json` -> MCP servers
- `settings.json` -> default settings

## Distribution

| Method | Use Case |
|--------|----------|
| GitHub | `/plugin install github:org/my-plugin` |
| npm | npm registry distribution |
| Local path | `claude --plugin-dir ./my-plugin` |
| Cowork marketplace | Anthropic & Partners, Organization, Personal tabs |

Skills within plugins use namespace isolation: `/my-plugin:skill-name`.

## When to Use Plugins

**Use plugins when:**
- You have multiple related skills, hooks, MCP configs, and agents that belong together
- You need to distribute capabilities across teams or repos
- You want namespace isolation to avoid command collisions
- You are building for Claude Cowork

**Don't use plugins when:**
- You have a single skill (just share the SKILL.md file)
- You only need one MCP server (configure directly in .mcp.json)
- You need Chat-specific capabilities (Chat uses Skills and Connectors)

## Key Decision: Plugins vs Skills

A plugin *contains* skills. Use a standalone skill for one focused instruction set. Use a plugin for a bundle of related skills, agents, hooks, and configs that install together.

## Common Pitfalls

1. **Over-bundling** -- Do not create a plugin for a single skill; just share the SKILL.md
2. **Missing manifest** -- The `.claude-plugin/plugin.json` file must exist with at least a `name` field
3. **Path errors** -- All manifest paths are relative to plugin root; verify directory structure matches
