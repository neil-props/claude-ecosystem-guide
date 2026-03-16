# Phase 1: Foundation - Research

**Researched:** 2026-03-15
**Domain:** Static site build pipeline, multi-page layout, syntax highlighting, theming
**Confidence:** HIGH

## Summary

Phase 1 decomposes a 2343-line monolithic `index.html` into a multi-page site driven by a markdown-to-HTML build pipeline. The existing site has a mature CSS custom properties theme system (dark/light), responsive breakpoints, a sticky nav bar, modal overlays, and a compatibility matrix -- all of which must be preserved and extended into a sidebar-based multi-page layout.

The core technical work is: (1) extract CSS and JS from the monolith into shared assets, (2) create an HTML template with sidebar navigation, (3) build a Node.js script that reads markdown files with YAML frontmatter and renders them into pages using that template, and (4) add syntax highlighting and copy-to-clipboard for code blocks. The stack is intentionally minimal: `marked` for markdown parsing, `gray-matter` for frontmatter, `highlight.js` for build-time syntax highlighting, and vanilla CSS/JS for layout and interactions.

**Primary recommendation:** Build a simple Node.js build script (under 300 lines) that reads markdown from `content/` (placeholder pages for now -- real content comes in Phase 2), parses frontmatter with gray-matter, renders markdown with marked + highlight.js, and injects into an HTML template with sidebar nav, theme toggle, and responsive layout. Keep all existing CSS variables and theme patterns. Do NOT introduce any framework, bundler, or SSG.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SITE-01 | Multi-page structure with persistent sidebar navigation | Template-based layout with sidebar component; JS-driven active state highlighting; responsive hamburger menu for mobile |
| SITE-03 | Dark/light theme toggle (preserve existing) | Existing `data-theme` attribute + CSS custom properties system preserved verbatim; localStorage persistence already works |
| SITE-04 | Responsive on mobile and tablet | Existing responsive breakpoints at 640px and 900px; sidebar collapses to hamburger/drawer on mobile |
| SITE-05 | Deep-linkable anchor URLs | Marked renderer generates `id` attributes on headings; scroll-to-anchor on page load |
| SITE-06 | Code examples have copy-to-clipboard buttons | Build-time: wrap code blocks in container with copy button; Runtime: `navigator.clipboard.writeText()` with visual feedback |
| SITE-07 | Syntax highlighting (YAML, JSON, bash, markdown) | highlight.js at build-time via marked-highlight integration; include yaml, json, bash, markdown, javascript, typescript language grammars |
| SITE-08 | Static HTML/CSS/JS, no framework overhead | Vanilla build script, zero client-side framework, static output |
| SITE-09 | Compatibility matrix preserved | Extract matrix HTML from index.html into a dedicated page or component; maintain existing table styles |
| KNOW-05 | Build script converts markdown to HTML pages | Node.js build script: gray-matter + marked + highlight.js + HTML template injection |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| marked | ^17.0.0 | Markdown to HTML | Most popular markdown parser for Node.js. Zero dependencies. Fast. Extensible via custom renderers. |
| marked-highlight | ^2.2.0 | Code highlighting integration | Official marked plugin that wires highlight.js into the marked rendering pipeline |
| gray-matter | ^4.0.3 | YAML frontmatter parsing | Industry standard frontmatter parser. Used by Astro, Gatsby, VitePress, TinaCMS. Battle-tested. |
| highlight.js | ^11.11.0 | Syntax highlighting | Server-side (build-time) highlighting. Supports 190+ languages. Auto-detection. No client-side JS needed for highlighting. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| glob | ^11.0.0 | File pattern matching | Finding markdown files in content directories during build |
| fs/path (built-in) | Node 20 | File I/O | Reading markdown, writing HTML output. No npm package needed. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| marked | markdown-it | markdown-it has more plugins but marked is faster and simpler for this use case. Either works. |
| highlight.js | Prism.js | Prism is 9% faster and smaller core (~2KB), but highlight.js has better auto-detection and simpler server-side API. For build-time use, performance difference is negligible. |
| highlight.js | Shiki | Shiki uses VS Code's TextMate grammars for perfect accuracy. Heavier dependency (oniguruma WASM). Overkill for YAML/JSON/bash highlighting. |
| gray-matter | front-matter | gray-matter is more widely used, handles edge cases better (code fences containing frontmatter examples). |
| Custom build script | 11ty / Astro | SSG adds dependency overhead, requires restructuring into framework conventions. Only justified at 30+ pages. |

