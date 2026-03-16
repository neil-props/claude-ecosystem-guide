# Phase 5: Decision Guidance and Recipes - Research

**Researched:** 2026-03-16
**Domain:** Interactive decision wizard, comparison tables, end-to-end recipes, full-text search (static site)
**Confidence:** HIGH

## Summary

Phase 5 adds three distinct feature categories to the existing static site: (1) an interactive decision wizard and comparison tables to help users choose the right extension point, (2) five end-to-end recipe walkthroughs for common workflows, and (3) full-text search across all content pages using Pagefind.

The site is built with a markdown-to-HTML pipeline (marked + gray-matter + highlight.js), uses vanilla JS with no framework, and deploys to GitHub Pages. All new content follows the existing pattern: markdown files in `content/` with YAML frontmatter, built by `build/build.js` into `docs/`. The sidebar navigation groups pages by `section` frontmatter field (currently `topics`, `reference`, and `root`). New pages for recipes and the decision wizard will use new section values to create additional nav groups.

**Primary recommendation:** Build the decision wizard as a new standalone page with vanilla JS state machine logic (no library needed for a simple branching flow). Use Pagefind v1.4.0 for search -- it indexes the built HTML output and requires zero server infrastructure. Recipes are standard content pages with a new `section: guides` frontmatter value.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SITE-02 | Full-text search across all content pages | Pagefind v1.4.0 -- indexes static HTML, provides both default UI and custom JS API, CSS custom properties for theming |
| DECT-01 | Interactive decision wizard -- "What are you trying to do?" flow | Vanilla JS state machine in `main.js`, new content page `decision-wizard.md` with HTML wizard markup |
| DECT-02 | Per-topic decision guidance integrated into each topic page | Already partially done (Phase 3 added "When to Use" sections); add structured "decision" callout or section to Concept tabs |
| DECT-03 | Comparison tables -- Skill vs Agent vs Command, MCP vs Plugin, Hook vs Skill | Standard HTML tables in a new comparison page or embedded in decision wizard page, using existing table styles |
| RECP-01 | Recipe: Build a deployment skill | New content page `content/recipe-deployment-skill.md` with `section: guides` |
| RECP-02 | Recipe: Set up a CRM enrichment project with MCP | New content page `content/recipe-crm-mcp.md` with `section: guides` |
| RECP-03 | Recipe: Create your first hook (pre-commit linting) | New content page `content/recipe-pre-commit-hook.md` with `section: guides` |
| RECP-04 | Recipe: Build a custom agent for your team | New content page `content/recipe-custom-agent.md` with `section: guides` |
| RECP-05 | Recipe: Configure settings hierarchy for a monorepo | New content page `content/recipe-monorepo-settings.md` with `section: guides` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Pagefind | 1.4.0 | Full-text static site search | De facto standard for static site search; zero server, indexes HTML output, ~100KB total client bundle |
| Vanilla JS | ES2020+ | Decision wizard interactivity | Project constraint: no frameworks; simple branching logic needs no library |
| marked | 17.x | Markdown to HTML (existing) | Already in project pipeline |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pagefind (npm) | 1.4.0 | CLI indexer as dev dependency | Run `npx pagefind --site docs` after build to generate search index |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pagefind | Lunr.js / Fuse.js | Lunr/Fuse require manual index generation and ship entire index to client; Pagefind chunks indexes for bandwidth efficiency |
| Vanilla wizard | Wizard-JS library | Adds dependency for what is essentially a 5-step branching flow; vanilla is simpler |

**Installation:**
```bash
npm install -D pagefind
```

**Post-build indexing command (add to package.json scripts):**
```bash
npx pagefind --site docs
```

## Architecture Patterns

### New Content Files
```
content/
  decision-wizard.md     # DECT-01: Interactive wizard page
  comparisons.md         # DECT-03: Comparison tables page
  recipe-deployment-skill.md     # RECP-01
  recipe-crm-mcp.md             # RECP-02
  recipe-pre-commit-hook.md     # RECP-03
  recipe-custom-agent.md        # RECP-04
  recipe-monorepo-settings.md   # RECP-05
```

