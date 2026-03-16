---
title: Projects and CLAUDE.md
slug: projects
order: 6
description: Configure project-level behavior and instructions for Claude Code
color: "#22d3ee"
section: topics
---

# Projects and CLAUDE.md

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

Projects provide persistent context that travels with your codebase. In Claude Code, the `CLAUDE.md` file is the primary mechanism -- a markdown file that Claude reads at the start of every session, giving it project-specific knowledge about your conventions, architecture, and preferences. Think of it as the "onboarding doc" that a new team member would read -- except Claude reads it every single time, reliably.

CLAUDE.md is the first thing you should set up in any project that uses Claude Code. It is the most reliable way to ensure consistent behavior across all interactions, because it is always loaded, never compacted, and shared with every agent in the project.

In Claude Chat, Projects are named spaces with uploaded knowledge bases and custom instructions. In Claude Cowork, folder-specific and global instructions serve the same purpose.

### The CLAUDE.md Hierarchy

CLAUDE.md files can exist at multiple levels, each adding context:

| Level | Location | Purpose |
|-------|----------|---------|
| **Global** | `~/.claude/CLAUDE.md` | Personal preferences across all projects |
| **Project** | `CLAUDE.md` (repo root) | Team-shared conventions and architecture |
| **Project (extended)** | `.claude/CLAUDE.md` | Additional project context |
| **Personal override** | `CLAUDE.local.md` | Personal overrides, gitignored |
| **Modular rules** | `.claude/rules/*.md` | Path-specific rules |

The merge semantics are additive: global instructions load first, then project-level files layer on top. Higher priority settings override lower ones when there are conflicts (Managed > Project > User).

## How It Works

### In Claude Code

CLAUDE.md files are automatically loaded when a session starts. The loading behavior in monorepos follows a clear pattern:

- **UP** -- walks from the current working directory to the repo root, loading all CLAUDE.md files found along the way at startup
- **DOWN** -- subdirectory CLAUDE.md files load lazily, only when Claude reads files in that directory
- **SIBLING** -- never loads (directories at the same level are independent)

You can import additional files using `@path/to/file` syntax within CLAUDE.md.

**Example CLAUDE.md:**

```markdown
# Project Name

## Tech Stack
- TypeScript with strict mode
- Next.js 14 with App Router
- PostgreSQL with Prisma ORM
- Vitest for testing

## Conventions
- Use pnpm, not npm
- Components in src/components/ with PascalCase
- Tests co-located: MyComponent.test.tsx
- Use Zod for runtime validation

## Architecture
- Monorepo with Turborepo
- API routes in src/app/api/
- Shared types in packages/types/

## Commands
- `pnpm dev` -- start dev server
- `pnpm test` -- run tests
- `pnpm lint` -- run ESLint
```

### Project Memory

Beyond CLAUDE.md, Claude Code maintains auto-memory -- a per-project, per-user learning journal:

```
~/.claude/projects/<project-hash>/memory/MEMORY.md
```

The first 200 lines of the memory file are auto-loaded at session start. Claude writes to this file automatically when it learns something important, or you can instruct it:

```
> "Remember: always use our custom Button component from @/components/ui"
```

Auto-memory complements CLAUDE.md: CLAUDE.md is for team-shared conventions you write deliberately, while auto-memory captures personal per-project learnings organically.

### In Claude Chat

In Claude Chat, Projects are named spaces in the sidebar:

1. Click **Projects** in the sidebar
2. Create a new project with a descriptive name
3. Add **custom instructions** (equivalent to CLAUDE.md for Chat)
4. Upload **knowledge base files** (docs, code, data) that persist across conversations

Custom instructions examples:
- "You are a senior React developer helping our frontend team"
- "Our API uses REST with JSON. Base URL: api.example.com"

Knowledge base files persist within the project -- Claude can reference them without re-uploading. Available on Pro, Max, Team, and Enterprise plans.