**Installation:**
```bash
npm init -y
npm install marked marked-highlight gray-matter highlight.js glob
```

**Dev dependency (optional, for local preview):**
```bash
npm install --save-dev serve
```

## Architecture Patterns

### Recommended Project Structure

```
claude-ecosystem-guide/
├── build/
│   ├── build.js              # Main build script (~200-300 lines)
│   └── templates/
│       └── page.html          # HTML template with sidebar, head, footer
├── content/                   # Markdown source files (placeholder pages for Phase 1)
│   ├── index.md               # Landing page content
│   ├── mcp.md                 # Placeholder topic pages
│   ├── skills.md
│   ├── plugins.md
│   ├── hooks.md
│   ├── agents.md
│   ├── projects.md
│   └── interactive-apps.md
├── docs/                      # BUILD OUTPUT (GitHub Pages serves this)
│   ├── index.html             # Generated landing page
│   ├── topics/                # Generated topic pages
│   │   ├── mcp.html
│   │   └── ...
│   └── assets/
│       ├── style.css          # Extracted + extended CSS
│       ├── main.js            # Theme toggle, copy-to-clipboard, mobile nav
│       └── hljs/              # Highlight.js theme CSS (dark + light)
├── index.html                 # LEGACY (preserved, still works)
├── ama.html                   # LEGACY (preserved)
├── package.json               # Build dependencies
└── .github/workflows/
    └── deploy.yml             # Updated to run build before deploy
```

**Key decision:** The build output goes into `docs/` (not root). GitHub Pages can serve from `/docs` on main branch. The legacy `index.html` at root stays until migration is complete. During Phase 1, both the legacy site and the new `docs/` output coexist.

**Alternative:** Output could stay in root. But `docs/` separation keeps generated files clearly distinct from source files, and avoids accidentally editing generated HTML.

### Pattern 1: Build-Time Template Injection

**What:** The build script reads each markdown file, parses frontmatter for metadata (title, slug, order, description), renders the body to HTML with syntax highlighting, and injects everything into an HTML template.

**When to use:** Every page generation.

**Example:**
```javascript
// build/build.js (simplified core)
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked with highlight.js
marked.use(markedHighlight({
  emptyLangClass: 'hljs',
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

// Custom renderer for heading anchors
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const slug = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${depth} id="${slug}">${text}<a class="anchor" href="#${slug}">#</a></h${depth}>`;
};
marked.use({ renderer });

// Read template
const template = readFileSync('build/templates/page.html', 'utf-8');

// Process each content file
function buildPage(filePath, navItems) {
  const raw = readFileSync(filePath, 'utf-8');
  const { data: meta, content } = matter(raw);
  const html = marked.parse(content);

  const page = template
    .replace('{{title}}', meta.title)
    .replace('{{content}}', html)
    .replace('{{nav}}', generateNav(navItems, meta.slug));

  writeFileSync(join('docs', meta.slug + '.html'), page);
}
```

### Pattern 2: CSS-Driven Theme Toggle (Preserve Existing)

**What:** The existing theme system uses `data-theme="light"` attribute on `<html>` with CSS custom properties. This pattern is preserved exactly. The theme toggle JS, localStorage persistence, and system preference detection are extracted into `main.js`.

**When to use:** Every page must include this.

**Critical details from existing code:**
- Flash-prevention script runs in `<head>` before CSS loads (reads localStorage)
- Theme transition class (`theme-transition`) adds smooth 0.4s animation on toggle
- System preference listener fires only when no stored preference exists
- Toggle button uses SVG sun/moon icons, visibility controlled by CSS

### Pattern 3: Sidebar Navigation with Active State

**What:** Persistent sidebar with topic links. Current page highlighted. Sidebar collapses to hamburger on mobile.

**When to use:** Every page except possibly the landing page.

**Implementation approach:**
```html
<!-- Sidebar structure -->
<aside class="sidebar">
  <div class="sidebar-header">
    <a href="/" class="site-title">Claude Ecosystem</a>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-section">
      <div class="nav-section-title">Topics</div>
      <a href="/topics/mcp.html" class="nav-link active">MCP Servers</a>
      <a href="/topics/skills.html" class="nav-link">Skills</a>
      <!-- ... -->
    </div>
  </nav>
