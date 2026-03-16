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

## How to Configure CLAUDE.md for a Project

### Prerequisites

- Claude Code installed and working (`claude --version`)
- A project directory (ideally a git repository)

### Step 1: Create Your Project CLAUDE.md

Create a `CLAUDE.md` file at your project root with your tech stack, conventions, and key commands:

```markdown
# My Project

## Tech Stack
- TypeScript with strict mode
- Next.js 14 with App Router
- PostgreSQL with Prisma ORM
- Vitest for testing

## Conventions
- Use pnpm, not npm or yarn
- Components in src/components/ with PascalCase filenames
- Tests co-located: MyComponent.test.tsx next to MyComponent.tsx
- Use Zod for all runtime validation
- Prefer named exports over default exports

## Key Commands
- `pnpm dev` -- start dev server on port 3000
- `pnpm test` -- run vitest
- `pnpm lint` -- run ESLint + Prettier
- `pnpm db:migrate` -- run Prisma migrations

## Architecture
- API routes in src/app/api/
- Shared types in src/types/
- Database models in prisma/schema.prisma
```

Check this file into git so every team member gets the same Claude behavior.

### Step 2: Add Directory-Specific Rules

For rules that only apply to certain parts of your codebase, create `.claude/rules/*.md` files:

```bash
# Create the rules directory
mkdir -p .claude/rules
```

Create `.claude/rules/tests.md`:

```markdown
# Testing Rules
- Use describe/it blocks, not test()
- Mock external services with msw
- Never import from src/index.ts in tests -- import directly from the module
- Prefer userEvent over fireEvent in React tests
```

Create `.claude/rules/api.md`:

```markdown
# API Route Rules
- All endpoints must validate input with Zod
- Return consistent error format: { error: string, code: string }
- Use middleware for auth -- never check auth inline
- Log all errors with structured JSON logging
```

Rules files are loaded when Claude reads files in the project -- they provide targeted guidance without bloating the main CLAUDE.md.

### Step 3: Create Personal Overrides with CLAUDE.local.md

For preferences that are personal (not shared with the team), create `CLAUDE.local.md` at the project root:

```markdown
# Personal Preferences
- I prefer verbose explanations in code comments
- Use vim keybinding references when explaining shortcuts
- My editor is Neovim -- reference its commands when relevant
- Always show the full file path in code examples
```

`CLAUDE.local.md` is automatically gitignored -- it will not be committed to the repository.

### Step 4: Set Up Monorepo Patterns

For monorepos, create a root CLAUDE.md plus per-package files:

```
my-monorepo/
  CLAUDE.md                    # Root: shared conventions, monorepo structure
  packages/
    api/
      CLAUDE.md                # API-specific: Express patterns, route conventions
    web/
      CLAUDE.md                # Web-specific: React patterns, component library
    shared/
      CLAUDE.md                # Shared lib: no side effects, pure functions only
```

Root `CLAUDE.md`:

```markdown
# My Monorepo

## Structure
- packages/api -- Express REST API
- packages/web -- Next.js frontend
- packages/shared -- Shared TypeScript utilities

## Global Conventions
- Use pnpm workspaces
- All packages use TypeScript strict mode
- Shared types go in packages/shared/src/types/
```

Package-specific `packages/api/CLAUDE.md`:

```markdown
# API Package
- Express with async error handling middleware
- Routes in src/routes/, controllers in src/controllers/
- Use Joi for request validation (not Zod -- this package predates the migration)
- Database access only through src/db/ module
```

### Step 5: Import Shared Instructions

Use `@import` syntax to reference shared instruction files from CLAUDE.md:

```markdown
# My Project

@docs/coding-standards.md
@docs/architecture-decisions.md
```

This includes the content of those files as additional context, keeping your CLAUDE.md concise while referencing detailed docs.

### Verify It Works

Start a new Claude Code session in your project directory and ask:

```
> What are the project conventions and tech stack?
```

Claude should reflect the content from your CLAUDE.md. You can also check what is loaded:

```
> What do you know from CLAUDE.md?
```

### Troubleshooting

