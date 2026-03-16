---
title: Commands
slug: commands
order: 8
description: Define reusable prompt shortcuts and workflow triggers
color: "#38bdf8"
section: topics
---

# Commands and Slash Commands

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Commands are reusable prompt shortcuts in Claude Code, invoked with a `/` prefix. They range from built-in system commands (`/help`, `/compact`, `/clear`) to custom user-defined commands and skill-based slash commands. Commands provide quick access to common workflows without retyping complex prompts.

Slash commands were the original way to teach Claude reusable workflows -- you would place markdown files in `.claude/commands/` and invoke them with `/command-name`. With the introduction of Skills (Oct 2025), this system has evolved. Custom commands still work for backward compatibility, but Skills (`.claude/skills/`) are now the recommended approach, offering auto-invocation, cross-interface portability, and richer frontmatter configuration.

## How It Works

### In Claude Code

Claude Code provides several categories of commands:

**Built-in system commands** for session management:

| Command | Purpose |
|---------|---------|
| `/help` | Show help and available commands |
| `/model` | Switch model (opus, sonnet, haiku) |
| `/memory` | Toggle auto-memory |
| `/compact` | Compress conversation context |
| `/clear` | Clear conversation history |
| `/status` | Show session info |

**Built-in skill commands** that ship with Claude Code:

| Command | Purpose |
|---------|---------|
| `/commit` | Analyze changes and create a git commit |
| `/simplify` | Review code for quality and efficiency |
| `/loop 5m /command` | Run a command on a recurring interval |
| `/claude-api` | Load API reference docs |

**Custom skill commands:** Any SKILL.md file placed in `.claude/skills/` becomes a `/skill-name` slash command automatically. For example, `.claude/skills/deploy/SKILL.md` becomes `/deploy`.

**Legacy custom commands:** Markdown files in `.claude/commands/` directory are also available as slash commands. These still work but lack the auto-invocation and frontmatter features of Skills.

**Resolution order:** When a `/name` is invoked, Claude resolves it as: Skill (inline) > Agent (separate context) > Command (explicit `/` only).

**Keyboard shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current operation |
| `Ctrl+D` | Exit session |
| `Tab` | Autocomplete file paths and commands |
| `Up/Down` | Navigate command history |
| `Esc` | Cancel current input |

Customize keybindings in `~/.claude/keybindings.json`.

### In Claude Cowork

Cowork supports slash commands bundled within plugins. The 11+ official plugins include 69+ slash commands total (e.g., `/reconcile`, `/forecast` from the Finance plugin). Commands are available after installing the relevant plugin via the Customize menu.

## When to Use Commands

- **Built-in system commands:** Use these for session management -- `/compact` when context is filling up, `/clear` when switching tasks, `/model` to switch between Opus and Sonnet
- **For custom reusable instructions:** Create a Skill (`.claude/skills/`) instead of a legacy command -- Skills offer auto-invocation, model overrides, tool restrictions, and work across Claude Code, Chat, and Cowork
- **Legacy commands:** Only if you already have a `.claude/commands/` setup and don't need the extra features of Skills
- **If you do something more than once a day:** Make it a Skill (and it automatically becomes a slash command)

## Best Practices

- **Use Skills instead of legacy Commands** -- Skills offer auto-invocation, model overrides, tool restrictions, and cross-interface portability
- If you do something more than once a day, make it a skill (and therefore a slash command)
- Use `/compact` proactively before hitting 50% context window
- Use `/clear` when switching tasks to avoid polluting context
- Use `/model` to switch between Opus (complex tasks), Sonnet (balanced), and Haiku (fast)
- Character budget for skill content: 15,000 chars default. Override with `SLASH_COMMAND_TOOL_CHAR_BUDGET`

## Common Questions

**What keyboard shortcuts and slash commands does Claude Code support?**
Built-in commands include `/help`, `/model`, `/memory`, `/compact`, `/clear`, and `/status`. Built-in skills add `/commit`, `/simplify`, `/loop`, and `/claude-api`. Any SKILL.md in `.claude/skills/` automatically becomes a `/skill-name` command. Key shortcuts: `Ctrl+C` (cancel), `Ctrl+D` (exit), `Tab` (autocomplete), `Up/Down` (history).

**What is the difference between Skills, Commands, and Agents?**
Skills are portable instruction sets (SKILL.md) that auto-invoke based on task context and work across all interfaces. Commands are legacy user-invoked prompts in `.claude/commands/` (Code only, never auto-triggered). Agents are specialized AI assistants with isolated contexts. Recommendation: use Skills instead of Commands for new work.

**How do I create a reusable /deploy command for my team?**
Create a Skill at `.claude/skills/deploy/SKILL.md` and check it into your repo. For distribution across multiple repos, bundle it in a Plugin and host on GitHub. The same skill works as a slash command in Code and as an installable command in Cowork via plugins.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

Custom slash commands are now created using **Skills**, which offer auto-invocation, model overrides, tool restrictions, and cross-interface portability. The legacy `.claude/commands/` directory still works but is not recommended for new work.

For creating custom slash commands, see the [Skills How-To guide](skills.html), which covers the recommended approach using Skills with frontmatter.

For built-in commands like `/compact`, `/model`, `/memory`, and `/clear`, see the Concept tab on this page for a complete list.

<!-- end howto -->

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

### Legacy Commands Directory

The original custom commands system uses markdown files in `.claude/commands/`:

| Property | Value |
|----------|-------|
| Directory | `.claude/commands/` (project) or `~/.claude/commands/` (user) |
| File format | Markdown (`.md`) |
| Invocation | `/command-name` (filename without extension) |
| Subdirectories | Supported -- `/subdir/command-name` |
| Arguments | `$ARGUMENTS` placeholder replaced with user input |

**Example:** `.claude/commands/review.md` becomes the `/review` slash command.

### Recommended: Skills

For new custom commands, use Skills instead. Skills provide all the same functionality plus:

- Auto-invocation based on task context (no need to type `/`)
- Model and tool overrides via frontmatter
- Cross-interface portability (Claude Code, Chat, and Cowork)
- Supporting files alongside the SKILL.md

See the [Skills Reference](skills.html) for the complete SKILL.md frontmatter spec and file format.

### Resolution Order

When a `/name` is invoked, Claude resolves it in this order:

1. **Skill** (inline context) -- `.claude/skills/name/SKILL.md`
2. **Agent** (separate context) -- `.claude/agents/name.md`
3. **Legacy Command** (explicit `/` only) -- `.claude/commands/name.md`

  </div>
</div>

## Related

- [Skills](skills.html) -- Skills are the recommended replacement for custom commands
- [Plugins](plugins.html) -- Plugins bundle multiple skill commands for distribution
- [Projects](projects.html) -- CLAUDE.md provides persistent context; commands provide reusable actions