</aside>

<!-- Mobile hamburger -->
<button class="mobile-nav-toggle" aria-label="Toggle navigation">
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>
```

**CSS approach:** Use CSS Grid for the main layout (`grid-template-columns: 260px 1fr`). Sidebar fixed on desktop, drawer overlay on mobile. Active state driven by build-time `class="active"` on current page link.

### Pattern 4: Copy-to-Clipboard for Code Blocks

**What:** Each code block gets a "Copy" button. Clicking copies code content and shows brief "Copied!" feedback.

**When to use:** Every `<pre><code>` block.

**Implementation:** Build-time wrapping + runtime JS.

```javascript
// Build-time: wrap code blocks (via marked renderer)
renderer.code = function({ text, lang }) {
  const highlighted = lang && hljs.getLanguage(lang)
    ? hljs.highlight(text, { language: lang }).value
    : text;
  return `<div class="code-block">
    <div class="code-header">
      <span class="code-lang">${lang || ''}</span>
      <button class="copy-btn" aria-label="Copy code">Copy</button>
    </div>
    <pre><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code></pre>
  </div>`;
};

// Runtime JS (main.js):
document.addEventListener('click', function(e) {
  if (e.target.closest('.copy-btn')) {
    const btn = e.target.closest('.copy-btn');
    const code = btn.closest('.code-block').querySelector('code');
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    });
  }
});
```

### Anti-Patterns to Avoid

- **Client-side markdown rendering:** Never load marked in the browser. All markdown is rendered at build time. Pages are static HTML.
- **Duplicating CSS variables:** The existing theme variables (`--bg`, `--surface`, `--text`, `--mcp`, `--skill`, etc.) must be reused, not redefined. Extract them into `style.css` once.
- **Framework-ifying the build:** The build script should be a single file that runs with `node build/build.js`. No Webpack, no Vite, no Rollup. If you need file watching for dev, use `nodemon` or `chokidar` -- do not add a bundler.
- **Over-engineering navigation:** Build-time generated HTML nav links. No client-side routing, no SPA patterns. Each page is a full HTML document.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown parsing | Custom regex parser | `marked` | Markdown has edge cases (nested lists, HTML in markdown, reference links). Custom parsers break on real content. |
| YAML frontmatter | Split-on-delimiter parsing | `gray-matter` | Handles edge cases like frontmatter examples inside code fences, TOML/JSON variants. |
| Syntax highlighting | Custom token colorizer | `highlight.js` | 190+ languages, tested against millions of code samples. Custom highlighting breaks on edge cases (string interpolation, nested templates). |
| Heading ID generation | Manual slug function | marked's built-in or custom renderer | Must handle unicode, special characters, duplicate headings. |
| Theme system | New theme approach | Existing CSS custom properties | The current system works perfectly. ~30 CSS variables cover both themes. Preserve it. |

**Key insight:** The build pipeline is glue code. Every complex sub-problem (parsing, highlighting, frontmatter) has a battle-tested library. The build script's job is orchestration: read files, call libraries, write output.

## Common Pitfalls

### Pitfall 1: Flash of Wrong Theme (FOWT)
**What goes wrong:** Page loads in dark theme, then flashes to light (or vice versa) when JS reads localStorage.
**Why it happens:** Theme JS runs after CSS renders the default theme.
**How to avoid:** The existing index.html already solves this with a `<script>` block in `<head>` that runs before CSS. This pattern MUST be preserved in the template. The script reads localStorage and sets `data-theme` before the body renders.
**Warning signs:** Visible flash when navigating between pages.

### Pitfall 2: Sidebar Navigation Doesn't Highlight Current Page
**What goes wrong:** All nav links look the same; user doesn't know which page they're on.
**Why it happens:** Active state set by JS URL matching, which breaks with relative paths, trailing slashes, or index pages.
**How to avoid:** Set `class="active"` at build time. The build script knows which page it's generating and marks the corresponding nav link.
**Warning signs:** Active class applied inconsistently, or not at all on some pages.

### Pitfall 3: Code Block Copy Fails on Highlighted Code
**What goes wrong:** Copy button copies HTML tags (`<span class="hljs-string">`) instead of plain code text.
**Why it happens:** Using `innerHTML` instead of `textContent` to get the code.
**How to avoid:** Always use `element.textContent` to extract plain text from highlighted code blocks.
**Warning signs:** Pasted code contains HTML markup.

### Pitfall 4: Build Output Deployed with Stale Files
**What goes wrong:** Old HTML files from deleted/renamed markdown sources persist in `docs/`.
**Why it happens:** Build script adds new files but doesn't clean old ones.
**How to avoid:** Start each build by clearing the `docs/` directory (except `docs/assets/` which holds static files, OR clear everything and re-copy assets).
**Warning signs:** 404 errors on renamed pages, ghost pages in navigation.

### Pitfall 5: Mobile Sidebar Doesn't Close on Navigation
**What goes wrong:** User taps a nav link on mobile, page navigates but sidebar drawer stays open.
**Why it happens:** Full page navigation in a multi-page site naturally closes it (page reload). But if any JS prevents default behavior or if using hash links within the same page, the drawer persists.
**How to avoid:** Close sidebar drawer on any nav link click. Since this is a multi-page site (not SPA), regular link clicks trigger full navigation which naturally resets state. Only worry about same-page anchor links.
**Warning signs:** Sidebar persists after anchor link clicks.

### Pitfall 6: Highlight.js Bundle Size
**What goes wrong:** Including all 190+ language grammars inflates the build.
**Why it happens:** Default `highlight.js` import includes everything.
**How to avoid:** Import only needed languages: `import hljs from 'highlight.js/lib/core'` then `hljs.registerLanguage('yaml', yaml)` for each needed language. For Phase 1, need: yaml, json, bash, javascript, typescript, markdown, xml/html.
**Warning signs:** Build output size unexpectedly large, or node_modules bloat.

## Code Examples

### Frontmatter Format for Content Pages

```markdown
---
title: MCP Servers & Connectors
slug: mcp
order: 1
description: The Model Context Protocol connects Claude to external tools and services.
color: "#fb923c"
section: topics
---

