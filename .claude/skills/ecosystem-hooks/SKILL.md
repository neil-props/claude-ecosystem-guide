---
name: ecosystem-hooks
description: Knowledge about Hooks in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Hooks

## Overview

Hooks are **deterministic automation outside the agentic loop**. They run shell scripts, call HTTP endpoints, invoke Claude prompts, or delegate to subagents at specific lifecycle events in Claude Code. Unlike skills and agents, hooks execute predictably and automatically -- Claude does not decide whether to run them. When the event fires, the hook runs. Every time.

Hooks are the lightest-weight extension point: no SDK, no protocol, just automation triggered at the right time. Available in **Claude Code only** (not Chat or Cowork).

## Lifecycle Events

Claude Code supports 19+ lifecycle events. Key ones:

| Event | When It Fires | Blockable |
|-------|---------------|-----------|
| `PreToolUse` | Before any tool call | Yes |
| `PostToolUse` | After a tool call succeeds | No |
| `PostToolUseFailure` | After a tool call fails | No |
| `UserPromptSubmit` | Before Claude processes input | Yes |
| `SessionStart` / `SessionEnd` | Session lifecycle | No |
| `SubagentStart` / `SubagentStop` | Subagent lifecycle | No/Yes |
| `Notification` | Notification event | No |
| `Stop` | Claude stops execution | Yes |
| `PreCompact` | Before context compression | No |
| `PermissionRequest` | Permission requested | Yes |
| `ConfigChange` | Configuration changes | No |

## Hook Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Command** | Shell script | Linting, blocking, file validation |
| **HTTP** | POST to endpoint | Webhooks, external API calls |
| **Prompt** | Single-turn LLM eval | Quick safety checks, content review |
| **Agent** | Multi-turn verification | Thorough code review, complex validation |

### Exit Codes (Command Type)

- `exit 0` -- Allow / proceed
- `exit 2` -- **Block** the action (stderr shown as feedback to Claude)
- Other -- Proceed (stderr logged)

## Configuration

Hooks use a **nested structure** in settings files:

```json
{
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
  }
}
```

### Structure

- Each event contains an array of **matcher groups**
- Each matcher group has an optional `matcher` regex and a `hooks` array
- Without a matcher, hooks fire for every instance of the event

### Matchers

Regex patterns scoping hooks to specific tools:
- `"Edit|Write"` -- Edit or Write tools only
- `"Bash"` -- Bash tool only
- Omit matcher to fire on all instances of the event

### Configuration Scopes

| Scope | Path |
|-------|------|
| Project | `.claude/settings.json` |
| User | `~/.claude/settings.json` |
| Managed | Admin-provisioned (cannot override) |
| Skill-scoped | Skill frontmatter `hooks:` field |
| Agent-scoped | Agent frontmatter `hooks:` field |

### Handler Fields

**Command:** `type`, `command`, `timeout` (seconds, default 60), `async` (boolean)
**HTTP:** `type`, `url`, `headers`, `body`, `timeout` (default 30), `async`
**Prompt:** `type`, `prompt`, `model`, `timeout` (default 60)
**Agent:** `type`, `agent`, `prompt`, `timeout` (default 120)

### Environment Variables

| Variable | Available In |
|----------|-------------|
| `$CLAUDE_FILE_PATH` | PreToolUse, PostToolUse |
| `$CLAUDE_TOOL_NAME` | PreToolUse, PostToolUse |
| `$CLAUDE_TOOL_INPUT` | PreToolUse |
| `$CLAUDE_SESSION_ID` | All events |
| `$CLAUDE_NOTIFICATION` | Notification events |

## Common Patterns

**Auto-lint after edits:** PostToolUse + matcher "Edit|Write" + eslint/prettier
**Block dangerous ops:** PreToolUse + matcher "Bash" + check for rm -rf/force push + exit 2
**Audit logging:** PostToolUse + async command appending JSONL to log file
**Slack notifications:** SessionStart + async HTTP POST to webhook URL
**Sensitive file protection:** PreToolUse + matcher "Read|Edit" + check for .env/.pem/.key + exit 2

## When to Use Hooks

**Use hooks when:**
- You need deterministic guardrails (block dangerous operations)
- You want automatic enforcement (auto-lint, auto-format)
- You need compliance logging for every tool invocation
- You want external notifications at lifecycle events

**Don't use hooks when:**
- You need Claude to make judgment calls (use Skills)
- You need external data interaction (use MCP)
- You need complex multi-step workflows (use Agents)

## Key Decision: Hooks vs Skills

Hooks are deterministic and automatic. Skills are on-demand instructions. Hooks enforce rules ("always lint after edit"). Skills teach processes ("here's how to review code").

## Common Pitfalls

1. **Flat structure** -- Use the nested matcher-group structure, not flat matcher + type at same level
2. **Slow hooks** -- Keep commands fast; slow hooks degrade the interactive experience
3. **Missing matchers** -- Without a matcher, hooks fire on every event instance; always scope with regex
