# Architecture Research

**Domain:** Documentation site + CLI agent with shared knowledge base
**Researched:** 2026-03-14
**Confidence:** HIGH

## System Overview

```
                    CONSUMERS
    ┌──────────────────┬──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌──────────┐   ┌──────────────┐   ┌──────────────┐
│  GitHub   │   │  Claude Code  │   │   Build      │
│  Pages    │   │  Agent        │   │   Script     │
│  (Site)   │   │  (CLI)        │   │              │
└─────┬─────┘   └──────┬───────┘   └──────┬───────┘
      │                │                   │
      │    reads at    │   reads at        │  transforms at
      │    runtime     │   session start   │  build time
      │                │                   │
┌─────┴────────────────┴───────────────────┴───────┐
│              KNOWLEDGE BASE (Markdown)            │
│                                                   │
│  knowledge/                                       │
│  ├── topics/                                      │
│  │   ├── mcp.md                                   │
│  │   ├── skills.md                                │
│  │   ├── plugins.md                               │
│  │   ├── hooks.md                                 │
│  │   ├── agents.md                                │
│  │   ├── projects.md                              │
│  │   └── interactive-apps.md                      │
│  ├── guides/                                      │
│  │   ├── decision-tree.md                         │
│  │   ├── getting-started.md                       │
│  │   └── best-practices.md                        │
│  └── reference/                                   │
│      ├── compatibility-matrix.md                  │
│      ├── timeline.md                              │
│      └── personas.md                              │
└───────────────────────────────────────────────────┘
```

## The Core Problem: Two Consumers, One Source

The project has two delivery surfaces that must stay in sync:

1. **GitHub Pages site** -- static HTML served to browsers
2. **Claude Code agent** -- local CLI agent using skill files with `claude --agent`

Both need the same factual content about the Claude ecosystem. The architecture must ensure a single edit propagates to both without manual duplication.

## Recommended Architecture: Markdown-Centric Knowledge Base

### Why Markdown is the Universal Format

Markdown is the only format that works natively in both contexts:

- **For the site:** A build script reads markdown files and injects them into HTML templates. The current single-file `index.html` approach (2343 lines) should evolve into a build pipeline that assembles content from markdown source files.
- **For the agent:** Claude Code agents and skills read markdown natively. Skill files ARE markdown (SKILL.md). Agent files ARE markdown (.claude/agents/*.md). The knowledge base files can be directly referenced or included in the agent's context.

No database. No CMS. No API layer. Markdown files in the repo ARE the source of truth.

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **Knowledge Base** (`knowledge/`) | Store all factual content as structured markdown | Plain `.md` files organized by topic |
| **Site Builder** (`build/`) | Transform markdown into the GitHub Pages site | Node.js script that reads `knowledge/` and outputs `docs/` |
| **Site Output** (`docs/`) | Static HTML/CSS/JS served by GitHub Pages | Generated files, not hand-edited |
| **Agent Definition** (`.claude/agents/`) | Define the claude-ecosystem agent persona and behavior | Agent `.md` file with frontmatter referencing knowledge |
| **Agent Skills** (`.claude/skills/`) | Provide topic-specific instruction sets the agent can invoke | Skill files that `@import` from `knowledge/` or embed content |
| **Live Fetch Layer** | Let the agent check current docs when knowledge base is stale | MCP server config or tool instructions in agent definition |

## Recommended Project Structure

```
claude-ecosystem-guide/
├── knowledge/                    # THE source of truth
│   ├── topics/                   # One file per ecosystem topic
│   │   ├── mcp.md                # MCP / Connectors
│   │   ├── skills.md             # Skills
│   │   ├── plugins.md            # Plugins
│   │   ├── hooks.md              # Hooks
│   │   ├── agents.md             # Subagents & Agent Teams
│   │   ├── projects.md           # Projects / CLAUDE.md
│   │   └── interactive-apps.md   # Interactive Apps
│   ├── guides/                   # Cross-cutting guides
│   │   ├── decision-tree.md      # "Which should I use?"
│   │   ├── getting-started.md    # Onboarding guide
│   │   ├── best-practices.md     # Best practices
│   │   └── personas.md           # Building by persona
│   ├── reference/                # Structured reference data
│   │   ├── compatibility.md      # Compatibility matrix
│   │   └── timeline.md           # Product timeline
│   └── meta/                     # Content metadata
│       └── topics.json           # Topic ordering, colors, short descriptions
│
├── build/                        # Site build tooling
│   ├── build.js                  # Main build script
│   ├── templates/                # HTML templates
│   │   ├── layout.html           # Page shell (nav, footer, theme toggle)
│   │   ├── topic.html            # Topic page template
│   │   └── index.html            # Landing page template
│   └── assets/                   # Static assets (CSS, JS)
│       ├── style.css             # Extracted from current index.html
│       └── main.js               # Extracted JS (theme toggle, search, modals)
│
├── docs/                         # BUILD OUTPUT (GitHub Pages serves this)
│   ├── index.html                # Generated landing page
│   ├── topics/                   # Generated topic pages
│   ├── guides/                   # Generated guide pages
│   └── assets/                   # Copied static assets
│
├── .claude/
│   ├── agents/
│   │   └── claude-ecosystem.md   # Agent definition (references knowledge/)
│   └── skills/
│       ├── ecosystem-lookup/
│       │   └── SKILL.md          # Quick topic lookup skill
│       ├── decision-helper/
│       │   └── SKILL.md          # "Which extension should I use?" skill
│       └── live-check/
│           └── SKILL.md          # Fetch latest from official docs
│
├── .github/workflows/
│   └── deploy.yml                # Build + deploy to GitHub Pages
│
├── index.html                    # LEGACY (preserved until migration complete)
├── ama.html                      # AMA content (migrate to knowledge/ later)
└── CLAUDE.md                     # Project instructions
```

### Structure Rationale

- **`knowledge/`:** Flat markdown files, one per topic. This is the single source of truth. Both the build script and agent read from here. Topics are self-contained -- each file covers conceptual overview, how-to, reference details, and gotchas for one extension point.
- **`build/`:** Separates build tooling from content. The build script is a simple transformer: read markdown, apply template, write HTML. No framework needed -- this is a documentation site, not a web app.
- **`docs/`:** Generated output only. GitHub Pages can serve from `/docs` on the main branch (configure in repo settings). Never hand-edit files here.
- **`.claude/agents/`:** The agent definition file sets persona, allowed tools, and references the knowledge base. It does NOT duplicate content -- it points to `knowledge/` files.
- **`.claude/skills/`:** Each skill handles a specific interaction pattern (topic lookup, decision help, live checking). Skills reference knowledge base files using `@knowledge/topics/mcp.md` syntax or embed key content.

## Architectural Patterns

### Pattern 1: Content-as-Data (Markdown with Structured Frontmatter)

**What:** Each knowledge base file uses YAML frontmatter for metadata (title, description, color, order, related topics) and markdown body for content. The build script parses frontmatter for navigation/layout and renders the body.

**When to use:** Every knowledge base file.

**Trade-offs:** Keeps content human-readable and agent-readable. Requires a frontmatter parser in the build script (trivial with gray-matter or similar). Agent gets slightly more context than needed from frontmatter, but the overhead is negligible.

**Example:**
```markdown
---
title: MCP Servers & Connectors
slug: mcp
color: "#fb923c"
order: 1
description: The Model Context Protocol connects Claude to external tools and services.
related: [skills, plugins, interactive-apps]
---

# MCP Servers & Connectors

## What It Is

The Model Context Protocol (MCP) is an open standard (JSON-RPC 2.0) connecting
Claude to external tools and services...

## How to Use It

### In Claude Code
...

### In Claude Chat
...

## Reference

### Configuration Options
...

## Common Gotchas
...
```

### Pattern 2: Agent References Knowledge (Not Duplicates)

**What:** The agent definition file and skill files reference knowledge base files rather than embedding content. The agent reads files at session start or on-demand using file read tools.

**When to use:** Agent and skill definitions.

**Trade-offs:** Keeps agent always in sync with knowledge base. Adds one tool call (file read) per topic lookup. This is acceptable because Claude Code agents can read local files instantly.

**Example (agent definition):**
```markdown
---
name: claude-ecosystem
description: Interactive guide to the Claude ecosystem
tools: [Read, WebFetch, Bash]
model: sonnet
---

# Claude Ecosystem Guide Agent

You are an expert on the Claude ecosystem. Your knowledge base is in
the `knowledge/` directory of this repository.

## How to Answer Questions

1. Read the relevant file from `knowledge/topics/` for the topic
2. If the question spans topics, read multiple files
3. For "which should I use?" questions, read `knowledge/guides/decision-tree.md`
4. If your knowledge seems outdated, use the live-check skill

## Knowledge Base Structure

- `knowledge/topics/` - One file per extension point (mcp, skills, plugins, etc.)
- `knowledge/guides/` - Cross-cutting guides
- `knowledge/reference/` - Compatibility matrix, timeline
```

### Pattern 3: Build-Time Transformation (Not Runtime)

**What:** The site is built by a Node.js script that reads markdown, applies HTML templates, and writes static files. No client-side markdown rendering. No build framework.

**When to use:** Site generation.

**Trade-offs:** Fast page loads (pre-rendered HTML). No JavaScript framework dependency. Build step is simple enough to debug. Downside: requires running `node build/build.js` after content changes. Mitigated by the GitHub Actions workflow running it automatically on push.

### Pattern 4: Hybrid Agent Knowledge (Static Base + Live Fetch)

**What:** The agent primarily uses the local knowledge base (fast, reliable) but has a fallback skill that fetches current information from official docs when the knowledge base might be stale.

**When to use:** When the agent encounters questions about very recent features or when the user asks "what's the latest on X?"

**Trade-offs:** Static knowledge is fast and always available. Live fetch is slower and depends on network access. The hybrid approach gives the best of both. The agent should clearly indicate when it's using live-fetched vs. local knowledge.

## Data Flow

### Flow 1: Content Authoring to Site

```
Author edits knowledge/topics/mcp.md
    ↓
git push to main
    ↓
GitHub Actions triggers
    ↓
build/build.js runs:
    ├── Reads knowledge/**/*.md
    ├── Parses YAML frontmatter
    ├── Renders markdown to HTML
    ├── Applies templates from build/templates/
    └── Writes to docs/
    ↓
GitHub Pages serves docs/
    ↓
User browses site
```

### Flow 2: Content Authoring to Agent

```
Author edits knowledge/topics/mcp.md
    ↓
git pull (or already local)
    ↓
User runs: claude --agent claude-ecosystem
    ↓
Agent reads .claude/agents/claude-ecosystem.md
    ↓
User asks: "How do I add an MCP server?"
    ↓
Agent reads knowledge/topics/mcp.md
    ↓
Agent synthesizes answer from file content
```

### Flow 3: Agent Live Fetch (Fallback)

```
User asks: "What MCP servers were added this week?"
    ↓
Agent determines knowledge base may be stale
    ↓
Agent invokes live-check skill
    ↓
Skill uses WebFetch on docs.anthropic.com / code.claude.com
    ↓
Agent synthesizes answer with attribution
    ↓
Agent suggests updating knowledge base if significant
```

### Flow 4: Legacy Migration

```
Existing index.html (2343 lines)
    ↓
Extract content sections into knowledge/topics/*.md
    ↓
Extract JS detail objects into structured markdown
    ↓
Extract CSS into build/assets/style.css
    ↓
Extract JS into build/assets/main.js
    ↓
Build template that preserves current visual design
    ↓
Verify docs/ output matches current site appearance
    ↓
Remove legacy index.html
```

## Component Boundaries

### Internal Boundaries

| Boundary | Direction | Notes |
|----------|-----------|-------|
| knowledge/ -> build/ | Build reads knowledge | Build script imports markdown, never modifies it |
| knowledge/ -> agent | Agent reads knowledge | Agent reads files on-demand, never modifies them |
| build/ -> docs/ | Build writes output | One-way generation, docs/ is disposable |
| agent -> live fetch | Agent calls external | Network-dependent fallback, not primary path |
| legacy index.html -> knowledge/ | Migration only | One-time content extraction, then legacy removed |

### External Boundaries

| Boundary | Integration | Notes |
|----------|-------------|-------|
| GitHub Pages | Serves docs/ directory | Configure Pages source to /docs on main branch |
| GitHub Actions | Runs build on push | Triggered by changes to knowledge/ or build/ |
| docs.anthropic.com | Agent live fetch target | Read-only, rate-limit-aware |
| code.claude.com | Agent live fetch target | Read-only, rate-limit-aware |

## Anti-Patterns

### Anti-Pattern 1: Duplicating Content Between Site and Agent

**What people do:** Write content once for the site HTML and separately for skill files, keeping "two versions" in sync manually.
**Why it's wrong:** Content drifts within days. Site says one thing, agent says another. Every update requires two edits.
**Do this instead:** Single markdown source in `knowledge/`. Both consumers read from the same files.

### Anti-Pattern 2: Embedding All Knowledge in the Agent Prompt

**What people do:** Put the entire knowledge base into the agent's system prompt or frontmatter instructions.
**Why it's wrong:** Blows up context window. Agent loads everything even for simple questions. Updates require editing the agent definition.
**Do this instead:** Agent reads specific files on-demand. The agent definition describes HOW to find information, not the information itself.

### Anti-Pattern 3: Using a Static Site Generator Framework

**What people do:** Reach for Docusaurus, VitePress, MkDocs, or similar for what is essentially a single-page reference.
**Why it's wrong:** Adds massive dependency tree for a site that has ~15 content pages. The current design is a visual showcase (custom CSS, interactive cards, modals), not a standard docs layout. Framework conventions would fight the design.
**Do this instead:** Simple build script (under 200 lines of Node.js) that reads markdown and applies custom templates. Full control, zero framework overhead.

### Anti-Pattern 4: Generating Skill Files from Knowledge Base

**What people do:** Create a build step that transforms knowledge markdown into SKILL.md files, adding unnecessary indirection.
**Why it's wrong:** Skills and knowledge files serve different purposes. A skill tells the agent HOW to behave. A knowledge file contains WHAT to know. Conflating them creates awkward hybrid files.
**Do this instead:** Skills reference knowledge files. The skill says "read knowledge/topics/mcp.md and answer the user's question." The knowledge file contains the actual content.

## Build Order (Dependencies)

The components have clear dependency ordering:

```
Phase 1: Knowledge Base Extraction
    │     (Extract content from index.html into knowledge/*.md)
    │     No dependencies. Foundation for everything else.
    ▼
Phase 2: Site Build Pipeline
    │     (build.js + templates + asset extraction)
    │     Depends on: knowledge/ existing with content
    │     Produces: docs/ that matches current site appearance
    ▼
Phase 3: Agent Definition
    │     (.claude/agents/claude-ecosystem.md)
    │     Depends on: knowledge/ existing with content
    │     Can run in parallel with Phase 2
    ▼
Phase 4: Agent Skills
    │     (ecosystem-lookup, decision-helper, live-check)
    │     Depends on: agent definition + knowledge/
    │     Enhances agent capabilities
    ▼
Phase 5: Content Expansion
          (Add depth: how-to guides, advanced reference)
          Depends on: build pipeline + agent both working
          Pure content work, architecture is settled
```

**Key dependency insight:** Phases 2 and 3 can run in parallel because they both depend only on Phase 1 (the knowledge base), not on each other. Phase 1 is the critical path -- everything else flows from having content in markdown.

## Scaling Considerations

| Concern | Current (1 site, 1 agent) | Future (multiple agents, richer site) |
|---------|--------------------------|---------------------------------------|
| Content volume | ~15 topic files, ~10 guide files | Same structure, more files |
| Build time | Milliseconds (markdown -> HTML) | Still milliseconds at 100+ files |
| Agent context | Reads 1-3 files per question | Consider a topic index file for routing |
| Site navigation | Single-page or few pages | Add search index generation to build |
| Content freshness | Manual updates | Add "last verified" dates to frontmatter |

This system does not need to scale to thousands of users in terms of architecture -- GitHub Pages handles traffic. The scaling concern is content volume, which markdown files handle gracefully.

## Sources

- Project context: `.planning/PROJECT.md`
- Existing site structure: `index.html` (2343 lines, 10 sections, 7 extension point detail modals)
- Claude Code agent docs: Agent frontmatter supports `name`, `description`, `tools`, `model`, `skills`, `mcpServers`, `memory`, `hooks` (from existing site content)
- Claude Code skill format: SKILL.md with YAML frontmatter, located in `.claude/skills/` (from existing site content)
- GitHub Pages: Supports serving from `/docs` directory on main branch

---
*Architecture research for: Claude Ecosystem Guide (documentation site + agent)*
*Researched: 2026-03-14*