### Frontmatter Sections for Navigation
```yaml
# Decision tools pages
section: tools       # Groups under "Decision Tools" in sidebar
order: 1             # Within the section

# Recipe pages
section: guides      # Groups under "Guides" in sidebar
order: 1             # Within the section
```

### Build System Changes Required
The `generateNav()` function in `build/build.js` currently handles `topics` and `reference` sections. It needs to be extended to handle `tools` and `guides` sections. The pattern is already established -- just add new section blocks.

### Pattern 1: Decision Wizard State Machine
**What:** A simple branching questionnaire that walks users through choices and recommends an extension point.
**When to use:** For DECT-01 -- the interactive wizard.
**Example:**
```javascript
// Decision wizard state machine (add to main.js)
const wizardSteps = {
  start: {
    question: "What are you trying to do?",
    options: [
      { label: "Connect Claude to an external tool or API", next: "external-tool" },
      { label: "Teach Claude a repeatable process", next: "repeatable" },
      { label: "Run code automatically at certain points", next: "automation" },
      { label: "Configure how Claude behaves in my project", next: "configure" },
      { label: "Create a specialized AI workflow", next: "specialized" }
    ]
  },
  "external-tool": {
    question: "What kind of external integration?",
    options: [
      { label: "I want to build/host my own server", result: "mcp" },
      { label: "I want a pre-built one-click integration", result: "connectors" },
      { label: "I want to bundle tools as a distributable package", result: "plugins" }
    ]
  },
  // ... more steps leading to results
};

function renderWizardStep(stepId) {
  const step = wizardSteps[stepId];
  const container = document.getElementById('wizard');
  // Render question + option buttons
  // On click: either navigate to next step or show result
}
```

### Pattern 2: Pagefind Integration
**What:** Full-text search using Pagefind's custom JS API (not default UI) for design consistency.
**When to use:** For SITE-02 -- search that matches the Props design system.
**Example:**
```javascript
// Custom search UI using Pagefind JS API
const pagefind = await import("/pagefind/pagefind.js");

async function performSearch(query) {
  const search = await pagefind.debouncedSearch(query, {}, 300);
  if (search === null) return; // superseded by newer search
  const results = await Promise.all(
    search.results.slice(0, 10).map(r => r.data())
  );
  renderResults(results); // Each result has: url, excerpt (with <mark> tags), meta.title
}
```

### Pattern 3: Recipe Page Structure
**What:** Each recipe follows a consistent template: Goal, Prerequisites, Steps, Verify, Next Steps.
**When to use:** For all RECP-* requirements.
**Example frontmatter and structure:**
```markdown
---
title: "Recipe: Build a Deployment Skill"
slug: recipe-deployment-skill
order: 1
description: End-to-end walkthrough of building a deployment skill for Claude Code
section: guides
---

# Build a Deployment Skill

## What You Will Build
Brief description of the end result.

## Prerequisites
- Claude Code installed
- Basic familiarity with skills (link to skills topic page)

## Step 1: Create the Skill Directory
...

## Step 2: Write the Frontmatter
...

## Verify It Works
...

## Next Steps
- Link to related topics
- Link to other recipes
```

### Pattern 4: Per-Topic Decision Guidance (DECT-02)
**What:** Add a "When to Use This" or "Decision Guide" section to each topic page's Concept tab.
**When to use:** For DECT-02 -- integrating decision guidance into existing pages.
**Note:** Phase 3 already added "When to Use" h2 sections in Concept tabs. DECT-02 may require enhancing these with more structured guidance (comparison snippets, "use X instead if..." callouts).

