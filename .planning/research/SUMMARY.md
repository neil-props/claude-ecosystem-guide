# Research Summary: Claude Ecosystem Guide

**Domain:** Developer documentation site + CLI agent companion
**Researched:** 2026-03-14
**Overall confidence:** MEDIUM

## Executive Summary

The Claude Ecosystem Guide is a documentation/reference site paired with a local CLI agent, both powered by a single knowledge base. The existing site is 2343 lines of vanilla HTML/CSS/JS deployed on GitHub Pages -- a solid foundation that should be enhanced incrementally rather than replaced with a framework.

The key architectural decision is the "single knowledge base" pattern: markdown files serve as the canonical content source. The site derives its pages from these files via a simple build script. The Claude Code agent reads them natively (either as skill files or via file-read tools). This prevents content drift and keeps maintenance costs low.

The biggest technical risks are content drift between site and agent (solved by single-source architecture), context window overflow from bloated skill files (solved by modular file structure), and the temptation to over-engineer the build pipeline (solved by discipline -- vanilla HTML + one build script + Pagefind).

The most impactful feature to build is the decision tree ("Which extension point should I use?"). Anthropic's official docs explain each feature individually but don't help users choose between MCP, Skills, Hooks, Agents, Plugins, and Connectors. This comparative guidance is the project's primary differentiator.

## Key Findings

**Stack:** Stay vanilla HTML/CSS/JS. Add Pagefind for search. Use a simple Node.js build script (not an SSG) to convert markdown knowledge files into HTML pages. Only consider 11ty if the site exceeds ~30 pages. No React, no Astro, no Docusaurus, no Tailwind.

**Architecture:** Markdown knowledge files are the single source of truth. A build script converts them to site pages. The agent reads them via file tools or as skill files. MCP tools provide optional live doc fetching as a fallback.

**Critical pitfall:** Content drift between site and agent. Prevented by never editing HTML content directly -- always edit the markdown source and rebuild.

## Key Decision: Knowledge Base Location

The STACK.md and ARCHITECTURE.md research files present two valid approaches for the knowledge base location:

1. **`.claude/skills/*.md`** (STACK.md) -- Skill files that Claude Code loads natively, doubling as content source for the site build
2. **`knowledge/`** (ARCHITECTURE.md) -- Standalone directory that both the build script and agent reference via file-read tools

**Recommendation for roadmap:** The `knowledge/` approach from ARCHITECTURE.md is more flexible. It separates content from Claude Code conventions, making it more portable and less coupled to skill file format requirements. The agent definition can reference `knowledge/` files via Read tool instructions. The skill files in `.claude/skills/` should be thin routing/behavior files that point to `knowledge/`, not contain the content themselves.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation** - Extract shared CSS/JS from monolithic index.html, establish multi-page structure, define knowledge base format, set up minimal build pipeline
   - Addresses: Shared layout, navigation, code organization, content format
   - Avoids: Breaking existing links (keep index.html as landing page), over-engineering the build

2. **Knowledge Base** - Extract content from existing index.html and ama.html into markdown files, establish consistent structure template
   - Addresses: Single source of truth, content extraction from existing assets
   - Avoids: Content drift, inconsistent depth, oversized files, ignoring AMA content

3. **Site Enhancement** - Build topic pages from knowledge files, add Pagefind search, create interactive decision tree
   - Addresses: Search (table stakes), decision tree (key differentiator), multi-page navigation
   - Avoids: Premature framework migration, indexing non-content elements

4. **Agent Setup** - Configure agent prompt, test file loading, add MCP live fetch fallback
   - Addresses: CLI agent companion, hybrid knowledge (static + live)
   - Avoids: Agent prompt bloat, monolithic skill files, over-reliance on live fetch

5. **Polish** - Layered content depths (concept/how-to/reference), cross-cutting comparisons, recipes/cookbook
   - Addresses: Content depth, comparison tables, opinionated guidance
   - Avoids: Trying to write all depths at once (start with how-to, add layers later)

**Phase ordering rationale:**
- Foundation must come first because multi-page structure and content format are prerequisites for everything
- Knowledge base before site enhancement because content must exist before it can be displayed and indexed
- Agent setup can partially overlap with site enhancement (both depend on knowledge base, not each other)
- Polish last because layered content is the highest writing effort with diminishing returns per phase

**Research flags for phases:**
- Phase 1 (Foundation): Needs verification of Pagefind build integration with GitHub Actions
- Phase 2 (Knowledge Base): Needs verification of Claude Code skill file loading behavior (exact path conventions, size limits, auto-loading behavior)
- Phase 4 (Agent Setup): Needs verification of `claude --agent` flag behavior and agent prompt format
- Phase 3, 5: Standard patterns, unlikely to need additional research

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Vanilla HTML recommendation is HIGH confidence. Pagefind version and exact behavior need verification. |
| Features | HIGH | Feature landscape is well-understood from existing site analysis and doc site best practices. |
| Architecture | MEDIUM | Single-source pattern is sound. Claude Code skill file exact behavior needs verification. |
| Pitfalls | MEDIUM | Content drift and framework migration pitfalls are well-established. Skill file-specific pitfalls need verification. |

## Gaps to Address

- **Claude Code skill file behavior**: Exact loading mechanism, path conventions, size limits, auto-loading vs manual reference. Needs phase-specific research before Phase 2.
- **Claude Code `--agent` flag**: Exact syntax, prompt file format, how it interacts with skill files. Needs research before Phase 4.
- **Pagefind current version**: Training data says ^1.3 but current version may differ. Verify before Phase 3.
- **MCP tool availability in agents**: Whether custom agents can use MCP tools like WebFetch and Context7. Needs verification before Phase 4.
- **Markdown parser choice**: `marked` vs `markdown-it` for the build script. Both work; needs quick evaluation before Phase 1.
- **Knowledge base location**: `.claude/skills/` vs `knowledge/` directory -- decision should be finalized during roadmap creation.
