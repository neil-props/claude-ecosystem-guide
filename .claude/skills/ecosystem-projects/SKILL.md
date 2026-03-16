---
name: ecosystem-projects
description: Knowledge about Projects and CLAUDE.md in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Projects and CLAUDE.md

## Overview

Projects provide persistent context that travels with your codebase. In Claude Code, `CLAUDE.md` is the primary mechanism -- a markdown file Claude reads at every session start, giving it project-specific knowledge about conventions, architecture, and preferences. Think of it as the onboarding doc for Claude -- always loaded, never compacted, shared with every agent.

CLAUDE.md is the first thing to set up in any Claude Code project. It is the most reliable way to ensure consistent behavior across all interactions.

In Claude Chat, Projects are named spaces with uploaded knowledge bases and custom instructions. In Claude Cowork, folder-specific and global instructions serve the same purpose.

## The CLAUDE.md Hierarchy

CLAUDE.md files exist at multiple levels, each adding context:

| Level | Location | Purpose |
|-------|----------|---------|
| **Global** | `~/.claude/CLAUDE.md` | Personal preferences across all projects |
| **Project** | `CLAUDE.md` (repo root) | Team-shared conventions and architecture |
| **Project (extended)** | `.claude/CLAUDE.md` | Additional project context |
| **Personal override** | `CLAUDE.local.md` | Personal overrides, gitignored |
| **Modular rules** | `.claude/rules/*.md` | Path-specific rules |

Merge semantics are additive: global loads first, project layers on top. Higher priority overrides lower when conflicts exist (Managed > Project > User).

## Loading Behavior

CLAUDE.md files auto-load at session start. In monorepos:

- **UP** -- walks from cwd to repo root, loading all CLAUDE.md files found at startup
- **DOWN** -- subdirectory CLAUDE.md files load lazily, only when Claude reads files in that directory
- **SIBLING** -- never loads (same-level directories are independent)

You can import additional files using `@path/to/file` syntax within CLAUDE.md.

## Full Resolution Order (lowest to highest priority)

1. Global user instructions (`~/.claude/CLAUDE.md`)
2. Project root (`CLAUDE.md`)
3. Project extended (`.claude/CLAUDE.md`)
4. Modular rules (`.claude/rules/*.md`)
5. Personal overrides (`CLAUDE.local.md`)

## Project Memory

Beyond CLAUDE.md, Claude Code maintains auto-memory -- a per-project, per-user learning journal at `~/.claude/projects/<project-hash>/memory/MEMORY.md`. The first 200 lines auto-load at session start. Claude writes to this automatically, or you can instruct it explicitly.

Auto-memory complements CLAUDE.md: CLAUDE.md is for team-shared conventions you write deliberately, while auto-memory captures personal per-project learnings organically.

## Cross-Interface Differences

| Interface | Mechanism | Setup |
|-----------|-----------|-------|
| **Claude Code** | CLAUDE.md files (auto-loaded) | Create files in repo |
| **Claude Chat** | Projects with custom instructions + knowledge base | Create via sidebar |
| **Claude Cowork** | Global/folder-specific instructions | Set in Customize menu |

## When to Use Projects

- **Always:** Create a CLAUDE.md in your repo root with tech stack, conventions, key commands
- **For teams:** Check CLAUDE.md into git so every member gets the same Claude behavior
- **For monorepos:** Add subdirectory CLAUDE.md files for package-specific conventions
- **For personal overrides:** Use `CLAUDE.local.md` (gitignored automatically)
- **For modular rules:** Use `.claude/rules/` for path-specific instructions

## Best Practices

- Keep CLAUDE.md files under 200 lines each for reliable adherence
- Be specific and actionable -- Claude fills gaps with assumptions
- Share a single CLAUDE.md with your team and check it into git
- Use `CLAUDE.local.md` for personal overrides (automatically gitignored)
- Use `.claude/rules/` for path-specific rules instead of one huge CLAUDE.md
- Put critical info in CLAUDE.md rather than repeating it in prompts
- In Chat, create separate Projects per workflow domain

## Common Pitfalls

1. **File not loading** -- Check exact name `CLAUDE.md` (case-sensitive) at repo root or `.claude/`
2. **Too long** -- Files over 200 lines reduce instruction-following reliability; split into rules files
3. **Vague instructions** -- "Write good code" vs "Use TypeScript strict mode, Zod for validation"
4. **Not in git** -- Team members won't get shared conventions unless CLAUDE.md is committed
5. **Conflicting layers** -- Later-loaded files override earlier ones; check hierarchy when debugging

## Key Decision: CLAUDE.md vs Memory vs Settings

- **CLAUDE.md** -- Instructions (what Claude should do). Always loaded, team-shared.
- **Memory** -- Facts Claude remembers. Personal, per-project learning.
- **Settings** -- Behavior configuration (permissions, model). Controls how Claude operates.
