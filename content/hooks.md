---
title: Hooks
slug: hooks
order: 4
description: Run custom scripts at key lifecycle events in Claude Code
color: "#f87171"
section: topics
---

# Hooks

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Hooks are **deterministic automation outside the agentic loop**. They run shell scripts, call HTTP endpoints, invoke Claude prompts, or delegate to subagents at specific lifecycle events in Claude Code. Unlike skills and agents, hooks execute predictably and automatically -- Claude does not decide whether to run them. When the event fires, the hook runs. Every time.

Hooks are the lightest-weight extension point: no SDK, no protocol, just automation triggered at the right time. They are available in **Claude Code only** (not Chat or Cowork).

Use hooks when you want to react automatically to events -- auto-lint after edits, block commits to protected branches, log tool usage for compliance, or notify external services. The key distinction: hooks are about *when things happen*, not about *what Claude should do*.

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

### Matchers

The **matchers system** lets you scope hooks to specific tools or file patterns. Use the `matcher` field with a regex pattern:

- `"matcher": "Edit|Write"` -- Only fire when the Edit or Write tool is used
- `"matcher": "Bash"` -- Only fire for Bash tool calls
- `"matcher": "Read|Edit"` -- Fire for Read or Edit operations

Without a matcher, hooks fire for every instance of the event. Use matchers to keep hooks focused and avoid unnecessary execution.

**Additional options:**
- `async: true` -- Run the hook in the background (non-blocking)

### In Claude Code

Hooks are configured in settings files or skill/agent frontmatter:

- **User-wide:** `~/.claude/settings.json`
- **Project-wide:** `.claude/settings.json`
- **Component-scoped:** Skill or agent frontmatter `hooks:` field

### In Claude Chat

Not available. Chat does not support hooks.

### In Claude Cowork

Not available. Cowork does not support hooks.

## When to Use Hooks

**Use Hooks when:**
- You need guardrails that enforce rules deterministically (block dangerous operations before they execute)
- You want automatic enforcement after actions (auto-lint, auto-format after every edit)
- You need compliance logging that captures every tool invocation
- You want notifications sent to external services (Slack, webhooks) at lifecycle events
- You need validation that runs without relying on Claude's judgment

**Don't use Hooks when:**
- You need Claude to make a judgment call about what to do (use [Skills](skills.html) instead -- skills provide instructions Claude interprets)
- You need to interact with external data sources or APIs as part of Claude's reasoning (use [MCP](mcp.html) instead)
- You need complex multi-step workflows with context isolation (use [Agents](agents.html) instead)

**Hooks vs other extension points:**
- **Hooks vs Skills:** Hooks are deterministic and automatic -- they fire at lifecycle events regardless of what Claude is thinking. Skills are on-demand instructions that Claude loads when relevant. Use hooks for "always do X when Y happens"; use skills for "here's how to do Z when asked."
- **Hooks vs Agents:** Hooks are lightweight, single-action automations. Agents are full isolated contexts for multi-step work. You can use an `agent` type hook for complex validation, but that's the exception.

> [!TIP]
> **Consider alternatives:** If you want to teach Claude a process rather than enforce rules, consider [Skills](skills.html). If you need complex multi-step validation with context isolation, consider [Agents](agents.html). For a detailed comparison, see [Hook vs Skill](comparisons.html).

## Configuration

### Basic Hook Setup

Add hooks to your settings file. Hooks use a **nested structure** where each event contains an array of matcher groups, and each matcher group contains a `hooks` array of handlers:

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
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Bash command about to run: $CLAUDE_TOOL_INPUT'"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session started at $(date)' >> ~/.claude/session.log"
          }
        ]
      }
    ]
  }
}
```

### Blocking Hook Example

Prevent direct commits to the main branch:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo $CLAUDE_TOOL_INPUT | grep -q 'git commit.*main'; then echo 'Blocked: no direct commits to main' >&2; exit 2; fi"
          }
        ]
      }
    ]
  }
}
```

### HTTP Webhook Example

Notify Slack when a session starts:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
            "headers": { "Content-Type": "application/json" },
            "body": "{ \"text\": \"Claude Code session started by $USER\" }",
            "async": true
          }
        ]
      }
    ]
  }
}
```

### Audit Logging for Compliance

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"tool\":\"$CLAUDE_TOOL_NAME\",\"time\":\"'$(date -u +%FT%TZ)'\",\"session\":\"$CLAUDE_SESSION_ID\"}' >> /var/log/claude-audit.jsonl",
            "async": true
          }
        ]
      }
    ]
  }
}
```

### Sensitive File Protection

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo $CLAUDE_TOOL_INPUT | grep -qE '\\.(env|pem|key)$'; then echo 'Blocked: sensitive file' >&2; exit 2; fi"
          }
        ]
      }
    ]
  }
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
      hooks:
        - type: command
          command: "npm run lint"
