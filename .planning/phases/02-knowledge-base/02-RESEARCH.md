# Phase 2: Knowledge Base - Research

**Researched:** 2026-03-15
**Domain:** Content extraction and structured markdown knowledge base creation
**Confidence:** HIGH

## Summary

Phase 2 is a content extraction and structuring phase, not a technology phase. The existing `index.html` (2343 lines) contains comprehensive content about the Claude ecosystem embedded in HTML sections and JavaScript data objects. The `ama.html` (2816 lines) contains 48 Q&A entries across 11 categories. Both need to be extracted into structured markdown files in `content/` that serve as the single source of truth for the build pipeline (already working from Phase 1) and the future agent (Phase 6).

The build pipeline is already functional: `build/build.js` reads `content/*.md` files with YAML frontmatter, renders them with `marked` + `highlight.js`, and outputs to `docs/`. All 10 topic placeholder files exist with correct frontmatter (title, slug, order, description, color, section). The task is to replace placeholder content with real extracted content while preserving the frontmatter schema.

The critical insight is that `content/` is the correct location (not `knowledge/` as originally researched in ARCHITECTURE.md). The roadmap decision changed from `knowledge/` to `content/`, and Phase 1 already established the `content/` directory with working build integration. The existing frontmatter fields (title, slug, order, description, color, section) must be preserved exactly -- the build script and nav generation depend on them.

**Primary recommendation:** Extract content from `index.html` sections and JS `details` object into the 10 existing `content/*.md` files, mine relevant Q&A from `ama.html` into each topic, and establish a consistent section template that serves both site readers and the future agent.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| KNOW-01 | Markdown knowledge files created for all 10 extension point topics | 10 placeholder files already exist in `content/` with correct frontmatter; replace placeholder body with extracted content |
| KNOW-02 | Knowledge files structured as single source of truth (site and agent both consume them) | Consistent section template (Overview, How It Works, Configuration, etc.) serves both HTML rendering and agent file-read |
| KNOW-03 | Content extracted from existing index.html into knowledge files | index.html has content in 9 HTML sections + 7 JS `details` objects; map each to the appropriate topic file |
| KNOW-04 | Content mined from existing ama.html into relevant knowledge files | 48 Q&A entries across 11 categories; map relevant entries to each topic as "FAQ" or inline content |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| marked | ^17.0.0 | Markdown to HTML | Already in use by build.js |
| gray-matter | ^4.0.3 | YAML frontmatter parsing | Already in use by build.js |
| highlight.js | ^11.11.0 | Syntax highlighting | Already in use by build.js |

### Supporting
No new libraries needed. This phase is pure content work -- writing markdown files that the existing build pipeline already processes.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual extraction | Script-based extraction | Manual is better here -- content needs human judgment for restructuring, not 1:1 HTML-to-markdown conversion |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Content File Structure (Existing)
```
content/
  agents.md          # Subagents & Agent Teams
  commands.md        # Commands / Slash Commands
  compatibility.md   # Compatibility Matrix (reference section)
  connectors.md      # Interactive Apps (NOTE: renamed from "Connectors")
  hooks.md           # Hooks
  index.md           # Landing page
  mcp.md             # MCP Servers & Connectors
  memory.md          # Memory System
  plugins.md         # Plugins
  projects.md        # Projects / CLAUDE.md
  settings.md        # Settings Hierarchy
  skills.md          # Skills
```

### Pattern 1: Consistent Section Template Per Topic
**What:** Each topic markdown file follows the same section structure to satisfy KNOW-02 (usable by both site and agent).
**When to use:** Every topic file in `content/`.

**Template:**
```markdown
---
title: [Title]
slug: [slug]
order: [number]
description: [one-liner]
color: "[hex]"
section: topics
---

# [Title]

## Overview
[What it is, why it exists, which interfaces support it]

## How It Works
[Mechanics across surfaces: Code, Chat, Cowork]

### In Claude Code
[Code-specific details]

### In Claude Chat
[Chat-specific details]

### In Claude Cowork
[Cowork-specific details]

## Configuration
[Setup steps, config files, frontmatter specs]

## Best Practices
[Patterns, tips, rules of thumb]

## Common Questions
[Extracted from ama.html -- 2-5 relevant Q&A pairs per topic]

## Related
[Links to related topics]
```

