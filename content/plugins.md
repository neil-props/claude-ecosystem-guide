---
title: Plugins
slug: plugins
order: 3
description: Extend Claude Code with third-party integrations and capabilities
color: "#a78bfa"
section: topics
---

# Plugins

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

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

### Distribution Methods

Plugins can be distributed through several channels:

- **Anthropic & Partners marketplace** -- official and partner plugins, curated and maintained
- **Organization private marketplaces** -- enterprise-internal distribution for proprietary workflows
- **GitHub repositories** -- install via `/plugin install github:org/my-plugin` for open-source sharing
- **Open source** -- `github.com/anthropics/knowledge-work-plugins` is the official collection

### In Claude Code

```bash
# Install a plugin from GitHub
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

## When to Use Plugins

**Use Plugins when:**
- You have multiple related skills, hooks, MCP configs, and agents that belong together as a coherent workflow
- You need to distribute capabilities across multiple repositories or teams
- You want namespace isolation to avoid command collisions between different bundles
- You are building for Claude Cowork (plugins are the primary extension mechanism there)

**Don't use Plugins when:**
- You have a single skill or process to share -- just share the individual `SKILL.md` file via git
- You only need to add one MCP server -- configure it directly in `.mcp.json`
- You need something Chat-specific -- Chat uses Skills and Connectors directly, not plugins

**Plugins vs other extension points:**
- **Plugins vs Skills:** A plugin *contains* skills. Use a standalone skill when you have one focused instruction set. Use a plugin when you have a bundle of related skills, agents, hooks, and configs that should be installed together.
- **Plugins vs MCP:** Plugins can *include* MCP server configurations. MCP is the protocol; plugins are the packaging mechanism.

## Configuration

### Plugin Anatomy

```
my-plugin/
.claude-plugin/
    plugin.json       <- Manifest (name, version, description, author, license)
skills/
    deploy/
        SKILL.md      <- Invoked as /my-plugin:deploy
    review/
        SKILL.md      <- Invoked as /my-plugin:review
agents/
    qa-bot.md          <- Custom subagent definition
hooks/
    hooks.json         <- Event-driven automation
.mcp.json              <- Bundled MCP server configs
.lsp.json              <- Code intelligence servers
settings.json          <- Default permission + env settings
```

### Minimal plugin.json Manifest

```json
{
  "name": "my-team-plugin",
  "version": "1.0.0",
  "description": "Our team's Claude workflows",
  "author": { "name": "Your Team" },
  "skills": "./skills/",
  "agents": "./agents/"
}
```

For the complete plugin.json schema with all fields, auto-discovery behavior, and validation rules, see the **Reference** tab.

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

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How to Create a Plugin That Bundles Skills

Build an installable plugin that packages skills, agents, hooks, and MCP configs into a single distributable bundle.

### Prerequisites

- Claude Code installed and working (`claude --version`)
- One or more skills or agents you want to bundle
- A directory for your plugin project

### Step 1: Create the Plugin Directory Structure

```bash
mkdir -p my-deployment-tools/.claude-plugin
mkdir -p my-deployment-tools/skills/deploy-check
mkdir -p my-deployment-tools/skills/rollback
mkdir -p my-deployment-tools/agents
mkdir -p my-deployment-tools/hooks
```

This creates the standard plugin layout. The `.claude-plugin/` directory holds the manifest; other directories hold the bundled components.

### Step 2: Write the Plugin Manifest

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "deployment-tools",
  "version": "1.0.0",
  "description": "Deployment automation tools for our team",
  "author": {
    "name": "Platform Team",
    "email": "platform@company.com",
    "url": "https://github.com/company"
  },
  "homepage": "https://docs.company.com/claude-plugins",
  "repository": "https://github.com/company/deployment-tools",
  "license": "MIT",
  "keywords": ["deployment", "ci-cd", "automation"],
  "skills": "./skills/",
  "agents": "./agents/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

The `name` field is the only required field. All paths are relative to the plugin root directory.

### Step 3: Add Skills to the Plugin

Create `skills/deploy-check/SKILL.md`:

```yaml
---
name: deploy-check
description: Validates deployment readiness by running tests, lint, and build checks
argument-hint: "[environment]"
allowed-tools: Read, Grep, Glob, Bash
---

# Deploy Check

Run deployment readiness checks for the $ARGUMENTS environment:
1. Run test suite
2. Check lint results
3. Verify build succeeds
4. Validate environment configuration
```

Create `skills/rollback/SKILL.md`:

```yaml
---
name: rollback
description: Guides through a safe rollback to the previous deployment
argument-hint: "[version]"
allowed-tools: Bash
---

# Rollback Guide