- **CLAUDE.md not loading:** Check the filename is exactly `CLAUDE.md` (case-sensitive). Ensure you are in the correct working directory. Verify the file is not excluded by `claudeMdExcludes` in your settings.
- **Rules not applying:** Ensure `.claude/rules/` files have the `.md` extension and are in the correct directory. Rules are loaded when Claude accesses files in the project.
- **File too large:** Keep each CLAUDE.md under 200 lines for reliable adherence. If you need more, split into `.claude/rules/` files or use `@import` for supplementary docs.
- **Conflicting instructions:** When multiple CLAUDE.md files conflict, later-loaded files take precedence. Project-level files override global ones.

<!-- end howto -->

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

### CLAUDE.md File Format

CLAUDE.md files are plain markdown files. There is no special schema or frontmatter -- Claude reads the raw markdown content as project instructions.

**Recognized file names:**

| File | Purpose | Shared via Git? |
|------|---------|-----------------|
| `CLAUDE.md` | Primary project instructions | Yes |
| `CLAUDE.local.md` | Personal overrides | No (gitignored) |
| `.claude/CLAUDE.md` | Extended project instructions | Yes |
| `.claude/rules/*.md` | Path-specific rules | Yes |
| `~/.claude/CLAUDE.md` | Global personal instructions | N/A (user home) |

### Loading Order and Precedence

CLAUDE.md files load in a specific order. Later-loaded content overrides earlier content when instructions conflict.

**Loading direction:**

| Direction | Behavior | When |
|-----------|----------|------|
| **UP** | Walks from current working directory to repo root, loading all CLAUDE.md files found | At session startup |
| **DOWN** | Subdirectory CLAUDE.md files load lazily | When Claude reads files in that directory |
| **SIBLING** | Never loads | Directories at the same level are independent |

**Full resolution order (lowest to highest priority):**

| Priority | Source | Location |
|----------|--------|----------|
| 1 (lowest) | Global user instructions | `~/.claude/CLAUDE.md` |
| 2 | Project root | `CLAUDE.md` (repo root) |
| 3 | Project extended | `.claude/CLAUDE.md` |
| 4 | Modular rules | `.claude/rules/*.md` |
| 5 (highest) | Personal overrides | `CLAUDE.local.md` |

Within each priority level, merge semantics are additive -- all content is loaded. When two sources give conflicting instructions, the higher-priority source wins.

### @import Syntax

Include content from other files using `@path/to/file` syntax within a CLAUDE.md file:

```markdown
@docs/coding-standards.md
@docs/api-conventions.md
```

- Paths are relative to the CLAUDE.md file location
- Imported files are read and their content is appended to the context
- Circular imports are not followed

### Character Limits

- Keep individual CLAUDE.md files under **200 lines** (~4,000 characters) for reliable adherence
- Auto-memory loads the first **200 lines** of the memory file
- There is no hard character limit enforced by the system, but longer files reduce instruction-following reliability

### File Location Resolution

| Scope | Path |
|-------|------|
| Global (macOS/Linux) | `~/.claude/CLAUDE.md` |
| Global (Windows) | `%USERPROFILE%\.claude\CLAUDE.md` |
| Project root | `<repo-root>/CLAUDE.md` |
| Project extended | `<repo-root>/.claude/CLAUDE.md` |
| Project rules | `<repo-root>/.claude/rules/*.md` |
| Personal override | `<repo-root>/CLAUDE.local.md` |
| Subdirectory | `<subdir>/CLAUDE.md` (lazy-loaded) |

### Examples

**Minimal CLAUDE.md:**

```markdown
# My Project
- TypeScript with strict mode
- Use pnpm for package management
- Tests in __tests__/ directories
```

**Monorepo CLAUDE.md (root):**

```markdown
# Acme Platform

## Structure
- apps/web -- Next.js frontend (port 3000)
- apps/api -- Express backend (port 4000)
- packages/ui -- Shared component library
- packages/db -- Prisma database client

## Global Rules
- pnpm workspaces, never install in package root
- TypeScript strict in all packages
- Shared types in packages/db/src/types/

@docs/deployment-checklist.md
```

  </div>
</div>

## Related

- [MCP](mcp.html) -- Connectors provide tools; Projects provide context and instructions
- [Skills](skills.html) -- Skills provide reusable procedures; CLAUDE.md provides project-specific context
- [Memory](memory.html) -- Memory system layers build on CLAUDE.md as the foundation
- [Settings](settings.html) -- Settings hierarchy controls permissions; CLAUDE.md controls instructions
