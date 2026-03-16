---
title: Agents
slug: agents
order: 5
description: Create specialized AI workflows with custom instructions and tools
color: "#4ade80"
section: topics
---

# Agents

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Agents are **isolated Claude instances with specific instructions and tool access**. Each agent runs in its own context window with custom prompts, tool restrictions, model selection, and optionally persistent memory. In Claude Code, agents range from built-in assistants (Explore, Plan) to fully custom agent files you define. In Claude Cowork, a coordinator + sub-agent architecture handles parallel work automatically.

Agents are the right choice when you need Claude to take on a specific persona with constrained capabilities, operate in isolated context (without polluting the main session), or coordinate parallel work across multiple independent contexts.

The key difference between agents and skills: agents run in **separate context windows** with full isolation, while skills run inline in the main context (unless using `context: fork`).

## How It Works

### In Claude Code

Claude Code provides several **built-in agents**:
- **Explore** -- Uses Haiku model, read-only, for fast codebase exploration
- **Plan** -- Research and planning agent
- **Bash** -- Shell command execution agent
- **general-purpose** -- Default subagent type
- **claude-code-guide** -- Documentation helper

**Custom agents** are defined as markdown files at `.claude/agents/my-agent.md`. The file contains YAML frontmatter (up to 14 fields) followed by markdown instructions that define the agent's behavior, persona, and workflow.

Invoke a custom agent from the CLI:

```bash
claude --agent reviewer "Review the changes in src/auth/"
```

Claude can also spawn subagents automatically during complex tasks, delegating subtasks to specialized agents that operate in their own context windows.

**Agent Teams** enable multiple independent agents coordinating via shared task lists. Each agent runs in its own context, optionally in git worktree isolation. Enable with:

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### In Claude Cowork

Cowork uses a **coordinator + sub-agent architecture**:
1. The coordinator decomposes tasks into parallel sub-agent jobs
2. Example: one agent extracts data, another synthesizes, a third assembles output
3. The coordinator merges outputs and presents a draft for review
4. Sub-agents are bundled within plugins

This architecture is automatic -- users describe an outcome and step away. Cowork handles the decomposition and parallelization.

## When to Use Agents

**Use Agents when:**
- You need context isolation -- the agent's work should not pollute your main session
- You need a specific persona with constrained tool access (e.g., a read-only reviewer)
- You need persistent memory that accumulates knowledge across sessions
- You need parallel execution with multiple agents working on different aspects simultaneously
- You want a reproducible, shareable workflow that others can invoke via `claude --agent`

**Don't use Agents when:**
- You just need inline guidance or instructions (use [Skills](skills.html) instead -- they are lighter weight and auto-invoke)
- You need deterministic automation at lifecycle events (use [Hooks](hooks.html) instead)
- You need to connect to external tools or data (use [MCP](mcp.html) instead -- agents can *use* MCP servers, but MCP provides the tools)

**Agents vs other extension points:**
- **Agents vs Skills:** Agents get their own isolated context window, can have persistent memory, their own MCP servers, and can be invoked via CLI with `--agent`. Skills are instructions loaded into the main session, auto-invoked by description matching. Use an agent for autonomous multi-step work; use a skill for inline guidance. (Skills with `context: fork` bridge the gap by running in a separate context.)
- **Agents vs Direct Prompting:** Agents provide reproducible, shareable workflows. Instead of typing the same complex prompt repeatedly, define it once as an agent file and invoke it with `claude --agent my-agent`. Team members get the same behavior.

## Configuration

### Agent File Format

Custom agents in Claude Code use markdown files with YAML frontmatter:

```yaml
---
name: code-reviewer
description: Reviews code changes for quality and security issues
tools: Read, Grep, Glob
disallowedTools: Bash, Write
model: opus
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

You are a senior code reviewer. Examine all changed files for:
- Security vulnerabilities
- Performance issues
- Code style violations
- Missing error handling
- Test coverage gaps

Output a structured markdown report with severity levels.
```

### Key Configuration Fields

| Field | Purpose | Values |
|-------|---------|--------|
| `name` | Display name (required) | Any string |
| `description` | Auto-discovery trigger (required) | Descriptive text |
| `tools` / `disallowedTools` | Control available tools | Tool name list |
| `model` | Override model | `opus`, `sonnet`, `haiku`, or inherit |
| `permissionMode` | Permission level | `default`, `acceptEdits`, `plan`, `bypassPermissions` |
| `maxTurns` | Limit agentic loops | Number |
| `skills` | Preload skills into agent context | Skill name list |
| `mcpServers` | Agent-scoped MCP servers | Server config objects |
| `hooks` | Agent-scoped lifecycle hooks | Hook config objects |
| `memory` | Persistent cross-session knowledge | `user`, `project`, `local` |
| `background` | Run in background | Boolean |
| `isolation` | Git worktree isolation | `worktree` |

