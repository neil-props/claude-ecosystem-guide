# Technology Stack

**Project:** Claude Ecosystem Guide
**Researched:** 2026-03-14
**Overall confidence:** MEDIUM (web search unavailable; recommendations based on training data and project analysis)

## Core Recommendation: Stay Vanilla, Enhance Incrementally

The existing site is 2343 lines of self-contained HTML/CSS/JS with zero dependencies. It works. It deploys with a trivial GitHub Pages workflow. **Do not introduce a framework or SSG.** The project constraint says "build on current index.html structure, don't rebuild from scratch." A framework migration would violate this and add complexity for a documentation site that one person maintains.

Instead, enhance the existing vanilla stack with targeted, zero-build-step additions for search and content organization.

## Recommended Stack

### Site: Core (Keep As-Is)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vanilla HTML/CSS/JS | N/A | Site foundation | Already works. Zero build step. Direct GitHub Pages deploy. No framework churn. A documentation site does not need React/Vue/Astro. | HIGH |
| Inter (Google Fonts) | Current | Typography | Already in use, excellent readability | HIGH |
| CSS Custom Properties | N/A | Theming (dark/light) | Already implemented with `data-theme` attribute pattern. Clean, maintainable. | HIGH |

### Site: Search Enhancement

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Pagefind | ^1.3 | Static search | Zero-runtime-cost search for static sites. Generates a search index at build time. Works with plain HTML -- no framework required. Tiny bundle (~5KB gzipped). Used by Starlight, Docusaurus, and other doc sites. | MEDIUM |

**Why Pagefind over alternatives:**
- **Lunr.js**: Requires loading entire index into memory. Fine for small sites but Pagefind is more performant and purpose-built for static sites.
- **Algolia**: Overkill. Requires account, API keys, external service. This is a personal documentation site.
- **Fuse.js**: Client-side fuzzy search. Works but no index pre-building -- loads all content into JS. Pagefind is better for docs.
- **Custom JS search**: The site currently has no search. Pagefind gives search with minimal effort.

**Pagefind caveat:** Requires a build step (`npx pagefind --site .`). This means the deploy workflow needs a small addition. Still no framework, just one CLI command.

### Site: Content Organization (Multi-Page)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Plain HTML files | N/A | Multi-page content | One HTML file per topic area. Shared header/footer via a small JS include or `<template>` elements. No SSG needed for ~10-15 pages. | HIGH |
| Shared layout via JS | N/A | DRY header/nav/footer | A small vanilla JS script that injects shared chrome. ~50 lines. Avoids SSG dependency for layout reuse. | HIGH |

**Why not an SSG (Astro, 11ty, Hugo)?**
- The constraint says "build on existing index.html, don't rebuild from scratch"
- An SSG requires restructuring content into its template format
- The site is maintained by one person -- SSG abstraction adds cognitive overhead without proportional benefit
- If the site grows beyond ~20 pages, reconsider 11ty (lowest migration cost from plain HTML)

### Agent: Knowledge Base

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Claude Code Skill Files (`.md`) | N/A | Static knowledge base | Skill files in `.claude/skills/` are automatically loaded by Claude Code as context. Markdown files with structured content. This IS the knowledge base format. | MEDIUM |
| `claude --agent` flag | N/A | Custom agent invocation | Runs Claude Code with a custom agent prompt. The agent prompt references skill files for domain knowledge. | MEDIUM |
| CLAUDE.md (project) | N/A | Agent behavior instructions | Project-level CLAUDE.md defines agent personality, tool usage, and response patterns. | HIGH |

**Single knowledge base strategy:**
The skill files (`.claude/skills/*.md`) ARE the canonical content. The site's HTML pages are generated/derived from these same markdown files. This means:
1. Write content as markdown skill files
2. Site pages consume these (either via build script or manual sync)
3. Agent consumes them natively

### Agent: Live Fetch Capability

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| MCP (Model Context Protocol) | N/A | Live documentation fetching | Agent can use MCP tools (WebFetch, Context7) to pull current docs when skill files lack an answer. | MEDIUM |
| Context7 MCP Server | N/A | Library documentation lookup | Provides authoritative, version-aware docs for any library in the ecosystem. | MEDIUM |

