---
title: Settings
slug: settings
order: 10
description: Control Claude Code configuration at every level
color: "#c084fc"
section: topics
---

# Settings Hierarchy

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Settings are the configuration hierarchy that controls Claude Code's behavior -- how different scopes of settings merge and override each other. From organization-wide enforcement down to per-session CLI arguments, the settings hierarchy follows a strict precedence order where higher-priority settings always win.

This matters because it lets teams enforce standards while individuals customize their experience. An enterprise admin can mandate security policies that no developer can bypass, while each developer can still set their own model preferences and tool permissions within those boundaries.

Settings cover everything from model selection and permission modes to tool restrictions, MCP server policies, and 140+ environment variables.

## How It Works

### The 5-Level Precedence

Settings are resolved in a strict priority order. Higher priority always overrides lower:

| Priority | Source | Scope | Who Controls |
|----------|--------|-------|-------------|
| **1 (highest)** | Managed settings (MDM/Registry) | Organization-wide | Admins only |
| **2** | CLI arguments | Current session | Developer |
| **3** | `.claude/settings.local.json` | Project (personal) | Developer |
| **4** | `.claude/settings.json` | Project (shared via git) | Team |
| **5 (lowest)** | `~/.claude/settings.json` | User-wide | Developer |

Managed settings always win -- they cannot be overridden by any lower-priority source. This makes them the enforcement mechanism for enterprise policies.

### Why This Matters

The settings hierarchy enables a layered approach to configuration:

- **Enterprise security teams** set managed policies: which MCP servers are allowed, which tools are denied, whether bypass mode is disabled
- **Team leads** configure shared project settings: approved tool permissions, MCP servers, hooks for linting
- **Individual developers** add personal overrides: model preferences, additional tool permissions, personal MCP servers
- **Per-session needs** are handled by CLI flags: temporary model switches, one-off permission modes

Each layer adds to (or overrides) the layers below it. No lower layer can undo a higher layer's restrictions.

### In Claude Code

**Permission rules** use an allow/ask/deny model with wildcard matching:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Edit(src/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Edit(.env*)"
    ]
  }
}
```

**Permission modes** control overall behavior:

| Mode | Behavior |
|------|----------|
| `default` | Standard checking, prompts for approval |
| `acceptEdits` | Auto-accept file edits, prompt for other tools |
| `dontAsk` | Auto-deny any permission prompts |
| `bypassPermissions` | Skip all checks (use with extreme caution) |
| `plan` | Read-only exploration mode |

### In Claude Chat

Claude Chat settings are managed through the web interface:

- **Settings > Connectors** -- Enable/disable MCP integrations
- **Settings > Capabilities > Skills** -- Toggle skills on/off
- **Project-level instructions** -- Per-project custom behavior
- **Team/Enterprise admin controls** -- Organization-wide policies for connectors, skills, and data access

### In Claude Cowork

- **Customize menu** -- Global instructions, connector controls, plugin management
- **Plugin settings** -- Each installed plugin can include default settings
- **Internet access toggle** -- Users control whether Cowork can access the web

## When to Use Each Level

Choose the right settings level for your use case:

- **Managed settings** (enterprise) -- Security policies that must be enforced organization-wide: allowed/denied MCP servers, prohibited tools, mandatory audit hooks. Only admins can set these.
- **CLI flags** -- Temporary overrides for specific tasks: `claude --model haiku` for a quick search, `claude --permission-mode plan` for read-only exploration. These don't persist.
- **settings.local.json** (project, personal) -- Your personal project preferences that shouldn't be shared: additional tool permissions for your workflow, personal MCP servers, model preferences. Automatically gitignored.
- **settings.json** (project, shared) -- Team-wide project settings: approved tool permissions, shared MCP server configs, linting hooks. Check this into git.
- **User settings** (~/.claude/settings.json) -- Global personal defaults that apply across all projects: your default model, commonly used tool permissions, personal MCP servers.

## Configuration

### Project-Shared Settings

Check `.claude/settings.json` into git so the whole team shares the same configuration:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(pnpm *)",
      "Edit(src/**)",
      "Write(src/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Edit(.env*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "type": "command",
        "command": "npx eslint --fix $CLAUDE_FILE_PATH"
      }
    ]
  }
}
```

### Personal Project Overrides

Use `.claude/settings.local.json` for personal preferences that shouldn't be shared (automatically gitignored):

```json
{
  "permissions": {
    "allow": [
      "Bash(docker *)"
    ]
  }
}
```

### Organization-Wide Managed Settings

