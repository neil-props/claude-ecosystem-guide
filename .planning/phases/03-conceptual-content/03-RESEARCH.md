# Phase 3: Conceptual Content - Research

**Researched:** 2026-03-15
**Domain:** Content writing for conceptual overviews, tab-based content layer UI integration
**Confidence:** HIGH

## Summary

Phase 3 enhances the 10 existing topic markdown files (already populated with extracted content in Phase 2) by restructuring them with a tab-based content layer UI and ensuring each page has a polished conceptual overview section. The tab infrastructure (CSS + JS) already exists from Phase 1.1 Design System -- the `.tabs`, `.tab-group`, `.tab-btn`, and `.tab-panel` components are implemented in `docs/assets/style.css` and `docs/assets/main.js`. A working demo exists on the index page. The task is to wrap existing content in tab panels and write/enhance the "Concept" tab content to meet CONC-01 through CONC-10 requirements.

The current content files in `content/` follow a flat structure: Overview, How It Works, Configuration, Best Practices, Common Questions, Related. Phase 3 restructures each file to use the tab UI with three panels: **Concept** (the conceptual overview -- the Phase 3 deliverable), **How-To** (placeholder linking to Phase 4 content), and **Reference** (placeholder linking to Phase 4 content). The existing content already contains solid overviews; the work is primarily: (1) wrapping content in HTML tab markup within markdown files, (2) deepening the conceptual "what is this, when to use it, how it fits" narrative, (3) ensuring cross-links between tabs and to other topic pages, and (4) meeting the specific per-topic requirements (MCP transports, skills frontmatter, etc.).

Since content files are markdown processed by `marked`, and `marked` passes through raw HTML, the tab markup can be embedded directly as HTML within the `.md` files. This is already demonstrated in `content/index.md` where the tab demo uses inline HTML div elements.

**Primary recommendation:** Restructure each of the 10 topic markdown files to use the existing tab UI component (HTML divs within markdown), placing the enhanced conceptual overview in the "Concept" tab panel and creating placeholder panels for "How-To" and "Reference" that link forward to Phase 4. Split the work into 2 waves: Wave 1 covers the 5 most complex topics (MCP, Skills, Plugins, Hooks, Agents) and Wave 2 covers the remaining 5 (Projects, Connectors, Commands, Memory, Settings).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONC-01 | MCP overview -- what it is, when to use it, transports (stdio, SSE, streamable HTTP) | Existing mcp.md already covers transports in a table; enhance with deeper "what is it" narrative, when-to-use guidance, and ecosystem context (AAIF, vendor-neutral). Verify streamable HTTP is positioned as the current standard replacing SSE. |
| CONC-02 | Skills overview -- what they are, frontmatter, when to use vs other extension points | Existing skills.md has strong overview and frontmatter section; enhance with clearer "when to use skills vs agents vs hooks vs commands" decision guidance in conceptual narrative |
| CONC-03 | Plugins overview -- what they are, how they bundle skills, distribution | Existing plugins.md explains bundling well; enhance with distribution story (npm, git, manual) and "when to build a plugin vs just share skills" |
| CONC-04 | Hooks overview -- what they are, lifecycle events, use cases | Existing hooks.md has comprehensive event table; enhance conceptual framing of "deterministic automation outside the agentic loop" |
| CONC-05 | Agents overview -- custom agents, agent files, when to use | Existing agents.md covers built-in and custom agents; enhance with "when agents vs skills" decision guidance |
| CONC-06 | Projects overview -- CLAUDE.md hierarchy, project memory | Existing projects.md covers hierarchy table; enhance with conceptual narrative about persistent context across sessions |
| CONC-07 | Connectors overview -- what they are, available connectors | Existing connectors.md covers Interactive Apps; enhance with clearer "what are connectors" framing distinct from MCP |
| CONC-08 | Commands overview -- slash commands, built-in vs custom | Existing commands.md covers the skills migration story; enhance conceptual overview of command types |
| CONC-09 | Memory system overview -- how memory works, persistence, types | Existing memory.md has 4-layer architecture; enhance with conceptual narrative about persistence and when to use each layer |
| CONC-10 | Settings hierarchy overview -- resolution order, scopes, overrides | Existing settings.md has 5-level precedence table; enhance with conceptual "why this matters" narrative |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| marked | ^17.0.0 | Markdown to HTML | Already in use by build.js; passes through raw HTML in markdown |
| gray-matter | ^4.0.3 | YAML frontmatter parsing | Already in use by build.js |
| highlight.js | ^11.11.0 | Syntax highlighting | Already in use by build.js |

