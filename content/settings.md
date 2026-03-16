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

Settings files use standard JSON. Check `.claude/settings.json` into git for team-shared config, and use `.claude/settings.local.json` for personal overrides (gitignored automatically).

For the complete schema, file locations, allow/deny syntax, and environment variables reference, see the **Reference** tab.

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

## How to Configure Settings for Your Team

### Prerequisites

- Claude Code installed and working (`claude --version`)
- A project directory with `.claude/` directory (create one if needed)

### Step 1: Create Project-Shared Settings

Create `.claude/settings.json` at your project root to share settings with your team:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(pnpm *)",
      "Edit(src/**)",
      "Write(src/**)",
      "Read(*)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl * | bash)",
      "Edit(.env*)",
      "Write(.env*)"
    ]
  }
}
```

Check this file into git so everyone on the team gets the same permissions.

### Step 2: Add Personal Overrides

Create `.claude/settings.local.json` for preferences that should not be shared (this file is automatically gitignored):

```json
{
  "permissions": {
    "allow": [
      "Bash(docker *)",
      "Bash(kubectl *)"
    ]
  }
}
```

Personal overrides merge with and take precedence over project-shared settings.

### Step 3: Configure User-Wide Defaults

Set global defaults that apply across all your projects:

```bash
# Open your user settings file
# macOS/Linux: ~/.claude/settings.json
```

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Read(*)"
    ]
  }
}
```

These defaults are the lowest priority -- any project or CLI setting overrides them.

### Step 4: Use CLI Flags for Temporary Overrides

For one-off session needs, use CLI flags (highest developer-controlled priority):

```bash
# Use a different model for this session
claude --model haiku

# Read-only exploration mode
claude --permission-mode plan

# Accept all file edits automatically
claude --permission-mode acceptEdits
```

CLI flags only last for the current session and are not persisted.

### Step 5: Set Up Environment Variables

Export environment variables for persistent behavior overrides:

```bash
# In your shell profile (~/.zshrc, ~/.bashrc)
export ANTHROPIC_MODEL="claude-sonnet-4-20250514"
export CLAUDE_CODE_EFFORT_LEVEL="high"
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE="70"
```

See the **Reference** tab for the complete environment variables table.

### Verify It Works

Start a Claude Code session and check which settings are active:

```
> What permission mode am I in?
> What model are you using?
```

You can also verify settings merge correctly by checking if your project permissions are applied:

```
> Can you run npm run test?
```

If the command is in your `allow` list, Claude will execute it without prompting.

### Troubleshooting

- **Settings not applying:** Ensure the file is valid JSON. Check file location -- `.claude/settings.json` must be inside the `.claude/` directory at the project root.
- **Permission denied unexpectedly:** A higher-priority settings source may be overriding your config. Check managed settings (enterprise) or CLI flags.
- **Local settings committed to git:** Verify `.claude/settings.local.json` is in your `.gitignore`. It should be gitignored automatically, but check if your gitignore has been modified.

<!-- end howto -->

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

### Settings Hierarchy -- 5-Level Precedence

Settings resolve in strict priority order. Higher priority always overrides lower:

| Priority | Source | File Path | Scope | Who Controls |
|----------|--------|-----------|-------|-------------|
| 1 (highest) | Managed settings | See Managed Locations below | Organization-wide | Admins only |
| 2 | CLI arguments | N/A (passed at invocation) | Current session | Developer |
| 3 | Project local | `<repo>/.claude/settings.local.json` | Project (personal) | Developer |
| 4 | Project shared | `<repo>/.claude/settings.json` | Project (shared via git) | Team |
| 5 (lowest) | User-wide | `~/.claude/settings.json` | All projects | Developer |

No lower-priority source can override a higher-priority restriction. Managed settings always win.

### Settings File Locations

| Scope | macOS | Linux |
|-------|-------|-------|
| User settings | `~/.claude/settings.json` | `~/.claude/settings.json` |
| Project shared | `<repo>/.claude/settings.json` | `<repo>/.claude/settings.json` |
| Project local | `<repo>/.claude/settings.local.json` | `<repo>/.claude/settings.local.json` |
| Managed settings | `/Library/Application Support/ClaudeCode/` | `/etc/claude-code/` |
| Managed MCP | `/Library/Application Support/ClaudeCode/managed-mcp.json` | `/etc/claude-code/managed-mcp.json` |

### Complete settings.json Schema

