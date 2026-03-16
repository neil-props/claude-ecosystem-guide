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

| Field | Purpose |
|-------|---------|
| `name` / `description` | Identity and auto-discovery trigger |
| `tools` / `disallowedTools` | Control available tools |
| `model` | Override model (`opus`, `sonnet`, `haiku`) |
| `permissionMode` | Permission level for the agent |
| `maxTurns` | Limit agentic loops |
| `skills` | Preload skills into agent context |
| `mcpServers` | Agent-scoped MCP servers |
| `hooks` | Agent-scoped lifecycle hooks |
| `memory` | Persistent cross-session knowledge |

For the complete agent file format specification with all 12 fields, types, defaults, and validation rules, see the **Reference** tab.

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

## How to Create a Custom Agent

Build a specialized agent with its own context, tool restrictions, and optional persistent memory.

### Prerequisites

- Claude Code installed and working (`claude --version`)
- A project with a `.claude/` directory (or willingness to create one)
- A specific persona or workflow you want to isolate from the main session

### Step 1: Create the Agents Directory

```bash
mkdir -p .claude/agents
```

This creates the project-level agents directory. Agents placed here are shared with your team via git.

### Step 2: Create the Agent File with Frontmatter

Create a file at `.claude/agents/code-reviewer.md` with YAML frontmatter defining the agent's capabilities:

```yaml
---
name: code-reviewer
description: Reviews code changes for quality, security, and style issues
tools: Read, Grep, Glob
disallowedTools: Write, Edit, Bash
model: sonnet
permissionMode: plan
maxTurns: 20
---
```

**Key fields explained:**
- **`tools`** / **`disallowedTools`** -- Control what the agent can and cannot do. This reviewer can read but not modify code.
- **`model`** -- Override the model. Use `opus` for complex reasoning, `haiku` for fast lightweight tasks.
- **`permissionMode`** -- Controls permission prompts: `default` (normal prompts), `acceptEdits` (auto-accept edits), `plan` (show plan, ask confirmation), `bypassPermissions` (skip all), `dontAsk` (deny without asking).
- **`maxTurns`** -- Limits agentic loops to prevent runaway execution.

### Step 3: Write the Agent Instructions

Below the frontmatter, add the markdown body that defines the agent's behavior:

```markdown
# Code Reviewer

You are a senior code reviewer. When invoked, examine all changed files for:

## Review Checklist

1. **Security vulnerabilities** -- SQL injection, XSS, auth bypass, secrets in code
2. **Performance issues** -- N+1 queries, unnecessary re-renders, memory leaks
3. **Code style** -- Naming conventions, file organization, consistent patterns
4. **Error handling** -- Missing try/catch, unhandled promise rejections, null checks
5. **Test coverage** -- New code paths without tests, edge cases not covered

## Output Format

Provide a structured markdown report:

### Critical Issues (must fix)
### Warnings (should fix)
### Suggestions (nice to have)

Rate overall code quality: A (excellent) through F (needs major rework).
```

### Step 4: Test the Agent

Invoke the agent from the command line:

```bash
claude --agent code-reviewer "Review the changes in src/auth/"
```

The agent runs in its own isolated context with only the tools you specified (Read, Grep, Glob). It cannot modify files because Write, Edit, and Bash are disallowed.

### Step 5: Add Advanced Features

Enhance the agent with skills, MCP servers, hooks, and memory:

```yaml
---
name: code-reviewer
description: Reviews code changes for quality, security, and style issues
tools: Read, Grep, Glob
disallowedTools: Write, Edit, Bash
model: sonnet
permissionMode: plan
maxTurns: 20
skills:
  - code-standards
  - security-review
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
hooks:
  PreToolUse:
    - matcher: "Read"
      hooks:
        - type: command
          command: "echo 'Reviewing: $CLAUDE_FILE_PATH' >> .claude/review.log"
memory: project
---
```

- **`skills`** -- Preloads skill instructions into the agent's context at startup
- **`mcpServers`** -- Agent-scoped MCP servers (not shared with main session)
- **`hooks`** -- Agent-scoped lifecycle hooks
- **`memory: project`** -- Persistent knowledge stored at `.claude/agent-memory/code-reviewer/`, shared via git

### Step 6: Create a Personal Agent for Cross-Project Use

For agents you want in every project:

```bash
mkdir -p ~/.claude/agents
```

Create `~/.claude/agents/quick-explore.md`:

```yaml
---
name: quick-explore
description: Fast codebase exploration using lightweight model
tools: Read, Grep, Glob
model: haiku
maxTurns: 10
---

# Quick Explorer

You are a fast codebase navigator. When asked about code:
1. Search for relevant files using Glob and Grep
2. Read key sections
3. Provide a concise summary

Keep responses brief and focused. You are optimized for speed.
```

Personal agents have lower priority than project-level agents.

### Verify It Works

- `claude --agent code-reviewer` starts the agent in an isolated context
- The agent can only use Read, Grep, and Glob (not Write, Edit, or Bash)
- The agent follows the instructions in the markdown body
- If `memory: project` is set, a `.claude/agent-memory/code-reviewer/` directory is created after the first run

### Troubleshooting