### Anti-Patterns to Avoid
- **Over-engineering the wizard:** Do not build a generic wizard framework. The decision tree has ~15-20 nodes max. A simple object-based state machine is sufficient.
- **Using Pagefind's default UI unstyled:** The default PagefindUI ships its own CSS that will clash with the Props design system. Use the JS API to build a custom search UI, or heavily override Pagefind's CSS variables.
- **Duplicating content in recipes:** Recipes should link to topic pages for detailed reference, not repeat the same configuration schemas inline.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full-text search indexing | Custom search index builder | Pagefind CLI | Handles stemming, chunking, ranking, multilingual support, relevance scoring |
| Search result excerpts | Custom excerpt generation | Pagefind's excerpt field with `<mark>` tags | Automatically highlights matching terms, handles context windowing |
| Debounced search | Custom debounce wrapper | `pagefind.debouncedSearch()` | Built-in, handles race conditions (returns null for superseded queries) |

**Key insight:** Search is the only component in this phase that warrants a library. The wizard, comparison tables, and recipes are all content + minimal JS that the existing stack handles perfectly.

## Common Pitfalls

### Pitfall 1: Pagefind Indexing Before Build
**What goes wrong:** Running `npx pagefind --site docs` before `npm run build` indexes stale HTML.
**Why it happens:** Pagefind indexes the output directory. If it runs before the build, it picks up old content.
**How to avoid:** Chain commands: `npm run build && npx pagefind --site docs`. Add a combined script to package.json.
**Warning signs:** Search returns results for deleted or renamed pages.

### Pitfall 2: Pagefind Assets Not in Git
**What goes wrong:** The `docs/pagefind/` directory generated by the indexer is ephemeral build output. If committed to git, it bloats the repo. If not committed, GitHub Pages won't have it.
**Why it happens:** GitHub Pages serves from the `docs/` directory, so search assets need to be there at deploy time.
**How to avoid:** Either (a) run Pagefind in a GitHub Actions workflow before deploy, or (b) commit the pagefind output to docs/ as part of the build. Given the project uses direct GitHub Pages from `docs/`, option (b) is simpler -- the `docs/pagefind/` directory should be committed.
**Warning signs:** Search works locally but not on deployed site.

### Pitfall 3: Sidebar Indexing by Pagefind
**What goes wrong:** Pagefind indexes sidebar navigation text, leading to every page matching nav-link text.
**Why it happens:** By default Pagefind indexes all body content including navigation.
**How to avoid:** Add `data-pagefind-body` to the `<article>` element in the page template, or add `data-pagefind-ignore` to the `<aside class="sidebar">` element.
**Warning signs:** Searching for "MCP" returns all 12 pages because every sidebar has an "MCP" nav link.

### Pitfall 4: Decision Wizard State Not Preserved
**What goes wrong:** User navigates back with browser button and loses wizard progress.
**Why it happens:** Wizard state is only in JS memory.
**How to avoid:** Store wizard state in URL hash or sessionStorage. URL hash is preferred (shareable, bookmarkable).
**Warning signs:** Users report losing progress when using browser back button.

### Pitfall 5: Recipe Content Goes Stale
**What goes wrong:** Recipes reference specific config formats or CLI commands that change as Claude Code evolves.
**Why it happens:** Recipes are concrete (specific code, specific commands) so they break when APIs change.
**How to avoid:** Each recipe should link to the canonical reference page for config schemas rather than embedding full schemas inline. Keep recipes focused on the workflow, not the reference.
**Warning signs:** Code examples in recipes don't match what's in the Reference tab of topic pages.

## Code Examples

### Pagefind Template Integration
```html
<!-- Add to build/templates/page.html, inside <head> -->
<link rel="stylesheet" href="{{basePath}}assets/style.css">
<!-- No pagefind-ui.css needed if using custom UI -->

<!-- Add search input to sidebar or header -->
<div class="search-container" id="searchContainer">
  <input type="search" id="searchInput" placeholder="Search docs..." aria-label="Search documentation">
  <div class="search-results" id="searchResults"></div>
</div>

<!-- Add before closing </body> -->
<script src="{{basePath}}assets/main.js"></script>
```

