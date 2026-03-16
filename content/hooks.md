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

Hooks are deterministic, event-driven automation in Claude Code. They run shell scripts, call HTTP endpoints, invoke Claude prompts, or delegate to subagents at specific lifecycle points. Hooks execute **outside the agentic loop** -- they are predictable and deterministic, not AI-generated responses.

Hooks are the lightest-weight extension point: no SDK, no protocol, just automation triggered at the right time. They are available in **Claude Code only** (not Chat or Cowork).

Use hooks when you want to react automatically to events -- auto-lint after edits, block commits to protected branches, log tool usage for compliance, or notify external services.

## How It Works

Hooks fire at specific lifecycle events during a Claude Code session. When an event occurs, all matching hooks execute in order. The hook's exit code or response determines what happens next.

### Hook Events (19)

Claude Code supports 19 lifecycle events:

| Event | When It Fires |
|-------|---------------|
| `SessionStart` | Session begins |
| `SessionEnd` | Session ends |
| `UserPromptSubmit` | Before Claude processes user input |
| `PreToolUse` | Before any tool call executes |
| `PostToolUse` | After a tool call completes successfully |
| `PostToolUseFailure` | After a tool call fails |
| `PermissionRequest` | When Claude requests permission for an action |
| `SubagentStart` | When a subagent spawns |
| `SubagentStop` | When a subagent completes |
| `PreCompact` | Before context compression |
| `ConfigChange` | When configuration changes |
| `WorktreeCreate` | When a git worktree is created |
| `TaskStart` | When a task begins |
| `TaskComplete` | When a task completes |
| `Notification` | When a notification event occurs |
| `Stop` | When Claude stops execution |

Additional events are available -- check the official documentation for the complete list.

### Hook Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Command** | Run a shell script | Linting, blocking, file validation |
| **HTTP** | POST to a remote endpoint | Webhook notifications, external API calls |
| **Prompt** | Single-turn LLM evaluation | Quick safety checks, content review |
| **Agent** | Multi-turn agentic verification | Thorough code review, complex validation |

**Exit codes for Command hooks:**
- `exit 0` -- Allow / proceed
- `exit 2` -- **Block** the action (stderr shown as feedback to Claude)
- Other codes -- Proceed (stderr logged but not shown)

**Additional options:**
- `async: true` -- Run the hook in the background (non-blocking)
- `matcher: "Edit|Write"` -- Regex pattern to scope the hook to specific tools

### In Claude Code

Hooks are configured in settings files or skill/agent frontmatter:

- **User-wide:** `~/.claude/settings.json`
- **Project-wide:** `.claude/settings.json`
- **Component-scoped:** Skill or agent frontmatter `hooks:` field

### In Claude Chat

Not available. Chat does not support hooks.

### In Claude Cowork

Not available. Cowork does not support hooks.

## Configuration

### Basic Hook Setup

Add hooks to your settings file:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "type": "command",
        "command": "npx eslint --fix $CLAUDE_FILE_PATH"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "type": "command",
        "command": "echo 'Bash command about to run: $CLAUDE_TOOL_INPUT'"
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "command": "echo 'Session started at $(date)' >> ~/.claude/session.log"
      }
    ]
  }
}
```

### Blocking Hook Example

Prevent direct commits to the main branch:

```json
{
  "PreToolUse": [{
    "matcher": "Bash",
    "type": "command",
    "command": "if echo $CLAUDE_TOOL_INPUT | grep -q 'git commit.*main'; then echo 'Blocked: no direct commits to main' >&2; exit 2; fi"
  }]
}
```

### HTTP Webhook Example

Notify Slack when a session starts:

```json
{
  "SessionStart": [{
    "type": "http",
    "url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "headers": { "Content-Type": "application/json" },
    "body": "{ \"text\": \"Claude Code session started by $USER\" }",
    "async": true
  }]
}
```

### Async Hooks

Background hooks that do not block the main flow:

```json
{
  "type": "command",
  "command": "curl -X POST https://api.example.com/log ...",
  "async": true
}
```

### Audit Logging for Compliance

```json
{
  "PostToolUse": [{
    "type": "command",
    "command": "echo '{\"tool\":\"$CLAUDE_TOOL_NAME\",\"time\":\"$(date -u +%FT%TZ)\",\"session\":\"$CLAUDE_SESSION_ID\"}' >> /var/log/claude-audit.jsonl",
    "async": true
  }]
}
```

### Sensitive File Protection

```json
{
  "PreToolUse": [{
    "matcher": "Read|Edit",
    "type": "command",
    "command": "if echo $CLAUDE_TOOL_INPUT | grep -qE '\\.(env|pem|key)$'; then echo 'Blocked: sensitive file' >&2; exit 2; fi"
  }]
}
```

### Skill-scoped Hooks

Hooks can be embedded in skill frontmatter to scope them to a specific skill:

```yaml
---
name: deploy-check
hooks:
  PostToolUse:
    - matcher: "Edit"
      command: "npm run lint"
---
```

## Best Practices

- Use `PreToolUse` hooks for **gatekeeping** (block dangerous operations before they execute)
- Use `PostToolUse` hooks for **enforcement** (auto-lint, auto-format after edits)
- Use `async: true` for non-blocking hooks like logging and notifications
- Use regex matchers to scope hooks to specific tools (`"matcher": "Edit|Write"`)
- Keep hook commands fast -- slow hooks degrade the interactive experience
- Use `exit 2` to block actions and provide feedback via stderr
- For compliance, use HTTP hooks to POST audit events to your SIEM
- Managed settings can enforce audit hooks org-wide that users cannot disable

## Common Questions

**What are Hooks and when should I use them?**
Hooks are event-driven automation that runs code at specific lifecycle points in Claude Code. Use them for auto-linting after edits, blocking dangerous operations, compliance logging, validating prompts before processing, and notifying external services. They are Claude Code only -- not available in Chat or Cowork.

**How do I set up a Hook in Claude Code?**
Add hooks to `.claude/settings.json` (project-level) or `~/.claude/settings.json` (user-level). Each hook specifies an event (e.g., `PostToolUse`), a type (`command`, `http`, `prompt`, or `agent`), and optionally a `matcher` regex to scope it to specific tools.

**What are common Hook patterns for enterprise teams?**
Auto-formatting after edits (PostToolUse + prettier), audit logging for compliance (PostToolUse + async JSONL logging), security checks before bash commands (PreToolUse + prompt evaluation), Slack notifications on session start (SessionStart + HTTP webhook), and blocking access to sensitive files (PreToolUse + exit 2).

## Related

- [Skills](skills.html) -- Skills teach Claude what to do; hooks automate when to react
- [Agents](agents.html) -- Agents can include hooks in their frontmatter
- [Plugins](plugins.html) -- Plugins can bundle hooks alongside skills and connectors
