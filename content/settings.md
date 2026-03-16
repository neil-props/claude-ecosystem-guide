---
title: Settings
slug: settings
order: 10
description: Control Claude Code configuration at every level
color: "#c084fc"
section: topics
---

# Settings Hierarchy

## Overview

Settings control Claude Code's behavior at multiple levels, from organization-wide enforcement down to per-session CLI arguments. The settings hierarchy follows a strict precedence order -- higher-priority settings always override lower ones, ensuring that enterprise policies can't be bypassed by individual users while still allowing personal customization within approved boundaries.

Settings cover everything from model selection and permission modes to tool restrictions, MCP server policies, and 140+ environment variables.

## How It Works

### In Claude Code

Settings are resolved in a strict priority order:

| Priority | Location | Scope |
|----------|----------|-------|
| **1 (highest)** | Managed settings (MDM/Registry) | Organization-wide |
| **2** | CLI arguments | Current session |
| **3** | `.claude/settings.local.json` | Project (personal) |
| **4** | `.claude/settings.json` | Project (shared via git) |
| **5 (lowest)** | `~/.claude/settings.json` | User-wide |

Managed settings always win -- they can't be overridden by any lower-priority source. This makes them the enforcement mechanism for enterprise policies.

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

## Related

- [Projects](projects.html) -- CLAUDE.md provides instructions; settings provide permissions and controls
- [Hooks](hooks.html) -- Hooks are configured within the settings files
- [MCP](mcp.html) -- MCP server policies are managed via settings and managed-mcp.json
- [Agents](agents.html) -- Agent frontmatter can override model, tools, and permissions per-agent