Managed settings are pushed via MDM (Jamf, Intune), Chef, Puppet, or Ansible:

**Deployment locations:**
- macOS: `/Library/Application Support/ClaudeCode/`
- Linux: `/etc/claude-code/`
- Windows: `C:\Program Files\ClaudeCode\`

**MCP server policies** (`managed-mcp.json`):

```json
{
  "mcpServers": {},
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverUrl": "https://*.yourcompany.com/*" }
  ],
  "deniedMcpServers": [
    { "serverCommand": "npx untrusted-*" }
  ]
}
```

### Key Environment Variables

Claude Code supports 140+ environment variables for fine-grained control:

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_MODEL` | Override default model |
| `CLAUDE_CODE_EFFORT_LEVEL` | Set effort level (Low/Med/High) |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Model for subagents |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Auto-compact threshold |
| `MAX_THINKING_TOKENS` | Limit extended thinking tokens |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Max output tokens (up to 64000) |
| `ENABLE_TOOL_SEARCH` | Auto-defer MCP tools (`auto:N`) |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | Skill content budget (default 15000) |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Enable agent teams (`1`) |

### Model Selection

Override the default model per session or globally:

```bash
# Via CLI flag
claude --model sonnet

# Via slash command during session
/model opus

# Via environment variable
export ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Via skill/agent frontmatter
# model: haiku
```

**Rule of thumb:** Start with the default (Opus in Code, Sonnet in Chat/Cowork). Use Opus for complex reasoning. Use Haiku for subagents and high-volume tasks.

## Best Practices

- Use **managed settings** for organization-wide policies that can't be overridden
- Pre-approve common permissions in `.claude/settings.json` instead of using `--dangerously-skip-permissions`
- Use `.claude/settings.local.json` for personal preferences (gitignored automatically)
- Set tool restrictions in skill/agent frontmatter (`allowed-tools`, `disallowedTools`) for defense-in-depth
- Use `plan` mode for read-only exploration when reviewing unfamiliar codebases
- Keep sandbox enabled (`sandbox` setting) for filesystem and network isolation
- Update Claude Code daily to get the latest settings and security fixes
- Use Opus with extended thinking for everything important; use Haiku for fast codebase searches

## Common Questions

**How do I restrict Claude Code's permissions and tool access?**
Set permission modes (`default`, `acceptEdits`, `plan`, etc.) in settings. Use `allowed-tools` and `disallowedTools` in skill/agent frontmatter. For org-wide enforcement, use managed settings pushed via MDM. The `allow/deny` permission rules support wildcards (e.g., `Bash(npm run *)`, `Edit(src/**)`).

**How do I enforce organization-wide policies for Claude usage?**
Use managed settings deployed via MDM, Chef, or Puppet. Managed settings have the highest priority and can't be overridden. Control allowed/denied MCP servers via `managed-mcp.json`, enforce permission modes, restrict tools, and mandate audit hooks.

**What's the settings precedence order?**
Managed (MDM) > CLI arguments > `.claude/settings.local.json` (personal project) > `.claude/settings.json` (shared project) > `~/.claude/settings.json` (user-wide). Managed always wins. This ensures enterprise policies are enforced while allowing personal customization within approved boundaries.

**How do I configure the model and thinking behavior?**
Use `/model` during a session, `ANTHROPIC_MODEL` env var for persistent override, or `model` in skill/agent frontmatter for per-task override. Control thinking with `MAX_THINKING_TOKENS`. Set effort level with `CLAUDE_CODE_EFFORT_LEVEL` (Low/Med/High).

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

> [!INFO]
> Step-by-step guides for Settings are coming in Phase 4.

Planned guides:
- Configuring project-shared settings for your team -- _coming soon_
- Setting up managed enterprise policies -- _coming soon_
- Customizing model selection and thinking behavior -- _coming soon_
- Managing permissions with allow/deny rules -- _coming soon_

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

> [!INFO]
> Detailed reference specs for Settings are coming in Phase 4.

Planned references:
- Complete settings.json schema -- _coming soon_
- All 140+ environment variables -- _coming soon_
- Managed settings deployment guide -- _coming soon_
- Permission mode reference -- _coming soon_

  </div>
</div>

## Related

- [Projects](projects.html) -- CLAUDE.md provides instructions; settings provide permissions and controls
- [Hooks](hooks.html) -- Hooks are configured within the settings files
- [MCP](mcp.html) -- MCP server policies are managed via settings and managed-mcp.json
- [Agents](agents.html) -- Agent frontmatter can override model, tools, and permissions per-agent
