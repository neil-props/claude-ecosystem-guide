# Roadmap: Claude Ecosystem Guide

## Overview

This roadmap delivers a comprehensive Claude Code ecosystem reference as two artifacts from a single knowledge base: a GitHub Pages site with layered documentation and an interactive CLI agent. The work flows from establishing the multi-page site structure and build pipeline, through extracting and writing knowledge content at increasing depth, to adding decision guidance and search, and finally building the companion agent. Each phase delivers a coherent, verifiable capability that the next phase builds on.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Multi-page site structure, shared layout, build pipeline, and code infrastructure (completed 2026-03-16)
- [ ] **Phase 1.1: Design System** - INSERTED - Visual design system, page layouts, component library, and design mockups
- [ ] **Phase 2: Knowledge Base** - Extract existing content into markdown knowledge files as single source of truth
- [ ] **Phase 3: Conceptual Content** - Write conceptual overviews for all 10 ecosystem extension points
- [ ] **Phase 4: Guides and Reference** - Write how-to guides and technical reference specs for all extension points
- [ ] **Phase 5: Decision Guidance and Recipes** - Decision trees, comparison tables, recipes, and full-text search
- [ ] **Phase 6: Agent** - CLI agent companion with static knowledge, live fetch, and contextual recommendations

## Phase Details

### Phase 1: Foundation
**Goal**: Users can navigate a multi-page site with working layout, navigation, themes, and code formatting -- built from a repeatable build pipeline
**Depends on**: Nothing (first phase)
**Requirements**: SITE-01, SITE-03, SITE-04, SITE-05, SITE-06, SITE-07, SITE-08, SITE-09, KNOW-05
**Success Criteria** (what must be TRUE):
  1. Site has a persistent sidebar navigation that works across multiple pages
  2. Dark/light theme toggle works on every page and persists user preference
  3. Site is usable on mobile and tablet (responsive layout)
  4. Code blocks have syntax highlighting and copy-to-clipboard buttons
  5. Running the build script converts markdown source files into HTML pages with correct layout
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Build pipeline, HTML template, CSS/JS assets, placeholder content pages with syntax highlighting and copy-to-clipboard
- [ ] 01-02-PLAN.md — Sidebar navigation, theme toggle, responsive mobile layout, compatibility matrix, deploy workflow

### Phase 1.1: Design System (INSERTED)
**Goal**: The Props team design system is applied to the site with all design tokens, themed layouts, and a reusable component library -- visually approved before content phases begin
**Depends on**: Phase 1
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, DSGN-07
**Success Criteria** (what must be TRUE):
  1. Visual design system (color palette, typography, spacing) is defined for both dark and light themes
  2. Page layout mockups show sidebar, content area, and mobile navigation patterns
  3. Content layer UI (tabs/accordions for concept/howto/reference/decision-tree) is designed and approved
  4. Interactive element designs (decision wizard, search results, code blocks, copy feedback) are mocked up
  5. Reusable component library (cards, callouts, tables, badges, nav items) is implemented in CSS
**Plans**: 2 plans

Plans:
- [ ] 1.1-01-PLAN.md — Props design tokens (colors, typography, spacing, shadows, transitions), dark/light themes, core layout styles (sidebar, typography, code blocks, tables, lists, mobile responsive)
- [ ] 1.1-02-PLAN.md — Component library (buttons, badges, cards, callouts, tabs, eyebrow labels), interactive elements, design showcase page, visual approval checkpoint

