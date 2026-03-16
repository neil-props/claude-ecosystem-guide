---
phase: 04-guides-and-reference
plan: 02
subsystem: content
tags: [skills, plugins, hooks, agents, how-to, reference, frontmatter, yaml, json]

requires:
  - phase: 03-conceptual-content
    provides: Concept tab content for all 10 topic pages with tab panel structure
  - phase: 04-guides-and-reference-01
    provides: Test infrastructure for howto and reference content validation
provides:
  - Complete how-to guides for Skills, Plugins, Hooks, and Agents
  - Complete reference specs for skill frontmatter (10 fields), plugin manifest, hook config (24 events), agent file format (12 fields)
  - Nested hook config structure throughout (concept + reference tabs)
affects: [04-guides-and-reference-03, 05-decision-guidance]

tech-stack:
  added: []
  patterns:
    - "How-to guide structure: Prerequisites, Step 1-N, Verify It Works, Troubleshooting"
    - "Reference spec structure: File Location, Complete Schema, Field Reference table, Validation Rules, Examples"
    - "Concept tab config sections slimmed with pointer to Reference tab for complete spec"

key-files:
  created: []
  modified:
    - content/skills.md
    - content/plugins.md
    - content/hooks.md
    - content/agents.md

key-decisions:
  - "Removed HTML break comments from tab panels (caused regex mismatch in reference content tests)"
  - "Hook config examples updated from flat to nested structure throughout Concept and Reference tabs"
  - "Concept tab config sections slimmed to summary with pointer to Reference tab"

patterns-established:
  - "How-to tab content: complete walkthrough from Prerequisites through Troubleshooting"
  - "Reference tab content: File Location, Complete Schema, Field Reference table, Validation Rules, Examples (minimal + full)"
  - "Concept tab config migration: detailed schemas move to Reference, Concept keeps overview with pointer"

requirements-completed: [HOWT-05, HOWT-06, HOWT-07, HOWT-08, REFR-02, REFR-03, REFR-04, REFR-05]

duration: 7min
completed: 2026-03-16
---

# Phase 4 Plan 02: Extension Point Guides and References Summary

**Complete how-to guides and technical reference specs for Skills (10-field frontmatter), Plugins (manifest schema), Hooks (24 events, nested config), and Agents (12-field file format)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-16T12:25:25Z
- **Completed:** 2026-03-16T12:33:12Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Skills page: complete skill creation walkthrough and frontmatter spec with all 10 fields, string substitutions, validation rules
- Plugins page: complete plugin creation walkthrough and plugin.json manifest spec with all fields and auto-discovery behavior
- Hooks page: complete hook setup guide and config spec with all 24 events, 4 handler types, matcher syntax, exit codes, environment variables
- Agents page: complete agent creation walkthrough and file format spec with all 12 fields, memory scopes, resolution priority
- Updated all Concept tab hook examples from flat to nested config structure for consistency with official docs

## Task Commits

Each task was committed atomically:

1. **Task 1: Write how-to guides and reference specs for Skills and Plugins** - `a73a90a` (feat)
2. **Task 2: Write how-to guides and reference specs for Hooks and Agents** - `bd79285` (feat)

## Files Created/Modified
- `content/skills.md` - How-to guide (HOWT-05) + frontmatter spec (REFR-02) with all 10 fields
- `content/plugins.md` - How-to guide (HOWT-06) + manifest spec (REFR-03) with all fields
- `content/hooks.md` - How-to guide (HOWT-07) + config spec (REFR-04) with 24 events, nested schema
- `content/agents.md` - How-to guide (HOWT-08) + file format spec (REFR-05) with all 12 fields

## Decisions Made
- Removed `<!-- break -->` HTML comments from tab panel boundaries -- these caused the reference content test regex to fail (it expects `</div>\s*</div>\s*</div>` without comments in between)
- Updated all hook config examples in Concept tab from flat structure to nested structure per official docs (research finding: nested is canonical)
- Slimmed Concept tab Configuration sections to overview summaries with "see Reference tab" pointers

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed HTML break comments causing test failures**
- **Found during:** Task 1 (Skills/Plugins reference content)
- **Issue:** `<!-- break -->` HTML comments between tab panel closing divs caused the reference content test regex to fail
- **Fix:** Removed all `<!-- break -->` comments from tab panel boundaries
- **Files modified:** content/skills.md, content/plugins.md
- **Verification:** All reference content tests pass (21/21)
- **Committed in:** a73a90a (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor HTML comment cleanup. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 8 of 10 topic pages now have complete how-to and reference content
- Plan 04-03 (Wave 3) covers remaining pages: projects and memory how-to guides, settings/projects/memory reference specs
- All tests passing (43 howto+reference tests, 18 build/structure tests)

---
*Phase: 04-guides-and-reference*
*Completed: 2026-03-16*