# MCP Servers & Connectors

Content goes here...
```

### HTML Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - Claude Ecosystem Guide</title>
  <script>
    // Flash prevention (same as existing index.html)
    (function() {
      var stored = localStorage.getItem('claude-guide-theme');
      if (stored) {
        document.documentElement.setAttribute('data-theme', stored);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  </script>
  <link rel="stylesheet" href="/assets/style.css">
  <link rel="stylesheet" href="/assets/hljs-theme.css">
</head>
<body>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <a href="/" class="site-title">Claude Ecosystem</a>
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <!-- sun/moon SVG icons -->
      </button>
    </div>
    <nav class="sidebar-nav">
      {{nav}}
    </nav>
  </aside>
  <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Toggle navigation">
    <span></span><span></span><span></span>
  </button>
  <main class="content">
    <article>
      {{content}}
    </article>
  </main>
  <script src="/assets/main.js"></script>
</body>
</html>
```

### Build Script npm Scripts

```json
{
  "scripts": {
    "build": "node build/build.js",
    "dev": "npx serve docs",
    "clean": "rm -rf docs"
  }
}
```

### GitHub Actions Workflow Update

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'docs'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Critical change:** The deploy workflow now serves from `docs/` (build output) instead of `.` (root). GitHub Pages source must be updated to serve from `docs/` on main branch in repo settings, OR the workflow uses `upload-pages-artifact` with `path: 'docs'`.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side highlighting (load hljs in browser) | Build-time highlighting (pre-rendered HTML) | Standard practice since 2020+ | Zero runtime JS for code highlighting; faster page loads |
| JS include scripts for shared layout | Build-time template injection | Always preferred for static sites | No FOUC, no JS dependency for layout |
| Single monolithic HTML file | Multi-page with build pipeline | This phase | Enables content scaling, individual page editing |

## Open Questions

1. **GitHub Pages source directory**
   - What we know: Current workflow serves from root (`.`). New approach needs to serve from `docs/`.
   - What's unclear: Whether to change GitHub Pages settings to serve from `/docs` on main, or continue using the artifact-based deployment (which can specify any path).
   - Recommendation: Use the artifact-based deployment (already in place) and change `path: '.'` to `path: 'docs'`. No repo settings change needed.

2. **Landing page approach**
   - What we know: Current `index.html` is a rich visual landing page with hero, cards, interactive elements. The multi-page site needs a landing page too.
   - What's unclear: Should Phase 1 create a simplified landing page from markdown, or preserve the existing visual landing page as-is and just add sidebar nav?
   - Recommendation: For Phase 1, create a simple landing page that links to topic pages. The existing `index.html` visual design will be revisited in Phase 1.1 (Design System). Keep existing `index.html` at root as legacy fallback.

