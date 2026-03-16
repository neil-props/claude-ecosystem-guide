---
title: Memory
slug: memory
order: 9
description: Manage Claude's persistent context and learned preferences
color: "#34d399"
section: topics
---

# Memory System

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Memory is how Claude remembers things across sessions -- the system for persisting context beyond a single conversation. Without memory, every Claude session would start from zero, requiring you to re-explain your project's conventions, preferences, and quirks each time.

Claude's memory system operates across four layers, each with different scope, persistence, and authorship. Together they ensure Claude retains project context, user preferences, and learned patterns across sessions -- without requiring you to repeat yourself.

Understanding which layer to use is key to effective long-term Claude usage.

## How It Works

### The 4-Layer Architecture

Claude's memory system has four distinct layers:

| Layer | Who Writes | Who Reads | Scope | Persistence |
|-------|-----------|-----------|-------|-------------|
| **CLAUDE.md** | You (the developer) | Claude + all agents | Project-wide | Always loaded |
| **Auto-memory** | Claude (automatically) | Claude only | Per-project, per-user | First 200 lines loaded |
| **/memory command** | You (manually) | Claude only | Per-project, per-user | Written to auto-memory file |
| **Agent memory** | The agent itself | That specific agent only | Configurable | Loaded at agent startup |

### In Claude Code

**CLAUDE.md** is the foundation of the memory system. It's a markdown file you write and maintain, loaded at every session start. All agents in the project can read it. It is never compacted -- critical information here is always available. See the [Projects](projects.html) page for full details.

**Auto-memory** is Claude's own learning journal. When Claude discovers important patterns during a session -- your preferred naming conventions, common mistakes to avoid, project quirks -- it can save them automatically:

```
~/.claude/projects/<project-hash>/memory/MEMORY.md
```

The first 200 lines of the memory file are auto-loaded at session start. Toggle auto-memory with the `/memory` command.

You can also instruct Claude to remember things explicitly using the **/memory command**:

```
> "Remember: always use our custom Button component from @/components/ui, never raw HTML buttons"
```

This persists in the memory file and is available in future sessions. The /memory command writes to the same auto-memory file -- the distinction is whether Claude writes automatically or you write explicitly.

**Agent memory** allows individual agents to maintain their own persistent knowledge. Memory scope is configured in the agent's frontmatter:

| Scope | Location | Visibility |
|-------|----------|------------|
| `user` | `~/.claude/agent-memory/<agent-name>/` | Cross-project, personal |
| `project` | `.claude/agent-memory/<agent-name>/` | Team-shared (via git) |
| `local` | `.claude/agent-memory-local/<agent-name>/` | Personal, per-project |

Agents write to their own memory independently and read it at startup.

### In Claude Chat

Claude Chat uses **Projects** as its memory mechanism:

- Custom instructions persist across all conversations within a project
- Uploaded knowledge base files serve as reference memory
- No auto-memory -- context is managed through project setup and conversation history

### In Claude Cowork

- **Global instructions** in the Customize menu serve as persistent memory across sessions
- **Folder-specific instructions** provide context when working in specific directories
- Plugin configurations also contribute to Cowork's contextual awareness

## When to Use Each Layer

Each memory layer serves a different purpose. Here is when to use each:

- **CLAUDE.md** -- Project standards, coding conventions, architecture decisions, workflow instructions. Use for anything the whole team should know. This is the most reliable layer because it is always loaded and never compacted.
- **Auto-memory** -- Let Claude learn your preferences organically. Good for personal patterns that emerge over time (naming preferences, common mistakes to avoid, project quirks).
- **/memory command** -- Important one-off facts you want Claude to remember: "my API key format is X", "always use tabs not spaces in this project", "the staging server is at deploy.example.com".
- **Agent memory** -- Specialized knowledge for custom agents that need to accumulate expertise over time. An agent that reviews PRs might learn your team's review standards across sessions.

### What Persists and What Doesn't

| Item | Survives session restart? | Scope |
|------|--------------------------|-------|
| CLAUDE.md files | Yes (always loaded) | Project-wide |
| Auto-memory | Yes (first 200 lines) | Per-project, per-user |
| Agent memory | Yes (at agent startup) | Per-agent |
| Conversation history | No (fresh each session) | Session only |
| Session transcripts | Stored locally, resumable with `claude --resume` | Local |

## Best Practices

- Put **team-shared** context in CLAUDE.md (checked into git)
- Let **auto-memory** handle personal per-project learning (gitignored)
- Use **agent memory** for specialized agents that need to accumulate knowledge over time
- Keep CLAUDE.md under 200 lines -- context efficiency matters
- Use `CLAUDE.local.md` for personal overrides that shouldn't be shared
- Start fresh sessions for new tasks rather than pushing through degraded context
- Use `/compact` proactively before the context window fills up
- Put critical information in CLAUDE.md rather than relying on auto-memory -- CLAUDE.md is always loaded and never compacted

