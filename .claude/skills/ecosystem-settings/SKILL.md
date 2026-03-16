---
name: ecosystem-settings
description: Knowledge about the Settings Hierarchy in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Settings Hierarchy

## Overview

Settings are the configuration hierarchy that controls Claude Code's behavior -- how different scopes of settings merge and override each other. From organization-wide enforcement down to per-session CLI arguments, the hierarchy follows a strict precedence order where higher-priority settings always win.

This lets teams enforce standards while individuals customize their experience. An enterprise admin can mandate security policies that no developer can bypass, while each developer can still set personal preferences within those boundaries.

Settings cover model selection, permission modes, tool restrictions, MCP server policies, and 140+ environment variables.

## The 5-Level Precedence

| Priority | Source | Scope | Who Controls |
|----------|--------|-------|-------------|
| **1 (highest)** | Managed settings (MDM/Registry) | Organization-wide | Admins only |
| **2** | CLI arguments | Current session | Developer |
| **3** | `.claude/settings.local.json` | Project (personal) | Developer |
| **4** | `.claude/settings.json` | Project (shared via git) | Team |
| **5 (lowest)** | `~/.claude/settings.json` | User-wide | Developer |

Managed settings always win -- they cannot be overridden by any lower-priority source.

## Permission System

### Allow/Ask/Deny Model

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

Rules use `Tool(pattern)` format with glob-style wildcards. Deny rules take precedence over allow rules at the same settings level.

### Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Standard checking, prompts for approval |
| `acceptEdits` | Auto-accept file edits, prompt for other tools |
| `dontAsk` | Auto-deny any permission prompts |
| `bypassPermissions` | Skip all checks (use with extreme caution) |
| `plan` | Read-only exploration mode |

Set via CLI: `claude --permission-mode <mode>`

## Settings File Locations

| Scope | Path |
|-------|------|
| User settings | `~/.claude/settings.json` |
| Project shared | `<repo>/.claude/settings.json` |
| Project local | `<repo>/.claude/settings.local.json` |
| Managed (macOS) | `/Library/Application Support/ClaudeCode/` |
| Managed (Linux) | `/etc/claude-code/` |
| Managed MCP | `managed-mcp.json` in managed location |

## Model Selection

Override the default model per session or globally:

```bash
# CLI flag (per session)
claude --model sonnet

# Slash command (during session)
/model opus

# Environment variable (persistent)
export ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Skill/agent frontmatter (per task)
# model: haiku
```

Rule of thumb: Start with the default (Opus in Code, Sonnet in Chat/Cowork). Use Opus for complex reasoning. Use Haiku for subagents and high-volume tasks.

## Key Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_MODEL` | `claude-opus-4-20250514` | Override default model |
| `CLAUDE_CODE_EFFORT_LEVEL` | `"high"` | Effort level: low/medium/high |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | `80` | Context % that triggers auto-compaction |
| `MAX_THINKING_TOKENS` | (model default) | Maximum tokens for extended thinking |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | `16000` | Max output tokens per response (up to 64000) |
| `ENABLE_TOOL_SEARCH` | `"false"` | Auto-defer MCP tools with `auto:N` |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | `15000` | Character budget for skill/command content |

## Managed MCP Server Policies

Organization admins control allowed/denied MCP servers via `managed-mcp.json`:
- `allowedMcpServers` -- whitelist patterns (name, URL, command)
- `deniedMcpServers` -- blocklist patterns (takes priority)
- Deployed via MDM (Jamf, Intune) to system-level path

## Cross-Interface Differences

| Interface | Settings Mechanism |
|-----------|-------------------|
| **Claude Code** | 5-level JSON hierarchy + CLI flags + env vars |
| **Claude Chat** | Web UI settings, Connectors toggle, Project instructions |
| **Claude Cowork** | Customize menu, plugin settings, internet toggle |

## When to Use Each Level

- **Managed** (enterprise) -- Security policies that must be enforced org-wide
- **CLI flags** -- Temporary per-session overrides (`--model haiku`, `--permission-mode plan`)
- **settings.local.json** -- Personal project preferences (gitignored)
- **settings.json** -- Team-wide project settings (check into git)
- **User settings** -- Global personal defaults across all projects

## Best Practices

- Use managed settings for org-wide policies that can't be overridden
- Pre-approve common permissions in `.claude/settings.json` instead of `--dangerously-skip-permissions`
- Use `.claude/settings.local.json` for personal preferences (gitignored)
- Set tool restrictions in skill/agent frontmatter for defense-in-depth
- Use `plan` mode for read-only exploration of unfamiliar codebases
- Keep sandbox enabled for filesystem and network isolation
- Use Opus with extended thinking for important tasks; Haiku for fast searches

## Common Pitfalls

1. **Using bypassPermissions** -- Almost never needed; pre-approve specific tools instead
2. **Not checking into git** -- `.claude/settings.json` should be shared; `.claude/settings.local.json` should not
3. **Ignoring managed settings** -- Enterprise policies override everything; check with your admin
4. **Hardcoding model in env** -- Use per-task frontmatter overrides for flexibility
5. **Conflicting permission levels** -- Higher priority always wins; check the 5-level hierarchy when debugging
