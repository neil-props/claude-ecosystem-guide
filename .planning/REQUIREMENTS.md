# Requirements: Claude Ecosystem Guide

**Defined:** 2026-03-14
**Core Value:** Anyone working with Claude Code can quickly understand which extension point to use, how to set it up, and how the pieces fit together — whether reading the site or asking the agent.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Site Structure

- [x] **SITE-01**: Site has multi-page structure with persistent sidebar navigation
- [ ] **SITE-02**: Site has full-text search across all content pages
- [x] **SITE-03**: Site supports dark/light theme toggle (preserve existing)
- [x] **SITE-04**: Site is responsive on mobile and tablet
- [x] **SITE-05**: All sections have deep-linkable anchor URLs
- [x] **SITE-06**: Code examples have copy-to-clipboard buttons
- [x] **SITE-07**: Code blocks have syntax highlighting (YAML, JSON, bash, markdown)
- [x] **SITE-08**: Site loads fast with no framework overhead (static HTML/CSS/JS)
- [x] **SITE-09**: Compatibility matrix shows feature availability across Code/Chat/Cowork (preserve existing)

### Design System

- [x] **DSGN-01**: Visual design system defined — color palette, typography scale, spacing system for both dark and light themes
- [x] **DSGN-02**: Page layout design — sidebar behavior, content area proportions, header/footer patterns
- [x] **DSGN-03**: Content layer UI — tab/accordion pattern for concept/howto/reference/decision-tree views per topic
- [x] **DSGN-04**: Interactive element design — decision wizard UI, search results display, code block styling, copy feedback
- [x] **DSGN-05**: Mobile navigation design — hamburger/drawer pattern, touch-friendly interactions
- [x] **DSGN-06**: Design mockups created and approved before implementation
- [x] **DSGN-07**: Component library — reusable styled components (cards, callouts, tables, badges, nav items)

### Content — Conceptual Overviews

- [ ] **CONC-01**: MCP overview — what it is, when to use it, transports (stdio, SSE, streamable HTTP)
- [ ] **CONC-02**: Skills overview — what they are, frontmatter, when to use vs other extension points
- [ ] **CONC-03**: Plugins overview — what they are, how they bundle skills, distribution
- [ ] **CONC-04**: Hooks overview — what they are, lifecycle events, use cases
- [ ] **CONC-05**: Agents overview — custom agents, agent files, when to use
- [ ] **CONC-06**: Projects overview — CLAUDE.md hierarchy, project memory
- [ ] **CONC-07**: Connectors overview — what they are, available connectors
- [ ] **CONC-08**: Commands overview — slash commands, built-in vs custom
- [ ] **CONC-09**: Memory system overview — how memory works, persistence, types
- [ ] **CONC-10**: Settings hierarchy overview — resolution order, scopes, overrides

### Content — How-To Guides

- [ ] **HOWT-01**: How to set up an MCP server (stdio transport)
- [ ] **HOWT-02**: How to set up an MCP server (SSE/streamable HTTP transport)
- [ ] **HOWT-03**: How to configure MCP authentication
- [ ] **HOWT-04**: How to build your own MCP server
- [ ] **HOWT-05**: How to create a skill with correct frontmatter
- [ ] **HOWT-06**: How to create a plugin that bundles skills
- [ ] **HOWT-07**: How to set up hooks for lifecycle events
- [ ] **HOWT-08**: How to create a custom agent
- [ ] **HOWT-09**: How to configure CLAUDE.md for a project
- [ ] **HOWT-10**: How to use the memory system effectively

### Content — Technical Reference

- [ ] **REFR-01**: MCP config schema (.mcp.json format, all fields)
- [ ] **REFR-02**: Skill frontmatter spec (all fields, validation rules)
- [ ] **REFR-03**: Plugin manifest spec
- [ ] **REFR-04**: Hook configuration spec (events, patterns, commands)
- [ ] **REFR-05**: Agent file format spec
- [ ] **REFR-06**: Settings hierarchy resolution order (full detail)
- [ ] **REFR-07**: CLAUDE.md file format and loading order
- [ ] **REFR-08**: Environment variables reference