## Common Questions

**How does Claude remember things across sessions?**
Claude uses a four-layer memory system: CLAUDE.md (you write, everyone reads), auto-memory (Claude writes, Claude reads), /memory command (you write, Claude reads), and agent memory (agents write, that agent reads). CLAUDE.md and auto-memory are the two primary layers for most users.

**Claude keeps making the same mistake -- how do I fix it?**
Add the correction to CLAUDE.md for a permanent fix. Use auto-memory for session-learned corrections. For automated enforcement, use hooks (e.g., block moment.js usage with a PostToolUse hook). Being explicit in prompts also helps, but CLAUDE.md is the most reliable approach.

**Claude lost context mid-conversation -- what happened?**
Most likely, context window compression occurred. When a conversation exceeds the context window, Claude Code automatically compacts older messages. Prevent this by using `/compact` proactively, putting critical info in CLAUDE.md (never compacted), breaking large tasks into smaller sessions, and using subagents for independent subtasks.

**What persists between sessions and what doesn't?**
CLAUDE.md files always load. Auto-memory loads (first 200 lines). Agent memory loads for that agent. Conversation history does NOT persist -- each session starts fresh. Session transcripts are stored locally and can be resumed with `claude --resume`.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How to Use the Memory System Effectively

### Prerequisites

- Claude Code installed and working (`claude --version`)
- A project directory (for project-scoped memory)

### Step 1: Understand the 4 Memory Layers

Before configuring memory, know what each layer does:

| Layer | You Write It? | Best For |
|-------|--------------|----------|
| **CLAUDE.md** | Yes -- manually | Team conventions, architecture, key commands |
| **Auto-memory** | No -- Claude writes automatically | Personal patterns Claude learns over time |
| **/memory command** | Yes -- via chat | One-off facts you want Claude to remember |
| **Agent memory** | No -- agent writes | Specialized knowledge for custom agents |

Start with CLAUDE.md (see the [Projects How-To](projects.html) guide). Then use the other layers as needed.

### Step 2: Use the /memory Command to Save Important Context

During a Claude Code session, tell Claude to remember something:

```
> Remember: our API always returns { data, error, meta } format -- never return raw arrays
```

Or use the `/memory` command to toggle auto-memory behavior:

```
> /memory
```

This toggles whether Claude automatically writes to the memory file during sessions.

You can also be specific about what to save:

```
> Remember: the staging database is at postgres://staging.internal:5432/app
> Remember: always use our custom fetch wrapper from src/lib/api-client.ts, never raw fetch
> Remember: John prefers tabs, the rest of the team uses spaces -- use spaces in shared code
```

These facts are written to your auto-memory file and loaded in future sessions.

### Step 3: Configure Auto-Memory Behavior

Auto-memory captures corrections and patterns Claude discovers during sessions. When Claude learns something -- like "this project uses tabs not spaces" after you correct it -- it saves that to the memory file automatically.

Auto-memory is **on by default**. Toggle it with:

```
> /memory
```

The memory file lives at:

```
~/.claude/projects/<project-hash>/memory/MEMORY.md
```

The first 200 lines of this file are auto-loaded at every session start.

### Step 4: Set Up Agent-Scoped Memory

Custom agents can maintain their own persistent knowledge across sessions. Configure the memory scope in the agent's frontmatter:

```yaml
---
name: code-reviewer
description: Reviews PRs for quality and security
memory: project
---
Review the code changes for quality issues...
```

Memory scope options:

| Scope | Stored At | Best For |
|-------|-----------|----------|
| `user` | `~/.claude/agent-memory/<agent-name>/` | Personal agents used across projects |
| `project` | `.claude/agent-memory/<agent-name>/` | Team-shared agents (committed to git) |
| `local` | `.claude/agent-memory-local/<agent-name>/` | Personal per-project agents |

The agent reads its memory at startup and writes to it during sessions as it learns.

### Step 5: Debug Memory Issues

**Find your memory files:**

```bash
# Auto-memory location (project-specific)
ls ~/.claude/projects/

# Each project directory contains a memory/ subdirectory
ls ~/.claude/projects/<project-hash>/memory/
```

**View what Claude remembers:**

```
> What do you know from your memory file?
```

**Clear stale memories:**

Edit or delete the memory file directly:

```bash
# View current memories
cat ~/.claude/projects/<project-hash>/memory/MEMORY.md

# Edit to remove stale entries
nano ~/.claude/projects/<project-hash>/memory/MEMORY.md
```

