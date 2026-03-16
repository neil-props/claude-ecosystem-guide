---
title: Compatibility Matrix
slug: compatibility
order: 20
description: Feature availability across Claude Code, Claude Chat, and Claude Cowork
section: reference
---

# Compatibility Matrix

The definitive reference for which extension works where. Not every extension is available on every surface -- this matrix shows exactly what you can use and where.

## Extension Availability

| Extension | Claude Code | Claude Chat | Claude Cowork | Adds Tools? | Adds Instructions? | Launched |
|-----------|:-----------:|:-----------:|:-------------:|:-----------:|:------------------:|:--------:|
| MCP / Connectors | Yes | Yes | Yes | Yes | No | Nov 2024 |
| Skills | Yes | Yes | Yes | No | Yes | Oct 2025 |
| Plugins | Yes | No | Yes | Yes | Yes | Jan 2026 |
| Projects / CLAUDE.md | Yes | Yes | Yes | No | Yes | 2024 |
| Subagents | Yes | No | Yes | No | Yes | 2025 |
| Hooks | Yes | No | No | No | No | 2025 |
| Interactive Apps | No | Yes | No | Yes | No | Jan 2026 |

## Key Takeaways

- **MCP Servers** are the most universal extension -- they work across all three surfaces and are the primary way to add external tools.
- **Skills** are the universal primitive for instructions -- they work everywhere without modification. Build once, use everywhere.
- **Plugins** bundle skills, agents, hooks, MCP servers, and commands into a single distributable package. Available in Code and Cowork.
- **Hooks** are Code-only -- they run shell commands at specific lifecycle events (pre-tool-use, post-tool-use, etc.) for automation and guardrails.
- **Interactive Apps** are Chat-only -- they provide rich UI experiences within the Claude Chat interface.
- **Projects / CLAUDE.md** files provide project-specific instructions and work across all surfaces.
