---
name: ecosystem-skills
description: Knowledge about Skills in the Claude Code ecosystem
user-invocable: false
disable-model-invocation: true
---

# Skills

## Overview

Skills are the **universal primitive** of the Claude ecosystem. A skill is a markdown file (SKILL.md) with YAML frontmatter that teaches Claude a specific process, pattern, or domain expertise. The same skill works across Claude Code, Claude Chat, and Claude Cowork without modification.

Skills launched October 2025, became an open standard at agentskills.io (December 2025). Partners include Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, and Sentry.

**Rule of thumb:** If you do it more than once a day, make it a skill.

## How Skills Work

A skill is a folder with a SKILL.md file:

```
my-skill/
  SKILL.md       <- Instructions + YAML frontmatter
  template.xlsx  <- Supporting files (optional)
  examples/      <- Reference examples (optional)
```

Skills use **progressive disclosure** -- Claude reads descriptions (metadata) at startup and loads full content only when relevant to the current task. Auto-invoked based on task context without manual triggering.

## Key Frontmatter Fields

| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Display name and `/slash` command ID (max 64 chars, `[a-z0-9-]+`) |
| `description` | string | Controls auto-invocation (max 1,024 chars) |
| `allowed-tools` | string list | Restricts available tools, no permission prompts for listed |
| `model` | string | Override model (`haiku`, `sonnet`, `opus`) |
| `context` | enum | `fork` for isolated execution, `inherit` for inline |
| `disable-model-invocation` | boolean | When true, requires explicit `/name` command |
| `user-invocable` | boolean | When false, hides from `/` menu |
| `argument-hint` | string | Autocomplete hint after `/name` |
| `agent` | string | Subagent type when `context: fork` |
| `hooks` | object | Lifecycle hooks scoped to this skill |

## String Substitutions

- `$ARGUMENTS` -- full argument string after `/name`
- `$ARGUMENTS[N]` or `$N` -- Nth argument (0-indexed)
- `${CLAUDE_SESSION_ID}` -- current session ID
- `${CLAUDE_SKILL_DIR}` -- absolute path to skill directory

## File Locations

| Scope | Path | Priority |
|-------|------|----------|
| Enterprise | Managed provisioning | Highest |
| Personal | `~/.claude/skills/*.md` | High |
| Project | `.claude/skills/my-skill/SKILL.md` | Medium |
| Plugin | `<plugin>/skills/*/SKILL.md` | Lowest |

Character budget: 15,000 chars default (override with `SLASH_COMMAND_TOOL_CHAR_BUDGET`).

## Cross-Surface Availability

- **Claude Code** -- `.claude/skills/` directory, `/name` commands
- **Claude Chat** -- Toggle in Settings > Capabilities > Skills; built-in skills for Excel, PowerPoint, Word, PDF, art; custom via skill-creator
- **Claude Cowork** -- Bundled inside plugins or standalone via Customize menu

## When to Use Skills

**Use skills when:**
- You have a repeatable process or pattern
- You want auto-invocation based on task context
- You need a portable capability across Code, Chat, and Cowork
- You want to share team knowledge via git

**Don't use skills when:**
- You need external API/database interaction (use MCP)
- You need deterministic automation at events (use Hooks)
- You need full context isolation with memory (use Agents)

## Key Decision: Skills vs Agents

Skills are inline instructions in the main session. Agents are isolated contexts with their own memory and tool restrictions. Use a skill for reusable guidance; use an agent for autonomous multi-step work. `context: fork` bridges the gap.

## Key Decision: Skills vs Commands

Commands are legacy (explicit `/invoke` only). Skills replace them with auto-invocation via description matching. Migrate existing commands to skills.

## Common Pitfalls

1. **Vague descriptions** -- Write specific descriptions that match the tasks you want auto-invoked
2. **Oversized skills** -- Keep under 15,000 char budget; focus on one task per skill
3. **Missing allowed-tools** -- Scope tool access to what the skill actually needs