**Check what CLAUDE.md instructions are active:**

```
> What instructions are loaded from CLAUDE.md?
```

### Verify It Works

1. Save something with the memory system:

```
> Remember: always use structured logging with pino, never console.log in production code
```

2. Start a **new** Claude Code session in the same project directory.

3. Ask Claude about the saved context:

```
> What logging library should I use in this project?
```

Claude should reference pino and the structured logging instruction from the previous session.

### Troubleshooting

- **Memory not persisting:** Check file permissions on `~/.claude/projects/`. Ensure the directory is writable. Verify auto-memory is enabled with `/memory`.
- **Too many memories (slow startup):** The file may have grown beyond 200 lines. Edit `MEMORY.md` directly to prune old or redundant entries -- only the first 200 lines are loaded.
- **Agent memory not loading:** Verify the `memory` field in agent frontmatter is set to a valid scope (`user`, `project`, or `local`). Check the corresponding directory exists.
- **Conflicting memories:** If CLAUDE.md says one thing and auto-memory says another, CLAUDE.md takes precedence. Edit the auto-memory file to remove conflicting entries.

<!-- end howto -->

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

### Memory File Locations

| Layer | Path | Loaded At |
|-------|------|-----------|
| CLAUDE.md (global) | `~/.claude/CLAUDE.md` | Session start (always) |
| CLAUDE.md (project) | `<repo-root>/CLAUDE.md` | Session start (always) |
| CLAUDE.md (extended) | `<repo-root>/.claude/CLAUDE.md` | Session start (always) |
| CLAUDE.md (personal) | `<repo-root>/CLAUDE.local.md` | Session start (always) |
| Modular rules | `<repo-root>/.claude/rules/*.md` | When Claude accesses project files |
| Auto-memory | `~/.claude/projects/<hash>/memory/MEMORY.md` | Session start (first 200 lines) |
| Agent memory (user) | `~/.claude/agent-memory/<agent-name>/` | Agent startup |
| Agent memory (project) | `<repo-root>/.claude/agent-memory/<agent-name>/` | Agent startup |
| Agent memory (local) | `<repo-root>/.claude/agent-memory-local/<agent-name>/` | Agent startup |

### Auto-Memory File Format

The auto-memory file is plain markdown. Claude appends entries as it learns:

```markdown
# Memory Index

- [feedback_design.md](feedback_design.md) -- Use Oxford Blue/Turquoise color scheme for UI
- Project uses pnpm workspaces, never npm
- API error format: { error: string, code: string, details?: unknown }
- Staging server: deploy-staging.example.com
- User prefers verbose commit messages with bullet points
```

**Loading behavior:**

| Property | Value |
|----------|-------|
| Auto-loaded lines | First 200 lines |
| Format | Plain markdown |
| Who writes | Claude (automatically) or user (via /memory command) |
| Who reads | Claude only (not shared with other users) |
| Gitignored | Yes (stored in user home directory) |

### Agent Memory Scope Options

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `memory` | string | `user`, `project`, `local` | Where the agent stores its persistent knowledge |

**Scope details:**

| Scope | Location | Visibility | Git-tracked |
|-------|----------|------------|-------------|
| `user` | `~/.claude/agent-memory/<name>/` | Cross-project, personal | No |
| `project` | `.claude/agent-memory/<name>/` | Team-shared | Yes |
| `local` | `.claude/agent-memory-local/<name>/` | Personal, per-project | No |

### /memory Command Reference

| Command | Action |
|---------|--------|
| `/memory` | Toggle auto-memory on or off for the current session |
| `"Remember: <fact>"` | Instruct Claude to save a specific fact to the memory file |

Both approaches write to the same auto-memory file at `~/.claude/projects/<hash>/memory/MEMORY.md`.

### Persistence Summary

| Item | Survives Session Restart | Scope |
|------|-------------------------|-------|
| CLAUDE.md files | Yes (always loaded) | Project-wide, all users |
| Auto-memory | Yes (first 200 lines) | Per-project, per-user |
| Agent memory | Yes (at agent startup) | Per-agent, scope-dependent |
| Conversation history | No (fresh each session) | Session only |
| Session transcripts | Stored locally, resumable with `claude --resume` | Local |

  </div>
</div>

## Related

- [Projects](projects.html) -- CLAUDE.md is the foundation of the memory system
- [Agents](agents.html) -- Agents have their own configurable memory scopes
- [Settings](settings.html) -- Settings hierarchy controls behavior; memory controls knowledge
- [Commands](commands.html) -- The /memory command toggles auto-memory
