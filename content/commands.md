---
title: Commands
slug: commands
order: 8
description: Define reusable prompt shortcuts and workflow triggers
color: "#38bdf8"
section: topics
---

# Commands and Slash Commands

## Overview

Commands are reusable prompt shortcuts in Claude Code, invoked with a `/` prefix. They range from built-in system commands (`/help`, `/compact`, `/clear`) to custom user-defined commands and skill-based slash commands. Commands provide quick access to common workflows without retyping complex prompts.

With the introduction of Skills (Oct 2025), the command system has evolved. Custom commands in `.claude/commands/` still work for backward compatibility, but the recommended approach is now to use Skills (`.claude/skills/`) which offer auto-invocation, cross-interface portability, and richer frontmatter configuration.

## How It Works

### In Claude Code

Claude Code provides several categories of commands:

**Built-in system commands:**

| Command | Purpose |
|---------|---------|
| `/help` | Show help and available commands |
| `/model` | Switch model (opus, sonnet, haiku) |
| `/memory` | Toggle auto-memory |
| `/compact` | Compress conversation context |
| `/clear` | Clear conversation history |
| `/status` | Show session info |

**Built-in skill commands:**

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

## Configuration

### Creating Custom Commands via Skills

The recommended way to create custom commands:

```bash
mkdir -p .claude/skills/my-command
```

Write the SKILL.md file:

```markdown
---
name: deploy
description: Deploy the current branch to staging
allowed-tools: Read, Bash
model: sonnet
---
# Deploy to Staging

1. Run the test suite: `npm test`
2. If tests pass, build the project: `npm run build`
3. Deploy to staging: `npm run deploy:staging`
4. Verify the deployment by checking the health endpoint
5. Report the deployment URL and status
```

Use it: `/deploy`

### Legacy Commands Directory

For backward compatibility, markdown files in `.claude/commands/` also work:

```markdown
# Generate Tests

Generate comprehensive tests for the specified file:

1. Read the source file: $FILE
2. Identify all exported functions
3. Write tests using the project's test framework
4. Save tests to the corresponding test directory
```

Use it: `/generate-tests FILE=src/utils/auth.ts`

### Plugin Commands

When plugins are installed, their bundled commands become available with namespace prefixes to avoid collisions:

```
/my-plugin:deploy
/my-plugin:review
```

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

## Related

- [Skills](skills.html) -- Skills are the recommended replacement for custom commands
- [Plugins](plugins.html) -- Plugins bundle multiple skill commands for distribution
- [Projects](projects.html) -- CLAUDE.md provides persistent context; commands provide reusable actions