### Supporting
No new libraries needed. This phase is pure content work using the existing build pipeline and UI components.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline HTML tabs in markdown | Custom marked plugin for tab syntax | Inline HTML works now, no build changes needed; a plugin would be cleaner but adds complexity for no functional gain |
| Single flat content | Separate page-per-layer (concept.html, howto.html, reference.html) | Tabs keep everything on one page, reducing navigation friction; separate pages would be more SEO-friendly but fragment the reading experience |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Content File Structure (Enhanced)
```
content/
  mcp.md             # Tab-wrapped: Concept (enhanced) + How-To (placeholder) + Reference (placeholder)
  skills.md           # Same pattern
  plugins.md          # Same pattern
  hooks.md            # Same pattern
  agents.md           # Same pattern
  projects.md         # Same pattern
  connectors.md       # Same pattern
  commands.md         # Same pattern
  memory.md           # Same pattern
  settings.md         # Same pattern
```

### Pattern 1: Tab-Wrapped Content Structure
**What:** Each topic markdown file uses inline HTML to wrap content sections in the tab UI component.
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

<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

## Overview

[Enhanced conceptual overview: what it is, when to use it, how it fits]

## How It Works

[Existing content, potentially reorganized]

## When to Use [Feature]

[Decision guidance specific to this extension point]

  </div>
  <div class="tab-panel" data-tab-panel="howto">

## How-To Guides

_Step-by-step guides are coming in Phase 4._