### Pagefind Custom Search JS
```javascript
// Add to main.js
let pagefindLoaded = false;
let pagefindModule = null;

async function initSearch() {
  if (pagefindLoaded) return;
  pagefindModule = await import("/pagefind/pagefind.js");
  pagefindLoaded = true;
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput) {
  searchInput.addEventListener('focus', initSearch); // Lazy load on focus
  searchInput.addEventListener('input', async function(e) {
    const query = e.target.value;
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    await initSearch();
    const search = await pagefindModule.debouncedSearch(query, {}, 300);
    if (!search) return;
    const results = await Promise.all(
      search.results.slice(0, 8).map(r => r.data())
    );
    searchResults.innerHTML = results.map(r =>
      `<a href="${r.url}" class="search-result">
        <div class="search-result-title">${r.meta.title || 'Untitled'}</div>
        <div class="search-result-excerpt">${r.excerpt}</div>
      </a>`
    ).join('');
  });
}
```

### Pagefind Template Body Attribute
```html
<!-- In build/templates/page.html, mark the content area for indexing -->
<main class="content" data-pagefind-body>
  <article>
    {{content}}
  </article>
</main>
```

### Comparison Table (DECT-03) Example
```markdown
## Skill vs Agent vs Command

| Aspect | Skill | Agent | Command |
|--------|-------|-------|---------|
| **What it is** | Markdown instructions with frontmatter | Dedicated agent file with system prompt | Slash command shortcut |
| **Complexity** | Low -- just a markdown file | Medium -- needs agent config | Low -- simple prompt template |
| **Reusability** | High -- works across Code/Chat/Cowork | Medium -- Code only | Low -- project-specific |
| **Auto-invoked?** | Yes, via progressive disclosure | No, explicit `--agent` flag | No, explicit `/command` |
| **Best for** | Repeatable processes, domain expertise | Complex multi-step workflows | Quick prompt shortcuts |
| **Can use tools?** | Yes, via `allowed-tools` frontmatter | Yes, full tool access | No direct tool access |
```

### Build Script Nav Extension
```javascript
// Extend generateNav() in build/build.js
const toolsPages = pages
  .filter(p => p.meta.section === 'tools')
  .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));

const guidesPages = pages
  .filter(p => p.meta.section === 'guides')
  .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));

// Add after reference section
if (toolsPages.length > 0) {
  nav += '<div class="nav-section">\n';
  nav += '  <div class="nav-section-title">Decision Tools</div>\n';
  for (const page of toolsPages) {
    const activeClass = page.slug === currentSlug ? ' active' : '';
    nav += `  <a href="${basePath}topics/${page.slug}.html" class="nav-link${activeClass}">${page.meta.title}</a>\n`;
  }
  nav += '</div>\n';
}

if (guidesPages.length > 0) {
  nav += '<div class="nav-section">\n';
  nav += '  <div class="nav-section-title">Recipes</div>\n';
  for (const page of guidesPages) {
    const activeClass = page.slug === currentSlug ? ' active' : '';
    nav += `  <a href="${basePath}topics/${page.slug}.html" class="nav-link${activeClass}">${page.meta.title}</a>\n`;
  }
  nav += '</div>\n';
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lunr.js (client-side index) | Pagefind (chunked static index) | 2022+ | 10-100x smaller client payload; no build-time index generation in JS |
| Algolia DocSearch (hosted) | Pagefind (self-hosted static) | 2023+ | No external service dependency, no API keys, works offline |
| Framework wizard components | Vanilla JS state machines | Ongoing | Zero bundle overhead for simple branching flows |

**Deprecated/outdated:**
- Lunr.js: Still works but ships entire index to client; not recommended for sites with 10+ pages
- Google Custom Search: Requires Google account, shows ads, poor UX control

## Open Questions

1. **Search placement in sidebar vs header**
   - What we know: Sidebar has limited width (260px). Header doesn't exist in current template.
   - What's unclear: Where the search input should live for best UX.
   - Recommendation: Place search input at top of sidebar nav (above "Topics" section). It fits the existing layout and is always visible. On mobile, it appears when the drawer opens.

2. **Pagefind output committed to git vs CI-generated**
   - What we know: Site deploys from `docs/` directory directly. No GitHub Actions CI for build.
   - What's unclear: Whether `docs/pagefind/` should be committed.
   - Recommendation: Commit it. The project has no CI pipeline, so the search index must be in the repo for GitHub Pages to serve it. Add `npm run build && npx pagefind --site docs` as a combined build+index script.

3. **Decision wizard as one page or multiple**
   - What we know: The wizard is a branching flow with ~5-6 questions leading to one of ~8 recommendations.
   - What's unclear: Whether each step should be a separate URL or a single-page app.
   - Recommendation: Single page with URL hash state (`#step=external-tool`). Simpler, faster, and the wizard is small enough that a single page load is fine.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner (node:test) |