```json
{
  "permissions": {
    "allow": ["<tool>(<pattern>)", "..."],
    "deny": ["<tool>(<pattern>)", "..."]
  },
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<regex>",
        "hooks": [
          {
            "type": "command",
            "command": "<shell command>",
            "timeout": 600
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "<server-name>": {
      "command": "<executable>",
      "args": ["<arg1>", "<arg2>"],
      "env": { "<KEY>": "<value>" }
    }
  }
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `permissions` | object | No | Tool permission rules |
| `permissions.allow` | string[] | No | Tool patterns to auto-approve |
| `permissions.deny` | string[] | No | Tool patterns to always deny |
| `hooks` | object | No | Lifecycle hook configuration (see [Hooks Reference](hooks.html)) |
| `mcpServers` | object | No | MCP server definitions (see [MCP Reference](mcp.html)) |

### Permission Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `default` | Standard checking -- prompts for approval on unrecognized tools | Normal development |
| `acceptEdits` | Auto-accepts file edits, prompts for other tools | Trusted editing sessions |
| `dontAsk` | Auto-denies any permission prompts | Automated CI/CD pipelines |
| `bypassPermissions` | Skips all permission checks | Use with extreme caution |
| `plan` | Read-only exploration, no writes or executions | Code review, onboarding |

Set via CLI: `claude --permission-mode <mode>`

### Allow/Deny Syntax

Permission rules use a `Tool(pattern)` format with glob-style wildcards:

| Pattern | Matches |
|---------|---------|
| `Bash(npm run *)` | Any `npm run` command |
| `Edit(src/**)` | Edits to any file under `src/` |
| `Write(*.test.ts)` | Writing any `.test.ts` file |
| `Bash(rm -rf *)` | Any `rm -rf` command (deny this) |
| `Edit(.env*)` | Edits to any `.env` file (deny this) |
| `Read(*)` | Reading any file |

Rules are evaluated in order: deny rules take precedence over allow rules at the same settings level.

### Managed MCP Server Policies

The `managed-mcp.json` file controls which MCP servers are permitted organization-wide:

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

| Field | Type | Description |
|-------|------|-------------|
| `mcpServers` | object | Org-mandated MCP servers (always connected) |
| `allowedMcpServers` | array | Allowlist patterns for permitted servers |
| `deniedMcpServers` | array | Denylist patterns for blocked servers |

### Environment Variables Reference

Claude Code supports 140+ environment variables. The table below lists the most important ones. For the full list, run `claude config list` or consult the [official documentation](https://code.claude.com/docs).

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ANTHROPIC_MODEL` | string | `claude-opus-4-20250514` | Override the default model for all sessions |
| `CLAUDE_CODE_EFFORT_LEVEL` | string | `"high"` | Set effort level: `low`, `medium`, or `high` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | string | (same as main) | Model used for subagent/agent tasks |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | number | `80` | Context window percentage that triggers auto-compaction |
| `MAX_THINKING_TOKENS` | number | (model default) | Maximum tokens for extended thinking |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | number | `16000` | Max output tokens per response (up to 64000) |
| `ENABLE_TOOL_SEARCH` | string | `"false"` | Auto-defer MCP tools with `auto:N` (set to `auto:40`) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | string | `claude-haiku-3-5-20241022` | Override the default Haiku model |
| `ANTHROPIC_BASE_URL` | string | `https://api.anthropic.com` | Custom API endpoint (for proxies or enterprise) |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | string | `"false"` | Disable background task execution |
| `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` | number | `60000` | Timeout for session-end hooks in milliseconds |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | string | `"0"` | Enable agent teams feature (`1` to enable) |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | number | `15000` | Character budget for skill/command content |

> [!NOTE]
> `ANTHROPIC_SMALL_FAST_MODEL` is deprecated. Use `ANTHROPIC_DEFAULT_HAIKU_MODEL` instead.

### Examples

**Minimal project settings:**

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Edit(src/**)"
    ]
  }
}
```

**Full team settings with hooks and MCP:**

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(pnpm *)",
      "Bash(git *)",
      "Edit(src/**)",
      "Write(src/**)",
      "Read(*)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl * | bash)",
      "Edit(.env*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

  </div>
</div>

## Related

- [Projects](projects.html) -- CLAUDE.md provides instructions; settings provide permissions and controls
- [Hooks](hooks.html) -- Hooks are configured within the settings files
- [MCP](mcp.html) -- MCP server policies are managed via settings and managed-mcp.json
- [Agents](agents.html) -- Agent frontmatter can override model, tools, and permissions per-agent
