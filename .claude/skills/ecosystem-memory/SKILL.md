---
name: ecosystem-memory
description: Knowledge about the Memory System in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Memory System

## Overview

Memory is how Claude remembers things across sessions -- the system for persisting context beyond a single conversation. Without memory, every Claude session starts from zero. Claude's memory system operates across four layers, each with different scope, persistence, and authorship.

Understanding which layer to use is key to effective long-term Claude usage.

## The 4-Layer Architecture

| Layer | Who Writes | Who Reads | Scope | Persistence |
|-------|-----------|-----------|-------|-------------|
| **CLAUDE.md** | You (developer) | Claude + all agents | Project-wide | Always loaded |
| **Auto-memory** | Claude (automatically) | Claude only | Per-project, per-user | First 200 lines loaded |
| **/memory command** | You (manually) | Claude only | Per-project, per-user | Written to auto-memory file |
| **Agent memory** | The agent itself | That specific agent only | Configurable | Loaded at agent startup |

## CLAUDE.md (Foundation Layer)

The most reliable memory layer. A markdown file you write and maintain, loaded at every session start. All agents can read it. Never compacted -- critical information is always available.

See the Projects skill for full CLAUDE.md details (hierarchy, loading order, configuration).

## Auto-Memory

Claude's own learning journal. When Claude discovers important patterns during a session -- naming conventions, common mistakes, project quirks -- it saves them automatically:

```
~/.claude/projects/<project-hash>/memory/MEMORY.md
```

First 200 lines auto-load at session start. Toggle with the `/memory` command.

## /memory Command

Explicitly instruct Claude to remember things:

```
> "Remember: always use our custom Button component from @/components/ui"
```

Writes to the same auto-memory file. The distinction: Claude writes automatically vs you write explicitly.

## Agent Memory

Individual agents maintain their own persistent knowledge. Memory scope is configured in agent frontmatter:

| Scope | Location | Visibility | Git-tracked |
|-------|----------|------------|-------------|
| `user` | `~/.claude/agent-memory/<agent-name>/` | Cross-project, personal | No |
| `project` | `.claude/agent-memory/<agent-name>/` | Team-shared | Yes |
| `local` | `.claude/agent-memory-local/<agent-name>/` | Personal, per-project | No |

## When to Use Each Layer

- **CLAUDE.md** -- Project standards, coding conventions, architecture decisions, workflow instructions. The most reliable layer because it is always loaded and never compacted.
- **Auto-memory** -- Let Claude learn preferences organically. Good for personal patterns that emerge over time.
- **/memory command** -- Important one-off facts: API key formats, server addresses, team preferences.
- **Agent memory** -- Specialized knowledge for custom agents that accumulate expertise over time.

## What Persists and What Doesn't

| Item | Survives Session Restart? | Scope |
|------|--------------------------|-------|
| CLAUDE.md files | Yes (always loaded) | Project-wide |
| Auto-memory | Yes (first 200 lines) | Per-project, per-user |
| Agent memory | Yes (at agent startup) | Per-agent |
| Conversation history | No (fresh each session) | Session only |
| Session transcripts | Stored locally, resumable with `claude --resume` | Local |

## Cross-Interface Differences

| Interface | Memory Mechanism |
|-----------|-----------------|
| **Claude Code** | CLAUDE.md + auto-memory + /memory + agent memory |
| **Claude Chat** | Projects (custom instructions + knowledge base files) |
| **Claude Cowork** | Global/folder-specific instructions in Customize menu |

## Best Practices

- Put team-shared context in CLAUDE.md (checked into git)
- Let auto-memory handle personal per-project learning (gitignored)
- Use agent memory for specialized agents that accumulate knowledge
- Keep CLAUDE.md under 200 lines -- context efficiency matters
- Use `CLAUDE.local.md` for personal overrides
- Start fresh sessions for new tasks rather than pushing through degraded context
- Use `/compact` proactively before the context window fills up
- Put critical information in CLAUDE.md, not auto-memory -- CLAUDE.md is never compacted

## Common Pitfalls

1. **Relying on auto-memory for critical info** -- CLAUDE.md is always loaded and never compacted; auto-memory is not guaranteed
2. **Memory file too large** -- Only first 200 lines load; prune old entries regularly
3. **Conflicting layers** -- CLAUDE.md takes precedence over auto-memory when they conflict
4. **Not using /compact** -- Context window fills up; compact proactively to avoid losing working context
5. **Expecting conversation persistence** -- Each session starts fresh; only CLAUDE.md and memory files carry over