**Rationale:** This template maps directly to the content layers planned in Phase 3 (CONC-*) and Phase 4 (HOWT-*, REFR-*). The "Overview" becomes the conceptual layer. "Configuration" becomes the reference layer. "How It Works" sections per surface become the how-to layer. The agent can read any section independently.

### Pattern 2: Preserve Existing Frontmatter Schema
**What:** Keep existing frontmatter fields exactly as Phase 1 established them. The build script depends on `title`, `slug`, `order`, `section` for navigation generation. `color` and `description` are used for display.
**When to use:** Every content file edit.

**Existing frontmatter values (DO NOT CHANGE):**
```
mcp.md:        title: "MCP Servers and Connectors", slug: mcp, order: 1, section: topics
skills.md:     title: "Skills", slug: skills, order: 2, section: topics
plugins.md:    title: "Plugins", slug: plugins, order: 3, section: topics
hooks.md:      title: "Hooks", slug: hooks, order: 4, section: topics  (verify order)
agents.md:     title: "Agents", slug: agents, order: 5, section: topics (verify order)
projects.md:   title: "Projects", slug: projects, order: 6, section: topics (verify order)
connectors.md: title: "Connectors", slug: connectors, order: 7, section: topics
commands.md:   title: "Commands", slug: commands, order: 8, section: topics (verify order)
memory.md:     title: "Memory", slug: memory, order: 9, section: topics (verify order)
settings.md:   title: "Settings", slug: settings, order: 10, section: topics (verify order)
compatibility.md: section: reference
index.md:      section: root
```

### Pattern 3: Content Source Mapping
**What:** Map each source section from index.html and ama.html to the correct target content file.

**From index.html HTML sections:**

| Source Section (id) | Target File(s) | Content Type |
|---------------------|----------------|--------------|
| `#interfaces` | `index.md` | Three interfaces overview |
| `#stack` | `index.md`, `mcp.md`, `skills.md`, `plugins.md` | Customization stack layers |
| `#extensions` | All 7 topic cards -> respective files | Short descriptions |
| `#matrix` | `compatibility.md` | Already has this content |
| `#architecture` | `index.md`, `skills.md`, `plugins.md` | System overview, skill anatomy, plugin anatomy |
| `#timeline` | `index.md` | Product timeline (keep on index page) |
| `#decide` | `index.md` | Decision helper (12 scenarios) |
| `#personas` | `index.md` | Building by persona guide |
| `#bestpractices` | Distributed across topic files | Best practices per domain |
| `#reference` | `agents.md`, `memory.md`, `skills.md`, `settings.md`, `plugins.md` | Technical reference tables |

**From index.html JS `details` object (7 extension points):**

| JS Key | Target File | Rich Content |
|--------|-------------|--------------|
| `details.mcp` | `mcp.md` | How it works, per-surface usage, tool search |
| `details.skill` | `skills.md` | Progressive disclosure, frontmatter, partner skills |
| `details.plugin` | `plugins.md` | What plugins bundle, distribution, install commands |
| `details.project` | `projects.md` | CLAUDE.md, Chat projects, Cowork instructions |
| `details.agent` | `agents.md` | Built-in agents, custom agents, agent teams, memory |
| `details.hook` | `hooks.md` | 19 hook events, 4 hook types, config locations |
| `details.connector` | `connectors.md` | Interactive Apps, MCP Apps extension, available apps |

**From ama.html (48 Q&A entries across 11 categories):**