3. **Content directory naming: `content/` vs `knowledge/`**
   - What we know: ARCHITECTURE.md recommends `knowledge/` as the canonical content directory. Phase 2 will extract content into this directory.
   - What's unclear: Should Phase 1 use `knowledge/` or a temporary `content/` directory with placeholder pages?
   - Recommendation: Use `content/` for Phase 1 placeholder pages. Phase 2 will establish the full `knowledge/` structure. The build script should make the source directory configurable so it's easy to change.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in `node --test` (Node 20+) or shell-based validation |
| Config file | none -- see Wave 0 |
| Quick run command | `node build/build.js && echo "Build succeeded"` |
| Full suite command | `node --test tests/` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SITE-01 | Multi-page with sidebar nav | smoke | `node --test tests/test-nav.js` (verify sidebar HTML in output) | No -- Wave 0 |
| SITE-03 | Theme toggle works | smoke | `grep -q 'data-theme' docs/index.html && grep -q 'themeToggle' docs/assets/main.js` | No -- Wave 0 |
| SITE-04 | Responsive layout | manual-only | Visual inspection at 375px, 768px, 1024px widths | N/A |
| SITE-05 | Deep-linkable anchors | unit | `node --test tests/test-anchors.js` (verify heading IDs in output) | No -- Wave 0 |
| SITE-06 | Copy-to-clipboard buttons | smoke | `grep -q 'copy-btn' docs/topics/*.html` | No -- Wave 0 |
| SITE-07 | Syntax highlighting | smoke | `grep -q 'hljs' docs/topics/*.html` | No -- Wave 0 |
| SITE-08 | No framework overhead | unit | `test ! -d docs/node_modules && wc -l docs/assets/main.js` (< 200 lines) | No -- Wave 0 |
| SITE-09 | Compatibility matrix preserved | smoke | `grep -q 'matrix' docs/index.html` or dedicated page | No -- Wave 0 |
| KNOW-05 | Build script converts md to HTML | integration | `node build/build.js && ls docs/topics/*.html` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build && node --test tests/`
- **Per wave merge:** Full build + manual visual inspection
- **Phase gate:** All automated tests pass + visual inspection of responsive layout + theme toggle

### Wave 0 Gaps
- [ ] `tests/test-build.js` -- verifies build script produces expected output files
- [ ] `tests/test-nav.js` -- verifies sidebar nav HTML contains all topic links with correct active states
- [ ] `tests/test-anchors.js` -- verifies heading IDs are generated in output HTML
- [ ] `tests/test-highlighting.js` -- verifies code blocks contain hljs classes
- [ ] `package.json` -- must exist with build dependencies and test script

## Sources

### Primary (HIGH confidence)
- [marked npm](https://www.npmjs.com/package/marked) - v17.0.0, zero dependencies, markdown-to-HTML
- [marked-highlight GitHub](https://github.com/markedjs/marked-highlight) - Official marked plugin for syntax highlighting integration
- [gray-matter npm](https://www.npmjs.com/package/gray-matter) - v4.0.3, YAML frontmatter parser
- [highlight.js](https://highlightjs.org/) - v11.x, server-side and browser syntax highlighting
- Existing `index.html` source code (2343 lines) - theme system, CSS variables, nav structure, compatibility matrix

### Secondary (MEDIUM confidence)
- [marked-highlight integration pattern](https://shuheikagawa.com/blog/2015/09/21/using-highlight-js-with-marked/) - Verified pattern for wiring hljs into marked
- [highlight.js server-side usage](https://highlightjs.readthedocs.io/en/latest/readme.html) - Confirmed Node.js support for build-time highlighting

### Tertiary (LOW confidence)
- highlight.js exact latest version -- stated as 11.11.0 based on training data. Verify with `npm view highlight.js version` before installing.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - marked, gray-matter, highlight.js are well-established, verified via npm
- Architecture: HIGH - Build-time template injection is standard for static sites; project structure follows research recommendations
- Pitfalls: HIGH - FOWT, copy-button innerHTML, stale builds are well-documented static site issues
- Existing code analysis: HIGH - Direct reading of index.html source code

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable domain, unlikely to change)