### Phase 2: Knowledge Base
**Goal**: All existing content from index.html and ama.html is extracted into structured markdown knowledge files that serve as the single source of truth
**Depends on**: Phase 1
**Requirements**: KNOW-01, KNOW-02, KNOW-03, KNOW-04
**Success Criteria** (what must be TRUE):
  1. Markdown knowledge files exist for all 10 extension point topics (MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, Settings)
  2. Content from existing index.html is preserved in the knowledge files (no information lost)
  3. Relevant Q&A content from ama.html is incorporated into the appropriate knowledge files
  4. Knowledge files follow a consistent structure template usable by both the site build and the agent
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Conceptual Content
**Goal**: Users can read a clear conceptual overview for every extension point, understanding what it is, when to use it, and how it fits in the ecosystem
**Depends on**: Phase 2
**Requirements**: CONC-01, CONC-02, CONC-03, CONC-04, CONC-05, CONC-06, CONC-07, CONC-08, CONC-09, CONC-10
**Success Criteria** (what must be TRUE):
  1. Each of the 10 topic pages has a conceptual overview section explaining what the feature is and when to use it
  2. MCP overview covers all three transport types (stdio, SSE, streamable HTTP)
  3. Skills overview explains frontmatter and when to use skills vs other extension points
  4. Each overview links to its corresponding how-to and reference sections (even if those pages are not yet populated)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Guides and Reference
**Goal**: Users can follow step-by-step how-to guides and consult precise technical reference specs for all extension points
**Depends on**: Phase 3
**Requirements**: HOWT-01, HOWT-02, HOWT-03, HOWT-04, HOWT-05, HOWT-06, HOWT-07, HOWT-08, HOWT-09, HOWT-10, REFR-01, REFR-02, REFR-03, REFR-04, REFR-05, REFR-06, REFR-07, REFR-08
**Success Criteria** (what must be TRUE):
  1. Each MCP how-to guide (stdio setup, SSE setup, authentication, building a server) is a complete walkthrough a user can follow from start to finish
  2. Each extension point how-to (skills, plugins, hooks, agents, CLAUDE.md, memory) walks through a real creation/configuration workflow
  3. Technical reference pages document complete config schemas with all fields, types, and validation rules (MCP config, skill frontmatter, plugin manifest, hook config, agent file format, settings hierarchy, CLAUDE.md format, env vars)
  4. Code examples in guides are copy-pasteable and use realistic values (not lorem ipsum)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

### Phase 5: Decision Guidance and Recipes
**Goal**: Users can determine which extension point to use for their situation and follow end-to-end recipes for common workflows, with full-text search across all content
**Depends on**: Phase 4
**Requirements**: SITE-02, DECT-01, DECT-02, DECT-03, RECP-01, RECP-02, RECP-03, RECP-04, RECP-05
**Success Criteria** (what must be TRUE):
  1. Interactive decision wizard walks a user through "What are you trying to do?" and recommends the right extension point
  2. Comparison tables clearly show differences between similar features (Skill vs Agent vs Command, MCP vs Plugin, Hook vs Skill)
  3. Each recipe is a complete end-to-end walkthrough of a real-world use case (deployment skill, CRM with MCP, pre-commit hook, custom agent, monorepo settings)
  4. Full-text search finds content across all pages and returns relevant results
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Agent
**Goal**: Users can invoke a CLI agent that answers Claude Code ecosystem questions from knowledge files, fetches live docs when needed, and gives contextual recommendations based on their project
**Depends on**: Phase 2
**Requirements**: AGNT-01, AGNT-02, AGNT-03, AGNT-04, AGNT-05, AGNT-06, AGNT-07, AGNT-08, AGNT-09
**Success Criteria** (what must be TRUE):
  1. User can run `claude --agent claude-ecosystem` and get accurate answers about any of the 10 extension points
  2. Agent uses live doc fetching (WebFetch/WebSearch) when static knowledge is insufficient, and cites its sources
  3. Agent reads the user's local project files (CLAUDE.md, .mcp.json, settings) and gives contextual setup recommendations
  4. Agent handles comparison questions ("what's the difference between X and Y?") with structured, side-by-side responses
  5. Agent can audit a user's Claude Code setup and flag issues or suggest improvements
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 1.1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Complete    | 2026-03-16 |
| 1.1. Design System | 1/2 | In progress | - |
| 2. Knowledge Base | 0/2 | Not started | - |
| 3. Conceptual Content | 0/2 | Not started | - |
| 4. Guides and Reference | 0/3 | Not started | - |
| 5. Decision Guidance and Recipes | 0/2 | Not started | - |
| 6. Agent | 0/2 | Not started | - |
