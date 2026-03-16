---
title: Skills
slug: skills
order: 2
description: Teach Claude reusable patterns and domain-specific capabilities
color: "#f472b6"
section: topics
---

# Skills

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Skills are the **universal primitive** of the Claude ecosystem. A skill is a markdown file (`SKILL.md`) with YAML frontmatter that teaches Claude a specific process, pattern, or domain expertise. Think of skills as reusable instruction sets -- they tell Claude *what* to do and *how* to do it, and the same skill works across Claude Code, Claude Chat, and Claude Cowork without modification.

Skills launched on October 16, 2025, simultaneously across all surfaces, and became an open standard published at [agentskills.io](https://agentskills.io) in December 2025. Partner organizations including Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, and Sentry publish skills through the partner directory.

Skills use **progressive disclosure** -- Claude reads skill descriptions (metadata) at startup and loads the full skill content only when it determines relevance to the current task. This means skills are auto-invoked based on task context without manual triggering.

**Rule of thumb:** If you do it more than once a day, make it a skill.

## How It Works

A skill is just a folder with a `SKILL.md` file:

```
my-skill/
SKILL.md       <- Instructions + YAML frontmatter
template.xlsx  <- Supporting files (optional)
examples/      <- Reference examples (optional)
scripts/
    validate.sh <- Helper scripts (optional)
```

The YAML frontmatter controls how the skill behaves. The 10 frontmatter fields define the skill's identity, permissions, and execution context:

- **`name`** -- Display name and `/slash` command identifier
- **`description`** -- The most important field. Controls when Claude auto-invokes the skill via progressive disclosure. Write a clear, specific description that matches the tasks you want the skill to handle.
- **`allowed-tools`** -- Restricts which tools the skill can use. No permission prompts for listed tools.
- **`model`** -- Override the model used (e.g., `haiku` for cheap/fast tasks, `opus` for complex reasoning).
- **`context: fork`** -- Run the skill in an isolated subagent context, giving it behavior similar to an agent.
- **`hooks`** -- Attach lifecycle hooks scoped to this skill only.
- **`argument-hint`** -- Autocomplete hint shown in the `/` menu.
- **`user-invocable`** -- Whether the skill appears in the `/` menu.
- **`disable-model-invocation`** -- Prevent auto-invocation (require explicit `/` command).
- **`agent`** -- Subagent type when used with `context: fork`.

The resolution order for how Claude chooses between different extension types:
1. **Skill** (inline) -- auto-invoked based on description match
2. **Agent** (separate context) -- for isolated multi-step work
3. **Command** (explicit `/` only) -- legacy, user-initiated

### In Claude Code

Skills live in the `.claude/skills/` directory:

- **Project skills:** `.claude/skills/my-skill/SKILL.md` (shared via git)
- **Personal skills:** `~/.claude/skills/my-skill/SKILL.md` (your own)

Skills are also invocable via `/skill-name` slash commands.

**Discovery priority order:** Enterprise > Personal > Project > Plugin.

**Character budget:** 15,000 characters by default. Override with the `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable.

### In Claude Chat

- Toggle skills on/off in **Settings > Capabilities > Skills**
- **Built-in skills:** Excel spreadsheet generation (with formulas), PowerPoint presentations, Word documents, fillable PDFs, algorithmic art
- Create custom skills using the built-in "skill-creator" skill in conversation
- **Org-managed skills** for Team/Enterprise plans (Dec 2025 update)

### In Claude Cowork

- Skills bundled inside plugins
- Also available standalone via the **Customize** menu
- Same SKILL.md format as Chat and Code

## When to Use Skills

**Use Skills when:**
- You have a repeatable process or pattern you want Claude to follow consistently
- You want instructions that auto-invoke based on task context (progressive disclosure)
- You need a portable, cross-surface capability (Code + Chat + Cowork)
- You want to share team-specific knowledge via git (`.claude/skills/`)

**Don't use Skills when:**
- You need Claude to interact with external APIs or databases (use [MCP](mcp.html) instead -- MCP provides tools, skills provide instructions)
- You need deterministic automation that runs without Claude's judgment (use [Hooks](hooks.html) instead -- hooks fire automatically at lifecycle events, skills are on-demand instructions)
- You need full context isolation with persistent memory (use [Agents](agents.html) instead -- agents get their own context window)

**Skills vs other extension points:**
- **Skills vs Agents:** Skills are reusable instructions loaded into the main session context. Agents are isolated Claude instances with their own context, memory, and tool restrictions. Use a skill when you want inline guidance; use an agent when you need isolation or multi-step autonomous work. (Skills with `context: fork` bridge the gap.)
- **Skills vs Hooks:** Skills are on-demand and require Claude's judgment to activate. Hooks are automatic and deterministic -- they fire at lifecycle events regardless of Claude's intent. Skills teach Claude *what to do*; hooks automate *when to react*.
- **Skills vs Commands:** Skills replace legacy commands. Commands required explicit `/` invocation; skills can auto-invoke via description matching. Migrate existing commands to skills for better discoverability.

## Best Practices

- **Skills are the universal primitive** -- same SKILL.md works in Code, Chat, and Cowork
- Write clear, specific `description` fields -- they control when auto-invocation triggers
- Keep skill instructions focused on one task or process
- Use `allowed-tools` to scope permissions down to what the skill needs
- Use `context: fork` for skills that do heavy work to avoid polluting the main context
- Full content only loads when relevant -- descriptions are always in context
- For complex patterns, provide examples in the skill folder
- Use `model: haiku` for lightweight, high-volume skill tasks

## Common Questions

**What are Skills and how do they work across all Claude interfaces?**
Skills are portable instruction sets (SKILL.md files) that teach Claude specific processes. The same format works across Code, Chat, and Cowork. They use progressive disclosure -- Claude reads metadata at startup and loads full content only when relevant. Launched Oct 2025, open standard at agentskills.io since Dec 2025.

**How do I create a custom Skill?**
In Claude Code, create a folder at `.claude/skills/my-skill/` with a `SKILL.md` file. The frontmatter defines the name, description, allowed tools, and model. In Claude Chat, use the "skill-creator" skill or upload via Settings > Capabilities > Skills.

**What is the difference between Skills, Commands, and Hooks?**
Skills teach Claude *what* to do (instructions, auto-invoked). Commands are the legacy version of Skills (user-invoked only, now merged into the skills system). Hooks automate *when* to react (event-driven, fire automatically at lifecycle points). Skills are about knowledge; hooks are about automation.

**How do I share Skills across my organization?**
Three strategies: (1) project-level via git in `.claude/skills/`, (2) bundle into a Plugin for cross-repo distribution, (3) organization-managed via admin provisioning for Team/Enterprise plans.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

> [!INFO]
> Step-by-step guides for Skills are coming in Phase 4.

Planned guides:
- How to create a skill with correct frontmatter -- _coming soon_
- How to configure CLAUDE.md for a project -- _coming soon_

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

> [!INFO]
> Detailed reference specs for Skills are coming in Phase 4.

Planned references:
- Skill frontmatter spec (all fields, validation rules) -- _coming soon_
- Environment variables reference -- _coming soon_

  </div>
</div>

## Related

- [Plugins](plugins.html) -- Plugins bundle multiple skills into installable packages
- [Hooks](hooks.html) -- Hooks complement skills by reacting to lifecycle events
- [Agents](agents.html) -- Agents can preload skills and run them in isolated contexts
