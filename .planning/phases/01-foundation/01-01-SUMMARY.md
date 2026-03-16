---
phase: 01-foundation
plan: 01
subsystem: build
tags: [marked, gray-matter, highlight.js, markdown, static-site, node]

# Dependency graph
requires: []
provides:
  - Markdown-to-HTML build pipeline (npm run build)
  - HTML template with flash-prevention and basePath placeholders
  - CSS theme variables extracted from existing index.html (dark/light)
  - Vanilla JS runtime for copy-to-clipboard, theme toggle, scroll-to-anchor
  - 11 content pages (index + 10 topic placeholders) with frontmatter
  - Test suite verifying build output, heading anchors, syntax highlighting
affects: [01-02, 02-01, navigation, theming, content]

# Tech tracking
tech-stack:
  added: [marked@17, marked-highlight@2, gray-matter@4, highlight.js@11, glob@11]
  patterns: [build-time template injection, CSS custom property theming, ESM modules]

key-files:
  created:
    - build/build.js
    - build/templates/page.html
    - docs/assets/style.css
    - docs/assets/main.js
    - content/index.md
    - content/mcp.md
    - tests/test-build.js
    - tests/test-anchors.js
    - tests/test-highlighting.js
    - package.json
  modified: []

key-decisions:
  - "Import hljs from highlight.js/lib/core with individual language registration to minimize bundle"
  - "Assets live in docs/assets/ as source of truth (not copied from separate source dir)"
  - "Test script explicitly lists test files instead of glob pattern for node --test compatibility"

patterns-established:
  - "Build-time template injection: markdown -> gray-matter -> marked -> HTML template -> output"
  - "Custom marked renderer for heading anchors with slugified IDs"
  - "Custom marked renderer for code blocks with copy button wrapper"
  - "Flash-prevention script in head before CSS loads"

requirements-completed: [KNOW-05, SITE-05, SITE-06, SITE-07, SITE-08]

# Metrics
duration: 14min
completed: 2026-03-16
---

# Phase 1 Plan 1: Build Pipeline Summary

**Markdown-to-HTML build pipeline with marked + highlight.js, producing 11 static pages with syntax highlighting, copy-to-clipboard code blocks, and deep-linkable headings**

## Performance

- **Duration:** 14 min
- **Started:** 2026-03-16T00:45:54Z
- **Completed:** 2026-03-16T01:00:00Z
- **Tasks:** 3
- **Files modified:** 26

## Accomplishments
- Working build pipeline that converts markdown content to static HTML pages with zero framework overhead
- Syntax highlighting at build-time using highlight.js with 7 registered languages (yaml, json, bash, js, ts, markdown, xml)
- Copy-to-clipboard buttons on every code block and deep-linkable heading anchors
- Full test suite (11 tests across 3 files) validating build output, heading anchors, and highlighting
- CSS theme system with 30+ custom properties supporting dark/light themes, extracted from existing site

## Task Commits

Each task was committed atomically:

1. **Task 1: Project setup and test scaffolds** - `7234562` (feat)
2. **Task 2: Build script, HTML template, and static assets** - `f91a237` (feat)
3. **Task 3: Placeholder content pages and full test suite green** - `664da9c` (feat)

## Files Created/Modified
- `package.json` - Project config with ESM, build/test scripts, and all dependencies
- `build/build.js` - Core build pipeline (~140 lines): glob content, parse frontmatter, render markdown, inject into template
- `build/templates/page.html` - HTML shell with flash-prevention, basePath placeholders, sidebar/content structure
- `docs/assets/style.css` - Theme variables, typography, code block styles, anchor styles (~250 lines)
- `docs/assets/main.js` - Theme toggle, copy-to-clipboard, scroll-to-anchor (~75 lines, vanilla JS)
- `content/index.md` - Landing page with extension point links and example code block
- `content/mcp.md` - MCP Servers placeholder with json config example
- `content/skills.md` - Skills placeholder with yaml skill file example
- `content/plugins.md` - Plugins placeholder with json config example
- `content/hooks.md` - Hooks placeholder with json hook config example
- `content/agents.md` - Agents placeholder with markdown agent file and bash invocation
- `content/projects.md` - Projects/CLAUDE.md placeholder with markdown example
- `content/connectors.md` - Connectors placeholder with yaml config example
- `content/commands.md` - Commands placeholder with markdown command and bash usage
- `content/memory.md` - Memory placeholder with bash CLI examples
- `content/settings.md` - Settings placeholder with json config example
- `tests/test-build.js` - Verifies build output files exist (5 tests)
- `tests/test-anchors.js` - Verifies heading IDs and anchor links (3 tests)
- `tests/test-highlighting.js` - Verifies hljs classes, copy buttons, code-block containers (3 tests)

## Decisions Made
- Used `highlight.js/lib/core` with individual language imports instead of full highlight.js to minimize bundle
- Assets (style.css, main.js) kept in `docs/assets/` as source of truth rather than a separate source directory -- simpler for Phase 1
- Test script uses explicit file paths instead of glob pattern due to node --test compatibility issue with directory arguments in Node 24
- Code block renderer handles highlighting inline rather than relying on markedHighlight for code wrapping (needed custom copy-btn container)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed node --test glob pattern**
- **Found during:** Task 1 (test scaffold verification)
- **Issue:** `node --test tests/` failed with MODULE_NOT_FOUND on Node 24 -- directory argument not supported as expected
- **Fix:** Changed test script to explicitly list test files: `node --test tests/test-build.js tests/test-anchors.js tests/test-highlighting.js`
- **Files modified:** package.json
- **Verification:** npm test runs all 3 test suites successfully
- **Committed in:** 7234562 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor test script adjustment. No scope creep.

## Issues Encountered
None beyond the test glob fix documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Build pipeline complete and tested, ready for Plan 02 (sidebar navigation, theme toggle UI, responsive layout)
- All placeholder content pages in place for navigation wiring
- CSS theme variables ready for sidebar and responsive styles
- Template has `{{nav}}` placeholder ready for sidebar injection

## Self-Check: PASSED

All 10 key files verified present. All 3 task commits verified in git log.

---
*Phase: 01-foundation*
*Completed: 2026-03-16*