### Build & Deploy

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| GitHub Pages | N/A | Hosting | Already configured and working. Free, reliable, custom domain support. | HIGH |
| GitHub Actions | N/A | CI/CD | Already configured. Needs minor update for Pagefind build step. | HIGH |
| Node.js (Actions only) | 20 LTS | Build environment | Only needed in CI for Pagefind. Not a local development dependency for content editing. | HIGH |

### Development

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `python3 -m http.server` or `npx serve` | N/A | Local dev server | For previewing the site locally. No complex dev server needed. | HIGH |

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| React / Vue / Svelte | Framework overhead for a documentation site with no dynamic data. The existing vanilla JS handles interactions fine. |
| Astro | Excellent for docs, but requires restructuring all content into Astro's format. Violates "build on existing" constraint. |
| Next.js | Server-side rendering is explicitly out of scope. SSR adds hosting complexity for zero benefit here. |
| Docusaurus | React-based, heavy, opinionated structure. Requires full content migration. |
| Tailwind CSS | The existing CSS custom properties system is clean and purpose-built for this site. Tailwind would require a build step and rewriting all styles. |
| MDX | Adds build complexity. Plain markdown for skill files, plain HTML for the site. |
| Algolia DocSearch | External dependency, requires approval process, overkill for a personal reference site. |
| Contentful / Sanity / any CMS | This is a static reference site maintained by one developer. A CMS adds complexity with no benefit. |
| TypeScript | No build step currently. Adding TS requires a compiler. The JS in this project is simple DOM manipulation -- TS would add ceremony without safety benefits. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Site framework | Vanilla HTML/CSS/JS | Astro / 11ty | Violates "build on existing" constraint. Migration cost > benefit for this scale. |
| Search | Pagefind | Lunr.js | Pagefind is purpose-built for static sites, smaller runtime, better UX. |
| Search | Pagefind | Algolia | External service dependency, overkill. |
| Styling | CSS Custom Properties | Tailwind | Existing system works. Migration adds build step and rewrites all styles. |
| Knowledge format | Markdown skill files | JSON / YAML | Markdown is human-readable, Claude-native, and directly usable as skill files. |
| Multi-page | Plain HTML + JS includes | SSG templates | Lower migration cost, no new toolchain. |

## Updated Deploy Workflow

```yaml
# .github/workflows/deploy.yml addition for Pagefind
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
  - run: npx pagefind --site .
  - uses: actions/configure-pages@v5
  - uses: actions/upload-pages-artifact@v3
    with:
      path: '.'
  - uses: actions/deploy-pages@v4
```

## Knowledge Base File Structure

```
.claude/
  skills/
    ecosystem-overview.md      # High-level ecosystem map
    mcp-guide.md               # MCP deep dive
    skills-guide.md            # Skills deep dive
    hooks-guide.md             # Hooks deep dive
    agents-guide.md            # Agents deep dive
    plugins-guide.md           # Plugins deep dive
    connectors-guide.md        # Connectors deep dive
    commands-guide.md          # Commands deep dive
    projects-guide.md          # Projects deep dive
    memory-settings.md         # Memory & settings
    decision-trees.md          # "Which extension point?" logic
    best-practices.md          # Tips & patterns
```

Each skill file serves double duty: Claude Code agent reads it natively, and a simple build/sync script extracts content for site pages.

## Installation

```bash
# No package.json needed for the site itself
# Pagefind runs via npx in CI only

# For local development with search:
npx pagefind --site . --serve

# For local preview without search:
python3 -m http.server 8000
```

## Sources

- Project analysis: existing index.html (2343 lines vanilla HTML/CSS/JS)
- Project constraints: .planning/PROJECT.md
- Pagefind: training data knowledge (MEDIUM confidence -- version should be verified)
- Claude Code skill files: training data knowledge (MEDIUM confidence -- exact behavior should be verified against current docs)
- GitHub Pages deployment: existing .github/workflows/deploy.yml (HIGH confidence -- working config)
