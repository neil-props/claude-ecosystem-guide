# Claude Ecosystem Guide

## What This Is

A comprehensive, public-facing reference for the Claude Code ecosystem — delivered as two artifacts from a single knowledge base. A GitHub Pages site provides layered documentation (conceptual overviews, how-to guides, full reference, and decision-tree guidance) covering MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, memory, and settings. A local Claude Code agent (`claude --agent claude-ecosystem`) answers ecosystem questions interactively, with hybrid knowledge (static skill files + live doc fetching).

## Core Value

Anyone working with Claude Code can quickly understand which extension point to use, how to set it up, and how the pieces fit together — whether reading the site or asking the agent.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Upgraded GitHub Pages site with full ecosystem coverage
- [ ] Layered content: conceptual, how-to, reference, and decision-tree for each topic
- [ ] Claude Code agent with skill-file knowledge base
- [ ] Agent hybrid knowledge: static base + live doc fetching
- [ ] Single knowledge base powers both deliverables
- [ ] Preserves existing content structure from index.html

### Out of Scope

- Mobile app — web-first, agent is CLI
- npm package / published distribution — agent is for personal local use
- User accounts or personalization on the site — static reference
- Automated CI/CD content pipeline — manual updates with agent-assisted live fetch

## Context

- Existing `index.html` (2343 lines) has solid topic organization covering the Claude Code ecosystem with dark/light theme, search, and interactive elements
- Existing `ama.html` provides Q&A content that may inform the knowledge base
- Site is already deployed via GitHub Pages (`.github/workflows/` exists)
- The "Props team" context is the originating audience, but the site is public-facing for the broader Claude Code community
- Agent should attempt live research when it doesn't know an answer rather than just admitting gaps

## Constraints

- **Existing content**: Build on current index.html structure, don't rebuild from scratch
- **Single source of truth**: Knowledge base content must serve both site and agent without duplication
- **Local agent**: Agent uses `claude --agent` with local skill files, no external infrastructure
- **Static site**: GitHub Pages deployment, no server-side rendering

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single knowledge base for both deliverables | Prevents content drift between site and agent | — Pending |
| Hybrid agent knowledge (static + live fetch) | Static alone goes stale; live alone is slow/unreliable | — Pending |
| All 3 content depths on site (concept + howto + reference + decision trees) | Users have different needs at different times | — Pending |
| Local-only agent install | Simplicity for personal use, no distribution overhead | — Pending |

---
*Last updated: 2026-03-14 after initialization*