- [How to set up X](#) -- _coming soon_
- [How to configure Y](#) -- _coming soon_

  </div>
  <div class="tab-panel" data-tab-panel="reference">

## Technical Reference

_Detailed reference specs are coming in Phase 4._

- [Configuration schema](#) -- _coming soon_
- [All fields and options](#) -- _coming soon_

  </div>
</div>
```

### Pattern 2: Markdown Inside HTML Tab Panels
**What:** The `marked` library passes through raw HTML but also processes markdown within HTML blocks when there are blank lines separating the markdown from the HTML tags.
**When to use:** When writing content inside tab panels.
**Critical detail:** There must be a blank line between the opening HTML `<div>` tag and any markdown content for `marked` to process the markdown correctly. Without the blank line, `marked` treats everything as raw HTML and skips markdown rendering.

**Example:**
```markdown
<div class="tab-panel active" data-tab-panel="concept">

## This heading WILL be processed as markdown

Because there is a blank line after the div tag.

- Bullet points work
- **Bold** works
- `code` works

</div>
```

**Anti-pattern (broken):**
```markdown
<div class="tab-panel active" data-tab-panel="concept">
## This heading will NOT be processed
Because there is no blank line after the div tag.
</div>
```

### Pattern 3: Conceptual Overview Structure
**What:** A consistent narrative structure for the "Concept" tab across all 10 topics.
**When to use:** Every concept tab panel.

**Structure:**
1. **Opening paragraph** -- What it is in one sentence, followed by the "USB-C analogy" style mental model
2. **Ecosystem context** -- Where it fits: which Claude surfaces support it (Code/Chat/Cowork), when it launched, who maintains it
3. **Core capabilities** -- What it can do (3-5 bullet points)
4. **How It Works** -- Technical explanation with diagrams/tables
5. **When to Use** -- Clear decision guidance ("Use X when...", "Don't use X when...")
6. **Relationship to other extension points** -- How it connects to the other 9 topics

### Anti-Patterns to Avoid
- **Content duplication between tabs:** Each tab should have distinct content. The concept tab explains "what and why"; the how-to tab walks through "how"; the reference tab documents "everything."
- **Orphan tab panels:** Every tab button must have a corresponding panel. Missing panels cause JS errors.
- **Nested tabs:** Do not nest `.tabs` containers inside `.tab-panel` divs -- the JS event delegation does not support nesting.
- **Mixing markdown heading levels inside tabs:** Keep tab content starting at h2 (##) since the page title is h1. Do not use h1 inside tab panels.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab switching UI | Custom JS toggle logic | Existing `.tabs` component (main.js lines 107-128) | Already implemented, tested, themed for both dark/light |
| Content layer navigation | Custom accordion or sidebar | Tab buttons with `data-tab` attributes | Design system already defines the pattern; users expect tabs for layered content |
| Responsive tab overflow | Custom scroll handlers | CSS `overflow-x: auto` on `.tab-group` | Already handled in style.css line 741 |
| Syntax highlighting in tabs | Client-side highlighting | Build-time hljs via marked-highlight | Already configured in build.js; works inside tab panels |

**Key insight:** All UI infrastructure for this phase already exists from Phase 1.1. This is purely a content and content-structure phase.

## Common Pitfalls

### Pitfall 1: Markdown not rendering inside HTML divs
**What goes wrong:** Content inside `<div>` tags appears as raw text instead of rendered HTML.
**Why it happens:** `marked` requires a blank line between an HTML block-level element and markdown content to trigger markdown processing within the block.
**How to avoid:** Always leave a blank line after opening `<div>` tags and before closing `</div>` tags when the content between them should be processed as markdown.
**Warning signs:** Headings showing as `##` text, bold showing as `**text**`, bullet points showing as `- text`.

### Pitfall 2: Tab panel content visible before JS loads
**What goes wrong:** All tab panels flash visible momentarily before JavaScript initializes and hides inactive panels.
**Why it happens:** The CSS rule `.tab-panel { display: none; }` and `.tab-panel.active { display: block; }` handles this, but only if the `active` class is correctly set in the HTML.
**How to avoid:** Always set `class="tab-panel active"` on the first panel and just `class="tab-panel"` on others. The CSS handles initial visibility; JS handles switching.
**Warning signs:** All three tab panels visible simultaneously on page load.

### Pitfall 3: Broken anchor links inside tab panels
**What goes wrong:** Anchor links to headings inside inactive tab panels don't scroll to the right location.
**Why it happens:** `display: none` elements have no scroll position. When a user clicks an anchor link to a heading in a hidden panel, the browser can't scroll to it.
**How to avoid:** For Phase 3, accept this limitation. In Phase 5, consider adding JS that activates the correct tab when an anchor link targets content inside a hidden panel.
**Warning signs:** Clicking a heading link in the page's table of contents does nothing or scrolls to the wrong place.

### Pitfall 4: Content bloat in the concept tab
**What goes wrong:** The conceptual overview becomes a full tutorial instead of a "what and why" explanation.
**Why it happens:** Temptation to include step-by-step instructions in the concept tab.
**How to avoid:** Keep concept tab focused on understanding: what is it, when to use it, how it fits. Move all "how to do X" content to the how-to tab (Phase 4).
**Warning signs:** Concept tab content exceeds ~300 lines of markdown for a single topic.

### Pitfall 5: Inconsistent tab labels across pages
**What goes wrong:** Some pages use "Concept/How-To/Reference" while others use "Overview/Guide/Spec" or other variations.
**Why it happens:** Different authors or sessions using different terminology.
**How to avoid:** Use exactly these three tab labels on every page: **Concept**, **How-To**, **Reference**. Consistent labels build user muscle memory.
**Warning signs:** Tabs looking different on different pages.

## Code Examples

Verified patterns from the existing codebase:

### Tab UI Markup (from content/index.md)
```html
<!-- Source: content/index.md lines 104-119 -->
<div class="tabs">
  <div class="tab-group">
    <button class="tab-btn active" data-tab="concept">Concept</button>
    <button class="tab-btn" data-tab="howto">How-To</button>
    <button class="tab-btn" data-tab="reference">Reference</button>
  </div>
  <div class="tab-panel active" data-tab-panel="concept">

[Markdown content here -- note the blank line after the div]

  </div>
  <div class="tab-panel" data-tab-panel="howto">

[Markdown content here]

  </div>
  <div class="tab-panel" data-tab-panel="reference">

[Markdown content here]

  </div>
</div>
```

### Tab CSS (from docs/assets/style.css)
```css
/* Source: docs/assets/style.css lines 735-764 */
.tab-group {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border);
  margin-bottom: var(--space-5);
  overflow-x: auto;
}
.tab-btn {
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
  white-space: nowrap;
}
.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 600;
}
.tab-panel { display: none; }
.tab-panel.active { display: block; }
```

### Tab Switching JS (from docs/assets/main.js)
```javascript
// Source: docs/assets/main.js lines 106-128
document.addEventListener('click', function(e) {
  var tabBtn = e.target.closest('.tab-btn');
  if (!tabBtn) return;

  var group = tabBtn.closest('.tabs');
  if (!group) return;

  var tabId = tabBtn.getAttribute('data-tab');

  // Deactivate all tabs in this group
  group.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  group.querySelectorAll('.tab-panel').forEach(function(panel) {
    panel.classList.remove('active');
  });

  // Activate selected tab
  tabBtn.classList.add('active');
  var panel = group.querySelector('[data-tab-panel="' + tabId + '"]');
  if (panel) panel.classList.add('active');
});
```

### Callout Usage (for "coming soon" notices)
```markdown
> [!INFO]
> How-to guides for this topic are coming in Phase 4. Check back soon!
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Flat single-section content | Tab-layered content (Concept/How-To/Reference) | Phase 3 (now) | Users can jump to the content depth they need |
| SSE as primary remote MCP transport | Streamable HTTP as recommended transport | Mid-2025 | Content must position streamable HTTP as current, SSE as legacy |
| Custom commands (.claude/commands/) | Skills (.claude/skills/) as recommended | Oct 2025 | Commands page must frame skills as the recommended approach |

**Deprecated/outdated:**
- SSE transport: Still works but being superseded by streamable HTTP. Content should mention SSE for completeness but recommend streamable HTTP.
- Custom commands: Still work for backward compatibility but skills are the recommended approach. Commands page must reflect this.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner (node --test) |
| Config file | None -- uses direct file paths |
| Quick run command | `node --test build/test-build.js` |
| Full suite command | `node --test build/test-build.js` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONC-01 | MCP page has conceptual overview with 3 transport types | content check | `grep -c "stdio\|streamable HTTP\|SSE" content/mcp.md` | N/A -- content validation |
| CONC-02 | Skills page has frontmatter explanation and comparison guidance | content check | `grep -c "frontmatter\|vs.*agent\|vs.*hook" content/skills.md` | N/A -- content validation |
| CONC-03 | Plugins page explains bundling and distribution | content check | `grep -c "bundle\|distribution\|install" content/plugins.md` | N/A -- content validation |
| CONC-04 | Hooks page explains lifecycle events and use cases | content check | `grep -c "lifecycle\|event\|deterministic" content/hooks.md` | N/A -- content validation |
| CONC-05 | Agents page explains custom agents and when to use | content check | `grep -c "agent file\|custom agent\|isolated context" content/agents.md` | N/A -- content validation |
| CONC-06 | Projects page explains CLAUDE.md hierarchy | content check | `grep -c "hierarchy\|CLAUDE.md\|global.*project" content/projects.md` | N/A -- content validation |
| CONC-07 | Connectors page explains what connectors are | content check | `grep -c "connector\|Interactive App" content/connectors.md` | N/A -- content validation |
| CONC-08 | Commands page explains slash commands | content check | `grep -c "slash command\|built-in\|custom" content/commands.md` | N/A -- content validation |
| CONC-09 | Memory page explains persistence and types | content check | `grep -c "layer\|persist\|CLAUDE.md\|auto-memory" content/memory.md` | N/A -- content validation |
| CONC-10 | Settings page explains resolution order | content check | `grep -c "precedence\|resolution\|override\|scope" content/settings.md` | N/A -- content validation |
| ALL | Tab UI wraps content on all 10 pages | smoke | `grep -c "tab-panel" content/mcp.md content/skills.md content/plugins.md content/hooks.md content/agents.md content/projects.md content/connectors.md content/commands.md content/memory.md content/settings.md` | N/A -- structural validation |
| ALL | Build succeeds with tab-wrapped content | integration | `node build/build.js` | Existing build script |

### Sampling Rate
- **Per task commit:** `node build/build.js && grep -l "tab-panel" content/*.md | wc -l`
- **Per wave merge:** `node --test build/test-build.js && node build/build.js`
- **Phase gate:** Full build green, all 10 topic pages have tab-wrapped content, visual spot-check in browser

### Wave 0 Gaps
None -- existing build infrastructure and test script cover all phase requirements. Content validation is manual (reviewing written content for accuracy and completeness).

## Open Questions

1. **Markdown rendering inside HTML div blocks**
   - What we know: The `marked` library passes through HTML and can process markdown within HTML blocks when separated by blank lines. This is demonstrated in `content/index.md`.
   - What's unclear: Whether complex markdown (nested lists, tables, code blocks with backtick fences) renders correctly inside `<div class="tab-panel">` blocks. The index.md demo only has simple paragraph text.
   - Recommendation: Test with a single complex topic file (mcp.md) first before restructuring all 10. If markdown doesn't render correctly inside divs, may need to use raw HTML for structured content within tab panels, or adjust the marked configuration.

2. **Existing content sections outside tabs**
   - What we know: Current files have sections like "Best Practices", "Common Questions", "Related" that don't fit cleanly into Concept/How-To/Reference.
   - What's unclear: Whether these should go inside the Concept tab, remain outside the tab structure, or be distributed across tabs.
   - Recommendation: Place "Best Practices" and "Common Questions" inside the Concept tab (they help users understand the feature). Place "Related" outside the tab structure as a page-level footer. "Configuration" sections move to the Reference tab in Phase 4 (placeholder for now). "How It Works" subsections that are about Claude Code/Chat/Cowork surface availability stay in Concept.

3. **Content depth for "coming soon" placeholder tabs**
   - What we know: Phase 3 focuses on the Concept tab. How-To and Reference tabs will be populated in Phase 4.
   - What's unclear: How much placeholder content the How-To and Reference tabs should have.
   - Recommendation: Each placeholder tab gets: (1) a brief description of what will appear there, (2) a bulleted list of planned guides/specs (from HOWT-* and REFR-* requirements), and (3) a callout noting "coming soon." This gives users a preview of what's coming and helps the Phase 4 planner see what's expected.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `content/*.md` (10 topic files), `build/build.js`, `docs/assets/style.css`, `docs/assets/main.js`
- Existing codebase: `content/index.md` tab demo (lines 104-119) -- verified working tab markup in markdown
- `.planning/phases/1.1-design-system/1.1-CONTEXT.md` -- design system decisions including tab UI

### Secondary (MEDIUM confidence)
- [Claude Code MCP Docs](https://code.claude.com/docs/en/mcp) -- MCP transport types and configuration
- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills) -- Skills frontmatter format and best practices
- [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) -- Anthropic official skill authoring guidance

### Tertiary (LOW confidence)
- WebSearch results on streamable HTTP transport positioning vs SSE -- multiple sources agree on direction but exact deprecation timeline unverified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries needed, all infrastructure exists
- Architecture: HIGH -- tab UI component verified working in codebase, markdown-in-HTML pattern verified in index.md
- Content structure: HIGH -- existing content files are well-structured, enhancement scope is clear
- Pitfalls: HIGH -- markdown-in-HTML rendering is the main risk, mitigated by existing working demo
- Content accuracy: MEDIUM -- MCP transport status and skills frontmatter verified with official docs, but ecosystem is fast-moving

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (content requirements are stable; ecosystem details may shift)