- **Agent not found:** Verify the file is at `.claude/agents/code-reviewer.md` (not nested in a subdirectory). The filename (minus `.md`) is the agent identifier.
- **Permission mode issues:** `bypassPermissions` skips all safety prompts -- use cautiously. `plan` mode shows a plan before execution, which is safer for review agents.
- **Tools not restricted:** Ensure `disallowedTools` lists the exact tool names: `Write`, `Edit`, `Bash`, `Read`, `Grep`, `Glob`. Names are case-sensitive.
- **Memory not persisting:** Check that the memory scope matches your intent: `project` stores at `.claude/agent-memory/<name>/`, `user` at `~/.claude/agent-memory/<name>/`, `local` at `.claude/agent-memory-local/<name>/`.
- **Agent running too long:** Set `maxTurns` to limit the number of agentic loops. Start with 10-20 for review tasks, higher for complex multi-step work.

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Agent File Format Specification

### File Location

| Scope | Path | Visibility |
|-------|------|------------|
| Project | `.claude/agents/*.md` | Shared via git, team-wide |
| Personal | `~/.claude/agents/*.md` | Your own, all projects |
| Plugin | `<plugin>/agents/*.md` | Via plugin installation |

**Resolution priority:** Project > Personal > Plugin. If multiple agents share a name, the highest-priority scope wins.

### Complete Frontmatter Example

```yaml
---
name: code-reviewer
description: Reviews code changes for quality, security, and style issues
tools: Read, Grep, Glob
disallowedTools: Write, Edit, Bash
model: sonnet
permissionMode: plan
maxTurns: 20
skills:
  - code-standards
  - security-review
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
memory: project
background: false
isolation: worktree
---
```

### Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | filename | Display name. Defaults to the filename (minus `.md`) if omitted. |
| `description` | string | Yes | `""` | Describes the agent's purpose. Used for auto-discovery when spawning subagents. |
| `tools` | string list | No | all tools | Comma-separated list of allowed tools. If set, only these tools are available. |
| `disallowedTools` | string list | No | none | Comma-separated list of denied tools. Cannot overlap with `tools`. |
| `model` | string | No | inherited | Model override: `haiku`, `sonnet`, `opus`, or a specific model ID. |
| `permissionMode` | enum | No | `default` | `default` (normal prompts), `acceptEdits` (auto-accept file edits), `dontAsk` (deny without asking), `bypassPermissions` (skip all), `plan` (show plan first). |
| `maxTurns` | number | No | unlimited | Maximum number of agentic turns before the agent stops. |
| `skills` | string list | No | none | Skills to preload into the agent's context at startup. |
| `mcpServers` | array | No | none | Agent-scoped MCP servers. Each entry is an object with server config or a string referencing a named server. |
| `hooks` | object | No | none | Agent-scoped lifecycle hooks. Uses the same nested hook schema as settings.json. |
| `memory` | enum | No | none | Persistent memory scope: `project` (`.claude/agent-memory/<name>/`), `user` (`~/.claude/agent-memory/<name>/`), or `local` (`.claude/agent-memory-local/<name>/`). |
| `background` | boolean | No | `false` | Run the agent in the background. |
| `isolation` | enum | No | `none` | `worktree` creates an isolated git worktree for the agent. `none` shares the working directory. |

### File Resolution Priority

When Claude resolves an agent by name:

1. **Project agents** (`.claude/agents/*.md`) -- highest priority
2. **Personal agents** (`~/.claude/agents/*.md`)
3. **Plugin agents** (`<plugin>/agents/*.md`) -- lowest priority
4. **Built-in agents** (Explore, Plan, Bash, etc.)

### Memory Scopes

| Scope | Storage Path | Visibility | Use Case |
|-------|-------------|------------|----------|
| `project` | `.claude/agent-memory/<name>/` | Team-shared via git | Shared knowledge base for the team |
| `user` | `~/.claude/agent-memory/<name>/` | Personal, cross-project | Personal agent knowledge |
| `local` | `.claude/agent-memory-local/<name>/` | Personal, per-project | Project-specific personal notes |

Memory is written by the agent during execution and loaded automatically at the start of each session. The agent manages its own memory files (typically markdown).

### Examples

**Minimal agent** (name and description only):

```yaml
---
name: quick-review
description: Quick code review for pull requests
---

Review the current changes. Focus on bugs and security issues.
Provide a brief summary with severity ratings.
```

**Full agent** (all 12 fields):

```yaml
---
name: code-reviewer
description: Reviews code changes for quality, security, and style issues
tools: Read, Grep, Glob
disallowedTools: Write, Edit, Bash
model: sonnet
permissionMode: plan
maxTurns: 20
skills:
  - code-standards
  - security-review
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
hooks:
  PreToolUse:
    - matcher: "Read"
      hooks:
        - type: command
          command: "echo 'Reviewing: $CLAUDE_FILE_PATH'"
memory: project
background: false
isolation: worktree
---

# Code Reviewer

You are a senior code reviewer. Examine all changed files for security
vulnerabilities, performance issues, style violations, and missing tests.
Output a structured markdown report with severity levels.
```

  </div>
</div>

## Related

- [Skills](skills.html) -- Skills provide reusable instructions; agents provide isolated execution contexts
- [Plugins](plugins.html) -- Plugins can bundle agent definitions alongside skills
- [Hooks](hooks.html) -- Agents can include scoped hooks in their frontmatter
- [MCP](mcp.html) -- Agents can declare their own MCP servers