### Content — Decision Trees

- [ ] **DECT-01**: Interactive decision wizard — "What are you trying to do?" flow that recommends the right extension point
- [ ] **DECT-02**: Per-topic decision guidance integrated into each topic page
- [ ] **DECT-03**: Comparison tables — Skill vs Agent vs Command, MCP vs Plugin, Hook vs Skill

### Content — Recipes

- [ ] **RECP-01**: Recipe: Build a deployment skill
- [ ] **RECP-02**: Recipe: Set up a CRM enrichment project with MCP
- [ ] **RECP-03**: Recipe: Create your first hook (pre-commit linting)
- [ ] **RECP-04**: Recipe: Build a custom agent for your team
- [ ] **RECP-05**: Recipe: Configure settings hierarchy for a monorepo

### Knowledge Base

- [x] **KNOW-01**: Markdown knowledge files created for all 10 extension point topics
- [x] **KNOW-02**: Knowledge files structured as single source of truth (site and agent both consume them)
- [x] **KNOW-03**: Content extracted from existing index.html into knowledge files
- [x] **KNOW-04**: Content mined from existing ama.html into relevant knowledge files
- [x] **KNOW-05**: Build script converts knowledge markdown to site HTML pages

### Agent

- [ ] **AGNT-01**: Agent invokable via `claude --agent claude-ecosystem`
- [ ] **AGNT-02**: Agent answers ecosystem questions from static skill file knowledge
- [ ] **AGNT-03**: Agent covers all 10 extension points (MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, Settings)
- [ ] **AGNT-04**: Agent uses hybrid knowledge — static base + live doc fetching via WebFetch/WebSearch
- [ ] **AGNT-05**: Agent cites sources and points users to relevant doc pages
- [ ] **AGNT-06**: Agent reads user's local project context (CLAUDE.md, .mcp.json, settings) and gives contextual recommendations
- [ ] **AGNT-07**: Agent provides guided setup workflows (creating skills, MCP servers, hooks, etc.)
- [ ] **AGNT-08**: Agent can perform ecosystem health check — audit user's Claude Code setup and flag issues/improvements
- [ ] **AGNT-09**: Agent handles comparison questions with structured responses ("what's the difference between X and Y?")

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Site Enhancements

- **SITE-V2-01**: Visual architecture diagrams (SVG) showing how extension points relate
- **SITE-V2-02**: Persona-based entry points ("I'm a developer" / "I'm ops" / "I'm non-technical")
- **SITE-V2-03**: Version/changelog tracking as a living timeline
- **SITE-V2-04**: Cross-reference linking between all topic pages

### Agent Enhancements

