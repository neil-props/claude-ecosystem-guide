---
name: ecosystem-commands
description: Knowledge about Commands and Slash Commands in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Commands and Slash Commands

## Overview

Commands are reusable prompt shortcuts in Claude Code, invoked with a `/` prefix. They range from built-in system commands (`/help`, `/compact`, `/clear`) to custom user-defined commands and skill-based slash commands.

Slash commands were the original way to teach Claude reusable workflows via `.claude/commands/` directory. With the introduction of Skills (Oct 2025), this system has evolved. Custom commands still work for backward compatibility, but Skills (`.claude/skills/`) are now the recommended approach, offering auto-invocation, cross-interface portability, and richer frontmatter configuration.

## Built-in System Commands

| Command | Purpose |
|---------|---------|
| `/help` | Show help and available commands |
| `/model` | Switch model (opus, sonnet, haiku) |
| `/memory` | Toggle auto-memory |
| `/compact` | Compress conversation context |
| `/clear` | Clear conversation history |
| `/status` | Show session info |

## Built-in Skill Commands

| Command | Purpose |
|---------|---------|
| `/commit` | Analyze changes and create a git commit |
| `/simplify` | Review code for quality and efficiency |
| `/loop 5m /command` | Run a command on a recurring interval |
| `/claude-api` | Load API reference docs |

## Custom Commands

**Skills (recommended):** Any SKILL.md in `.claude/skills/` automatically becomes a `/skill-name` slash command. Example: `.claude/skills/deploy/SKILL.md` becomes `/deploy`.

**Legacy commands:** Markdown files in `.claude/commands/` are also available as slash commands. These still work but lack auto-invocation and frontmatter features.

## Resolution Order

When a `/name` is invoked, Claude resolves it as:

1. **Skill** (inline context) -- `.claude/skills/name/SKILL.md`
2. **Agent** (separate context) -- `.claude/agents/name.md`
3. **Legacy Command** (explicit `/` only) -- `.claude/commands/name.md`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current operation |
| `Ctrl+D` | Exit session |
| `Tab` | Autocomplete file paths and commands |
| `Up/Down` | Navigate command history |
| `Esc` | Cancel current input |

Customize keybindings in `~/.claude/keybindings.json`.

## When to Use Commands

- **Built-in system commands** -- Session management (`/compact`, `/clear`, `/model`)
- **For custom reusable instructions** -- Create a Skill instead of a legacy command
- **Legacy commands** -- Only if you already have `.claude/commands/` and don't need extra features
- **Rule of thumb** -- If you do something more than once a day, make it a Skill

## Best Practices

- Use Skills instead of legacy Commands for new work
- Use `/compact` proactively before hitting 50% context window
- Use `/clear` when switching tasks to avoid polluting context
- Character budget for skill content: 15,000 chars default (override with `SLASH_COMMAND_TOOL_CHAR_BUDGET`)

## Key Decision: Commands vs Skills vs Agents

- **Skills** -- Portable instruction sets, auto-invoke on task context, work across all interfaces
- **Commands** -- Legacy user-invoked prompts, Code only, never auto-triggered
- **Agents** -- Specialized AI assistants with isolated contexts

Recommendation: use Skills for new work; keep Commands only for backward compatibility.

## Common Pitfalls

1. **Creating new commands instead of skills** -- Skills are the recommended path forward
2. **Not using /compact** -- Context fills up; compact proactively
3. **Overloading single commands** -- Break complex workflows into multiple skills
