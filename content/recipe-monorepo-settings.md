---
title: "Recipe: Monorepo Settings Hierarchy"
slug: recipe-monorepo-settings
order: 5
description: "End-to-end walkthrough: configure Claude Code settings across a monorepo"
section: guides
---

# Recipe: Monorepo Settings Hierarchy

## What You Will Configure

A **settings hierarchy** for a monorepo that shares common configuration at the root while allowing each package to override settings for its own needs. This gives your team consistent defaults (shared MCP servers, common hooks, model preferences) with the flexibility for per-package and per-developer customization.

Claude Code reads settings from five levels, with more specific levels overriding more general ones. This recipe walks through setting up three of those levels in a real monorepo.

## Prerequisites

- Claude Code installed
- A monorepo with multiple packages (this recipe uses a typical `packages/` structure)
- Basic familiarity with [Settings](topics/settings.html) concepts

## Step 1: Understand the Settings Hierarchy

Claude Code merges settings from five levels, in order of increasing priority:

| Level | File | Scope |
|-------|------|-------|
| 1. Managed policy | Enterprise-managed config | Organization-wide |
| 2. User settings | `~/.claude/settings.json` | All your projects |
| 3. Project shared | `.claude/settings.json` | Committed, team-shared |
| 4. Project local | `.claude/settings.local.json` | Gitignored, per-developer |
| 5. CLI flags | `--model`, `--allowedTools` | Single session |

Higher-priority levels override lower ones. Array values (like `allowedTools`) are merged, not replaced -- a package can add tools but cannot remove tools allowed at the root level.

For the full precedence rules, see the [Settings reference](topics/settings.html).

## Step 2: Create Root Settings

At the monorepo root, create `.claude/settings.json` with shared configuration:

```json
{
  "model": "claude-sonnet-4-20250514",
  "allowedTools": [
    "Read",
    "Write",
    "Edit",
    "Bash",
    "Glob",
    "Grep"
  ],
  "hooks": {
    "PreCommit": [
      {
        "matcher": "**/*.{js,ts,jsx,tsx}",
        "command": "npx eslint --no-warn-ignored ${files}",
        "description": "Lint all JS/TS files before commit"
      }
    ]
  }
}
```

This gives every package in the monorepo:

- A consistent model selection.
- A common set of allowed tools.
- A shared pre-commit linting hook.

Your monorepo structure:

```plaintext
my-monorepo/
  .claude/
    settings.json         <-- root settings (Level 3)
  packages/
    frontend/
    backend/
    shared-lib/
  package.json
```

## Step 3: Create Package-Level Overrides

The frontend package needs different settings. Create `packages/frontend/.claude/settings.json`:

```json
{
  "allowedTools": [
    "Read",
    "Write",
    "Edit",
    "Bash",
    "Glob",
    "Grep"
  ],
  "hooks": {
    "PreCommit": [
      {
        "matcher": "**/*.{js,ts,jsx,tsx}",
        "command": "npx eslint --no-warn-ignored ${files}",
        "description": "Lint staged files"
      },
      {
        "matcher": "**/*.css",
        "command": "npx stylelint ${files}",
        "description": "Lint CSS files before commit"
      }
    ]
  }
}
```

And the backend package might need access to database tools. Create `packages/backend/.claude/settings.json`:

```json
{
  "allowedTools": [
    "Read",
    "Write",
    "Edit",
    "Bash",
    "Glob",
    "Grep"
  ],
  "hooks": {
    "PreCommit": [
      {
        "matcher": "**/*.{js,ts}",
        "command": "npx eslint --no-warn-ignored ${files}",
        "description": "Lint staged files"
      },
      {
        "matcher": "**/*.sql",
        "command": "npx sql-lint ${files}",
        "description": "Lint SQL files before commit"
      }
    ]
  }
}
```

Updated structure:

```plaintext
my-monorepo/
  .claude/
    settings.json               <-- root (Level 3)
  packages/
    frontend/
      .claude/
        settings.json           <-- frontend overrides (Level 3, closer scope)
    backend/
      .claude/
        settings.json           <-- backend overrides (Level 3, closer scope)
    shared-lib/                 <-- inherits root settings only
  package.json
```

## Step 4: Create Per-Developer Local Settings

Each developer can add personal overrides that are **not committed to git**. Create `.claude/settings.local.json` at the monorepo root:

```json
{
  "model": "claude-sonnet-4-20250514"
}
```

Add the local settings file to `.gitignore`:

```bash
echo ".claude/settings.local.json" >> .gitignore
```

This lets each developer choose their preferred model without affecting the team configuration. Level 4 (local) overrides Level 3 (shared) for the model field, while inheriting everything else.

## Step 5: Add CLAUDE.md at Each Level

Settings control *tool access and behavior*. `CLAUDE.md` files control *instructions and context*. Use both together for full configuration.

**Root `CLAUDE.md`** (monorepo conventions):

```markdown
# Monorepo Conventions

- Use `pnpm` for all package management (not npm or yarn).
- Import shared code from `@myorg/shared-lib`, never with relative paths across packages.
- All packages use TypeScript strict mode.
- Run `pnpm test` from the package directory, not the root.
```

**Package-level `packages/frontend/CLAUDE.md`**:

```markdown
# Frontend Package

- This is a React 18 application with Next.js 14.
- Components live in `src/components/` and use CSS Modules.
- State management uses Zustand (not Redux).
- All components must have a corresponding `.test.tsx` file.
```

**Package-level `packages/backend/CLAUDE.md`**:

```markdown
# Backend Package

- This is an Express.js API server with PostgreSQL.
- Routes live in `src/routes/` and use the controller pattern.
- Database access goes through `src/db/` repository files only.
- All endpoints must validate input with Zod schemas.
```

Claude merges CLAUDE.md files from all levels, giving it full context about the monorepo conventions *and* the specific package it is working in.

## Step 6: Verify the Hierarchy

Open Claude Code from different directories to see the merged settings in action.

From the **monorepo root**:

```bash
cd my-monorepo
claude "what model are you using and what tools do you have?"
```

Claude should report the root settings: the shared model and the base set of allowed tools.

From the **frontend package**:

```bash
cd my-monorepo/packages/frontend
claude "what model are you using and what tools do you have?"
```

Claude should report the frontend overrides merged with the root settings: the same model, the base tools, and the CSS linting hook.

From **shared-lib** (no package-level overrides):

```bash
cd my-monorepo/packages/shared-lib
claude "what hooks are configured?"
```

Claude should report only the root-level hooks, since shared-lib has no overrides.

## Verify It Works

Your settings hierarchy is working correctly when:

- Claude in any package directory uses the root model and tools as defaults.
- Claude in `packages/frontend/` has the CSS linting hook active.
- Claude in `packages/backend/` has the SQL linting hook active.
- Claude in `packages/shared-lib/` inherits only root settings.
- A developer's `settings.local.json` model choice overrides the shared model.
- CLAUDE.md instructions from both root and package level appear in Claude's context.

## Next Steps

- Read the [Settings reference](topics/settings.html) for the complete settings schema and all available fields.
- See [Projects](topics/projects.html) for advanced CLAUDE.md patterns including memory and auto-memory.
- Add MCP servers at different levels: a shared documentation server at root, a Storybook server in frontend only.
- Set up [hooks](topics/hooks.html) at different levels for package-specific quality gates.