- **AGNT-V2-01**: Agent can generate boilerplate files (skill templates, MCP configs, hook configs)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Server-side rendering / dynamic backend | GitHub Pages is sufficient; adds infrastructure complexity |
| User accounts / personalization on site | Privacy concerns, auth complexity, maintenance burden |
| npm-published agent package | Distribution overhead for a local tool |
| Comment system / community features | Moderation burden; use GitHub Discussions instead |
| AI-powered site search | Over-engineered for content volume |
| Automated content pipeline / CI-generated docs | Manual updates + agent live fetch covers freshness |
| Multi-language / i18n | English-first domain, translation maintenance cost |
| Analytics / tracking | Privacy concern, minimal value |
| Versioned docs (v1, v2 branches) | Claude ecosystem moves too fast; single living document |
| Agent memory across sessions | Stateless per session; project context from local files |
| PDF / ebook export | Maintenance burden for a format nobody prefers |
| Tutorial progression / learning paths | Reference site, not a course |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SITE-01 | Phase 1: Foundation | Complete |
| SITE-02 | Phase 5: Decision Guidance and Recipes | Pending |
| SITE-03 | Phase 1: Foundation | Complete |
| SITE-04 | Phase 1: Foundation | Complete |
| SITE-05 | Phase 1: Foundation | Complete |
| SITE-06 | Phase 1: Foundation | Complete |
| SITE-07 | Phase 1: Foundation | Complete |
| SITE-08 | Phase 1: Foundation | Complete |
| SITE-09 | Phase 1: Foundation | Complete |
| DSGN-01 | Phase 1.1: Design System | Complete |
| DSGN-02 | Phase 1.1: Design System | Complete |
| DSGN-03 | Phase 1.1: Design System | Complete |
| DSGN-04 | Phase 1.1: Design System | Complete |
| DSGN-05 | Phase 1.1: Design System | Complete |
| DSGN-06 | Phase 1.1: Design System | Complete |
| DSGN-07 | Phase 1.1: Design System | Complete |
| CONC-01 | Phase 3: Conceptual Content | Pending |
| CONC-02 | Phase 3: Conceptual Content | Pending |
| CONC-03 | Phase 3: Conceptual Content | Pending |
| CONC-04 | Phase 3: Conceptual Content | Pending |
| CONC-05 | Phase 3: Conceptual Content | Pending |
| CONC-06 | Phase 3: Conceptual Content | Pending |
| CONC-07 | Phase 3: Conceptual Content | Pending |
| CONC-08 | Phase 3: Conceptual Content | Pending |
| CONC-09 | Phase 3: Conceptual Content | Pending |
| CONC-10 | Phase 3: Conceptual Content | Pending |
| HOWT-01 | Phase 4: Guides and Reference | Pending |
| HOWT-02 | Phase 4: Guides and Reference | Pending |
| HOWT-03 | Phase 4: Guides and Reference | Pending |
| HOWT-04 | Phase 4: Guides and Reference | Pending |
| HOWT-05 | Phase 4: Guides and Reference | Pending |
| HOWT-06 | Phase 4: Guides and Reference | Pending |
| HOWT-07 | Phase 4: Guides and Reference | Pending |
| HOWT-08 | Phase 4: Guides and Reference | Pending |
| HOWT-09 | Phase 4: Guides and Reference | Pending |
| HOWT-10 | Phase 4: Guides and Reference | Pending |
| REFR-01 | Phase 4: Guides and Reference | Pending |
| REFR-02 | Phase 4: Guides and Reference | Pending |
| REFR-03 | Phase 4: Guides and Reference | Pending |
| REFR-04 | Phase 4: Guides and Reference | Pending |
| REFR-05 | Phase 4: Guides and Reference | Pending |
| REFR-06 | Phase 4: Guides and Reference | Pending |
| REFR-07 | Phase 4: Guides and Reference | Pending |
| REFR-08 | Phase 4: Guides and Reference | Pending |
| DECT-01 | Phase 5: Decision Guidance and Recipes | Pending |
| DECT-02 | Phase 5: Decision Guidance and Recipes | Pending |
| DECT-03 | Phase 5: Decision Guidance and Recipes | Pending |
| RECP-01 | Phase 5: Decision Guidance and Recipes | Pending |
| RECP-02 | Phase 5: Decision Guidance and Recipes | Pending |
| RECP-03 | Phase 5: Decision Guidance and Recipes | Pending |
| RECP-04 | Phase 5: Decision Guidance and Recipes | Pending |
| RECP-05 | Phase 5: Decision Guidance and Recipes | Pending |
| KNOW-01 | Phase 2: Knowledge Base | Complete |
| KNOW-02 | Phase 2: Knowledge Base | Complete |
| KNOW-03 | Phase 2: Knowledge Base | Complete |
| KNOW-04 | Phase 2: Knowledge Base | Complete |
| KNOW-05 | Phase 1: Foundation | Complete |
| AGNT-01 | Phase 6: Agent | Pending |
| AGNT-02 | Phase 6: Agent | Pending |
| AGNT-03 | Phase 6: Agent | Pending |
| AGNT-04 | Phase 6: Agent | Pending |
| AGNT-05 | Phase 6: Agent | Pending |
| AGNT-06 | Phase 6: Agent | Pending |
| AGNT-07 | Phase 6: Agent | Pending |
| AGNT-08 | Phase 6: Agent | Pending |
| AGNT-09 | Phase 6: Agent | Pending |

**Coverage:**
- v1 requirements: 66 total
- Mapped to phases: 66
- Unmapped: 0

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-14 after roadmap creation*
