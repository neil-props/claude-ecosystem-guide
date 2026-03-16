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

Plugins are the **distribution unit** of the Claude ecosystem. They package skills, MCP server configurations, subagent definitions, hooks, slash commands, LSP servers, and default settings into installable bundles. Think of it this way: skills are individual recipes; plugins are complete cookbooks.

Plugins launched in January 2026 alongside Claude Cowork. In Cowork, there are 15+ official plugins for knowledge work (Sales, Finance, Legal, Data, Marketing, HR, and more). In Claude Code, plugins are developer-focused (code review, testing, CI/CD). Plugins are **not directly available in Claude Chat** -- Chat uses Skills and Connectors individually.

All official plugins are open source at `github.com/anthropics/knowledge-work-plugins`, with 85+ skills and 69+ slash commands across the official set.

## How It Works

A plugin bundles multiple extension types into a single installable package:

| Component | Purpose |
|-----------|---------|
| Skills (SKILL.md files) | Slash commands and auto-invoked instructions |
| Subagents | Custom AI assistants with isolated contexts |
| Hooks (hooks.json) | Event-driven automation |
| MCP configs (.mcp.json) | Bundled connector/server configurations |
| LSP servers (.lsp.json) | Code intelligence integration |
| Settings (settings.json) | Default permission and environment settings |

### In Claude Code

```bash
# Install a plugin
/plugin install <github-url-or-name>

# Test a local plugin during development
claude --plugin-dir ./my-plugin
```

Skills within plugins use namespace isolation to avoid collisions: `/my-plugin:skill-name`.

The plugin manifest lives at `.claude-plugin/plugin.json`.

### In Claude Cowork

Cowork is the primary home for plugins:

1. Open the **Customize** menu
2. Click **Browse Plugins**
3. Choose from three tabs: **Anthropic & Partners**, **Your Organization**, **Personal**
4. Click **Install**

**Official plugins (15+):**
- **Productivity** -- Task management, calendars, workflows
- **Enterprise Search** -- Search across email, chat, docs, wikis
- **Sales** -- Prospecting, outreach, deal strategy
- **Finance** -- Journal entries, reconciliation, variance analysis
- **Data** -- SQL, datasets, dashboards, visualizations
- **Legal** -- Contract review, NDA triage, compliance
- **Marketing** -- Campaign strategy, content creation
- **Customer Support** -- Ticket triage, response drafting
- **Product Management** -- Roadmaps, specs, prioritization
- **HR** -- Recruiting, onboarding, policy
- **Plugin Create** -- Build your own plugins interactively

Partner plugins include LSEG, S&P Global, FactSet, Morningstar, and PitchBook for financial services.

## Configuration

### Plugin Anatomy

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       <- Manifest (name, version, description, author, license)
├── skills/
│   ├── deploy/
│   │   └── SKILL.md      <- Invoked as /my-plugin:deploy
│   └── review/
│       └── SKILL.md      <- Invoked as /my-plugin:review
├── agents/
│   └── qa-bot.md          <- Custom subagent definition
├── hooks/
│   └── hooks.json         <- Event-driven automation
├── .mcp.json              <- Bundled MCP server configs
├── .lsp.json              <- Code intelligence servers
└── settings.json          <- Default permission + env settings
```

### Minimal plugin.json Manifest

```json
{
  "name": "my-team-plugin",
  "version": "1.0.0",
  "description": "Our team's Claude workflows",
  "author": { "name": "Your Team" },
  "skills": ["skills/deploy", "skills/review"],
  "agents": ["agents/qa-bot.md"]
}
```

### Distribution

Plugins can be distributed through:
- **Anthropic & Partners marketplace** -- official and partner plugins
- **Organization private marketplaces** -- enterprise-internal distribution
- **GitHub repositories** -- install via `/plugin install github:org/my-plugin`
- **Open source** -- `github.com/anthropics/knowledge-work-plugins`

## Best Practices

- Use plugins when you need to distribute a **bundle** of related skills, connectors, and agents across multiple repos or teams
- For a single reusable instruction set, a standalone Skill is simpler
- Use namespace isolation (`/my-plugin:skill-name`) to avoid command collisions
- In Cowork, use the "Plugin Create" plugin to build new plugins interactively
- Test locally with `claude --plugin-dir ./my-plugin` before distributing
- Keep plugin manifests (`plugin.json`) minimal and accurate

## Common Questions

**What are Plugins and how do they differ from Skills?**
Skills are individual instruction files for one task. Plugins are installable packages that bundle multiple skills, MCP server configs, subagents, hooks, slash commands, LSP servers, and default settings. Plugins are the distribution unit; skills are the universal primitive.

**How do I build a custom Plugin?**
Create a directory with a `.claude-plugin/plugin.json` manifest, add `skills/`, `agents/`, `hooks/` subdirectories as needed, and optionally include `.mcp.json` and `settings.json`. Test locally with `claude --plugin-dir ./my-plugin`, then push to GitHub for distribution.

**Where do plugins work?**
Plugins work in Claude Cowork (primary home, 15+ official plugins) and Claude Code (dev-focused plugins). They are not directly available in Claude Chat -- Chat uses Skills and Connectors individually.

## Related

- [Skills](skills.html) -- The individual instruction sets that plugins bundle together
- [MCP](mcp.html) -- Plugins can include MCP server configurations
- [Hooks](hooks.html) -- Plugins can include event-driven automation hooks
- [Agents](agents.html) -- Plugins can include custom subagent definitions
