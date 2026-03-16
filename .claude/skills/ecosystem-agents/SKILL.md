---
name: ecosystem-agents
description: Knowledge about Agents in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Agents

## Overview

Agents are **isolated Claude instances with specific instructions and tool access**. Each agent runs in its own context window with custom prompts, tool restrictions, model selection, and optionally persistent memory. In Claude Code, agents range from built-in assistants (Explore, Plan) to fully custom agent files. In Claude Cowork, a coordinator + sub-agent architecture handles parallel work.

The key difference between agents and skills: agents run in **separate context windows** with full isolation, while skills run inline in the main context (unless using `context: fork`).

## Built-In Agents (Claude Code)

- **Explore** -- Haiku model, read-only, fast codebase exploration
- **Plan** -- Research and planning agent
- **Bash** -- Shell command execution
- **general-purpose** -- Default subagent type
- **claude-code-guide** -- Documentation helper

## Custom Agent File Format

Custom agents are markdown files at `.claude/agents/my-agent.md`:

```yaml
---
name: code-reviewer
description: Reviews code changes for quality and security
tools: Read, Grep, Glob
disallowedTools: Write, Edit, Bash
model: sonnet
permissionMode: plan
maxTurns: 20
skills:
  - code-standards
  - security-review
mcpServers:
  github:
    command: npx
    args: ["@modelcontextprotocol/server-github"]
hooks:
  PostToolUse:
    - matcher: "Read"
      command: "echo 'File reviewed: $CLAUDE_FILE_PATH'"
memory: project
background: false
isolation: worktree
---

# Code Reviewer Agent

You are a senior code reviewer. Examine changed files for security,
performance, style, error handling, and test coverage.
```

## Frontmatter Fields

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `name` | string | filename | Display name |
| `description` | string | "" | Auto-discovery trigger |
| `tools` | string list | all | Allowed tools only |
| `disallowedTools` | string list | none | Denied tools |
| `model` | string | inherited | `haiku`, `sonnet`, `opus`, or model ID |
| `permissionMode` | enum | default | `default`, `acceptEdits`, `plan`, `bypassPermissions`, `dontAsk` |
| `maxTurns` | number | unlimited | Limits agentic loops |
| `skills` | string list | none | Preload skills at startup |
| `mcpServers` | array | none | Agent-scoped MCP servers |
| `hooks` | object | none | Agent-scoped lifecycle hooks |
| `memory` | enum | none | `project`, `user`, or `local` |
| `background` | boolean | false | Run in background |
| `isolation` | enum | none | `worktree` for git worktree isolation |

## Invocation

```bash
# CLI invocation
claude --agent code-reviewer "Review changes in src/auth/"

# Claude can also spawn subagents automatically during complex tasks
```

## Agent Memory

Persistent cross-session knowledge:

| Scope | Path | Visibility |
|-------|------|------------|
| `project` | `.claude/agent-memory/<name>/` | Team-shared via git |
| `user` | `~/.claude/agent-memory/<name>/` | Personal, cross-project |
| `local` | `.claude/agent-memory-local/<name>/` | Personal, per-project |

Memory is written by the agent itself and loaded at session start.

## File Resolution Priority

1. **Project** (`.claude/agents/*.md`) -- highest
2. **Personal** (`~/.claude/agents/*.md`)
3. **Plugin** (`<plugin>/agents/*.md`)
4. **Built-in** (Explore, Plan, Bash)

## Agent Teams

Multiple independent agents coordinating via shared task lists. Each agent runs in its own context, optionally in git worktree isolation.

Enable: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

In Cowork, this coordinator + sub-agent architecture is built in.

## When to Use Agents

**Use agents when:**
- You need context isolation (work should not pollute main session)
- You need a specific persona with constrained tools
- You need persistent memory across sessions
- You need parallel execution with multiple agents
- You want reproducible, shareable workflows via `claude --agent`

**Don't use agents when:**
- You just need inline guidance (use Skills)
- You need deterministic automation (use Hooks)
- You need external tool connections (use MCP; agents *use* MCP, they don't replace it)

## Key Decision: Agents vs Skills

| Dimension | Agent | Skill |
|-----------|-------|-------|
| Context | Separate (isolated) | Inline (main)* |
| Auto-invoked | By description | By description |
| Memory | Yes | No |
| MCP servers | Yes (scoped) | No |
| Preload skills | Yes | No |
| Model override | Yes | Yes |
| Tool restrictions | Yes | Yes |

*Skills with `context: fork` get separate context, behaving like an agent.

## Common Pitfalls

1. **No maxTurns** -- Always set `maxTurns` to prevent runaway agent loops
2. **Overly permissive tools** -- Use `disallowedTools` for read-only agents (reviewers, explorers)
3. **Wrong memory scope** -- `project` is git-shared; use `local` for personal per-project notes