### Agent Memory

Agents can maintain persistent knowledge across sessions:

| Scope | Location | Visibility |
|-------|----------|------------|
| `user` | `~/.claude/agent-memory/<name>/` | Cross-project, personal |
| `project` | `.claude/agent-memory/<name>/` | Team-shared via git |
| `local` | `.claude/agent-memory-local/<name>/` | Personal, per-project |

Memory is written by the agent itself and loaded at the start of each session.

### Agent vs Command vs Skill

| Dimension | Agent | Command | Skill |
|-----------|-------|---------|-------|
| Context | Separate (isolated) | Inline (main) | Inline* |
| User-invocable | No /menu | Yes /name | Yes /name |
| Auto-invoked | Yes (by description) | Never | Yes (by description) |
| Own context | Yes (isolated) | No | No* |
| Model override | Yes | Yes | Yes |
| Tool restrictions | Yes | Yes | Yes |
| Hooks | Yes | No | Yes |
| Memory | Yes | No | No |
| Preload skills | Yes | No | No |
| MCP servers | Yes | No | No |

\* Skills with `context: fork` get separate context, behaving like an agent.

**When to use each:**
- **Agent** -- Autonomous multi-step work, context isolation, parallel teams
- **Command** -- User-initiated entry point, orchestration (legacy, prefer skills)
- **Skill** -- Reusable knowledge, auto-invoke on intent

### Worktree Isolation

Agents with `isolation: worktree` run in isolated git worktrees to avoid conflicts during parallel development:

```yaml
---
name: feature-builder
isolation: worktree
---
```

This creates a separate working copy of the repository for each agent, preventing file conflicts when multiple agents work simultaneously.

## Best Practices

- Use agents for tasks that need **context isolation** -- code review, research, parallel feature work
- Use `isolation: worktree` for agents that modify files in parallel
- Use the `memory` field for agents that accumulate knowledge over time
- Preload `skills:` to give agents specialized knowledge at startup
- Use `model: haiku` for subagents doing lightweight exploration
- Use `model: opus` for agents doing complex reasoning (architecture, review)
- Set `maxTurns` to prevent runaway agent loops
- Use `disallowedTools` for read-only agents (e.g., reviewers that should not modify code)
- Agent teams coordinate via shared task lists -- enable experimentally

## Common Questions

**What are subagents and how do they work?**
Subagents are specialized AI assistants that Claude Code spawns to handle subtasks. Each subagent runs in its own isolated context with custom prompts, tool restrictions, and model selection. Built-in subagents include Explore (Haiku, read-only), Plan (research), and general-purpose. Custom subagents are defined as markdown files in `.claude/agents/`.

**How do Agent Teams work?**
Agent Teams enable multiple independent agents coordinating via shared task lists. Each agent runs in its own context, optionally in git worktree isolation for parallel development without conflicts. Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. In Cowork, this coordinator + sub-agent architecture is built in.

**How does agent memory work?**
Agents can maintain persistent cross-session knowledge. Three scopes: `user` (cross-project at `~/.claude/agent-memory/<name>/`), `project` (team-shared via git), and `local` (personal, per-project). The agent writes its own memory, which loads at session start.

**When should I use an agent vs a skill?**
Use an agent when you need context isolation, persistent memory, MCP server access, or parallel execution. Use a skill when you need inline instructions that auto-invoke based on task context. Skills with `context: fork` bridge the gap by running in a separate context like an agent.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

> [!INFO]
> Step-by-step guides for Agents are coming in Phase 4.

Planned guides:
- How to create a custom agent -- _coming soon_

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

> [!INFO]
> Detailed reference specs for Agents are coming in Phase 4.

Planned references:
- Agent file format spec (all fields, validation rules) -- _coming soon_
- Environment variables reference -- _coming soon_

  </div>
</div>

## Related

- [Skills](skills.html) -- Skills provide reusable instructions; agents provide isolated execution contexts
- [Plugins](plugins.html) -- Plugins can bundle agent definitions alongside skills
- [Hooks](hooks.html) -- Agents can include scoped hooks in their frontmatter
- [MCP](mcp.html) -- Agents can declare their own MCP servers