| AMA Category | Entries | Target File(s) |
|--------------|---------|----------------|
| `getting-started` (gs-*) | 6 | `index.md` (general), distributed to relevant topics |
| `claude-code` (cc-*) | 6 | `projects.md` (CLAUDE.md), `commands.md`, `settings.md` |
| `claude-chat` (ch-*) | 4 | `connectors.md`, `skills.md` |
| `cowork` (cw-*) | 3 | `plugins.md`, `connectors.md` |
| `mcp` (mcp-*) | 6 | `mcp.md` |
| `skills` (sk-*) | 4 | `skills.md` |
| `plugins` (pl-*) | 2 | `plugins.md` |
| `hooks` (hk-*) | 3 | `hooks.md` |
| `workflows` (wf-*) | 4 | Distributed across relevant topics |
| `security` (sec-*) | 5 | `settings.md`, distributed across topics |
| `troubleshooting` (ts-*) | 5 | Distributed across relevant topics |

### Anti-Patterns to Avoid
- **Dumping raw HTML into markdown:** Extract the semantic content, not the HTML structure. Convert `<code>` to backticks, `<strong>` to `**bold**`, HTML entities to characters.
- **Losing information:** Every factual claim in index.html must appear in at least one content file. The placeholders currently have "Coming Soon" -- that must all be replaced.
- **Inconsistent depth:** All 10 topic files should have roughly comparable depth. Don't write 500 lines for MCP and 50 for Commands.
- **Ignoring the "Interactive Apps" rename:** In index.html, `connectors.md` maps to "Interactive Apps" (the `connector` key in JS), NOT to "Connectors" (which is the Chat name for MCP servers). The existing placeholder has an incorrect description. Fix this.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTML-to-markdown conversion | Custom parser script | Manual extraction | Content needs restructuring, not 1:1 conversion. Only ~10 files. |
| AMA content mining | Automated Q&A extraction | Manual reading and placement | Need human judgment on which Q&A fits which topic |
| Frontmatter schema validation | Custom validator | Existing build script | Build script already validates by failing if frontmatter is missing |

**Key insight:** This phase is 95% content writing and 5% technical. The build pipeline already works. The challenge is ensuring completeness and consistency of extracted content, not building tooling.

## Common Pitfalls

### Pitfall 1: Content Loss During Extraction
**What goes wrong:** Some factual content from index.html is lost because it lives in unexpected places (inline styles, data attributes, JS objects, HTML comments).
**Why it happens:** Content is spread across 3 locations: HTML sections (lines 1035-2027), JS `details` object (lines 2048-2272), and inline elements (info-boxes, arch-boxes, pre blocks).
**How to avoid:** Use the source mapping table above. After extraction, do a line-by-line scan of index.html to verify no content was missed. Key areas often missed: info-boxes in `#stack` section, architecture diagrams in `#architecture`, Boris Cherny daily habits in `#bestpractices`.
**Warning signs:** A topic file that's shorter than 100 lines probably lost content.