| Config file | None -- tests run via `node --test` |
| Quick run command | `node --test tests/test-build.js` |
| Full suite command | `node --test tests/test-build.js tests/test-anchors.js tests/test-highlighting.js tests/test-nav.js` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SITE-02 | Search input exists in built HTML | unit | `node --test tests/test-search.js` | No -- Wave 0 |
| DECT-01 | Decision wizard page builds and has wizard markup | unit | `node --test tests/test-wizard.js` | No -- Wave 0 |
| DECT-02 | Topic pages have decision guidance sections | unit | `node --test tests/test-decision-guidance.js` | No -- Wave 0 |
| DECT-03 | Comparison tables render in built HTML | unit | `node --test tests/test-comparisons.js` | No -- Wave 0 |
| RECP-01 | Recipe deployment skill page builds | unit | `node --test tests/test-recipes.js` | No -- Wave 0 |
| RECP-02 | Recipe CRM MCP page builds | unit | `node --test tests/test-recipes.js` | No -- Wave 0 |
| RECP-03 | Recipe pre-commit hook page builds | unit | `node --test tests/test-recipes.js` | No -- Wave 0 |
| RECP-04 | Recipe custom agent page builds | unit | `node --test tests/test-recipes.js` | No -- Wave 0 |
| RECP-05 | Recipe monorepo settings page builds | unit | `node --test tests/test-recipes.js` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `node --test tests/test-build.js`
- **Per wave merge:** `node --test tests/test-build.js tests/test-anchors.js tests/test-highlighting.js tests/test-nav.js tests/test-recipes.js tests/test-search.js tests/test-wizard.js`
- **Phase gate:** Full suite green before verification

### Wave 0 Gaps
- [ ] `tests/test-search.js` -- verifies search input in template, Pagefind data-pagefind-body attribute
- [ ] `tests/test-wizard.js` -- verifies wizard page builds with wizard container element
- [ ] `tests/test-decision-guidance.js` -- verifies topic pages contain decision guidance content
- [ ] `tests/test-comparisons.js` -- verifies comparison tables render
- [ ] `tests/test-recipes.js` -- verifies all 5 recipe pages build, have correct structure
- [ ] `pagefind` dev dependency: `npm install -D pagefind`

## Sources

### Primary (HIGH confidence)
- [Pagefind official docs](https://pagefind.app/docs/) -- installation, UI usage, JS API, config options, indexing attributes
- [Pagefind UI usage](https://pagefind.app/docs/ui-usage/) -- CSS custom properties for theming
- [Pagefind JS API](https://pagefind.app/docs/api/) -- custom search UI, debouncedSearch, preload
- [Pagefind config options](https://pagefind.app/docs/config-options/) -- CLI flags, --site, --exclude-selectors
- [Pagefind indexing](https://pagefind.app/docs/indexing/) -- data-pagefind-body, data-pagefind-ignore attributes
- Existing project codebase -- build/build.js, templates/page.html, content/*.md, docs/assets/main.js, style.css

### Secondary (MEDIUM confidence)
- [Pagefind npm page](https://www.npmjs.com/package/pagefind) -- version 1.4.0 confirmed

### Tertiary (LOW confidence)
- None -- all findings verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Pagefind is well-documented with official docs verified; vanilla JS is project constraint
- Architecture: HIGH -- patterns follow established project conventions (frontmatter sections, build pipeline)
- Pitfalls: HIGH -- based on direct analysis of project structure and Pagefind documentation

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (Pagefind is stable; project patterns are internal)