Walk through rolling back to version $ARGUMENTS:
1. Verify the target version exists
2. Check for database migration conflicts
3. Execute the rollback command
4. Verify service health after rollback
```

Skills within plugins are namespaced: `/deployment-tools:deploy-check` and `/deployment-tools:rollback`.

### Step 4: Test the Plugin Locally

```bash
claude --plugin-dir ./my-deployment-tools
```

This loads the plugin for the current session. Verify that:
- The skills appear in the `/` command list
- You can invoke them with the namespaced prefix

### Step 5: Distribute the Plugin

**Via GitHub** (recommended for open-source):

```bash
cd my-deployment-tools
git init && git add . && git commit -m "Initial plugin release"
git remote add origin https://github.com/company/deployment-tools.git
git push -u origin main
```

Team members install with:

```bash
/plugin install github:company/deployment-tools
```

**Via npm:**

Add a `package.json` alongside your plugin manifest for npm distribution. Team members can install from the npm registry.

**Via direct path** (for local/internal use):

```bash
claude --plugin-dir /shared/plugins/deployment-tools
```

### Verify It Works

- `claude --plugin-dir ./my-deployment-tools` loads without errors
- Plugin skills appear in the `/` command list with namespace prefix
- `/deployment-tools:deploy-check staging` executes the skill correctly
- Team members can install from GitHub and access the same skills

### Troubleshooting

- **"Invalid plugin manifest" error:** Verify `plugin.json` is valid JSON and the `name` field is present. Use `cat .claude-plugin/plugin.json | python3 -m json.tool` to validate.
- **Skills not loading:** Check that skill paths in the manifest match the actual directory structure. Paths are relative to the plugin root.
- **Namespace collisions:** If you see duplicate command names, ensure your plugin `name` is unique. Skills within the plugin use the `/<plugin-name>:<skill-name>` namespace.
- **Plugin not found after install:** Verify the GitHub URL is correct and the repository is accessible. Check `claude mcp list` for any related configuration.


  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Plugin Manifest Specification

### File Location

The plugin manifest lives at `.claude-plugin/plugin.json` inside the plugin root directory.

```
my-plugin/
  .claude-plugin/
    plugin.json         <- Manifest (required)
  skills/               <- Skill directories (auto-discovered)
    deploy-check/
      SKILL.md
  agents/               <- Agent files (auto-discovered)
    reviewer.md
  hooks/
    hooks.json          <- Hook configuration
  .mcp.json             <- Bundled MCP server configs
  .lsp.json             <- Code intelligence servers
  settings.json         <- Default permission and environment settings
```

### Complete Schema

```json
{
  "name": "deployment-tools",
  "version": "1.0.0",
  "description": "Deployment automation tools for our team",
  "author": {
    "name": "Platform Team",
    "email": "platform@company.com",
    "url": "https://github.com/company"
  },
  "homepage": "https://docs.company.com/claude-plugins",
  "repository": "https://github.com/company/deployment-tools",
  "license": "MIT",
  "keywords": ["deployment", "ci-cd", "automation"],
  "commands": ["./custom/commands/deploy-status.md"],
  "agents": "./agents/",
  "skills": "./skills/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

### Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | N/A | Plugin identifier. Used as the namespace prefix for skills (`/<name>:<skill>`). |
| `version` | string | No | `""` | Semantic version string (e.g., `"1.0.0"`). |
| `description` | string | No | `""` | Human-readable description of the plugin's purpose. |
| `author` | object | No | `{}` | Author information with `name` (string), `email` (string), and `url` (string) subfields. |
| `homepage` | string | No | `""` | URL to the plugin's documentation or homepage. |
| `repository` | string | No | `""` | URL to the source code repository. |
| `license` | string | No | `""` | SPDX license identifier (e.g., `"MIT"`, `"Apache-2.0"`). |
| `keywords` | string[] | No | `[]` | Tags for discoverability in plugin directories. |
| `commands` | string[] | No | auto-discover | Paths to legacy command files. **Deprecated** -- use `skills` instead. |
| `agents` | string | No | auto-discover | Path to agents directory or glob pattern. |
| `skills` | string | No | auto-discover | Path to skills directory or glob pattern. |
| `hooks` | string | No | auto-discover | Path to hooks configuration file (e.g., `hooks.json`). |
| `mcpServers` | string | No | auto-discover | Path to MCP server configuration file (e.g., `.mcp.json`). |
| `outputStyles` | string | No | `""` | Path to custom output style definitions. |
| `lspServers` | string | No | auto-discover | Path to LSP server configuration file (e.g., `.lsp.json`). |

### Auto-Discovery Behavior

When fields like `skills`, `agents`, `hooks`, or `mcpServers` are omitted from the manifest, Claude Code auto-discovers them from conventionally-named directories:

| Directory/File | Auto-discovered as |
|----------------|--------------------|
| `skills/` | Skill definitions (each subdirectory with `SKILL.md`) |
| `agents/` | Agent markdown files |
| `hooks/hooks.json` | Hook configuration |
| `.mcp.json` | MCP server definitions |
| `.lsp.json` | LSP server definitions |
| `settings.json` | Default settings |

Explicit paths in the manifest override auto-discovery.

### Validation Rules

- `name` is the only strictly required field
- All path fields are relative to the plugin root directory
- Skill directories must contain a `SKILL.md` file to be recognized
- Agent files must be valid markdown with YAML frontmatter
- `hooks` path must point to a valid JSON file following the hook configuration schema
- `commands` is deprecated -- prefer `skills` for new plugins

### Examples

**Minimal plugin** (name only, auto-discovery):

```json
{
  "name": "my-team-tools"
}
```

With auto-discovery, Claude Code finds skills in `skills/`, agents in `agents/`, and configs from conventionally-named files.

**Full plugin** (all fields specified):

```json
{
  "name": "deployment-tools",
  "version": "1.0.0",
  "description": "Deployment automation tools for our team",
  "author": {
    "name": "Platform Team",
    "email": "platform@company.com",
    "url": "https://github.com/company"
  },
  "homepage": "https://docs.company.com/plugins/deployment-tools",
  "repository": "https://github.com/company/deployment-tools",
  "license": "MIT",
  "keywords": ["deployment", "ci-cd", "automation"],
  "agents": "./agents/",
  "skills": "./skills/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json",
  "lspServers": "./.lsp.json"
}
```


  </div>
</div>

## Related

- [Skills](skills.html) -- The individual instruction sets that plugins bundle together
- [MCP](mcp.html) -- Plugins can include MCP server configurations
- [Hooks](hooks.html) -- Plugins can include event-driven automation hooks
- [Agents](agents.html) -- Plugins can include custom subagent definitions
