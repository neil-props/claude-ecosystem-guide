---
phase: 04-guides-and-reference
plan: 01
subsystem: content
tags: [mcp, how-to, reference, config-schema, testing]

requires:
  - phase: 03-conceptual-content
    provides: MCP concept tab with overview, configuration, and best practices
provides:
  - MCP how-to tab with 4 complete guides (stdio, HTTP, auth, build-your-own)
  - MCP reference tab with .mcp.json and managed-mcp.json config schemas
  - Test scaffolds for how-to and reference content validation across all topic pages
affects: [04-02-PLAN, 04-03-PLAN]

tech-stack:
  added: []
  patterns: [how-to guide template with Prerequisites/Steps/Verify/Troubleshooting, reference table with Field/Type/Required/Default/Description]

key-files:
  created:
    - tests/test-howto-content.js
    - tests/test-reference-content.js
  modified:
    - content/mcp.md

key-decisions:
  - "HTML comment break before closing div to prevent markdown list from swallowing tab panel boundaries"
  - "Tab panel extraction regex: howto uses next panel boundary, reference uses triple-div-close pattern"
  - "Concept tab Configuration section slimmed to overview with pointer to Reference tab for full schema"

patterns-established:
  - "How-to guide structure: Prerequisites, numbered Steps, Verify It Works, Troubleshooting"
  - "Reference table structure: Field, Type, Required, Default, Description columns"
  - "Test scaffold pattern: extract tab panel HTML via regex, check for key phrases, verify no placeholder text"

requirements-completed: [HOWT-01, HOWT-02, HOWT-03, HOWT-04, REFR-01]

duration: 5min
completed: 2026-03-16
---

# Phase 4 Plan 01: MCP How-To Guides and Reference Summary

**4 MCP how-to guides (stdio, HTTP, auth, build-your-own) plus .mcp.json and managed-mcp.json config schema reference, with test scaffolds for all Phase 4 content validation**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-16T12:18:02Z
- **Completed:** 2026-03-16T12:23:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created test scaffolds that validate how-to and reference content across all 7 topic pages (spot-checks for key phrases, placeholder detection)
- Wrote 4 complete MCP how-to guides covering stdio server setup, HTTP/SSE remote servers, authentication configuration, and building custom MCP servers
- Documented complete .mcp.json and managed-mcp.json schemas with field reference tables, validation rules, and examples
- Slimmed Concept tab Configuration section with pointer to Reference tab for full schema details

## Task Commits

Each task was committed atomically:

1. **Task 1: Create test scaffolds for how-to and reference content** - `19d340e` (test)
2. **Task 2: Write MCP how-to guides and config schema reference** - `dcc480f` (feat)

## Files Created/Modified
- `tests/test-howto-content.js` - Spot-check tests for how-to tab content across 7 topic pages
- `tests/test-reference-content.js` - Spot-check tests for reference tab content across 7 topic pages
- `content/mcp.md` - MCP page with fully populated how-to and reference tabs

## Decisions Made
- Used HTML comment break (`<!-- end howto -->`) before closing `</div>` to prevent markdown list items from bleeding into the tab panel boundary
- Tab panel regex extraction uses different patterns for howto (bounded by next panel div) vs reference (bounded by triple closing div)
- Concept tab Configuration section condensed to a quick example with pointer to Reference tab, avoiding content duplication

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed tab panel regex extraction in test files**
- **Found during:** Task 2 (verification)
- **Issue:** Original regex couldn't extract reference panel content because the closing pattern didn't account for the tabs container structure ending before the Related section
- **Fix:** Updated both test helpers -- howto uses next panel boundary, reference uses triple-div-close pattern
- **Files modified:** tests/test-howto-content.js, tests/test-reference-content.js
- **Verification:** All MCP tests pass; other pages fail as expected
- **Committed in:** dcc480f (part of Task 2 commit)

**2. [Rule 3 - Blocking] Added HTML comment break before reference panel div**
- **Found during:** Task 2 (verification)
- **Issue:** Markdown list items at the end of the howto panel caused the parser to generate stray `</li></ul>` tags inside the reference panel opening, breaking content extraction
- **Fix:** Added `<!-- end howto -->` comment between the last list item and the closing `</div>` to force the list to close
- **Files modified:** content/mcp.md
- **Verification:** Built HTML no longer has stray tags; reference panel content extracts correctly
- **Committed in:** dcc480f (part of Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes necessary for test verification to work. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- How-to guide template and reference table patterns are established for Plans 02 and 03
- Test scaffolds are in place and will incrementally pass as remaining topic pages are populated
- MCP page is complete and can serve as the reference example for other topic pages

---
*Phase: 04-guides-and-reference*
*Completed: 2026-03-16*
