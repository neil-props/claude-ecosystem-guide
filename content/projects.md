---
title: Projects and CLAUDE.md
slug: projects
order: 6
description: Configure project-level behavior and instructions for Claude Code
color: "#22d3ee"
section: topics
---

# Projects and CLAUDE.md

## Overview

Projects provide persistent context that survives across sessions. In Claude Code, the `CLAUDE.md` file is the primary mechanism -- a markdown file auto-loaded at every session start that tells Claude about your codebase's conventions, architecture, and preferences. In Claude Chat, Projects are named spaces with uploaded knowledge bases and custom instructions. In Claude Cowork, folder-specific and global instructions serve the same purpose.

CLAUDE.md files can exist at multiple levels -- global (`~/.claude/CLAUDE.md`), project root, and subdirectories -- with each level adding context. This hierarchy makes it the most reliable way to ensure consistent behavior across all interactions.

## How It Works

### In Claude Code

CLAUDE.md files are automatically loaded when a session starts. They support a multi-level hierarchy:

| Level | Location | Purpose |
|-------|----------|---------|
| **User** | `~/.claude/CLAUDE.md` | Personal preferences across all projects |
| **Project** | `CLAUDE.md` (repo root) | Team-shared conventions and architecture |
| **Project (extended)** | `.claude/CLAUDE.md` | Additional project context |
| **Personal override** | `CLAUDE.local.md` | Personal overrides, gitignored |
| **Modular rules** | `.claude/rules/*.md` | Path-specific rules |

**Loading order:** Managed > Project > User. Higher priority settings override lower ones.

**Monorepo loading behavior:**

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

## Configuration

### CLAUDE.md Format

CLAUDE.md files use standard markdown. Keep them factual and actionable:

```markdown
## Do
- Use TypeScript strict mode
- Write tests with vitest
- Use Zod for all input validation

## Do Not
- Never modify migration files directly
- Never commit .env files
- Never use moment.js (use date-fns)
```

### Auto-Memory

Claude Code maintains its own per-project, per-user memory at:

```
~/.claude/projects/<project-hash>/memory/MEMORY.md
```

The first 200 lines of the memory file are auto-loaded at session start. Claude writes to this file automatically when it learns something important, or you can instruct it:

```
> "Remember: always use our custom Button component from @/components/ui"
```

### Path-Specific Rules

For modular, path-scoped instructions, use the `.claude/rules/` directory:

```
.claude/rules/
├── api.md          # Rules for API routes
├── components.md   # Rules for React components
└── tests.md        # Rules for test files
```

Rules load based on the files Claude is working with.

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

## Related

- [MCP](mcp.html) -- Connectors provide tools; Projects provide context and instructions
- [Skills](skills.html) -- Skills provide reusable procedures; CLAUDE.md provides project-specific context
- [Memory](memory.html) -- Memory system layers build on CLAUDE.md as the foundation
- [Settings](settings.html) -- Settings hierarchy controls permissions; CLAUDE.md controls instructions
