---
title: Skills
slug: skills
order: 2
description: Teach Claude reusable patterns and domain-specific capabilities
color: "#f472b6"
section: topics
---

# Skills

## Overview

Skills are the **universal primitive** of the Claude ecosystem. A skill is a folder with a `SKILL.md` file containing YAML frontmatter and markdown instructions that teach Claude specific processes. The same skill works in Claude Code, Claude Chat, and Claude Cowork without modification.

Skills launched on October 16, 2025, simultaneously across all surfaces, and became an open standard published at [agentskills.io](https://agentskills.io) in December 2025. Partner organizations including Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, and Sentry publish skills through the partner directory.

Skills use **progressive disclosure** -- Claude reads skill descriptions (metadata) at startup and loads the full skill content only when it determines relevance to the current task. This means skills are auto-invoked based on task context without manual triggering.

**Rule of thumb:** If you do it more than once a day, make it a skill.

## How It Works

A skill is just a folder:

```
my-skill/
├── SKILL.md       <- Instructions + YAML frontmatter
├── template.xlsx  <- Supporting files (optional)
├── examples/      <- Reference examples (optional)
└── scripts/
    └── validate.sh <- Helper scripts (optional)
```

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

## Configuration

### Skill Frontmatter (10 fields)

The YAML frontmatter in `SKILL.md` controls behavior:

```yaml
---
name: quarterly-report        # Display name + /slash command
description: Generate reports  # Auto-discovery trigger (critical)
argument-hint: <quarter>       # Autocomplete hint
allowed-tools: Read, Write     # No permission prompts for these
model: opus                    # sonnet | opus | haiku
context: fork                  # Run in isolated subagent context
agent: general-purpose         # Subagent type (with fork)
user-invocable: true           # Show in / menu
disable-model-invocation: false # Allow auto-invoke
hooks:                         # Lifecycle hooks
  PostToolUse:
    - matcher: "Edit"
      command: "npm run lint"
---
# Instructions follow in markdown...
```

Key fields:
- **`description`** -- Most important field. Controls when Claude auto-invokes the skill via progressive disclosure.
- **`allowed-tools`** -- Restrict which tools the skill can use. No permission prompts for listed tools.
- **`model`** -- Override the model used for this skill (e.g., use Haiku for cheap/fast tasks).
- **`context: fork`** -- Run the skill in an isolated subagent context, like an agent.
- **`hooks`** -- Attach lifecycle hooks scoped to this skill only.

### Creating a Custom Skill

```bash
mkdir -p .claude/skills/my-skill
```

Write the SKILL.md:

```markdown
---
name: deploy-check
description: Validate deployment readiness for production
allowed-tools: Read, Bash, Grep
model: sonnet
---

# Deployment Readiness Check

## Steps
1. Run the full test suite
2. Check for TODO/FIXME comments in changed files
3. Verify no .env files are staged
4. Check bundle size is within limits
5. Output a go/no-go summary
```

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

## Related

- [Plugins](plugins.html) -- Plugins bundle multiple skills into installable packages
- [Hooks](hooks.html) -- Hooks complement skills by reacting to lifecycle events
- [Agents](agents.html) -- Agents can preload skills and run them in isolated contexts
