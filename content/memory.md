---
title: Memory
slug: memory
order: 9
description: Manage Claude's persistent context and learned preferences
color: "#34d399"
section: topics
---

# Memory System

## Overview

Claude's memory system operates across four layers, each with different scope, persistence, and authorship. Together they ensure Claude retains project context, user preferences, and learned patterns across sessions -- without requiring you to repeat yourself.

The layers range from project-wide CLAUDE.md files that the whole team shares, to per-agent memory that individual agents maintain autonomously. Understanding which layer to use is key to effective long-term Claude usage.

## How It Works

Claude's memory system has four distinct layers:

| System | Who Writes | Who Reads | Scope |
|--------|-----------|-----------|-------|
| **CLAUDE.md** | You (the developer) | Claude + all agents | Project-wide |
| **Auto-memory** | Claude (automatically) | Claude only | Per-project, per-user |
| **/memory command** | You (manually) | Claude only | Per-project, per-user |
| **Agent memory** | The agent itself | That specific agent only | Configurable |

### In Claude Code

**CLAUDE.md** is the foundation of the memory system. It's a markdown file you write and maintain, loaded at every session start. All agents in the project can read it. See the [Projects](projects.html) page for full details.

**Auto-memory** is Claude's own learning journal. When Claude discovers important patterns during a session -- your preferred naming conventions, common mistakes to avoid, project quirks -- it can save them automatically:

```
~/.claude/projects/<project-hash>/memory/MEMORY.md
```

The first 200 lines of the memory file are auto-loaded at session start. Toggle auto-memory with the `/memory` command.

You can also instruct Claude to remember things explicitly:

```
> "Remember: always use our custom Button component from @/components/ui, never raw HTML buttons"
```

This persists in the memory file and is available in future sessions.

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

## Configuration

### Controlling Auto-Memory

Toggle auto-memory on or off during a session:

```
/memory
```

Auto-memory files are stored per-project, per-user. They are gitignored by default since they contain personal observations.

### CLAUDE.md Loading in Monorepos

Understanding how CLAUDE.md loads is critical for monorepo setups:

- **UP** -- Claude walks from the current working directory to the repo root at startup, loading all CLAUDE.md files found
- **DOWN** -- Subdirectory CLAUDE.md files load lazily when Claude reads files in that directory
- **SIBLING** -- Never loads (directories at the same level are independent)

This means a monorepo can have a root CLAUDE.md with shared conventions plus package-specific CLAUDE.md files that load on demand.

### Memory File Format

Memory files are plain markdown. Claude writes them in a structured format:

```markdown
## Learned Preferences
- This project uses pnpm, not npm
- Tests go in __tests__/ directory
- Always use the custom Button component from @/components/ui

## Project Patterns
- API routes follow REST conventions in src/app/api/
- Database migrations use Prisma, never raw SQL
```

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

## Related

- [Projects](projects.html) -- CLAUDE.md is the foundation of the memory system
- [Agents](agents.html) -- Agents have their own configurable memory scopes
- [Settings](settings.html) -- Settings hierarchy controls behavior; memory controls knowledge
- [Commands](commands.html) -- The /memory command toggles auto-memory