### Pitfall 2: Connectors vs Interactive Apps Confusion
**What goes wrong:** The current `connectors.md` placeholder describes "Connectors" as database/service connections. But in the index.html, the `connector` extension card is actually "Interactive Apps" (Figma, Slack, Asana embedded in Chat).
**Why it happens:** "Connectors" in Claude Chat means MCP connections to services. "Interactive Apps" is a separate extension point. The placeholder file conflated them.
**How to avoid:** `connectors.md` should be about Interactive Apps (matching the index.html `connector` card and `details.connector` JS object). MCP Connectors belong in `mcp.md` (they're the Chat-side name for MCP servers).

### Pitfall 3: AMA Content Duplication
**What goes wrong:** A Q&A entry is copied verbatim into a topic file, creating redundant long-form content that doesn't fit the section template.
**Why it happens:** The AMA answers are written in a conversational Q&A format, not a reference format.
**How to avoid:** Extract the *facts* from Q&A answers and integrate them into the appropriate sections. Only use the Q&A format in a "Common Questions" section at the bottom of each file, and only for genuinely frequently-asked questions (2-5 per topic max).

### Pitfall 4: Breaking the Build
**What goes wrong:** Editing frontmatter fields causes the build to fail or navigation to break.
**Why it happens:** The build script uses `section` field for nav grouping and `slug` for URL generation.
**How to avoid:** Never change frontmatter field names or the `section`/`slug` values. Run `npm run build` after each file edit to verify.

### Pitfall 5: Markdown Rendering Issues
**What goes wrong:** Complex content from index.html (ASCII diagrams, comparison tables, nested code blocks) renders incorrectly in the build output.
**Why it happens:** The index.html uses `<pre>` blocks for architecture diagrams and ASCII art. These need careful conversion to markdown fenced code blocks or custom formatting.
**How to avoid:** Use fenced code blocks (triple backticks) for ASCII diagrams. Use standard markdown tables (pipe syntax) for comparison data. Test by running `npm run build` and checking the output.

## Code Examples

### Existing Frontmatter Schema (from working content files)
```yaml
# Source: content/mcp.md (Phase 1 output)
---
title: MCP Servers and Connectors
slug: mcp
order: 1
description: The Model Context Protocol connects Claude to external tools and data sources
color: "#fb923c"
section: topics
---
```

### Content Extraction Example: MCP Details Object -> Markdown
```markdown
# Source: index.html lines 2049-2078 (details.mcp JS object)
# Target: content/mcp.md

## Overview

The Model Context Protocol is an open standard (JSON-RPC 2.0) connecting Claude to
external tools and services. In Claude Chat these appear as "Connectors" (50+ pre-built).
In Claude Code they're configured via CLI or config files. Donated to the Linux
Foundation's Agentic AI Foundation in Dec 2025.

## How It Works

- Server exposes tools via JSON-RPC over stdio or HTTP
- Claude discovers available tools at session start (or on-demand via Tool Search)
- Claude calls tools as needed -- results flow back into context
- MCP Apps extension enables interactive UI rendering (sandboxed iframes)

### In Claude Code

- `claude mcp add my-server -- npx my-mcp-server`
- Scopes: local, project (`.mcp.json`), user (`~/.claude.json`), managed (org-wide)
- Supports OAuth 2.0, custom auth headers, env var expansion (`${MY_TOKEN}`)
- Tool Search: auto-defers loading when tools exceed 10% context (`ENABLE_TOOL_SEARCH=auto:N`)
- Subagent-scoped: agents can declare their own MCP servers in frontmatter
- Precedence: Subagent > Project > User > Managed

### In Claude Chat

- Called **Connectors** -- Settings > Connectors
- 50+ pre-built: Jira, Confluence, Slack, Asana, Linear, Sentry, etc.
- **Interactive Apps**: live Figma, Slack, Canva embedded in conversations

### In Claude Cowork

- Connectors configured in Customize menu
- Bundled within plugins (e.g., Salesforce connector in Sales plugin)
- Users control which connectors are active and internet access
```

### AMA Mining Example: Integrating Q&A Into Topic File
```markdown
# Source: ama.html entry mcp-02 (line ~1286)
# Target: content/mcp.md -> "Configuration" section (integrate facts)
#         content/mcp.md -> "Common Questions" section (keep as Q&A)

## Configuration

### .mcp.json Format

Configure MCP servers in your project's `.mcp.json` file:

\`\`\`json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
\`\`\`

## Common Questions

**How do I configure MCP servers in Claude Code?**

Three approaches: CLI (`claude mcp add`), project config (`.mcp.json`),
or user config (`~/.claude.json`). Project-level config is recommended
for team sharing since `.mcp.json` is checked into git.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Monolithic index.html | Multi-page build from markdown | Phase 1 (2026-03-15) | Content now lives in `content/*.md` files |
| Placeholder content | Real extracted content | Phase 2 (this phase) | Knowledge files become the source of truth |

**Deprecated/outdated:**
- The `knowledge/` directory path from ARCHITECTURE.md research was not adopted. Content lives in `content/` per Phase 1 implementation.
- The original research suggested 7 extension points. The current project has 10 topics: MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors (Interactive Apps), Commands, Memory, Settings.

## Open Questions

1. **Connectors naming conflict**
   - What we know: index.html uses "Interactive Apps" for the `connector` card, but the content file is named `connectors.md`. "Connectors" in Claude Chat means MCP connections.
   - What's unclear: Should the file be renamed to `interactive-apps.md`? Or keep `connectors.md` but update the content to be about Interactive Apps?
   - Recommendation: Keep the filename `connectors.md` (changing it would break existing build output URLs) but update the title and content to "Interactive Apps" matching the source material. The slug `connectors` is fine -- URLs don't need to match titles exactly.

2. **Commands and Memory content depth**
   - What we know: index.html has limited dedicated content for Commands and Memory as standalone topics. Commands are mentioned in slash commands context. Memory is covered in the Technical Reference section.
   - What's unclear: Is there enough source material for full standalone pages?
   - Recommendation: Extract what exists. These files may be shorter than others (80-120 lines vs 150-250 for MCP/Skills). Phase 3 will expand them with original conceptual content.

3. **Decision helper and persona content placement**
   - What we know: The `#decide` section (12 scenarios) and `#personas` section (3 persona guides) are cross-cutting -- they span multiple topics.
   - What's unclear: Should these go in `index.md` or be split into their own content files?
   - Recommendation: Keep in `index.md` for now. Phase 5 (DECT-01, DECT-02, DECT-03) will create proper decision guidance pages. Duplicating now creates drift.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner (node:test) |
| Config file | none -- tests specified in package.json scripts |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| KNOW-01 | 10 topic markdown files exist with real content (not placeholder) | integration | `node --test tests/test-knowledge-content.js -x` | No -- Wave 0 |
| KNOW-02 | Knowledge files follow consistent structure template | integration | `node --test tests/test-knowledge-structure.js -x` | No -- Wave 0 |
| KNOW-03 | Content from index.html preserved (key facts present) | integration | `node --test tests/test-content-completeness.js -x` | No -- Wave 0 |
| KNOW-04 | AMA content incorporated (common questions sections exist) | integration | `node --test tests/test-ama-content.js -x` | No -- Wave 0 |
| BUILD | Build succeeds with new content files | smoke | `npm run build` | Yes (test-build.js) |

### Sampling Rate
- **Per task commit:** `npm run build && npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/test-knowledge-content.js` -- verifies all 10 topic files have >80 lines of content (not placeholder "Coming Soon")
- [ ] `tests/test-knowledge-structure.js` -- verifies each topic file has required sections (Overview, How It Works, Configuration or equivalent)
- [ ] `tests/test-content-completeness.js` -- verifies key facts from index.html appear in content files (spot-check: MCP transport types, Skill frontmatter fields, Hook event list)
- [ ] `tests/test-ama-content.js` -- verifies at least 5 topic files have a "Common Questions" section with content

## Sources

### Primary (HIGH confidence)
- `index.html` (project root) -- 2343 lines, all content sections and JS detail objects examined
- `ama.html` (project root) -- 2816 lines, 48 Q&A entries across 11 categories examined
- `build/build.js` -- build pipeline reads `content/*.md`, parses frontmatter, outputs to `docs/`
- `content/*.md` -- 12 existing placeholder files with established frontmatter schema
- `.planning/REQUIREMENTS.md` -- KNOW-01 through KNOW-05 requirements

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md` -- recommended `knowledge/` directory (overridden by Phase 1 implementation using `content/`)
- `.planning/research/SUMMARY.md` -- overall project research and phase rationale
- `.planning/STATE.md` -- project decisions including `knowledge/` -> `content/` migration path

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, existing pipeline proven
- Architecture: HIGH -- content structure, frontmatter schema, and build pipeline all established in Phase 1
- Content mapping: HIGH -- complete audit of source files performed, all sections and JS objects catalogued
- Pitfalls: HIGH -- based on direct examination of source material and known naming conflicts

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable -- content extraction, not moving target)