**Team features (Team/Enterprise):** Shared projects across team members, organization-managed knowledge bases, and admin controls for project access.

### In Claude Cowork

- **Global instructions** -- standing preferences applied across all Cowork sessions
- **Folder-specific instructions** -- context applied when working in specific directories
- Set both in the **Customize** menu

## When to Use Projects

Projects (and CLAUDE.md specifically) should be the first thing you set up for any project that uses Claude Code:

- **Always:** Create a CLAUDE.md in your repo root with tech stack, conventions, and key commands
- **For teams:** Check CLAUDE.md into git so every team member gets the same Claude behavior
- **For monorepos:** Add subdirectory CLAUDE.md files for package-specific conventions
- **For personal overrides:** Use `CLAUDE.local.md` for preferences that shouldn't be shared (gitignored automatically)
- **For modular rules:** Use `.claude/rules/` when different parts of the codebase need different instructions

In Claude Chat, create separate Projects per workflow domain -- don't overload one project with everything.

## Best Practices

- Keep CLAUDE.md files under **200 lines** each for reliable adherence
- Be specific and actionable, not vague -- Claude fills gaps with assumptions
- Share a single CLAUDE.md with your team and check it into git
- Use `CLAUDE.local.md` for personal overrides (automatically gitignored)
- Tag `@claude` on PRs to update CLAUDE.md when conventions change
- In Chat, create separate Projects per workflow domain -- don't overload one
- Use `.claude/rules/` for path-specific rules instead of one huge CLAUDE.md
- Put critical info in CLAUDE.md rather than repeating it in prompts -- it's always loaded and never compacted

## Common Questions

**What is CLAUDE.md and how should I structure it?**
CLAUDE.md is a markdown file at your repo root that gives Claude persistent context about your project. Structure it with sections for tech stack, conventions, architecture, and key commands. Keep it under 200 lines, be specific, and use `CLAUDE.local.md` for personal overrides.

**My CLAUDE.md isn't being picked up -- what's wrong?**
Check that the file is exactly `CLAUDE.md` (case-sensitive) at the repo root or inside `.claude/`. Verify it's not excluded by `claudeMdExcludes` in settings. Keep it under 200 lines, ensure you're in the correct working directory, and test by asking Claude what it knows from CLAUDE.md.

**How do I get Claude to remember our conventions across sessions?**
In Code, put conventions in CLAUDE.md at your repo root (auto-loaded every session). Use auto-memory for cross-session learning. In Chat, create a Project with custom instructions and uploaded reference docs. In Cowork, set Global Instructions in the Customize menu.

**How do I use Projects for non-technical teams?**
Create a Claude Chat Project with system instructions defining the workflow (decision tree, conflict rules, logging). Connect Connectors (HubSpot, ZoomInfo, etc.) and upload reference docs (taxonomy mapping, templates). The team opens the project and chats naturally -- no code or terminal required.

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

> [!INFO]
> Step-by-step guides for Projects are coming in Phase 4.

Planned guides:
- Setting up CLAUDE.md for a new project -- _coming soon_
- Configuring path-specific rules with .claude/rules/ -- _coming soon_
- Structuring CLAUDE.md for monorepos -- _coming soon_
- Using auto-memory effectively -- _coming soon_

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

> [!INFO]
> Detailed reference specs for Projects are coming in Phase 4.

Planned references:
- CLAUDE.md format and loading behavior -- _coming soon_
- Path-specific rules configuration -- _coming soon_
- Auto-memory file format and location -- _coming soon_

  </div>
</div>

## Related

- [MCP](mcp.html) -- Connectors provide tools; Projects provide context and instructions
- [Skills](skills.html) -- Skills provide reusable procedures; CLAUDE.md provides project-specific context
- [Memory](memory.html) -- Memory system layers build on CLAUDE.md as the foundation
- [Settings](settings.html) -- Settings hierarchy controls permissions; CLAUDE.md controls instructions
