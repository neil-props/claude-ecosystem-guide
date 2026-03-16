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

Skills are structured knowledge files that teach Claude how to perform specific tasks within a domain. Each skill contains rules, examples, and patterns that Claude loads contextually when relevant to the current task. Skills live in `.claude/skills/` directories and use markdown with YAML frontmatter.

Skills are the recommended approach when you want Claude to follow specific patterns repeatedly across multiple conversations.

## Quick Example

Create a skill file at `.claude/skills/api-patterns/SKILL.md`:

```yaml
---
name: API Patterns
description: REST API conventions for this project
globs: ["src/api/**/*.ts", "src/routes/**/*.ts"]
---

# API Patterns

## Rules

- All endpoints return JSON with `{ data, error, meta }` envelope
- Use zod for request validation
- Include rate limiting on all public endpoints
```

## Coming Soon

Full content including skill file format, loading behavior, rule organization, and skill vs agent comparison will be added in Phases 2-4.
