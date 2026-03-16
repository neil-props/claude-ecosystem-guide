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

The `CLAUDE.md` file is the primary way to give Claude Code project-specific instructions. Placed at the root of your project, it tells Claude about your codebase's conventions, architecture, and preferences. Claude reads this file at the start of every conversation, making it the most reliable way to ensure consistent behavior across all interactions.

CLAUDE.md files can exist at multiple levels -- global (`~/.claude/CLAUDE.md`), project root, and subdirectories -- with each level adding context.

## Quick Example

Create a `CLAUDE.md` at your project root:

```markdown
# Project Instructions

## Tech Stack
- TypeScript with strict mode
- Next.js 14 with App Router
- PostgreSQL with Drizzle ORM

## Conventions
- Use `pnpm` for package management
- All API routes go in `src/app/api/`
- Use zod for all input validation
- Write tests with vitest

## Do Not
- Never modify migration files directly
- Never commit .env files
```

## Coming Soon

Full content including CLAUDE.md format, inheritance rules, project detection, and best practices will be added in Phases 2-4.