---
```

For the complete hook configuration specification with all 24 events, 4 handler types, matcher syntax, and exit code behavior, see the **Reference** tab.

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

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How to Set Up Hooks for Lifecycle Events

Add deterministic automation that fires at key points in a Claude Code session -- lint after edits, block dangerous operations, or notify external services.

### Prerequisites

- Claude Code installed and working (`claude --version`)
- Access to settings.json (project-level at `.claude/settings.json` or user-level at `~/.claude/settings.json`)
- For this example: ESLint installed in your project (`npm install --save-dev eslint`)

### Step 1: Open Your Settings File

Hooks are configured in settings.json. Choose the right scope:

- **Project-level** (shared via git): `.claude/settings.json`
- **User-level** (personal, all projects): `~/.claude/settings.json`

Create the file if it does not exist:

```bash
mkdir -p .claude
touch .claude/settings.json
echo '{}' > .claude/settings.json
```

### Step 2: Add a PreToolUse Hook for File Linting

Add a hook that runs ESLint on files before Claude uses the Edit or Write tools. This catches lint errors before they are introduced:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH",
            "timeout": 600
          }
        ]
      }
    ]
  }
}
```

**Key points about the structure:**
- Each event (e.g., `PreToolUse`) contains an array of **matcher groups**
- Each matcher group has a `matcher` regex and a `hooks` array of handlers
- The `matcher` field scopes the hook to specific tools (here, Edit or Write)
- The `timeout` is in seconds (default varies by hook type)

### Step 3: Add a Notification Hook

Add a second hook that sends a Slack notification when Claude sends a notification event:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH",
            "timeout": 600
          }
        ]
      }
    ],
    "NotificationSend": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
            "headers": { "Content-Type": "application/json" },
            "body": "{ \"text\": \"Claude Code notification: $CLAUDE_NOTIFICATION\" }",
            "async": true
          }
        ]
      }
    ]
  }
}
```

The `async: true` flag makes the HTTP call non-blocking so it does not slow down your session.

### Step 4: Test the Hook

Start a Claude Code session and trigger the event. For the ESLint hook, ask Claude to edit a JavaScript file:

```
> Fix the bug in src/utils.js
```

When Claude uses the Edit tool, the PreToolUse hook fires first. If ESLint finds and fixes issues, the file is linted before Claude's edit is applied.

### Verify It Works

- The hook fires when Claude uses the Edit or Write tools on JavaScript files
- ESLint output appears in the hook execution log
- For the notification hook, check your Slack channel for incoming messages
- Use `exit 2` in a command hook to test blocking behavior -- Claude will see the stderr feedback

### Troubleshooting

- **Hook not firing:** Check the `matcher` regex -- it matches against tool names (e.g., `Edit`, `Write`, `Bash`, `Read`). Without a matcher, hooks fire for every instance of the event.
- **Exit code 2 blocking unexpectedly:** Exit code 2 means "block this action." The hook's stderr is shown to Claude as feedback. Use exit code 0 to allow, or any other code to proceed with a warning.
- **Timeout issues:** The default timeout varies. Set an explicit `timeout` value in seconds. Long-running hooks degrade the interactive experience.
- **Wrong config structure:** Hooks use a nested structure: event > matcher groups > hooks array. A flat structure (matcher and type at the same level) may cause parsing errors.
- **Environment variables not available:** Hook commands receive `$CLAUDE_FILE_PATH`, `$CLAUDE_TOOL_NAME`, `$CLAUDE_TOOL_INPUT`, `$CLAUDE_SESSION_ID`, and other context variables. Ensure your command references them correctly.

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Hook Configuration Specification

### Configuration Location

Hooks are configured in the `hooks` object within settings files:

| Scope | Path | Visibility |
|-------|------|------------|
| Project | `.claude/settings.json` | Shared via git, team-wide |
| User | `~/.claude/settings.json` | Personal, all projects |
| Managed | Managed settings (admin) | Organization-wide, cannot be overridden |
| Skill-scoped | Skill frontmatter `hooks:` field | Scoped to one skill only |
| Agent-scoped | Agent frontmatter `hooks:` field | Scoped to one agent only |

### Complete Schema

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH",
            "timeout": 600
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH",
            "timeout": 300,
            "async": true
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/T00/B00/xxx",
            "headers": { "Content-Type": "application/json" },
            "body": "{ \"text\": \"Claude session started by $USER\" }",
            "async": true
          }
        ]
      }
    ]
  }
}
```

### Event Reference (24 Events)

| Event | Description | Blockable | Matcher Target |
|-------|-------------|-----------|----------------|
| `PreToolUse` | Before a tool call executes | Yes | Tool name |
| `PostToolUse` | After a tool call succeeds | No | Tool name |
| `PostToolUseFailure` | After a tool call fails | No | Tool name |
| `Notification` | When a notification event occurs | No | N/A |
| `NotificationSend` | When a notification is sent | No | N/A |
| `Stop` | When Claude stops execution | Yes | N/A |
| `SubagentStop` | When a subagent completes | Yes | N/A |
| `PreCompact` | Before context compression | No | N/A |
| `SessionStart` | When a session begins | No | N/A |
| `SessionEnd` | When a session ends | No | N/A |
| `SessionPause` | When a session is paused | No | N/A |
| `SessionResume` | When a session resumes | No | N/A |
| `UserPromptSubmit` | Before Claude processes user input | Yes | N/A |
| `PermissionRequest` | When Claude requests permission | Yes | Tool name |
| `SubagentStart` | When a subagent spawns | No | N/A |
| `ConfigChange` | When configuration changes | No | N/A |
| `WorktreeCreate` | When a git worktree is created | No | N/A |
| `TaskStart` | When a task begins | No | N/A |
| `TaskComplete` | When a task completes | No | N/A |
| `TeammateIdle` | When a teammate agent becomes idle | No | N/A |
| `TaskCompleted` | When a tracked task completes | No | N/A |
| `InstructionsLoaded` | When instructions finish loading | No | N/A |
| `Elicitation` | When Claude asks for clarification | No | N/A |
| `ToolResult` | When a tool returns a result | No | Tool name |

