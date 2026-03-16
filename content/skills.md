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

The YAML frontmatter controls how the skill behaves. There are **10 frontmatter fields** that define the skill's identity, permissions, and execution context. The most important ones:

- **`name`** -- Display name and `/slash` command identifier (max 64 chars, lowercase/hyphens)
- **`description`** -- Controls when Claude auto-invokes the skill via progressive disclosure. Write a clear, specific description that matches the tasks you want the skill to handle.
- **`allowed-tools`** -- Restricts which tools the skill can use. No permission prompts for listed tools.
- **`model`** -- Override the model used (e.g., `haiku` for cheap/fast tasks, `opus` for complex reasoning).
- **`context: fork`** -- Run the skill in an isolated subagent context, giving it behavior similar to an agent.

For the complete frontmatter specification with all 10 fields, types, defaults, and validation rules, see the **Reference** tab.

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

## How to Create a Skill with Correct Frontmatter

Build a reusable skill that Claude auto-invokes based on task context, or invoke it manually with a `/` command.

### Prerequisites

- Claude Code installed and working (`claude --version`)
- A project with a `.claude/` directory (or willingness to create one)
- A repeatable process you want Claude to follow consistently

### Step 1: Create the Skill Directory

```bash
mkdir -p .claude/skills
```

This creates the project-level skills directory. Skills placed here are shared with your team via git.

### Step 2: Create the Skill File with Frontmatter

Create a file at `.claude/skills/deploy-checker.md` with complete YAML frontmatter:

```yaml
---
name: deploy-checker
description: Validates deployment readiness by checking test status, lint results, and environment configuration before pushing to production
argument-hint: "[environment]"
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
context: fork
agent: general-purpose
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---
```

**Key fields explained:**
- **`name`** -- The `/` command name. Must be lowercase with hyphens, max 64 characters.
- **`description`** -- Controls when Claude auto-invokes this skill. Be specific about what tasks it handles.
- **`allowed-tools`** -- Restricts the skill to only these tools. No permission prompts for listed tools.
- **`context: fork`** -- Runs the skill in an isolated subagent context so it does not pollute your main session.

### Step 3: Write the Skill Body

Below the frontmatter, add the markdown instructions that tell Claude what to do:

```markdown
# Deploy Checker

You are a deployment readiness validator. When invoked, check the following
for the target environment (provided as $ARGUMENTS or defaulting to "staging"):

## Checks to Run

1. **Test status** -- Run `npm test` and verify all tests pass
2. **Lint results** -- Run `npm run lint` and verify zero errors
3. **Environment config** -- Verify `.env.$ARGUMENTS` exists and has all required variables
4. **Build** -- Run `npm run build` and verify it succeeds
5. **Git status** -- Verify no uncommitted changes

## Output Format

Provide a structured report:
- Environment: $ARGUMENTS
- Tests: PASS/FAIL (count)
- Lint: PASS/FAIL (error count)
- Config: PASS/FAIL (missing vars)
- Build: PASS/FAIL
- Git: CLEAN/DIRTY

End with a clear GO / NO-GO recommendation.
```

### Step 4: Test the Skill

Invoke the skill in Claude Code using the `/` command:

```
/deploy-checker staging
```

Claude will run in a forked context (because of `context: fork`), execute the checks using only the allowed tools, and produce a deployment readiness report.

You can also let Claude auto-invoke it. When you say something like "check if we're ready to deploy to production," the description match triggers the skill automatically.

### Step 5: Create a Personal Skill for Cross-Project Reuse

For skills you want available in every project, create them in your home directory:

```bash
mkdir -p ~/.claude/skills
```

Create `~/.claude/skills/git-workflow.md`:

```yaml
---
name: git-workflow
description: Follows the team git workflow for creating branches, commits, and pull requests
user-invocable: true
allowed-tools: Bash
---

# Git Workflow

Follow these steps for any code change:

1. Create a feature branch: `git checkout -b feature/$ARGUMENTS`
2. Make changes and commit with conventional commit messages
3. Push and create a PR with a descriptive title and body
```

Personal skills are available in all projects but have lower priority than project-level skills.

### Verify It Works

- The skill appears in the `/` command list when you type `/deploy` in Claude Code
- Running `/deploy-checker staging` executes the checks and produces a report
- Claude auto-invokes the skill when you describe a deployment readiness task

### Troubleshooting