### Handler Types

**Command handler** -- runs a shell command:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | Yes | N/A | Must be `"command"` |
| `command` | string | Yes | N/A | Shell command to execute. Environment variables are expanded. |
| `timeout` | number | No | 60 | Timeout in seconds |
| `async` | boolean | No | `false` | Run in background (non-blocking) |

**HTTP handler** -- sends an HTTP POST request:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | Yes | N/A | Must be `"http"` |
| `url` | string | Yes | N/A | URL to POST to |
| `headers` | object | No | `{}` | HTTP headers as key-value pairs |
| `body` | string | No | `""` | Request body. Environment variables are expanded. |
| `timeout` | number | No | 30 | Timeout in seconds |
| `async` | boolean | No | `false` | Run in background (non-blocking) |

**Prompt handler** -- single-turn LLM evaluation:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | Yes | N/A | Must be `"prompt"` |
| `prompt` | string | Yes | N/A | Prompt text for Claude to evaluate. Environment variables are expanded. |
| `model` | string | No | inherited | Model to use for evaluation |
| `timeout` | number | No | 60 | Timeout in seconds |

**Agent handler** -- multi-turn agentic verification:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | Yes | N/A | Must be `"agent"` |
| `agent` | string | Yes | N/A | Agent name or path to agent file |
| `prompt` | string | No | `""` | Initial prompt for the agent |
| `timeout` | number | No | 120 | Timeout in seconds |

### Matcher Syntax

The `matcher` field uses regex patterns to scope hooks to specific tools:

| Pattern | Matches |
|---------|---------|
| `"Edit\|Write"` | Edit or Write tools |
| `"Bash"` | Bash tool only |
| `"Read\|Edit"` | Read or Edit tools |
| `".*"` | All tools (same as omitting matcher) |

Without a `matcher`, the hook fires for every instance of the event. Matchers only apply to events that target tools (e.g., PreToolUse, PostToolUse, PermissionRequest).

### Exit Code Behavior

For **command** handlers on blockable events:

| Exit Code | Behavior |
|-----------|----------|
| `0` | Allow -- the action proceeds normally |
| `1` | Error -- logged but action proceeds |
| `2` | **Block** -- the action is prevented. Stderr is shown to Claude as feedback. |
| Other | Proceed with warning logged |

### JSON Output Schemas

Command hooks can output JSON to stdout for structured feedback. For blockable events, the JSON schema:

```json
{
  "decision": "allow",
  "reason": "File passes all checks"
}
```

Or to block:

```json
{
  "decision": "block",
  "reason": "File contains sensitive data patterns"
}
```

### Environment Variables in Hooks

| Variable | Available In | Description |
|----------|-------------|-------------|
| `$CLAUDE_FILE_PATH` | PreToolUse, PostToolUse | Path to the file being operated on |
| `$CLAUDE_TOOL_NAME` | PreToolUse, PostToolUse | Name of the tool being used |
| `$CLAUDE_TOOL_INPUT` | PreToolUse | Tool input (JSON string) |
| `$CLAUDE_SESSION_ID` | All events | Current session identifier |
| `$CLAUDE_NOTIFICATION` | Notification events | Notification message content |
| `$USER` | All events | Current OS username |

### Examples

**Minimal hook** (auto-format after edits):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

**Full example** (multiple events, multiple handler types):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint $CLAUDE_FILE_PATH",
            "timeout": 600
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo $CLAUDE_TOOL_INPUT | grep -q 'rm -rf'; then echo 'Blocked: destructive command' >&2; exit 2; fi"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH",
            "async": true
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.slack.com/services/T00/B00/xxx",
            "headers": { "Content-Type": "application/json" },
            "body": "{ \"text\": \"Claude session started by $USER\" }",
            "async": true
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"tool\":\"$CLAUDE_TOOL_NAME\",\"time\":\"'$(date -u +%FT%TZ)'\",\"session\":\"$CLAUDE_SESSION_ID\"}' >> /var/log/claude-audit.jsonl",
            "async": true
          }
        ]
      }
    ]
  }
}
```

  </div>
</div>

## Related

- [Skills](skills.html) -- Skills teach Claude what to do; hooks automate when to react
- [Agents](agents.html) -- Agents can include hooks in their frontmatter
- [Plugins](plugins.html) -- Plugins can bundle hooks alongside skills and connectors