- **Skill not appearing in `/` menu:** Check the `name` field -- it must be max 64 characters, lowercase letters and hyphens only. Ensure the file is at `.claude/skills/deploy-checker.md` (not nested deeper).
- **Frontmatter parse errors:** Verify YAML syntax -- proper indentation, no tabs, strings with special characters quoted. Use a YAML linter if unsure.
- **Skill not auto-invoking:** The `description` field controls auto-invocation. Make it more specific to the tasks you want matched. If `disable-model-invocation: true`, auto-invocation is disabled.
- **Tools not available:** Check `allowed-tools` -- only listed tools are available. Omit this field to allow all tools.
- **Character budget exceeded:** Skills have a 15,000-character budget by default. Override with the `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable.


  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Skill Frontmatter Specification

### File Location

| Scope | Path | Visibility |
|-------|------|------------|
| Project | `.claude/skills/*.md` | Shared via git, team-wide |
| Personal | `~/.claude/skills/*.md` | Your own, all projects |
| Plugin | `<plugin>/skills/*/SKILL.md` | Via plugin installation |

**Discovery priority:** Enterprise > Personal > Project > Plugin.

### Complete Frontmatter Example

```yaml
---
name: deploy-checker
description: Validates deployment readiness before pushing to production
argument-hint: "[environment]"
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
context: fork
agent: general-purpose
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---
```

### Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | N/A | Display name and `/` command identifier. Max 64 characters, lowercase letters and hyphens only (`[a-z0-9-]+`). |
| `description` | string | Yes | N/A | Controls auto-invocation via progressive disclosure. Max 1,024 characters. Must not contain XML tags. |
| `argument-hint` | string | No | `""` | Autocomplete hint shown after the `/name` in the command menu (e.g., `"[environment]"`). |
| `disable-model-invocation` | boolean | No | `false` | When `true`, prevents Claude from auto-invoking this skill. Requires explicit `/name` command. |
| `user-invocable` | boolean | No | `true` | When `false`, hides the skill from the `/` menu. Used for skills that should only be auto-invoked. |
| `allowed-tools` | string list | No | all tools | Comma-separated list of tools the skill can use. No permission prompts for listed tools. |
| `model` | string | No | inherited | Override the model: `haiku`, `sonnet`, `opus`, or a specific model ID. |
| `context` | enum | No | `inherit` | `fork` runs in an isolated subagent context. `inherit` runs in the main session context. |
| `agent` | string | No | `"general-purpose"` | Subagent type when `context: fork`. Can reference a custom agent file. |
| `hooks` | object | No | none | Lifecycle hooks scoped to this skill only. Uses the same nested hook schema as settings.json. |

### String Substitutions

These variables are available in the skill body (markdown instructions):

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | The full argument string passed after the `/name` command |
| `$ARGUMENTS[N]` | The Nth argument (0-indexed) |
| `$N` | Shorthand for `$ARGUMENTS[N]` (e.g., `$0`, `$1`) |
| `${CLAUDE_SESSION_ID}` | The current session identifier |
| `${CLAUDE_SKILL_DIR}` | Absolute path to the directory containing this skill file |

### Validation Rules

- `name` must match `[a-z0-9-]+` and be at most 64 characters
- `description` must be at most 1,024 characters and must not contain XML tags
- `allowed-tools` entries must be valid tool names recognized by Claude Code
- `model` must be a valid model alias (`haiku`, `sonnet`, `opus`) or a full model ID
- `context` must be either `fork` or `inherit`
- `hooks` must follow the nested hook configuration schema (see [Hooks Reference](hooks.html))
- Total skill content (frontmatter + body) is subject to the character budget (default 15,000; override with `SLASH_COMMAND_TOOL_CHAR_BUDGET`)

### Examples

**Minimal skill** (just a name and description):

```yaml
---
name: code-review
description: Reviews code changes for quality, security, and style issues
---

Review the code changes in the current branch. Check for:
- Security vulnerabilities
- Performance issues
- Style violations
- Missing error handling
```

**Full skill** (all fields):

```yaml
---
name: deploy-checker
description: Validates deployment readiness before pushing to production
argument-hint: "[environment]"
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
context: fork
agent: general-purpose
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---

# Deploy Checker

Validate deployment readiness for the $ARGUMENTS environment.
Run tests, lint, build, and environment config checks.
Output a GO / NO-GO recommendation.
```


  </div>
</div>

## Related

- [Plugins](plugins.html) -- Plugins bundle multiple skills into installable packages
- [Hooks](hooks.html) -- Hooks complement skills by reacting to lifecycle events
- [Agents](agents.html) -- Agents can preload skills and run them in isolated contexts
